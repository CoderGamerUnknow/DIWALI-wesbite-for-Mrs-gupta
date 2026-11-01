import { LAB_FEATURES_3 } from "../../const/lab3";
import styles from "../LightLab.module.scss";
 const LEARN_IDS = [
   "arti-words",
   "bakri-light",
   "colour-symbols",
   "diya-lore",
   "festival-menu",
   "folk-patterns",
   "how-diya-is-made",
   "legend-of-the-lamp",
   "lullaby-of-lights",
   "ritual-routing",
 ];

export function Learn3() {
  const learn = LEARN_IDS
    .map(id => LAB_FEATURES_3.find(f => f.id === id))
    .filter(Boolean);

  return (
    <div className={styles.lab}>
      <div className={styles.labHeader}>
        <h2 className={styles.labTitle}>Learn</h2>
        <p className={styles.labLead}>Ten small things worth knowing about the festival of lights.</p>
      </div>
      <div className={styles.featureGrid}>
        {learn.map(f => (
          <div key={f.id} className={styles.featureCard}>
            <div className={styles.featureCover}>
              <span className={styles.featureTag}>Learn</span>
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
