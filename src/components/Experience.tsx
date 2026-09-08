import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useI18n } from "../i18n";
import { Reveal } from "../lib/Reveal";
import { Scramble } from "../lib/Scramble";
import { ArrowUpRight } from "../lib/Icons";

function totalYears(first: string) {
  const [y, m] = first.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  return Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

export function Experience() {
  const { t, resume } = useI18n();
  const listRef = useRef<HTMLOListElement>(null);
  // Fill follows the point 85 % down the viewport, so it reaches each dot as its card comes into view
  // and is completely full once the last card is on screen.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 85%", "end 85%"] });
  const scaleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 80, damping: 24 });
  const years = totalYears(resume.experience[resume.experience.length - 1].start);
  const [a, b, c] = t.experience.title(years, resume.experience.length);

  return (
    <section className="section experience" id="experience">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <span className="eyebrow">
                <Scramble text={t.experience.eyebrow} />
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h2">
                {a}
                <em>{b}</em>
                {c}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="lead">{t.experience.lead}</p>
          </Reveal>
        </div>

        <div className="timeline">
          <div className="timeline-rail" aria-hidden>
            <motion.div className="timeline-rail-fill" style={{ scaleY }} />
          </div>

          <ol className="timeline-list" ref={listRef}>
            {resume.experience.map((job, i) => (
              <Reveal key={job.company + job.start} as="li" className="timeline-item" delay={0.03 * i} y={36}>
                <div className="timeline-dot" aria-hidden>
                  <span />
                </div>

                <div className="timeline-meta">
                  <span className="timeline-period">{job.period}</span>
                  <span className="timeline-loc">{job.location}</span>
                  {job.end === null && <span className="timeline-now">{t.experience.current}</span>}
                </div>

                <article className="card timeline-card">
                  <header className="timeline-card-head">
                    <div>
                      <h3 className="timeline-role">{job.role}</h3>
                      <p className="timeline-company">
                        {job.companyUrl ? (
                          <a href={job.companyUrl} target="_blank" rel="noreferrer">
                            {job.company} <ArrowUpRight width={14} height={14} />
                          </a>
                        ) : (
                          job.company
                        )}
                      </p>
                    </div>
                    <span className="timeline-index">{String(resume.experience.length - i).padStart(2, "0")}</span>
                  </header>

                  <ul className="timeline-bullets">
                    {job.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>

                  {job.projects.length > 0 && (
                    <div className="timeline-projects">
                      <span className="timeline-projects-label">{t.experience.projects}</span>
                      <div className="timeline-projects-list">
                        {job.projects.map((p) => (
                          <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="proj-link">
                            {p.name}
                            <ArrowUpRight width={12} height={12} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="timeline-stack">
                    {job.stack.map((s) => (
                      <span key={s} className="chip">
                        {s}
                      </span>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
