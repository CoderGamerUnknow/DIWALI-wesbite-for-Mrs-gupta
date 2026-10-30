import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { diwaliDate, site } from "../const/site";
import { Diya } from "../components/Diya";
import styles from "./Countdown.module.scss";

const getRemaining = () => {
  const distance = Math.max(0, diwaliDate.getTime() - Date.now());

  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
    done: distance <= 0,
  };
};

export function Countdown() {
  const sectionRef = useRef(null);
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-countdown-copy] > *", {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-countdown-copy]", start: "top 80%" },
      });

      gsap.from("[data-countdown-panel]", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-countdown-panel]", start: "top 82%" },
      });

      gsap.to("[data-countdown-diya]", {
        yPercent: -18,
        rotate: -6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const units = [
    { label: "Days", value: remaining.days },
    { label: "Hours", value: remaining.hours },
    { label: "Minutes", value: remaining.minutes },
    { label: "Seconds", value: remaining.seconds },
  ];

  return (
    <section className={`section ${styles.countdown}`} id="countdown" ref={sectionRef}>
      <div className={styles.rangoli} aria-hidden="true" />
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy} data-countdown-copy>
          <p className="eyebrow">The wait, in numbers</p>
          <h2 className="section-title">
            {remaining.done ? "The lamps are lit." : "Counting down to"}
            {!remaining.done && (
              <>
                <br />
                <em>the festival of lights.</em>
              </>
            )}
          </h2>
          <p className={`lead ${styles.lead}`}>
            {remaining.done
              ? `Diwali is here. May this year bring you every quiet joy you have wished for, ${site.principalShort}.`
              : "Diwali 2026 arrives on Sunday, 8 November. Until then, consider this our little countdown — one bright thought at a time."}
          </p>

          <div className={styles.dateChip}>
            <span className={styles.dateDot} aria-hidden="true" />
            {site.diwaliLabel} · Lakshmi Puja
          </div>

          <p className={styles.srSummary}>
            Diwali is on {site.diwaliLabel}.
          </p>
        </div>

        <div className={styles.panelWrap}>
          <div className={styles.panel} data-countdown-panel>
            <span className={styles.panelGlow} aria-hidden="true" />
            <div className={styles.panelHead}>
              <span>Diwali {site.year}</span>
              <span>{remaining.done ? "Celebrate" : "Until the first diya"}</span>
            </div>

            <div className={styles.units} aria-hidden="true">
              {units.map((unit, index) => (
                <div className={styles.unit} key={unit.label}>
                  <span className={styles.value}>
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className={styles.label}>{unit.label}</span>
                  {index < units.length - 1 && (
                    <span className={styles.colon}>:</span>
                  )}
                </div>
              ))}
            </div>

            <div className={styles.panelFoot}>
              <span className={styles.miniDiya} data-countdown-diya aria-hidden="true">
                <Diya lit />
              </span>
              <p>
                {remaining.done
                  ? "May your home always feel this warm."
                  : "A little patience, a lot of light."}
              </p>
              <span aria-hidden="true">✦</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
