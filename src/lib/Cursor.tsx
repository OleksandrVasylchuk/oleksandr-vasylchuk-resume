import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Custom cursor: a dot that sticks to the pointer and a ring that lags behind.
 * Ring expands over links/buttons and shows a label from data-cursor="...".
 * Desktop pointers only; native cursor stays visible on touch / reduced motion.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.5 });

  useEffect(() => {
    const ok = window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ok) return;
    setEnabled(true);
    document.documentElement.classList.add("has-cursor");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("a, button, [data-cursor], input, textarea, canvas");
      setHover(!!el);
      setLabel(el?.dataset.cursor ?? "");
    };
    const up = () => setDown(false);
    const dn = () => setDown(true);
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", dn);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", dn);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div className="cursor-dot" aria-hidden style={{ x, y }} animate={{ scale: down ? 0.6 : 1 }} />
      <motion.div
        className={`cursor-ring ${hover ? "is-hover" : ""} ${label ? "has-label" : ""}`}
        aria-hidden
        style={{ x: rx, y: ry }}
        animate={{ scale: down ? 0.85 : hover ? (label ? 2.6 : 1.7) : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
      >
        {label && <span>{label}</span>}
      </motion.div>
    </>
  );
}
