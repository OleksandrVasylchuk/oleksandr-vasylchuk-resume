import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useI18n } from "../i18n";
import photo from "../assets/photo.jpg";
import { Reveal, Stagger, StaggerItem } from "../lib/Reveal";
import { TiltCard } from "../lib/TiltCard";
import { Scramble } from "../lib/Scramble";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 60, damping: 20, mass: 1 });
  const rounded = useTransform(spring, (v) => Math.round(v).toString());

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);

  return (
    <span ref={ref} className="stat-value">
      {reduce ? value : <motion.span>{rounded}</motion.span>}
      <span className="stat-suffix">{suffix}</span>
    </span>
  );
}

/** Live, ticking facts: local time in Kyiv and experience measured to the second. */
function Live() {
  const { t, resume } = useI18n();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(id);
  }, []);
  const first = resume.experience[resume.experience.length - 1].start;
  const [y, m] = first.split("-").map(Number);
  const start = new Date(y, m - 1, 1).getTime();
  const years = (now - start) / (1000 * 60 * 60 * 24 * 365.25);
  const kyiv = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Kyiv", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(now);
  const hour = Number(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Kyiv", hour: "numeric", hour12: false }).format(now)) % 24;
  const status = hour >= 9 && hour < 19 ? t.about.statusDay : hour >= 19 ? t.about.statusEve : t.about.statusNight;
  const current = resume.experience.find((j) => j.end === null);
  const since = current ? new Date(Number(current.start.split("-")[0]), Number(current.start.split("-")[1]) - 1, 1).getTime() : start;
  const days = Math.floor((now - since) / (1000 * 60 * 60 * 24));

  return (
    <div className="live" aria-live="off">
      <div className="live-item">
        <span>{t.about.liveExp}</span>
        <strong>{years.toFixed(6)}</strong>
        <em>
          {t.about.liveExpNote} {first}
        </em>
      </div>
      <div className="live-item">
        <span>{t.about.kyiv}</span>
        <strong>{kyiv}</strong>
        <em>{status}</em>
      </div>
      <div className="live-item">
        <span>{t.about.daysLead}</span>
        <strong>{days.toLocaleString("en-US")}</strong>
        <em>
          {t.about.at} {current?.company ?? "—"}
        </em>
      </div>
    </div>
  );
}

export function About() {
  const { t, resume } = useI18n();
  const [a, b, c] = t.about.title;
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <span className="eyebrow">
                <Scramble text={t.about.eyebrow} />
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h2">
                {a} <em>{b}</em>
                {c}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="lead">{resume.summary}</p>
          </Reveal>
        </div>

        <div className="about-grid">
          <Reveal className="about-photo-wrap" y={40}>
            <TiltCard className="about-photo" max={6}>
              <img src={photo} alt={`${resume.name} — ${t.about.portrait}`} width={1032} height={1032} loading="lazy" decoding="async" />
              <div className="about-photo-badge">
                <span className="pulse" />
                {resume.availability}
              </div>
            </TiltCard>
          </Reveal>

          <div className="about-content">
            <Stagger className="stats" as="ul">
              {resume.stats.map((s) => (
                <StaggerItem key={s.label} as="li" className="stat">
                  <Counter value={s.value} suffix={s.suffix} />
                  <span className="stat-label">{s.label}</span>
                </StaggerItem>
              ))}
            </Stagger>

            <Reveal delay={0.05}>
              <Live />
            </Reveal>

            <Reveal delay={0.1}>
              <div className="about-points">
                {[
                  [t.about.p1t, t.about.p1],
                  [t.about.p2t, t.about.p2],
                  [t.about.p3t, t.about.p3],
                ].map(([title, text], i) => (
                  <div className="about-point" key={title}>
                    <span className="about-point-n">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Stagger className="about-tags">
              {resume.highlights.map((h) => (
                <StaggerItem key={h} as="span" className="chip">
                  {h}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}
