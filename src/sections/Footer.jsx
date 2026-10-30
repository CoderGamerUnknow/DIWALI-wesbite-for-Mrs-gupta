import { Diya } from "../components/Diya";
import { useSmoothScroll } from "../context/ScrollContext";
import { site } from "../const/site";
import styles from "./Footer.module.scss";

export function Footer() {
  const { scrollTo } = useSmoothScroll();

  return (
    <footer className={styles.footer}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <span className={styles.diya} aria-hidden="true">
            <Diya lit />
          </span>
          <p className={`${styles.hindi} hindi`} lang="hi">शुभ दीपावली</p>
          <p className={styles.line}>
            May the light you give so freely always find its way back to you.
          </p>
          <button
            type="button"
            className={styles.toTop}
            onClick={() => scrollTo("top")}
          >
            Back to the first diya
            <span aria-hidden="true">↑</span>
          </button>
        </div>

        <div className={styles.bottom}>
          <span>Diwali {site.year}</span>
          <span>Made with light by {site.from.toLowerCase()}</span>
          <span>For {site.principalShort}</span>
        </div>
      </div>
    </footer>
  );
}
