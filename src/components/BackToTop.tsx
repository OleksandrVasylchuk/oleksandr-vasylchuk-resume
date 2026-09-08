import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useI18n } from "../i18n";
import { getLenis } from "../lib/useLenis";

/** Round "back to top" button with a scroll-progress ring; appears after one screen. */
export function BackToTop() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      setVisible(window.scrollY > window.innerHeight * 1.2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", window.location.pathname);
  };

  const R = 21;
  const C = 2 * Math.PI * R;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className="to-top"
          onClick={toTop}
          aria-label={t.nav.toTop}
          title={t.nav.toTop}
          data-cursor="Top"
          initial={reduce ? false : { opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg className="to-top-ring" viewBox="0 0 48 48" aria-hidden>
            <circle cx="24" cy="24" r={R} className="to-top-track" />
            <circle cx="24" cy="24" r={R} className="to-top-bar" strokeDasharray={C} strokeDashoffset={C * (1 - progress)} />
          </svg>
          <svg className="to-top-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 20V5" />
            <path d="m6 11 6-6 6 6" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
