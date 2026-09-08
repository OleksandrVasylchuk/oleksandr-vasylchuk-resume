import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { resume } from "../data/resume";
import { Reveal } from "../lib/Reveal";
import { ArrowUpRight } from "../lib/Icons";

function totalYears() {
  const first = resume.experience[resume.experience.length - 1].start;
  const [y, m] = first.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  const diff = (Date.now() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(diff);
}

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 60%"] });
  const scaleY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 80, damping: 24 });
  const years = totalYears();

  return (
    <section className="section experience" id="experience">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <span className="eyebrow">Experience</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h2">
                {years}+ years, <em>{resume.experience.length} teams</em>, one standard.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="lead">
              From SEO-driven fixes to leading concurrent outsourced products. Every role below came with real production traffic and real clients.
            </p>
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
                  {job.end === null && <span className="timeline-now">Current</span>}
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
                      <span className="timeline-projects-label">Projects</span>
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
