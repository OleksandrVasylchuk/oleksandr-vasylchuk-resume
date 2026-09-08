import { lazy, Suspense, useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { resume, CV_URL } from "../data/resume";
import { SplitWords } from "../lib/Reveal";
import { Magnetic } from "../lib/Magnetic";
import { scrollToHash } from "../lib/useLenis";
import { ArrowDown, DownloadIcon, SparkIcon } from "../lib/Icons";

const Scene = lazy(() => import("./Scene").then((m) => ({ default: m.Scene })));

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
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

  return (
    <section className="hero" id="top" ref={sectionRef}>
      {show3d && (
        <Suspense fallback={null}>
          <Scene active={inView} />
        </Suspense>
      )}
      <div className="grid-bg" />
      <div className="hero-vignette" />

      <motion.div className="container hero-inner" style={{ y, opacity }}>
        <motion.div
          className="hero-status"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
        >
          <span className="pulse" />
          {resume.availability}
        </motion.div>

        <h1 className="hero-title">
          <SplitWords text={resume.firstName} delay={0.35} />
          <br />
          <SplitWords text={resume.lastName} delay={0.5} className="hero-title-accent" />
        </h1>

        <motion.p
          className="hero-role"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
        >
          <SparkIcon width={14} height={14} /> {resume.title}
        </motion.p>

        <motion.p
          className="hero-lead"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1, ease: EASE }}
        >
          {resume.heroLine}
        </motion.p>

        <motion.div
          className="hero-cta"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15, ease: EASE }}
        >
          <Magnetic>
            <a className="btn btn-primary" href={CV_URL} download>
              <DownloadIcon />
              Download CV (PDF)
            </a>
          </Magnetic>
          <Magnetic>
            <a className="btn btn-ghost" href="#contact" onClick={(e) => go(e, "#contact")}>
              Let&apos;s talk
            </a>
          </Magnetic>
        </motion.div>

        <motion.ul
          className="hero-meta"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <li>
            <span>Currently</span>
            <strong>Tech Lead @ Qwerty-Soft</strong>
          </li>
          <li>
            <span>Based in</span>
            <strong>{resume.location}</strong>
          </li>
          <li>
            <span>Focus</span>
            <strong>WordPress · WooCommerce · React</strong>
          </li>
        </motion.ul>
      </motion.div>

      <motion.a
        href="#about"
        className="hero-scroll"
        onClick={(e) => go(e, "#about")}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        aria-label="Scroll to about"
      >
        <span>Scroll</span>
        <ArrowDown />
      </motion.a>
    </section>
  );
}
