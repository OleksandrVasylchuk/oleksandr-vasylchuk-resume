import { resume } from "../data/resume";

export function Marquee() {
  const items = resume.marquee;
  return (
    <div className="marquee" aria-hidden>
      {[0, 1].map((k) => (
        <div className="marquee-track" key={k}>
          {items.map((item) => (
            <span className="marquee-item" key={item}>
              {item}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
