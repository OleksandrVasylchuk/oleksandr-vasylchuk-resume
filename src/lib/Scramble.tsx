import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

const CHARS = "!<>-_\\/[]{}—=+*^?#01";

/** Decodes text character by character ("hacker" scramble) when it scrolls into view. */
export function Scramble({ text, className, speed = 28 }: { text: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [out, setOut] = useState(reduce ? text : "");

  useEffect(() => {
    if (!inView || reduce) return;
    let frame = 0;
    let raf = 0;
    const total = text.length;
    const tick = () => {
      frame++;
      const revealed = Math.floor(frame / 2);
      let s = "";
      for (let i = 0; i < total; i++) {
        const ch = text[i];
        if (ch === " ") s += " ";
        else if (i < revealed) s += ch;
        else s += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setOut(s);
      if (revealed <= total) raf = window.setTimeout(tick, speed) as unknown as number;
      else setOut(text);
    };
    tick();
    return () => clearTimeout(raf);
  }, [inView, text, reduce, speed]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{out || " "}</span>
    </span>
  );
}
