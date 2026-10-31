import { useRef, useState } from "react";
import { LAB_CATEGORIES, LAB_FEATURES as FIRST_FEATURES } from "../const/lab";
import { LAB_FEATURES_2 } from "../const/lab2";
import { useSmoothScroll } from "../context/ScrollContext";
import { FeatureBody } from "./lab/FeatureBody";
import { Diya } from "./Diya";
import styles from "./LightLab.module.scss";

const LAB_FEATURES = [...FIRST_FEATURES, ...LAB_FEATURES_2];
const TOTAL = LAB_FEATURES.length;

export function LightLab() {
  const { scrollTo } = useSmoothScroll();
  const stageRef = useRef(null);
  const [category, setCategory] = useState("All");
  const [activeId, setActiveId] = useState(null);

  const activeFeature = LAB_FEATURES.find((feature) => feature.id === activeId) ?? null;
  const activeIndex = activeFeature ? LAB_FEATURES.indexOf(activeFeature) + 1 : 0;
  const visible =
    category === "All"
      ? LAB_FEATURES
      : LAB_FEATURES.filter((feature) => feature.category === category);

  const open = (id) => {
    setActiveId(id);
    window.requestAnimationFrame(() => {
      if (stageRef.current) scrollTo(stageRef.current, { offset: -96 });
    });
  };

  const surprise = () => {
    const pick = LAB_FEATURES[Math.floor(Math.random() * LAB_FEATURES.length)];
    setCategory("All");
    open(pick.id);
  };

  return (
    <section className={`section ${styles.lab}`} id="lab">
      <div className={styles.aura} aria-hidden="true" />
      <div className={styles.toran} aria-hidden="true">
        {Array.from({ length: 13 }, (_, index) => (
          <span key={index} style={{ "--drop": `${10 + ((index * 11) % 26)}px` }} />
        ))}
      </div>

      <div className={`container ${styles.inner}`}>
        <header className={styles.head}>
          <div>
            <p className="eyebrow">The Light Lab</p>
            <h2 className="section-title">
              Eighty little lights,
              <br />
              <em>one for every mood.</em>
            </h2>
          </div>
          <div className={styles.headCopy}>
            <p className="lead">
              Small things to play with, make, learn and keep. Every one runs
              right here in your browser — no accounts, no downloads, no
              instructions longer than a sentence.
            </p>
            <p className={styles.headNote}>
              <span aria-hidden="true">✦</span>
              {TOTAL} experiences, made for the festival
            </p>
          </div>
        </header>

        <div className={styles.stage} ref={stageRef}>
          {activeFeature ? (
            <>
              <div className={styles.stageTop}>
                <span className={styles.stageIndex}>
                  {String(activeIndex).padStart(2, "0")} / {TOTAL} ·{" "}
                  {activeFeature.category}
                </span>
                <button
                  type="button"
                  className={styles.closeStage}
                  onClick={() => setActiveId(null)}
                >
                  Close <span aria-hidden="true">×</span>
                </button>
              </div>

              <div className={styles.stageHeading}>
                <h3>{activeFeature.title}</h3>
                <p>{activeFeature.blurb}</p>
              </div>

              <div className={styles.stageBody} key={activeFeature.id}>
                <FeatureBody id={activeFeature.id} />
              </div>
            </>
          ) : (
            <div className={styles.stageEmpty}>
              <span className={styles.emptyNumber} aria-hidden="true">
                {TOTAL}
              </span>
              <div className={styles.emptyCopy}>
                <span className={styles.stageIndex}>The whole shelf</span>
                <h3>Eighty small ways to play.</h3>
                <p>
                  Pick any card below. The light you choose opens right here, so
                  you never lose your place on the page.
                </p>
                <div className={styles.emptyActions}>
                  <button type="button" className={styles.primaryButton} onClick={surprise}>
                    Surprise me
                    <span aria-hidden="true">✦</span>
                  </button>
                  <span className={styles.hint}>
                    <Diya lit /> Or start with the first light.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.categoryBar} role="group" aria-label="Filter the light lab">
          {["All", ...LAB_CATEGORIES].map((name) => {
            const count =
              name === "All"
                ? LAB_FEATURES.length
                : LAB_FEATURES.filter((feature) => feature.category === name).length;
            return (
              <button
                key={name}
                type="button"
                className={`${styles.categoryButton} ${
                  category === name ? styles.categoryActive : ""
                }`}
                onClick={() => setCategory(name)}
                aria-pressed={category === name}
              >
                {name}
                <span>{count}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.grid}>
          {visible.map((feature) => {
            const index = LAB_FEATURES.indexOf(feature) + 1;
            return (
              <button
                key={feature.id}
                type="button"
                className={`${styles.card} ${
                  feature.id === activeId ? styles.cardActive : ""
                }`}
                onClick={() => open(feature.id)}
              >
                <span className={styles.cardTop}>
                  <span className={styles.cardNumber}>
                    {String(index).padStart(2, "0")}
                  </span>
                  <span className={styles.cardCategory}>{feature.category}</span>
                </span>
                <span className={styles.cardTitle}>{feature.title}</span>
                <span className={styles.cardBlurb}>{feature.blurb}</span>
                <span className={styles.cardOpen} aria-hidden="true">
                  Open <span>→</span>
                </span>
              </button>
            );
          })}
        </div>

        <p className={styles.footNote}>
          Your names, notes and wishes stay in this browser. Nothing in the lab
          is sent anywhere.
        </p>
      </div>
    </section>
  );
}
