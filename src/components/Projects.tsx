import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useI18n } from "../i18n";
import { Reveal } from "../lib/Reveal";
import { Scramble } from "../lib/Scramble";
import { ArrowUpRight } from "../lib/Icons";

function host(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
function slug(url: string) {
  return host(url).toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

/**
 * Pinned horizontal gallery: the section is tall, the inner track is sticky and slides
 * sideways with scroll. Falls back to a vertical stack on narrow screens / reduced motion.
 */
export function Projects() {
  const { t, resume } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { featuredProjects, additionalProjects } = resume;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]), { stiffness: 90, damping: 26, mass: 0.6 });
  const totalLinks = resume.experience.reduce((n, j) => n + j.projects.length, 0) + additionalProjects.projects.length;
  const [a, b] = t.work.title;

  const more = [
    ...resume.experience.flatMap((j) => j.projects.filter((p) => !featuredProjects.some((f) => f.url === p.url))),
    ...additionalProjects.projects,
  ];

  return (
    <section className="projects" id="work">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <span className="eyebrow">
                <Scramble text={t.work.eyebrow} />
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
            <p className="lead">{t.work.lead(totalLinks)}</p>
          </Reveal>
        </div>
      </div>

      <div className={`gallery ${reduce ? "is-static" : ""}`} ref={ref} style={{ height: `${(featuredProjects.length + 1) * 42}vh` }}>
        <div className="gallery-sticky">
          <motion.div className="gallery-track" style={reduce ? undefined : { x }}>
            {featuredProjects.map((p, i) => (
              <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="gcard" data-cursor="Open" aria-label={`${p.name} — ${t.work.open}`}>
                <div className="gcard-media">
                  <img src={`/projects/${slug(p.url)}.jpg`} alt={`${p.name}`} loading="lazy" decoding="async" width={2160} height={1215} />
                  <span className="gcard-index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="gcard-type">{p.type}</span>
                </div>
                <div className="gcard-body">
                  <div>
                    <h3>{p.name}</h3>
                    <p className="gcard-host">{host(p.url)}</p>
                  </div>
                  <span className="gcard-arrow">
                    <ArrowUpRight />
                  </span>
                </div>
                <p className="gcard-desc">{p.description}</p>
                <div className="gcard-foot">
                  <span>{p.company}</span>
                  <div className="gcard-stack">
                    {p.stack.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
            <div className="gcard gcard-end">
              <span className="eyebrow">
                <Scramble text={t.work.more} />
              </span>
              <h3>{t.work.others(more.length)}</h3>
              <p>{additionalProjects.description}</p>
              <div className="gcard-links">
                {more.map((p) => (
                  <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="proj-link">
                    {p.name}
                    <ArrowUpRight width={12} height={12} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
          <div className="gallery-progress" aria-hidden>
            <motion.span style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </section>
  );
}
