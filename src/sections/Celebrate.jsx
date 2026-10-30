import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Fireworks } from "../components/Fireworks";
import { site } from "../const/site";
import styles from "./Celebrate.module.scss";

export function Celebrate() {
  const sectionRef = useRef(null);
  const fireworksRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const onChange = (event) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-celebrate-content] > *", {
        opacity: 0,
        y: 26,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-celebrate-content]",
          start: "top 82%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleBurstAtPointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    fireworksRef.current?.burst(event.clientX - rect.left, event.clientY - rect.top, {
      count: 48,
    });
  };

  return (
    <section className={`section ${styles.celebrate}`} id="celebrate" ref={sectionRef}>
      <div
        className={styles.sky}
        onPointerDown={reduced ? undefined : handleBurstAtPointer}
        aria-hidden="true"
      >
        <Fireworks ref={fireworksRef} />
      </div>

      <div className={styles.stars} aria-hidden="true" />
      <div className={styles.horizon} aria-hidden="true" />

      <div className={`container ${styles.content}`} data-celebrate-content>
        <p className="eyebrow eyebrow--centered">Go on, make some noise</p>
        <h2 className={`section-title ${styles.title}`}>
          The sky has been
          <br />
          <em>waiting for you.</em>
        </h2>
        <p className={styles.lead}>
          Tap the dark anywhere and a firework will bloom. One for joy, one for
          health, one for the year ahead — take as many as you like. The sky is
          yours tonight, {site.principalShort}.
        </p>

        {reduced ? (
          <p className={styles.quiet}>
            The sky is quiet tonight — your wish is just as bright,{" "}
            {site.principalShort}.
          </p>
        ) : (
          <>
            <button
              type="button"
              className="btn"
              onClick={() => fireworksRef.current?.volley()}
            >
              Send up a burst
              <span aria-hidden="true">✦</span>
            </button>

            <p className={styles.note} aria-hidden="true">
              No matches required.
            </p>
          </>
        )}
      </div>

      <div className={styles.silhouette} aria-hidden="true">
        <span className={styles.silhouetteDiya}>
          <span className={styles.silhouetteFlame} />
        </span>
      </div>
    </section>
  );
}
