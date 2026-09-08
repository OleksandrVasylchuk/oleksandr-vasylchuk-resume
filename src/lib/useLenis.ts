import { useEffect, useRef } from "react";
import Lenis from "lenis";

let instance: Lenis | null = null;

export function getLenis() {
  return instance;
}

export function scrollToHash(hash: string) {
  const el = document.querySelector<HTMLElement>(hash);
  if (!el) return;
  if (instance) {
    instance.scrollTo(el, { offset: -72, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Boots Lenis smooth scrolling once for the whole app. Respects reduced motion. */
export function useLenis() {
  const raf = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
    });
    instance = lenis;

    const loop = (time: number) => {
      lenis.raf(time);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf.current);
      lenis.destroy();
      instance = null;
    };
  }, []);
}
