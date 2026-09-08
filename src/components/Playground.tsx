import { useCallback, useEffect, useRef, useState } from "react";
import { resume, CV_URL } from "../data/resume";
import { Reveal } from "../lib/Reveal";
import { Runner, tierFor } from "../lib/runner";
import { ArrowUpRight, DownloadIcon } from "../lib/Icons";

const HS_KEY = "ov-deploy-run-hs";

export function Playground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runner = useRef<Runner | null>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    try {
      return Number(localStorage.getItem(HS_KEY) || 0);
    } catch {
      return 0;
    }
  });
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const r = new Runner(canvas, {
      onScore: setScore,
      onGameOver: (s) => {
        setPhase("over");
        setBest((b) => {
          const nb = Math.max(b, s);
          try {
            localStorage.setItem(HS_KEY, String(nb));
          } catch {
            /* ignore */
          }
          return nb;
        });
      },
    });
    runner.current = r;
    const ro = new ResizeObserver(() => r.resize());
    ro.observe(canvas);
    return () => {
      ro.disconnect();
      r.destroy();
      runner.current = null;
    };
  }, []);

  const start = useCallback(() => {
    setScore(0);
    setPhase("playing");
    runner.current?.start();
  }, []);

  const act = useCallback(() => {
    if (phase === "playing") runner.current?.jump();
    else start();
  }, [phase, start]);

  // keyboard: only when the game is on screen
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.code !== "ArrowUp") return;
      const el = canvasRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const visible = r.top < window.innerHeight * 0.8 && r.bottom > window.innerHeight * 0.2;
      if (!visible) return;
      if (phase === "idle" && !(document.activeElement === el || el.matches(":hover"))) return;
      e.preventDefault();
      act();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [act, phase]);

  // pause when scrolled away
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting && phase === "playing") {
        runner.current?.stop();
        setPhase("over");
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [phase]);

  const tier = tierFor(score);

  const share = async () => {
    const text = `I scored ${score} in Deploy Run on ${resume.name}'s portfolio (${tier.title}). Beat me: ${resume.siteUrl}#play`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <section className="section playground" id="play">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <span className="eyebrow">Recruiter zone</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h2">
                Tired of scrolling CVs? <em>Ship one.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="lead">
              You are the deploy. Jump over bugs, plugin conflicts and the white screen of death, grab coffee for bonus points. Space, ↑ or tap to jump. Double jump works.
            </p>
          </Reveal>
        </div>

        <div className="play-grid">
          <Reveal className="play-stage-wrap" y={36}>
            <div className={`play-stage phase-${phase}`} data-cursor={phase === "playing" ? "Jump" : "Play"}>
              <canvas ref={canvasRef} className="play-canvas" tabIndex={0} aria-label="Deploy Run mini game" onPointerDown={act} />
              <div className="play-hud">
                <span>
                  Score <strong>{score}</strong>
                </span>
                <span>
                  Best <strong>{best}</strong>
                </span>
              </div>
              {phase !== "playing" && (
                <div className="play-overlay">
                  {phase === "over" ? (
                    <>
                      <span className="play-overlay-eyebrow">Deploy finished</span>
                      <h3>{tier.title}</h3>
                      <p>{tier.note}</p>
                      <div className="play-overlay-actions">
                        <button className="btn btn-primary" onClick={start} type="button">
                          Deploy again
                        </button>
                        <button className="btn btn-ghost" onClick={share} type="button">
                          {copied ? "Copied!" : "Share score"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="play-overlay-eyebrow">Deploy Run</span>
                      <h3>Press play to deploy</h3>
                      <p>Every 10 px is a point. Coffee is 50. Bugs end the sprint.</p>
                      <button className="btn btn-primary" onClick={start} type="button">
                        ▶ Start deploy
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal className="play-side" delay={0.1} y={36}>
            <div className="card brief">
              <span className="eyebrow">60-second brief</span>
              <h3>What you actually need to know</h3>
              <dl className="brief-list">
                <div>
                  <dt>Looking for</dt>
                  <dd>Senior Full-Stack WordPress / Tech Lead, remote</dd>
                </div>
                <div>
                  <dt>Core stack</dt>
                  <dd>PHP · WordPress · WooCommerce · REST API · React · Docker · CI/CD</dd>
                </div>
                <div>
                  <dt>Strongest at</dt>
                  <dd>Custom plugins with heavy backend logic, third-party integrations, Figma-to-production ownership</dd>
                </div>
                <div>
                  <dt>Leads today</dt>
                  <dd>Architecture, code review and mentoring across concurrent client projects at Qwerty-Soft</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{resume.location}, EET (UTC+2/+3), overlaps EU and US-East mornings</dd>
                </div>
                <div>
                  <dt>Languages</dt>
                  <dd>{resume.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</dd>
                </div>
              </dl>
              <div className="brief-actions">
                <a className="btn btn-primary" href={CV_URL} download>
                  <DownloadIcon /> CV (PDF)
                </a>
                <a className="btn btn-ghost" href={resume.contacts.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn <ArrowUpRight />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
