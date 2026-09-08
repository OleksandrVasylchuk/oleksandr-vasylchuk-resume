import { useEffect, useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { CV_URL } from "../data/resume";
import { scrollToHash } from "../lib/useLenis";
import { DownloadIcon } from "../lib/Icons";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#stack", label: "Stack" },
  { href: "#play", label: "Play" },
  { href: "#contact", label: "Contact" },
];

export function Nav({ ready, onPalette }: { ready: boolean; onPalette: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToHash(href);
    history.replaceState(null, "", href);
  };

  return (
    <motion.header
      className={`nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}
      initial={reduce ? false : { y: -40, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : { y: -40, opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
    >
      <div className="container nav-inner">
        <a href="#top" className="nav-logo" onClick={(e) => go(e, "#top")} aria-label="Back to top">
          <span className="nav-logo-mark">OV</span>
          <span className="nav-logo-text">Oleksandr Vasylchuk</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="nav-k" type="button" onClick={onPalette} aria-label="Open command palette" data-cursor="⌘K">
            <kbd>⌘</kbd>
            <kbd>K</kbd>
          </button>
          <a className="btn btn-primary nav-cv" href={CV_URL} download>
            <DownloadIcon />
            <span>Download CV</span>
          </a>
          <button className="nav-burger" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="nav-mobile" aria-hidden={!open}>
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={(e) => go(e, l.href)} tabIndex={open ? 0 : -1}>
            {l.label}
          </a>
        ))}
        <a href={CV_URL} download className="btn btn-primary" tabIndex={open ? 0 : -1}>
          <DownloadIcon /> Download CV (PDF)
        </a>
      </div>
    </motion.header>
  );
}
