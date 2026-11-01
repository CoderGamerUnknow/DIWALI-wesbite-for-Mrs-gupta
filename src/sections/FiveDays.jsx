import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Diya } from "../components/Diya";
import { site } from "../const/site";
import styles from "./FiveDays.module.scss";

export function FiveDays() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-days-head] > *", {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-days-head]", start: "top 80%" },
      });

      gsap.from("[data-day-row]", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-days-list]", start: "top 82%" },
      });

      gsap.to("[data-days-glow]", {
        yPercent: -18,
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

  return (
    <section className={`section ${styles.days}`} id="five-days" ref={sectionRef}>
      <span className={styles.glow} data-days-glow aria-hidden="true" />

      <div className={`container ${styles.grid}`}>
        <div className={styles.intro} data-days-head>
          <p className="eyebrow">The festival, day by day</p>
          <h2 className="section-title">
            Diwali is not one night.
            <br />
            <em>It is five.</em>
          </h2>
          <p className="lead">
            It begins with a clean house and one small new thing, and ends with
            a tilak, a plate of sweets and the people who make a house a home.
            The names change across India; the reason for the lamps does not.
          </p>
          <p className={styles.note}>
            <span aria-hidden="true">✦</span>
            Five days of making the dark a little friendlier.
          </p>
        </div>

        <ol className={styles.list} data-days-list>
          {site.fiveDays.map((day, index) => (
            <li
              className={`${styles.row} ${day.main ? styles.main : ""}`}
              key={day.name}
              data-day-row
            >
              <div className={styles.marker} aria-hidden="true">
                <span className={styles.markerDiya}>
                  <Diya lit />
                </span>
                <span className={styles.markerNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className={styles.body}>
                <div className={styles.heading}>
                  <h3>{day.name}</h3>
                  <span className={`${styles.hindi} hindi`} lang="hi">
                    {day.hindi}
                  </span>
                  {day.main && (
                    <span className={styles.badge}>The main night</span>
                  )}
                </div>
                <p className={styles.sub}>{day.sub}</p>
                <p className={styles.text}>{day.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className={`container ${styles.footNote}`}>
        <span aria-hidden="true">✦</span>
        The main night arrives with the new moon of Kartika — no moonlight at
        all, which is exactly why every little lamp matters.
      </p>
    </section>
  );
}
