import { Name, Submenu, Link, List, Bold, Experience } from "./Projects.styled";

export default function Projects() {
  return (
    <List>
      <Experience>
        <Link target="_blank" href="https://seomatica.io/">
          SEOMATICA
        </Link>
        <Link target="_blank" href="https://migrantgo.eu/">
          MIGRANT GO
        </Link>
        <Link target="_blank" href="https://minesapostas.com/">
          minesapostas.com
        </Link>
        <Link target="_blank" href="https://dookola.top/">
          dookola.top
        </Link>
        <Name>
          <Bold>[</Bold> HTML5, CSS3, SASS, BEM, PHP, JS, JQUERY, WordPress, ACF,<Bold>]</Bold>
        </Name>
        <Submenu>Corporate projects for SEOMATICA and business card sites with attractive gaming features.</Submenu>
      </Experience>
      <Experience>
        <Link target="_blank" href="https://lacto-cure.ua/">
          ЛАКТО-КЮР®
        </Link>
        <Name>
          <Bold>[</Bold> HTML5, CSS3, SASS, BEM, PHP, JS, JQUERY, WordPress, ACF, Flexible Content, Webpack,<Bold>]</Bold>
        </Name>
        <Submenu>Project: AltumAgency for DevOut Labs and ЛАКТО-КЮР® SEOTM Digital Agency. part-time.</Submenu>
      </Experience>
      <Experience>
        <Link target="_blank" href="https://stirnweiss-brenner.de/">
          stirnweiss-brenner.de
        </Link>
        <Link target="_blank" href="https://aisuperior.com/">
          aisuperior.com
        </Link>
        <Link target="_blank" href="https://scaleops.com/">
          scaleops
        </Link>
        <Link target="_blank" href="https://multiverse.media/">
          multiverse.media
        </Link>
        <Name>
          <Bold>[</Bold> HTML5, CSS3, SASS, PHP, JS, JQUERY, AJAX, WordPress, ACF, Elementor<Bold>]</Bold>
        </Name>
        <Submenu>Sites for various companies. Business card sites to advertise programs.</Submenu>
      </Experience>
      <Experience>
        <Link target="_blank" href="https://ein-des-ein.com/">
          ein-des-ein.com
        </Link>
        <Link target="_blank" href="https://bosphortour.uz/">
          bosphortour.uz
        </Link>
        <Name>
          <Bold>[</Bold> HTML5, CSS3, SASS, BEM, PHP, JS, JQUERY, WordPress, ACF, PUG<Bold>]</Bold>
        </Name>
        <Submenu>Corporate projects for EIN-DES-EIN and business card sites to advertise apps.</Submenu>
      </Experience>
      <Experience>
        <Link target="_blank" href="https://slotogate.com/">
          slotogate.com
        </Link>
        <Name>
          <Bold>[</Bold> HTML5, CSS3, SASS, BEM, PHP, JS, JQUERY, WordPress, ACF, WPML <Bold>]</Bold>
        </Name>
        <Submenu>Projects for TRIONIKA. Responsive layout of WordPress templates based on layouts in Figma with effective optimization under Google Lighthouse. Creation of custom post types, taxonomies.</Submenu>
      </Experience>
    </List>
  );
}
