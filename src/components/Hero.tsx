import { lazy, Suspense, useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { resume, CV_URL } from "../data/resume";
import { SplitWords } from "../lib/Reveal";
import { Magnetic } from "../lib/Magnetic";
import { scrollToHash } from "../lib/useLenis";
import { ArrowDown, DownloadIcon, SparkIcon } from "../lib/Icons";

const ParticleField = lazy(() => import("./ParticleField").then((m) => ({ default: m.ParticleField })));

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const [show3d, setShow3d] = useState(false);
  const [inView, setInView] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 120]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const canWebGL = (() => {
      try {
        const c = document.createElement("canvas");
        return !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        return false;
      }
    })();
    if (canWebGL && !reduce) setShow3d(true);
  }, [reduce]);

  // Pause the WebGL loop while the hero is scrolled out of view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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

  return (
    <section className="hero" id="top" ref={sectionRef}>
      {show3d && (
        <Suspense fallback={null}>
          <ParticleField active={inView} />
        </Suspense>
      )}
      <div className="grid-bg" />
      <div className="hero-vignette" />

      <motion.div className="container hero-inner" style={{ y, opacity }}>
        <motion.div className="hero-status" {...fade(0.2)}>
          <span className="pulse" />
          {resume.availability}
        </motion.div>

        <h1 className="hero-title">
          <SplitWords text={resume.firstName} delay={0.3} play={ready} />
          <br />
          <SplitWords text={resume.lastName} delay={0.45} play={ready} className="hero-title-accent" />
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
              Download CV (PDF)
            </a>
          </Magnetic>
          <Magnetic>
            <a className="btn btn-ghost" href="#play" onClick={(e) => go(e, "#play")} data-cursor="Play">
              Recruiter? Play a game
            </a>
          </Magnetic>
        </motion.div>

        <motion.ul className="hero-meta" {...fade(1.3)}>
          <li>
            <span>Currently</span>
            <strong>Tech Lead @ Qwerty-Soft</strong>
          </li>
          <li>
            <span>Based in</span>
            <strong>{resume.location}</strong>
          </li>
          <li>
            <span>Shortcut</span>
            <strong>
              <kbd>Ctrl</kbd> + <kbd>K</kbd> for commands
            </strong>
          </li>
        </motion.ul>
      </motion.div>

      <motion.a href="#about" className="hero-scroll" onClick={(e) => go(e, "#about")} {...fade(1.7)} aria-label="Scroll to about">
        <span>Scroll</span>
        <ArrowDown />
      </motion.a>

      <motion.div className="hero-hint" {...fade(1.9)} aria-hidden>
        move the cursor · particles react
      </motion.div>
    </section>
  );
}
