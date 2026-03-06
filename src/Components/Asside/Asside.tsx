import MYPhoto from "../Images/photo.jpg";
import { HiOutlinePhone, HiOutlineMailOpen } from "react-icons/hi";
import { AiOutlineLinkedin, AiFillGithub } from "react-icons/ai";
import { Photo, Column, Contact, Section, Item, Link, List, Seitbar, Title, Hi } from "./Asside.styled";

export default function Asside() {
  return (
    <Seitbar>
      <Column>
        <Photo src={MYPhoto} alt="My photo" />
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
        <List>
          <Item>HTML5/CSS3/SASS/BEM</Item>
          <Item>JavaScript Es6+</Item>
          <Item>WooCommerce</Item>
          <Item>WordPress</Item>
          <Item>Elementor</Item>
          <Item>WebPack</Item>
          <Item>VS Code</Item>
          <Item>XAMPP</Item>
          <Item>Docker</Item>
          <Item>JQuery</Item>
          <Item>Figma</Item>
          <Item>AJAX</Item>
          <Item>NPM</Item>
          <Item>PHP</Item>
          <Item>ACF</Item>
          <Item>Git</Item>
        </List>
      </Section>

      <Section>
        <Title>Soft Skills</Title>
        <List>
          <Item>Funny</Item>
          <Item>Friendly</Item>
          <Item>Honesty</Item>
          <Item>Teamwork</Item>
          <Item>Responsibility</Item>
          <Item>Communicable</Item>
          <Item>Self development</Item>
        </List>
      </Section>

      <Section>
        <Title>Language skills</Title>
        <List>
          <Item>English - Intermediate</Item>
          <Item>Ukrainian - Mastery</Item>
        </List>
      </Section>
    </Seitbar>
  );
}
