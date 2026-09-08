import { resume } from "../data/resume";
import { Reveal, Stagger, StaggerItem } from "../lib/Reveal";
import { TiltCard } from "../lib/TiltCard";
import { ArrowUpRight } from "../lib/Icons";

function host(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

export function Projects() {
  const { featuredProjects, additionalProjects } = resume;
  const totalLinks = resume.experience.reduce((n, j) => n + j.projects.length, 0) + additionalProjects.projects.length;

  return (
    <section className="section projects" id="work">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <span className="eyebrow">Selected work</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h2">
                Live in production. <em>Not a demo.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="lead">
              A selection from {totalLinks}+ delivered sites and platforms. Every link opens the real thing, serving real customers today.
            </p>
          </Reveal>
        </div>

        <Stagger className="projects-grid" as="ul">
          {featuredProjects.map((p, i) => (
            <StaggerItem key={p.url} as="li" className={`projects-cell ${i === 0 ? "is-wide" : ""}`}>
              <TiltCard className="card project-card" max={6}>
                <a href={p.url} target="_blank" rel="noreferrer" className="project-link" aria-label={`${p.name} — open live site`}>
                  <div className="project-top">
                    <span className="project-type">{p.type}</span>
                    <span className="project-arrow">
                      <ArrowUpRight />
                    </span>
                  </div>
                  <div className="project-body">
                    <h3 className="project-name">{p.name}</h3>
                    <p className="project-host">{host(p.url)}</p>
                    <p className="project-desc">{p.description}</p>
                  </div>
                  <div className="project-foot">
                    <span className="project-company">{p.company}</span>
                    <div className="project-stack">
                      {p.stack.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                </a>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal className="projects-more" delay={0.1}>
          <div className="projects-more-head">
            <h3>More delivered projects</h3>
            <p>{additionalProjects.description}</p>
          </div>
          <div className="projects-more-list">
            {[
              ...resume.experience.flatMap((j) => j.projects.filter((p) => !featuredProjects.some((f) => f.url === p.url))),
              ...additionalProjects.projects,
            ].map((p) => (
              <a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="proj-link">
                {p.name}
                <ArrowUpRight width={12} height={12} />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
