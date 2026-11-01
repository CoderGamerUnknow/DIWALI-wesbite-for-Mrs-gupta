import { LAB_FEATURES_3 } from "../../const/lab3";
import styles from "../LightLab.module.scss";

const PERSONAL_IDS = [
  "accent-origami",
  "aurora-name",
  "badge-maker",
  "birth-moon",
  "constellation-name",
  "greeting-card",
  "lantern-message",
  "monogram-lamp",
  "paper-lantern",
  "signature-rangoli",
];

export function Personal3() {
  const personal = PERSONAL_IDS
    .map(id => LAB_FEATURES_3.find(f => f.id === id))
    .filter(Boolean);

  return (
    <div className={styles.lab}>
      <div className={styles.labHeader}>
        <h2 className={styles.labTitle}>Personalize</h2>
        <p className={styles.labLead}>Ten small ways to make the page feel like yours.</p>
      </div>
      <div className={styles.featureGrid}>
        {personal.map(f => (
          <div key={f.id} className={styles.featureCard}>
            <div className={styles.featureCover}>
              <span className={styles.featureTag}>Personalize</span>
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
