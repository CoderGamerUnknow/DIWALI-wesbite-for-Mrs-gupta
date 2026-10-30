import { useEffect, useState } from "react";
import { Diya } from "./Diya";
import { useSmoothScroll } from "../context/ScrollContext";
import styles from "./ScrollTopDiya.module.scss";

export function ScrollTopDiya() {
  const { scrollTo } = useSmoothScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`${styles.button} ${visible ? styles.visible : ""}`}
      onClick={() => scrollTo("top")}
      aria-label="Back to the top"
      tabIndex={visible ? 0 : -1}
    >
      <span className={styles.ring} aria-hidden="true" />
      <span className={styles.diya}>
        <Diya lit />
      </span>
      <span className={styles.label} aria-hidden="true">
        Top
      </span>
    </button>
  );
}
