import { useI18n } from "../i18n";
import { Reveal } from "../lib/Reveal";
import { Scramble } from "../lib/Scramble";

export function Education() {
  const { t, resume } = useI18n();
  const [a, b] = t.education.title;
  return (
    <section className="section education" id="education">
      <div className="container">
        <div className="edu-grid">
          <div>
            <Reveal>
              <span className="eyebrow">
                <Scramble text={t.education.eyebrow} />
              </span>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="h2">
                {a}
                <em>{b}</em>
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
