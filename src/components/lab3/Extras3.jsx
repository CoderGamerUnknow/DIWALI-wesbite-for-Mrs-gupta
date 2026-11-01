import { LAB_FEATURES_3 } from "../../const/lab3";
import styles from "../LightLab.module.scss";

const EXTRAS_IDS = [
  "aria-lab",
  "biting-time",
  "birthday-toast",
  "diya-sounds",
  "family-tree-lights",
  "festival-facts",
  "greeting-deck",
  "hindi-alphabet",
  "move-the-moon",
  "paper-crane",
];

export function Extras3() {
  const extras = EXTRAS_IDS
    .map(id => LAB_FEATURES_3.find(f => f.id === id))
    .filter(Boolean);

  return (
    <div className={styles.lab}>
      <div className={styles.labHeader}>
        <h2 className={styles.labTitle}>Extras</h2>
        <p className={styles.labLead}>Ten little utilities and goodies on the side.</p>
      </div>
      <div className={styles.featureGrid}>
        {extras.map(f => (
          <div key={f.id} className={styles.featureCard}>
            <div className={styles.featureCover}>
              <span className={styles.featureTag}>Extras</span>
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
