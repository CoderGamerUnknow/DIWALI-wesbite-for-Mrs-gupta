import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Diya } from "../components/Diya";
import { Rangoli } from "../components/Rangoli";
import { site } from "../const/site";
import styles from "./Wish.module.scss";

export function Wish() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-wish-intro] > *", {
        opacity: 0,
        y: 26,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-wish-intro]", start: "top 80%" },
      });

      gsap.from("[data-wish-card]", {
        opacity: 0,
        y: 44,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-wish-card]", start: "top 84%" },
      });

      gsap.from("[data-wish-line]", {
        opacity: 0,
        y: 18,
        stagger: 0.12,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-wish-body]", start: "top 78%" },
      });

      gsap.to("[data-wish-rangoli]", {
        rotate: 55,
        yPercent: 14,
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
    <section className={`section ${styles.wish}`} id="wish" ref={sectionRef}>
      <Rangoli className={styles.rangoli} data-wish-rangoli />
      <div className={`container ${styles.grid}`}>
        <div className={styles.intro} data-wish-intro>
          <p className="eyebrow">A letter, not a card</p>
          <h2 className={`section-title ${styles.title}`}>
            Some words,
            <br />
            <em>lit from within.</em>
          </h2>
          <p className="lead">
            What do you give the person who gives so much? A card gets read once.
            Flowers fade. So we chose light — and a page that can keep glowing
            long after the sweets are finished.
          </p>

          <div className={styles.meta}>
            <span>Written by your students</span>
            <span className={styles.metaDot} aria-hidden="true">
              ✦
            </span>
            <span>Diwali {site.year}</span>
          </div>

          <div className={styles.stamp} aria-hidden="true">
            <span className={styles.stampLine} />
            <span className="hindi" lang="hi">दीप जले, मन जले</span>
          </div>
        </div>

        <article className={styles.card} data-wish-card>
          <div className={styles.cornerTop} aria-hidden="true" />
          <div className={styles.cornerBottom} aria-hidden="true" />

          <header className={styles.cardHead}>
            <span className={styles.cardLabel}>A Diwali wish</span>
            <span className={styles.cardDiya} aria-hidden="true">
              <Diya lit />
            </span>
          </header>

          <div className={styles.body} data-wish-body>
            <p className={styles.greeting} data-wish-line>
              {site.letter.greeting}
            </p>

            {site.letter.paragraphs.map((paragraph, index) => (
              <p className={styles.paragraph} key={paragraph.slice(0, 24)} data-wish-line>
                {index === 0 && (
                  <span className={styles.dropCap} aria-hidden="true">
                    {paragraph.charAt(0)}
                  </span>
                )}
                {index === 0 ? paragraph.slice(1) : paragraph}
              </p>
            ))}

            <div className={styles.signOff} data-wish-line>
              <p>{site.letter.closing}</p>
              <p className={styles.signature}>{site.letter.signature}</p>
              {site.school && <p className={styles.school}>{site.school}</p>}
            </div>
          </div>

          <span className={styles.cardGarland} aria-hidden="true">
            ✦ ✦ ✦ ✦ ✦
          </span>
        </article>
      </div>
    </section>
  );
}
