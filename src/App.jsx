import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SmoothScroll } from "./components/SmoothScroll";
import { IntroLoader } from "./components/IntroLoader";
import { CursorGlow } from "./components/CursorGlow";
import { Nav } from "./components/Nav";
import { MusicToggle } from "./components/MusicToggle";
import { ScrollTopDiya } from "./components/ScrollTopDiya";
import { Hero } from "./sections/Hero";
import { Wish } from "./sections/Wish";
import { Diyas } from "./sections/Diyas";
import { Blessings } from "./sections/Blessings";
import { FiveDays } from "./sections/FiveDays";
import { Countdown } from "./sections/Countdown";
import { Celebrate } from "./sections/Celebrate";
import { Share } from "./sections/Share";
import { Footer } from "./sections/Footer";

// The Light Lab is the largest part of the page and sits below the fold, so
// load it as its own chunk instead of in the initial bundle.
const LightLab = lazy(() =>
  import("./components/LightLab").then((module) => ({ default: module.LightLab }))
);

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
          <MusicToggle />

          <main>
            <Hero />
            <Wish />
            <Diyas />
            <Blessings />
            <FiveDays />
            <Countdown />
            <Celebrate />
            <Suspense fallback={null}>
              <LightLab />
            </Suspense>
            <Share />
          </main>

          <Footer />
          <ScrollTopDiya />
        </SmoothScroll>
      )}
    </>
  );
}
