/**
 * Generates public/og.png (1200x630) — the social preview card used by
 * LinkedIn, Telegram, Slack, Twitter/X and Google.
 *
 * Content comes from src/data/resume.json, the portrait from src/assets/photo.jpg,
 * so the card never goes stale. Rendered with headless Chrome (same binary as
 * scripts/shots.mjs; override with CHROME_PATH).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(fs.readFileSync(path.join(ROOT, "src/data/resume.json"), "utf8"));
const photo = fs.readFileSync(path.join(ROOT, "src/assets/photo.jpg")).toString("base64");
const OUT = path.join(ROOT, "public/og.png");

const chips = ["WordPress", "WooCommerce", "PHP", "React", "REST API", "CI/CD"];

const html = `<!doctype html>
<html><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #07080c; color: #eef0f4; font-family: Inter, system-ui, sans-serif; overflow: hidden; position: relative; }
  .grid { position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
    background-size: 60px 60px;
    -webkit-mask-image: radial-gradient(ellipse 80% 70% at 30% 40%, #000 10%, transparent 100%); }
  .glow { position: absolute; width: 900px; height: 900px; right: -280px; top: -300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(200,255,77,.16), rgba(124,108,255,.10) 42%, transparent 68%); filter: blur(10px); }
  .wrap { position: relative; height: 100%; display: flex; align-items: center; gap: 56px; padding: 64px 72px; }
  .left { flex: 1; }
  .status { display: inline-flex; align-items: center; gap: 10px; padding: 9px 16px 9px 12px; border-radius: 999px;
    border: 1px solid rgba(255,255,255,.18); background: rgba(255,255,255,.03);
    font-family: "JetBrains Mono", monospace; font-size: 15px; letter-spacing: .1em; text-transform: uppercase; color: #b4b9c6; }
  .dot { width: 9px; height: 9px; border-radius: 50%; background: #c8ff4d; box-shadow: 0 0 12px #c8ff4d; }
  h1 { font-family: Syne, sans-serif; font-weight: 800; font-size: 82px; line-height: .95; letter-spacing: -.04em; margin: 26px 0 0; }
  h1 .accent { background: linear-gradient(100deg, #c8ff4d, #eaff9a 40%, #4de3ff); -webkit-background-clip: text; background-clip: text; color: transparent; }
  .role { display: flex; align-items: center; gap: 10px; margin-top: 18px; font-family: "JetBrains Mono", monospace; font-size: 21px; color: #c8ff4d; letter-spacing: .01em; }
  .lead { margin-top: 16px; font-size: 21px; line-height: 1.45; color: #b4b9c6; max-width: 30ch; }
  .chips { display: flex; flex-wrap: wrap; gap: 9px; margin-top: 26px; }
  .chip { padding: 8px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,.12); background: rgba(255,255,255,.04);
    font-family: "JetBrains Mono", monospace; font-size: 15px; color: #b4b9c6; }
  .right { width: 340px; flex: none; }
  .photo { position: relative; width: 340px; height: 430px; border-radius: 28px; overflow: hidden; border: 1px solid rgba(255,255,255,.18); }
  .photo img { width: 100%; height: 100%; object-fit: cover; filter: saturate(.92) contrast(1.05); }
  .photo::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba(7,8,12,.85)); }
  .badge { position: absolute; left: 18px; bottom: 18px; z-index: 2; padding: 9px 14px; border-radius: 999px;
    border: 1px solid rgba(255,255,255,.2); background: rgba(7,8,12,.72);
    font-family: "JetBrains Mono", monospace; font-size: 14px; color: #eef0f4; }
  .url { position: absolute; left: 72px; bottom: 40px; font-family: "JetBrains Mono", monospace; font-size: 17px; color: #7d8494; letter-spacing: .08em; }
</style></head>
<body>
  <div class="grid"></div><div class="glow"></div>
  <div class="wrap">
    <div class="left">
      <span class="status"><span class="dot"></span>${data.availability}</span>
      <h1>Oleksandr<br /><span class="accent">Vasylchuk</span></h1>
      <div class="role">✦ Senior Full-Stack WordPress Developer · Tech Lead</div>
      <div class="lead">Custom plugins, API integrations and CI/CD for production WordPress &amp; WooCommerce platforms.</div>
      <div class="chips">${chips.map((c) => `<span class="chip">${c}</span>`).join("")}</div>
    </div>
    <div class="right">
      <div class="photo">
        <img src="data:image/jpeg;base64,${photo}" alt="" />
        <span class="badge">5+ years · Kyiv, remote</span>
      </div>
    </div>
  </div>
  <div class="url">${data.siteUrl.replace(/^https?:\/\//, "")}</div>
</body></html>`;

const chrome = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
if (!fs.existsSync(chrome)) {
  // CI (Vercel) has no local Chrome: public/og.png is committed, so keep the build green.
  console.log("… no local Chrome found, keeping the committed public/og.png");
  process.exit(0);
}

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 400));
await page.screenshot({ path: OUT, type: "png" });
await browser.close();
console.log(`✔ OG image written to public/og.png (${Math.round(fs.statSync(OUT).size / 1024)} KB)`);
