import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Diya } from "../components/Diya";
import { site } from "../const/site";
import styles from "./ThankYou.module.scss";

const THANKS = [
  {
    title: "For the second chances",
    text: "You have a way of believing in someone a little before they have earned it. That is not a small thing. It is often the thing that lets a person begin again.",
  },
  {
    title: "For the students at the back",
    text: "You notice the quiet ones. You ask the question nobody else asks. You remember the name. They may never say so, but it changes the shape of their day.",
  },
  {
    title: "For the days that go right quietly",
    text: "The timetables, the phone calls, the small emergencies that never reach a newsletter — you carry them so the rest of us can teach. We are grateful for the work no one sees.",
  },
  {
    title: "For the door that stays open",
    text: "For the parent who needed five more minutes, the teacher who needed a straight answer, and the student who needed one adult to take them seriously. You made room.",
  },
  {
    title: "For making it feel like a place, not a building",
    text: "Somehow, between the notices and the bells, you kept the warmth in. That is the part we will remember long after the syllabus.",
  },
];

export function ThankYou() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-thanks-head] > *", {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-thanks-head]", start: "top 80%" },
      });

      gsap.from("[data-thanks-letter]", {
        opacity: 0,
        y: 46,
        rotate: -1.2,
        duration: 1.05,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-thanks-letter]", start: "top 84%" },
      });

      gsap.to("[data-thanks-glow]", {
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
    <section
      className={`section ${styles.thankYou}`}
      id="thank-you"
      ref={sectionRef}
      aria-labelledby="thank-you-title"
    >
      <span className={styles.glow} data-thanks-glow aria-hidden="true" />
      <span className={`hindi ${styles.watermark}`} aria-hidden="true">
        धन्यवाद
      </span>

      <div className={`container ${styles.grid}`}>
        <div className={styles.intro} data-thanks-head>
          <p className="eyebrow">With gratitude</p>
          <h2 id="thank-you-title" className={`section-title ${styles.title}`}>
            Thank you,
            <br />
            <em>for the light nobody claps for.</em>
          </h2>
          <p className={`lead ${styles.lead}`}>
            There are thank-yous we say at assemblies, and then there is this one
            — for the quiet, unglamorous work of looking after a school. The
            early mornings, the difficult conversations, the small mercies that
            never make it into a newsletter.
          </p>

          <div className={styles.diyaRow} aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={styles.diya}
                style={{ "--i": index }}
              >
                <Diya lit />
              </span>
            ))}
          </div>
          <p className={styles.diyaNote}>
            Five lamps for the things we do not say enough.
          </p>
        </div>

        <article className={styles.letter} data-thanks-letter>
          <header className={styles.letterHead}>
            <span className={styles.letterKicker}>
              A thank-you, in plain words
            </span>
            <span className={styles.letterDiya} aria-hidden="true">
              <Diya lit />
            </span>
          </header>

          <ol className={styles.list}>
            {THANKS.map((item, index) => (
              <li className={styles.item} key={item.title}>
                <span className={styles.number}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className={styles.closing}>
            <p>
              So before the lamps are put away, we wanted to say it plainly:
              thank you, {site.principalShort}. For the patience, the fairness,
              the steady hand, and the hundred small kindnesses that never asked
              for an audience.
            </p>
            <p>May the year ahead be as generous to you as you have been to us.</p>
          </div>

          <p className={styles.signature}>
            With all our light,
            <br />
            <strong>{site.letter.signature}</strong>
          </p>
          <p className={styles.footnote}>
            From the loud ones, the quiet ones, and everyone you helped find
            their feet.
          </p>
        </article>
      </div>
    </section>
  );
}
