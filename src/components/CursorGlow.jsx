import { useEffect, useRef } from "react";
import gsap from "gsap";
import styles from "./CursorGlow.module.scss";

export function CursorGlow() {
  const haloRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced) return;

    const halo = haloRef.current;
    const dot = dotRef.current;
    if (!halo || !dot) return;

    gsap.set([halo, dot], { xPercent: -50, yPercent: -50 });

    const haloX = gsap.quickTo(halo, "x", { duration: 0.55, ease: "power3" });
    const haloY = gsap.quickTo(halo, "y", { duration: 0.55, ease: "power3" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2" });

    const onMove = (event) => {
      haloX(event.clientX);
      haloY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);
    };

    const onOver = (event) => {
      const interactive = event.target.closest(
        "a, button, [data-cursor-hover], input, textarea, select"
      );
      halo.classList.toggle(styles.active, Boolean(interactive));
    };

    const onLeave = () => {
      gsap.to([halo, dot], { opacity: 0, duration: 0.25 });
    };

    const onEnter = () => {
      gsap.to([halo, dot], { opacity: 1, duration: 0.25 });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  return (
    <div className={styles.layer} aria-hidden="true">
      <div ref={haloRef} className={styles.halo} />
      <div ref={dotRef} className={styles.dot} />
    </div>
  );
}
