import { useEffect } from "react";
import { scrollToHash, useLenis } from "./lib/useLenis";
import { CursorGlow, Noise, ScrollProgress } from "./lib/Effects";
import { Cursor } from "./lib/Cursor";
import { Preloader, usePreloader } from "./components/Preloader";
import { Palette, usePalette } from "./components/Palette";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Stack } from "./components/Stack";
import { Playground } from "./components/Playground";
import { Education } from "./components/Education";
import { Contact, Footer } from "./components/Contact";

export default function App() {
  useLenis();
  const { done, finish } = usePreloader();
  const { open, setOpen } = usePalette();

  // Sections mount after the browser's native hash jump, so re-run it once content exists.
  useEffect(() => {
    if (!done) return;
    const { hash } = window.location;
    if (!hash || hash === "#top") return;
    const t = window.setTimeout(() => scrollToHash(hash), 350);
    return () => window.clearTimeout(t);
  }, [done]);

  return (
    <>
      <Preloader done={done} onFinish={finish} />
      <ScrollProgress />
      <CursorGlow />
      <Cursor />
      <Nav ready={done} onPalette={() => setOpen(true)} />
      <Palette open={open} onClose={() => setOpen(false)} />
      <main>
        <Hero ready={done} />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Stack />
        <Playground />
        <Education />
        <Contact />
      </main>
      <Footer />
      <Noise />
    </>
  );
}
