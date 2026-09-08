import { useEffect } from "react";
import { scrollToHash, useLenis } from "./lib/useLenis";
import { CursorGlow, Noise, ScrollProgress } from "./lib/Effects";
import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Projects } from "./components/Projects";
import { Stack } from "./components/Stack";
import { Education } from "./components/Education";
import { Contact, Footer } from "./components/Contact";

export default function App() {
  useLenis();

  // Sections mount after the browser's native hash jump, so re-run it once content exists.
  useEffect(() => {
    const { hash } = window.location;
    if (!hash || hash === "#top") return;
    const t = window.setTimeout(() => scrollToHash(hash), 350);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Stack />
        <Education />
        <Contact />
      </main>
      <Footer />
      <Noise />
    </>
  );
}
