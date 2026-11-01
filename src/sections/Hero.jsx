import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Diya } from "../components/Diya";
import { Rangoli } from "../components/Rangoli";
import { useSmoothScroll } from "../context/ScrollContext";
import { site } from "../const/site";
import styles from "./Hero.module.scss";

const TITLE = "HAPPY DIWALI";

const EMBERS = Array.from({ length: 18 }, (_, index) => ({
  left: (index * 37 + 7) % 100,
  delay: -((index * 1.7) % 15),
  duration: 9 + (index % 5) * 2.4,
  size: 2 + (index % 3),
  drift: (index % 2 === 0 ? 1 : -1) * (14 + (index % 4) * 9),
}));

export function Hero() {
  const heroRef = useRef(null);
  const { scrollTo } = useSmoothScroll();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from("[data-hero-eyebrow]", { opacity: 0, y: 16, duration: 0.8 }, 0.1)
        .from(
          "[data-hero-char]",
          {
            yPercent: 120,
            opacity: 0,
            rotateX: -60,
            transformOrigin: "50% 100%",
            stagger: 0.032,
            duration: 1,
          },
          0.2
        )
        .from("[data-hero-hindi]", { opacity: 0, y: 18, duration: 0.8 }, 0.7)
        .from(
          "[data-hero-copy] > *",
          { opacity: 0, y: 22, stagger: 0.1, duration: 0.8 },
          0.85
        )
        .from("[data-hero-cue]", { opacity: 0, y: 10, duration: 0.7 }, 1.1);

      gsap.to("[data-hero-rangoli]", {
        yPercent: 26,
        rotate: 34,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.to("[data-hero-content]", {
        yPercent: -14,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      gsap.to("[data-hero-lamp-left]", {
        yPercent: -48,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });

      gsap.to("[data-hero-lamp-right]", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.4,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const go = (id) => (event) => {
    event.preventDefault();
    scrollTo(`#${id}`);
  };

  return (
    <section className={styles.hero} id="top" ref={heroRef}>
      <div className={styles.stars} aria-hidden="true" />
      <div className={styles.aura} aria-hidden="true" />
      <Rangoli className={styles.rangoli} data-hero-rangoli />

      <div className={`${styles.lamp} ${styles.lampLeft}`} data-hero-lamp-left aria-hidden="true">
        <span className={styles.string} />
        <div className={styles.hangDiya}>
          <Diya lit />
        </div>
      </div>

      <div className={`${styles.lamp} ${styles.lampRight}`} data-hero-lamp-right aria-hidden="true">
        <span className={styles.string} />
        <div className={styles.hangDiya}>
          <Diya lit />
        </div>
      </div>

      <div className={styles.embers} aria-hidden="true">
        {EMBERS.map((ember, index) => (
          <span
            key={index}
            className={styles.ember}
            style={{
              "--left": `${ember.left}%`,
              "--delay": `${ember.delay}s`,
              "--duration": `${ember.duration}s`,
              "--size": `${ember.size}px`,
              "--drift": `${ember.drift}px`,
            }}
          />
        ))}
      </div>

      <div className={`container ${styles.content}`} data-hero-content>
        <p className={`eyebrow eyebrow--centered ${styles.eyebrow}`} data-hero-eyebrow>
          {site.diwaliLabel} · The Festival of Lights
        </p>

        <h1 className={styles.title} aria-label={TITLE}>
          {TITLE.split(" ").map((word, wordIndex) => (
            <span className={styles.word} key={word}>
              {word.split("").map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  className={styles.charMask}
                  aria-hidden="true"
                >
                  <span className={styles.char} data-hero-char>
                    {char}
                  </span>
                </span>
              ))}
              {wordIndex === 0 && <span className={styles.space} aria-hidden="true" />}
            </span>
          ))}
        </h1>

        <p className={`${styles.hindi} hindi`} lang="hi" data-hero-hindi>
          शुभ दीपावली
        </p>

        <div className={styles.copy} data-hero-copy>
          <p className={styles.leadCopy}>
            A little light, a lot of love — a Diwali wish made just for{" "}
            <span>{site.principalShort}</span>.
          </p>

          <div className={styles.actions}>
            <a href="#wish" className="btn" onClick={go("wish")}>
              Read our wish
              <span aria-hidden="true">↓</span>
            </a>
            <a href="#diyas" className="btn btn--ghost" onClick={go("diyas")}>
              Light a diya
              <span aria-hidden="true">✦</span>
            </a>
          </div>

          <p className={styles.chip}>
            <span aria-hidden="true">✦</span> For {site.principalShort}, with gratitude
            {site.school ? ` · ${site.school}` : ""}
          </p>
        </div>
      </div>

      <a
        href="#wish"
        className={styles.scrollCue}
        onClick={go("wish")}
        data-hero-cue
      >
        <span>Scroll into the light</span>
        <span className={styles.scrollLine} aria-hidden="true" />
      </a>

      <div className={styles.fade} aria-hidden="true" />
    </section>
  );
}
