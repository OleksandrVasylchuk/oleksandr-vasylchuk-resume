import MYPhoto from "../Images/photo.jpg";
import { HiOutlinePhone, HiOutlineMailOpen } from "react-icons/hi";
import { AiOutlineLinkedin, AiFillGithub } from "react-icons/ai";
import { Photo, PhotoWrapper, Column, Contact, Section, Item, Tag, TagList, Link, List, Seitbar, Title, Hi } from "./Asside.styled";

const techSkills = ["HTML5", "CSS3", "SASS", "BEM", "JavaScript ES6+", "TypeScript", "React", "PHP", "Composer", "WordPress", "WP-CLI", "Gutenberg Blocks", "WooCommerce", "ACF", "Elementor", "Timber/Twig", "MySQL", "REST API", "AJAX", "jQuery", "Docker", "Linux / SSH", "Nginx", "CI/CD", "Git", "Webpack", "Vite", "Figma"];

export default function Asside() {
  return (
    <Seitbar>
      <Column>
        <PhotoWrapper>
          <Photo src={MYPhoto} alt="Oleksandr Vasylchuk" />
        </PhotoWrapper>
      </Column>

      <Section>
        <Title>Contacts</Title>
        <List>
          <Contact>
            <Link href="tel:+380990241220" target="_blank" rel="noreferrer">
              <Hi>
                <HiOutlinePhone />
              </Hi>
              +380990241220
            </Link>
          </Contact>
          <Contact>
            <Link href="mailto:sanyabatyushka@gmail.com" target="_blank" rel="noreferrer">
              <Hi>
                <HiOutlineMailOpen />
              </Hi>
              sanyabatyushka@gmail.com
            </Link>
          </Contact>
          <Contact>
            <Link href="https://www.linkedin.com/in/oleksandr-vasylchuk" target="_blank" rel="noreferrer">
              <Hi>
                <AiOutlineLinkedin />
              </Hi>
              LinkedIn
            </Link>
          </Contact>
          <Contact>
            <Link href="https://github.com/OleksandrVasylchuk" target="_blank" rel="noreferrer">
              <Hi>
                <AiFillGithub />
              </Hi>
              GitHub
            </Link>
          </Contact>
        </List>
      </Section>

      <Section>
        <Title>Tech Skills</Title>
        <TagList>
          {techSkills.map((skill) => (
            <Tag key={skill}>{skill}</Tag>
          ))}
        </TagList>
      </Section>

      <Section>
        <Title>Soft Skills</Title>
        <List>
          <Item>Team Leadership &amp; Mentoring</Item>
          <Item>Technical Architecture &amp; Planning</Item>
          <Item>Task Delegation &amp; Prioritization</Item>
          <Item>Clean Code &amp; Code Review</Item>
          <Item>Agile / Scrum</Item>
          <Item>Proactive Communication</Item>
          <Item>Problem Solving</Item>
          <Item>Continuous Learning</Item>
        </List>
      </Section>

      <Section>
        <Title>Languages</Title>
        <List>
          <Item>English — Intermediate</Item>
          <Item>Ukrainian — Native</Item>
        </List>
      </Section>
    </Seitbar>
  );
}
