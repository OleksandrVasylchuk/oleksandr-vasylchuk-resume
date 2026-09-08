import type { MouseEvent } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { CV_URL } from "../data/resume";
import { useI18n } from "../i18n";
import { SplitWords } from "../lib/Reveal";
import { Magnetic } from "../lib/Magnetic";
import { scrollToHash } from "../lib/useLenis";
import { ArrowDown, DownloadIcon, SparkIcon } from "../lib/Icons";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const { t, resume, lang } = useI18n();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 120]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  const go = (e: MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    scrollToHash(hash);
  };

  const hidden = { opacity: 0, y: 16 };
  const shown = { opacity: 1, y: 0 };
  const fade = (delay: number) => ({
    initial: reduce ? false : hidden,
    animate: ready ? shown : hidden,
    transition: { duration: 0.9, delay, ease: EASE },
  });

  // The name stays Latin in both languages: it matches the CV/LinkedIn and keeps the display face.
  const first = resume.firstName;
  const last = resume.lastName;

  return (
    <section className="hero" id="top">
      <div className="grid-bg" />
      <div className="hero-vignette" />

      <motion.div className="container hero-inner" style={{ y, opacity }}>
        <motion.div className="hero-status" {...fade(0.2)}>
          <span className="pulse" />
          {resume.availability}
        </motion.div>

        <h1 className="hero-title" key={lang}>
          <SplitWords text={first} delay={0.3} play={ready} />
          <br />
          <SplitWords text={last} delay={0.45} play={ready} className="hero-title-accent" />
        </h1>

        <motion.p className="hero-role" {...fade(0.8)}>
          <SparkIcon width={14} height={14} /> {resume.title}
        </motion.p>

        <motion.p className="hero-lead" {...fade(0.95)}>
          {resume.heroLine}
        </motion.p>

        <motion.div className="hero-cta" {...fade(1.1)}>
          <Magnetic>
            <a className="btn btn-primary" href={CV_URL} download data-cursor="PDF">
              <DownloadIcon />
              {t.nav.cvFull}
            </a>
          </Magnetic>
          <Magnetic>
            <a className="btn btn-ghost" href="#play" onClick={(e) => go(e, "#play")} data-cursor="Play">
              {t.hero.playCta}
            </a>
          </Magnetic>
        </motion.div>

        <motion.ul className="hero-meta" {...fade(1.3)}>
          <li>
            <span>{t.hero.currently}</span>
            <strong>{t.hero.techLead}</strong>
          </li>
          <li>
            <span>{t.hero.basedIn}</span>
            <strong>{resume.location}</strong>
          </li>
          <li>
            <span>{t.hero.shortcut}</span>
            <strong>
              <kbd>Ctrl</kbd> + <kbd>K</kbd> {t.hero.forCommands}
            </strong>
          </li>
        </motion.ul>
      </motion.div>

      <motion.a href="#about" className="hero-scroll" onClick={(e) => go(e, "#about")} {...fade(1.7)} aria-label="Scroll to about">
        <span>{t.hero.scroll}</span>
        <ArrowDown />
      </motion.a>

      <motion.div className="hero-hint" {...fade(1.9)} aria-hidden>
        {t.hero.hint}
      </motion.div>
    </section>
  );
}
