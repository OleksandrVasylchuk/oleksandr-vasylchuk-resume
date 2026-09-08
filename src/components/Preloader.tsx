import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const KEY = "ov-preloaded";

export function usePreloader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(() => {
    try {
      return !!sessionStorage.getItem(KEY);
    } catch {
      return false;
    }
  });
  useEffect(() => {
    if (reduce) setDone(true);
  }, [reduce]);
  const finish = () => {
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setDone(true);
  };
  return { done, finish };
}

export function Preloader({ done, onFinish }: { done: boolean; onFinish: () => void }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (done) return;
    document.documentElement.classList.add("is-loading");
    const start = performance.now();
    const dur = 1500;
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setN(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onFinish, 250);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(() => {
    if (done) document.documentElement.classList.remove("is-loading");
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="preloader"
          aria-hidden
          initial={{ clipPath: "inset(0 0 0 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
        >
          <div className="preloader-inner">
            <div className="preloader-name">
              <span>Oleksandr</span>
              <span>Vasylchuk</span>
            </div>
            <div className="preloader-count">
              <span className="preloader-n">{String(n).padStart(3, "0")}</span>
              <span className="preloader-pct">%</span>
            </div>
            <div className="preloader-bar">
              <span style={{ transform: `scaleX(${n / 100})` }} />
            </div>
            <div className="preloader-hint">booting portfolio · webgl · fonts</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
