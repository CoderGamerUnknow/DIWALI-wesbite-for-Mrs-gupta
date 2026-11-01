import { LAB_FEATURES_3 } from "../../const/lab3";
import styles from "../LightLab.module.scss";

const CREATE_IDS = [
  "card-collage",
  "chalk-rangoli",
  "diya-doodle-wild",
  "five-line-poem",
  "flower-crown",
  "glow-collage",
  "lamp-library",
  "light-poem",
  "tile-pattern",
  "wish-tree",
];

export function Create3() {
  const create = CREATE_IDS
    .map(id => LAB_FEATURES_3.find(f => f.id === id))
    .filter(Boolean);

  return (
    <div className={styles.lab}>
      <div className={styles.labHeader}>
        <h2 className={styles.labTitle}>Create</h2>
        <p className={styles.labLead}>Ten small things to make and take home.</p>
      </div>
      <div className={styles.featureGrid}>
        {create.map(f => (
          <div key={f.id} className={styles.featureCard}>
            <div className={styles.featureCover}>
              <span className={styles.featureTag}>Create</span>
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
