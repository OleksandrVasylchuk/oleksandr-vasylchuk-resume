/**
 * Screenshots of featured projects for the gallery (public/projects/<slug>.jpg).
 * Usage: npm run shots            # all featured projects
 *        npm run shots -- ezkratom-com sunnynails-sg
 * Needs a local Chrome (override with CHROME_PATH). 1440x900 @1.5x, waits for
 * animations, strips cookie banners / chat widgets / popups, crops 16:9.
 */
import fs from "node:fs";
import path from "node:path";
import puppeteer from "puppeteer-core";

import { fileURLToPath } from "node:url";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const ALL = args.includes("--all");
const outArg = args.find((a) => a.startsWith("--out="));
const only = args.filter((a) => !a.startsWith("--"));
const OUT = outArg ? path.resolve(outArg.slice(6)) : path.join(ROOT, "public/projects");
fs.mkdirSync(OUT, { recursive: true });
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/resume.json"), "utf8"));
const SHOT_URL = {};

const slug = (url) =>
  url
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/\/$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

const CLEANUP = `
  (() => {
    const kill = (el) => el && el.remove();
    // custom-element widgets with shadow DOM (chat-widget etc.), form/popup shells, srcless overlay iframes
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      if (el.shadowRoot && /chat|widget|popup|bot|launcher/i.test(el.tagName)) kill(el);
    }
    for (const el of Array.from(document.querySelectorAll('[id^="Form--"],[class*="klaviyo-form"],[class*="privy-"],[class*="optin-monster"],[id^="om-"]'))) kill(el);
    for (const f of Array.from(document.querySelectorAll("iframe"))) {
      const r = f.getBoundingClientRect();
      const src = f.getAttribute("src") || "";
      if ((!src || src === "about:blank") && r.width > 250) kill(f);
      else if (r.width >= innerWidth * 0.95 && r.height >= innerHeight * 0.9) kill(f);
    }
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const cs = getComputedStyle(el);
      const z = parseInt(cs.zIndex);
      if ((cs.position === "fixed" || cs.position === "absolute") && z >= 9000) {
        const r = el.getBoundingClientRect();
        const idc = (el.id + " " + (typeof el.className === "string" ? el.className : "")).toLowerCase();
        const headerish = el.closest("header,nav") || /header|nav|menu|logo/.test(idc) || (r.top <= 2 && r.height < innerHeight * 0.5);
        if (r.width > 300 && r.height > 200 && !headerish) kill(el);
      }
    }
    // click visible close buttons of popups first (real timed popups, not menus)
    for (const b of Array.from(document.querySelectorAll('[aria-label*="close" i],[title*="close" i],[class*="close"],.pum-close,.dialog-close-button,.mfp-close,.fancybox-close-small'))) {
      const r = b.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && !b.closest("header,nav")) { try { b.click(); } catch (e) {} }
    }
    for (const el of Array.from(document.querySelectorAll('.pum,.pum-overlay,[class*="popmake"],[id*="popmake"],.elementor-popup-modal,[role="dialog"],[class*="lightbox"],.pum-active'))) kill(el);
    document.documentElement.classList.remove("pum-open", "pum-open-overlay", "pum-open-scrollable");
    // cookie / consent banners and chat widgets: anything fixed/sticky that smells like one
    const rx = /cookie|consent|gdpr|privacy choices|tidio|intercom|crisp|tawk|drift|hubspot-messages|livechat|chat|popup|modal|newsletter|subscribe/i;
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") continue;
      const id = (el.id || "") + " " + (el.className && el.className.baseVal !== undefined ? "" : el.className || "");
      const txt = (el.innerText || "").slice(0, 400);
      const isHeader = el.tagName === "HEADER" || /header|navbar|nav-|site-nav|menu/i.test(id);
      if (isHeader) continue;
      if (rx.test(id) || /cookie|consent|privacy/i.test(txt) || el.tagName === "IFRAME") kill(el);
    }
    for (const f of Array.from(document.querySelectorAll('iframe[src*="chat"],iframe[src*="tidio"],iframe[src*="intercom"],iframe[src*="crisp"],iframe[src*="tawk"],iframe[src*="hubspot"]'))) kill(f);
    for (const el of Array.from(document.querySelectorAll('[class*="cookie"],[id*="cookie"],[class*="consent"],[id*="consent"],[class*="gdpr"],[id*="gdpr"],[class*="cky-"],#CybotCookiebotDialog,.cc-window,#onetrust-consent-sdk'))) kill(el);
    // popups / overlays that are not the header
    for (const el of Array.from(document.querySelectorAll('[class*="popup"],[id*="popup"],[class*="modal"][class*="show"],[class*="modal"][class*="open"],.fancybox-container,.mfp-wrap,[class*="overlay"][class*="active"]'))) kill(el);
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    document.body.classList.remove("modal-open", "no-scroll", "overflow-hidden");
    // small fixed widgets (chat bubbles, scroll-to-top, promo pills) that are not the header
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed") continue;
      if (el.closest("header") || el.tagName === "HEADER" || /header|navbar|site-nav/i.test(el.id + " " + (typeof el.className === "string" ? el.className : ""))) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 640 && r.height < 640 && r.width > 0) kill(el);
    }
    // AOS-style libraries: mark as animated
    for (const el of Array.from(document.querySelectorAll("[data-aos]"))) el.classList.add("aos-animate");
    // force reveal-on-scroll elements, but never touch hidden menus / dialogs / popups
    const SKIP = "[role=dialog],[role=menu],[aria-hidden=true],[class*=menu],[class*=dropdown],[class*=popup],[class*=modal],[class*=overlay],[class*=drawer],[class*=offcanvas],[class*=submenu],[class*=burger],[class*=pum-],[class*=tooltip],header,nav,.swiper-wrapper,.slick-track";
    for (const el of Array.from(document.querySelectorAll("main *, section *, article *, .hero *, [class*=hero] *, [class*=banner] *"))) {
      if (el.closest(SKIP)) continue;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (cs.position === "fixed") continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0 || r.top > 1400) continue;
      const op = parseFloat(cs.opacity);
      const tr = cs.transform;
      const moved = tr !== "none" && !/^matrix\(1, 0, 0, 1, 0, 0\)$/.test(tr);
      if (op < 1 || moved) {
        el.style.setProperty("opacity", "1", "important");
        if (moved && !el.closest(".swiper-wrapper,.slick-track,.slick-list,[class*=carousel],[class*=slider]")) el.style.setProperty("transform", "none", "important");
        el.style.setProperty("clip-path", "none", "important");
      }
    }
  })();
`;

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--lang=en-US,en"],
});

const list = ALL
  ? [...new Map([...data.experience.flatMap((j) => j.projects), ...data.additionalProjects.projects].filter((p) => !p.url.includes("ewp.live")).map((p) => [p.url, p])).values()]
  : data.featuredProjects;
for (const p of list) {
  const s = slug(p.url);
  if (only.length && !only.includes(s)) continue;
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1.5 });
  await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36");
  await page.setExtraHTTPHeaders({ "Accept-Language": "en-US,en;q=0.9,uk;q=0.8" });
  const hardTimeout = new Promise((_, rej) => setTimeout(() => rej(new Error("hard timeout 90s")), 90000));
  try {
    const target = SHOT_URL[s] || p.url;
    await Promise.race([hardTimeout, (async () => {
    await page.goto(target, { waitUntil: "networkidle2", timeout: 60000 }).catch(() => page.goto(target, { waitUntil: "domcontentloaded", timeout: 60000 }));
    await new Promise((r) => setTimeout(r, 2500));
    // nudge lazy / scroll-triggered content, then return to top
    await page.evaluate(async () => {
      for (let y = 0; y < Math.min(document.body.scrollHeight, 2400); y += 300) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await new Promise((r) => setTimeout(r, 1800));
    await page.evaluate(CLEANUP);
    await new Promise((r) => setTimeout(r, 600));
    await page.evaluate(CLEANUP);
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 400));
    const file = path.join(OUT, `${s}.jpg`);
    await page.screenshot({ path: file, type: "jpeg", quality: 84, clip: { x: 0, y: 0, width: 1440, height: 810 } });
    const kb = Math.round(fs.statSync(file).size / 1024);
    console.log(`✔ ${s}  ${kb} KB  (${await page.title()})`);
    })()]);
  } catch (e) {
    console.log(`✖ ${s}: ${e.message}`);
  } finally {
    await page.close().catch(() => {});
  }
}
await browser.close();
