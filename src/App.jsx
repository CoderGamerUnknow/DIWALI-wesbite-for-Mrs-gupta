import { useCallback, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScroll } from "./components/SmoothScroll";
import { IntroLoader } from "./components/IntroLoader";
import { CursorGlow } from "./components/CursorGlow";
import { Nav } from "./components/Nav";
import { ScrollTopDiya } from "./components/ScrollTopDiya";
import { Hero } from "./sections/Hero";
import { Wish } from "./sections/Wish";
import { Diyas } from "./sections/Diyas";
import { Blessings } from "./sections/Blessings";
import { Countdown } from "./sections/Countdown";
import { Celebrate } from "./sections/Celebrate";
import { LightLab } from "./components/LightLab";
import { Share } from "./sections/Share";
import { Footer } from "./sections/Footer";

export default function App() {
  const [ready, setReady] = useState(false);

  const handleLoaderDone = useCallback(() => setReady(true), []);

  useEffect(() => {
    if (!ready) return;

    window.scrollTo(0, 0);
    const frame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => {});
    }

    return () => window.cancelAnimationFrame(frame);
  }, [ready]);

  return (
    <>
      {!ready && <IntroLoader onDone={handleLoaderDone} />}

      {ready && (
        <SmoothScroll>
          <a href="#wish" className="skip-link">
            Skip to the Diwali wish
          </a>

          <div className="scroll-progress" aria-hidden="true">
            <div className="scroll-progress__bar" />
          </div>

          <CursorGlow />
          <Nav />

          <main>
            <Hero />
            <Wish />
            <Diyas />
            <Blessings />
            <Countdown />
            <Celebrate />
            <LightLab />
            <Share />
          </main>

          <Footer />
          <ScrollTopDiya />
        </SmoothScroll>
      )}
    </>
  );
}
