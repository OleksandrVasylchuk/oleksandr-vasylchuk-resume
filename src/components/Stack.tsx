import { useI18n } from "../i18n";
import { Reveal, Stagger, StaggerItem } from "../lib/Reveal";
import { Scramble } from "../lib/Scramble";

export function Stack() {
  const { t, resume } = useI18n();
  const [a, b] = t.stack.title;
  return (
    <section className="section stack" id="stack">
      <div className="container">
        <div className="section-head">
          <div>
            <Reveal>
              <span className="eyebrow">
                <Scramble text={t.stack.eyebrow} />
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
            <p className="lead">{t.stack.lead}</p>
          </Reveal>
        </div>

        <div className="stack-grid">
          {resume.skillGroups.map((g, i) => (
            <Reveal key={g.name} className="card stack-card" delay={0.06 * i} y={32}>
              <div className="stack-card-head">
                <span className="stack-card-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{g.name}</h3>
              </div>
              <Stagger className="stack-chips">
                {g.skills.map((s) => (
                  <StaggerItem key={s} as="span" className="chip">
                    {s}
                  </StaggerItem>
                ))}
              </Stagger>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
