import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollContext } from "../context/ScrollContext";

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const updateProgress = (progress) => {
      document.documentElement.style.setProperty(
        "--scroll-progress",
        Math.min(1, Math.max(0, progress)).toFixed(4)
      );
    };

    if (prefersReducedMotion()) {
      const onScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        updateProgress(max > 0 ? window.scrollY / max : 0);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.35,
    });

    lenisRef.current = instance;
    setLenis(instance);

    instance.on("scroll", ({ progress }) => {
      ScrollTrigger.update();
      updateProgress(progress);
    });

    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tick);
      instance.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  const scrollTo = useCallback((target, options = {}) => {
    if (target === "top" || target === 0) {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { duration: 1.35, ...options });
      } else {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }
      return;
    }

    if (!target) return;
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(element, {
        offset: -84,
        duration: 1.35,
        ...options,
      });
      return;
    }

    const top = element.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({
      top,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const value = useMemo(() => ({ lenis, scrollTo }), [lenis, scrollTo]);

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}
