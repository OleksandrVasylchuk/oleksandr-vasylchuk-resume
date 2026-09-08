import { useCallback, useEffect, useRef, useState } from "react";
import { CV_URL } from "../data/resume";
import { useI18n } from "../i18n";
import { Reveal } from "../lib/Reveal";
import { Scramble } from "../lib/Scramble";
import { Runner, tierIndex } from "../lib/runner";
import { ArrowUpRight, DownloadIcon } from "../lib/Icons";

const HS_KEY = "ov-deploy-run-hs";

export function Playground() {
  const { t, resume } = useI18n();
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

  const tier = t.play.tiers[tierIndex(score)];
  const [a, b] = t.play.title;

  const share = async () => {
    try {
      await navigator.clipboard.writeText(t.play.shareText(score, tier.title, resume.name, resume.siteUrl));
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
              <span className="eyebrow">
                <Scramble text={t.play.eyebrow} />
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h2">
                {a}
                <em>{b}</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="lead">{t.play.lead}</p>
          </Reveal>
        </div>

        <div className="play-grid">
          <Reveal className="play-stage-wrap" y={36}>
            <div className={`play-stage phase-${phase}`} data-cursor={phase === "playing" ? "Jump" : "Play"}>
              <canvas ref={canvasRef} className="play-canvas" tabIndex={0} aria-label="Deploy Run mini game" onPointerDown={act} />
              <div className="play-hud">
                <span>
                  {t.play.score} <strong>{score}</strong>
                </span>
                <span>
                  {t.play.best} <strong>{best}</strong>
                </span>
              </div>
              {phase !== "playing" && (
                <div className="play-overlay">
                  {phase === "over" ? (
                    <>
                      <span className="play-overlay-eyebrow">{t.play.finished}</span>
                      <h3>{tier.title}</h3>
                      <p>{tier.note}</p>
                      <div className="play-overlay-actions">
                        <button className="btn btn-primary" onClick={start} type="button">
                          {t.play.again}
                        </button>
                        <button className="btn btn-ghost" onClick={share} type="button">
                          {copied ? t.play.copied : t.play.share}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="play-overlay-eyebrow">{t.play.name}</span>
                      <h3>{t.play.pressPlay}</h3>
                      <p>{t.play.rules}</p>
                      <button className="btn btn-primary" onClick={start} type="button">
                        {t.play.start}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </Reveal>

          <Reveal className="play-side" delay={0.1} y={36}>
            <div className="card brief">
              <span className="eyebrow">{t.play.briefEyebrow}</span>
              <h3>{t.play.briefTitle}</h3>
              <dl className="brief-list">
                <div>
                  <dt>{t.play.lookingFor}</dt>
                  <dd>{t.play.lookingForV}</dd>
                </div>
                <div>
                  <dt>{t.play.core}</dt>
                  <dd>PHP · WordPress · WooCommerce · REST API · React · Docker · CI/CD</dd>
                </div>
                <div>
                  <dt>{t.play.strongest}</dt>
                  <dd>{t.play.strongestV}</dd>
                </div>
                <div>
                  <dt>{t.play.leads}</dt>
                  <dd>{t.play.leadsV}</dd>
                </div>
                <div>
                  <dt>{t.play.location}</dt>
                  <dd>
                    {resume.location}, {t.play.locationV}
                  </dd>
                </div>
                <div>
                  <dt>{t.play.languages}</dt>
                  <dd>{resume.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</dd>
                </div>
              </dl>
              <div className="brief-actions">
                <a className="btn btn-primary" href={CV_URL} download>
                  <DownloadIcon /> {t.play.cv}
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
