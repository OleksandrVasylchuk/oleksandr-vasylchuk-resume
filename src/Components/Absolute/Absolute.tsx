import { Absolute, Name, Target, Job, Column, Highlights, HighlightTag } from "./Absolute.styled";

const highlights = ["Senior / Tech Lead", "5+ Years Experience", "CI/CD & DevOps", "Custom Plugin Dev", "API Integrations", "Open to Senior Roles"];

export default function AbsoluteSection() {
  return (
    <Absolute>
      <Column>
        <Name>Oleksandr Vasylchuk</Name>
        <Job>Senior Full-Stack Developer · Tech Lead</Job>
        <Target>Senior Full-Stack WordPress Developer with 5+ years delivering production-grade solutions for international clients. Deep expertise in custom plugin development with complex backend logic and third-party API integrations, Git-based CI/CD pipelines for staging and production, and full-cycle ownership from Figma to deployment. Currently serving as Tech Lead at Qwerty-Soft — driving architecture decisions, code reviews, and team management across concurrent outsourced projects. Open to Senior or Tech Lead roles.</Target>
        <Highlights>
          {highlights.map((h) => (
            <HighlightTag key={h}>{h}</HighlightTag>
          ))}
        </Highlights>
      </Column>
    </Absolute>
  );
}
