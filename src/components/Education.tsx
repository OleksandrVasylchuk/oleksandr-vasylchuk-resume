import { resume } from "../data/resume";
import { Reveal } from "../lib/Reveal";

export function Education() {
  return (
    <section className="section education" id="education">
      <div className="container">
        <div className="edu-grid">
          <div>
            <Reveal>
              <span className="eyebrow">Education & languages</span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h2">
                Background <em>&amp; basics.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="lang-list">
                {resume.languages.map((l) => (
                  <li key={l.name}>
                    <span>{l.name}</span>
                    <strong>{l.level}</strong>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <ol className="edu-list">
            {resume.education.map((e, i) => (
              <Reveal key={e.school} as="li" className="edu-item" delay={0.06 * i}>
                <span className="edu-period">{e.period}</span>
                <div>
                  <h3>{e.school}</h3>
                  <p>{e.degree}</p>
                  <span className="edu-loc">{e.location}</span>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
