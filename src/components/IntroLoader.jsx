import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Diya } from "./Diya";
import styles from "./IntroLoader.module.scss";

const TITLE = "HAPPY DIWALI";

export function IntroLoader({ onDone }) {
  const rootRef = useRef(null);
  const counterRef = useRef(null);
  const progressRef = useRef(null);
  const finishRef = useRef(() => {});
  const doneRef = useRef(false);

  useEffect(() => {
    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDone?.();
    };
    finishRef.current = finish;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timer = window.setTimeout(finish, 300);
      return () => window.clearTimeout(timer);
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: finish,
      });

      tl.from("[data-loader-kicker]", { opacity: 0, y: 12, duration: 0.7 }, 0.05)
        .from(
          "[data-loader-diya]",
          { scale: 0.6, opacity: 0, duration: 1.1, ease: "back.out(1.7)" },
          0.15
        )
        .from(
          "[data-loader-char]",
          {
            yPercent: 120,
            opacity: 0,
            rotateX: -60,
            stagger: 0.028,
            duration: 0.85,
            ease: "power4.out",
          },
          0.2
        )
        .from("[data-loader-hindi]", { opacity: 0, y: 14, duration: 0.8 }, 0.65)
        .from("[data-loader-note]", { opacity: 0, duration: 0.7 }, 0.8)
        .to(
          counterRef.current,
          {
            textContent: 100,
            duration: 2.15,
            ease: "power2.inOut",
            snap: { textContent: 1 },
          },
          0.2
        )
        .to(
          progressRef.current,
          { scaleX: 1, duration: 2.15, ease: "power2.inOut" },
          0.2
        )
        .to(
          "[data-loader-inner]",
          { yPercent: -10, opacity: 0, duration: 0.75, ease: "power2.in" },
          "+=0.2"
        )
        .to(
          rootRef.current,
          { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" },
          "-=0.25"
        )
        .to(rootRef.current, { autoAlpha: 0, duration: 0.15 }, "-=0.05");
    }, rootRef);

    const failsafe = window.setTimeout(finish, 6000);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, [onDone]);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      role="dialog"
      aria-label="Happy Diwali introduction"
    >
      <div className={styles.stars} aria-hidden="true" />
      <div className={styles.aura} aria-hidden="true" />

      <div className={styles.inner} data-loader-inner>
        <p className={styles.kicker} data-loader-kicker>
          Diwali · The Festival of Lights
        </p>

        <div className={styles.diya} data-loader-diya>
          <Diya lit />
        </div>

        <h1 className={styles.title} aria-label={TITLE}>
          {TITLE.split(" ").map((word, wordIndex) => (
            <span className={styles.word} key={word}>
              {word.split("").map((char, index) => (
                <span className={styles.charMask} key={`${char}-${index}`} aria-hidden="true">
                  <span className={styles.char} data-loader-char>
                    {char}
                  </span>
                </span>
              ))}
              {wordIndex === 0 && <span className={styles.space} aria-hidden="true" />}
            </span>
          ))}
        </h1>

        <p className={`${styles.hindi} hindi`} lang="hi" data-loader-hindi>
          शुभ दीपावली
        </p>
        <p className={styles.note} data-loader-note>
          Lighting up something special for you…
        </p>
      </div>

      <div className={styles.progressWrap}>
        <div className={styles.progressMeta}>
          <span>Lighting the diyas</span>
          <span className={styles.counter} aria-hidden="true">
            <span ref={counterRef}>0</span>%
          </span>
        </div>
        <div className={styles.track}>
          <div ref={progressRef} className={styles.bar} />
        </div>
      </div>

      <button
        type="button"
        className={styles.skip}
        onClick={() => finishRef.current()}
      >
        Skip intro
      </button>
    </div>
  );
}
