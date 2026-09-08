import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { resume } from "../data/resume";
import photo from "../assets/photo.jpg";
import { Reveal, Stagger, StaggerItem } from "../lib/Reveal";
import { TiltCard } from "../lib/TiltCard";

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

export function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <span className="eyebrow">About</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h2">
                Engineering that <em>ships</em>, teams that deliver.
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
              <img src={photo} alt={`${resume.name} — portrait`} width={1032} height={1032} loading="lazy" decoding="async" />
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

            <Reveal delay={0.1}>
              <div className="about-points">
                <div className="about-point">
                  <span className="about-point-n">01</span>
                  <div>
                    <h3>Full-cycle ownership</h3>
                    <p>From Figma handoff to production: architecture, custom plugins, integrations, CI/CD and monitoring. No hand-offs lost in between.</p>
                  </div>
                </div>
                <div className="about-point">
                  <span className="about-point-n">02</span>
                  <div>
                    <h3>Backend-heavy WordPress</h3>
                    <p>Custom plugin development with complex business logic, REST APIs, payment gateways, CRMs and external data feeds.</p>
                  </div>
                </div>
                <div className="about-point">
                  <span className="about-point-n">03</span>
                  <div>
                    <h3>Tech leadership</h3>
                    <p>Defining stacks, reviewing code, breaking down tasks and mentoring developers across concurrent outsourced projects.</p>
                  </div>
                </div>
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
