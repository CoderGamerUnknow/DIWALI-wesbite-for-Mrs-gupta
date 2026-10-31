import { LAB_FEATURES_3, WORDLE_ANSWERS, WORDLE_KEYS } from "../../const/lab3";
import { Diya } from "../Diya";
import styles from "../LightLab.module.scss";

const PLAY_IDS = [
  "alibi-lights",
  "candle-count",
  "colour-memory",
  "diya-dash",
  "path-draw",
  "shadow-match",
  "spark-counter",
  "steal-the-flame",
  "string-lights",
  "treasure-diya",
];

export function Play3() {
  const play = PLAY_IDS
    .map((id) => LAB_FEATURES_3.find((f) => f.id === id))
    .filter(Boolean);

  return (
    <div className={styles.lab}>
      <div className={styles.labHeader}>
        <h2 className={styles.labTitle}>Play</h2>
        <p className={styles.labLead}>Ten little games and challenges you can play right here.</p>
      </div>
      <div className={styles.featureGrid}>
        {play.map((f) => (
          <div key={f.id} className={styles.featureCard}>
            <div className={styles.featureCover}>
              <span className={styles.featureTag}>Play</span>
              <img
                className={styles.featureImage}
                src={`/covers/${f.id}.svg`}
                alt={f.title}
                loading="lazy"
              />
            </div>
            <div className={styles.featureBody}>
              <h3 className={styles.featureTitle}>{f.title}</h3>
              <p className={styles.featureSummary}>{f.blurb}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
