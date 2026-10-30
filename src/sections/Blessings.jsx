import { useEffect, useRef } from "react";
import gsap from "gsap";
import { site } from "../const/site";
import styles from "./Blessings.module.scss";

export function Blessings() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-blessing-head] > *", {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-blessing-head]", start: "top 82%" },
      });

      gsap.from("[data-blessing-card]", {
        opacity: 0,
        y: 44,
        rotate: (index) => (index % 2 === 0 ? -1.4 : 1.4),
        stagger: 0.09,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-blessing-grid]", start: "top 84%" },
      });

      gsap.to("[data-blessing-glow]", {
        yPercent: -22,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={`section ${styles.blessings}`} id="blessings" ref={sectionRef}>
      <span className={styles.glow} data-blessing-glow aria-hidden="true" />

      <div className="container">
        <header className={styles.head} data-blessing-head>
          <div>
            <p className="eyebrow">Six small blessings</p>
            <h2 className="section-title">
              For your year ahead,
              <br />
              <em>a little more light.</em>
            </h2>
          </div>
          <p className={`lead ${styles.headLead}`}>
            Not the kind of wishes that fit on a WhatsApp forward. The quiet kind —
            for your home, your health, your laughter, and all the good that is
            still on its way to you.
          </p>
        </header>

        <div className={styles.grid} data-blessing-grid>
          {site.blessings.map((blessing, index) => (
            <article className={styles.card} key={blessing.text} data-blessing-card>
              <div className={styles.cardTop}>
                <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
                <span className={styles.spark} aria-hidden="true">
                  ✦
                </span>
              </div>

              <p className={`${styles.hindiText} hindi`} lang="hi">
                {blessing.hindi}
              </p>
              <p className={styles.text}>{blessing.text}</p>

              <span className={styles.cardLine} aria-hidden="true" />
            </article>
          ))}
        </div>

        <p className={styles.footnote} aria-hidden="true">
          <span>✦</span> Every lamp here is lit for you <span>✦</span>
        </p>
      </div>
    </section>
  );
}
