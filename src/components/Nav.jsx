import { useEffect, useRef, useState } from "react";
import { Diya } from "./Diya";
import { useSmoothScroll } from "../context/ScrollContext";
import { site } from "../const/site";
import styles from "./Nav.module.scss";

const LINKS = [
  { id: "wish", label: "The wish" },
  { id: "diyas", label: "Light a diya" },
  { id: "blessings", label: "Blessings" },
  { id: "countdown", label: "Countdown" },
  { id: "share", label: "QR card" },
];

export function Nav() {
  const { lenis, scrollTo } = useSmoothScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const firstLinkRef = useRef(null);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = (event) => {
      const y = typeof event.scroll === "number" ? event.scroll : window.scrollY;
      const direction =
        typeof event.direction === "number"
          ? event.direction
          : y > lastY
            ? 1
            : -1;

      lastY = y;
      setScrolled(y > 20);
      setHidden(direction === 1 && y > 520);
    };

    if (lenis) {
      lenis.on("scroll", onScroll);
      return () => lenis.off?.("scroll", onScroll);
    }

    const onWindowScroll = () => onScroll({ scroll: window.scrollY });
    window.addEventListener("scroll", onWindowScroll, { passive: true });
    return () => window.removeEventListener("scroll", onWindowScroll);
  }, [lenis]);

  useEffect(() => {
    const sections = LINKS.map((link) => document.getElementById(link.id)).filter(
      Boolean
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // While the menu is open: freeze the page behind it, close on Escape, and
  // put the keyboard on the first entry.
  useEffect(() => {
    if (!menuOpen) return undefined;

    lenis?.stop();
    if (!lenis) document.documentElement.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus({ preventScroll: true });
    };

    const focusTimer = window.setTimeout(() => {
      firstLinkRef.current?.focus({ preventScroll: true });
    }, 80);

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen, lenis]);

  // The panel only exists below the desktop breakpoint.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 981px)");
    const onChange = (event) => {
      if (event.matches) setMenuOpen(false);
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const go = (id) => (event) => {
    event.preventDefault();
    setHidden(false);

    if (menuOpen) {
      setMenuOpen(false);
      // Lenis ignores scroll requests while stopped, so release it first.
      lenis?.start();
    }

    scrollTo(`#${id}`);
  };

  const toggleMenu = () => {
    setHidden(false);
    setMenuOpen((open) => !open);
  };

  return (
    <>
      <header
        className={`${styles.header} ${scrolled ? styles.scrolled : ""} ${
          hidden ? styles.hidden : ""
        }`}
      >
        <div className={`container ${styles.inner}`}>
          <a
            href="#top"
            className={styles.brand}
            onClick={(event) => {
              event.preventDefault();
              setHidden(false);
              setMenuOpen(false);
              lenis?.start();
              scrollTo("top");
            }}
            aria-label="Happy Diwali — back to the beginning"
          >
            <span className={styles.brandDiya}>
              <Diya lit />
            </span>
            <span>
              <span className={`${styles.brandText} hindi`} lang="hi">
                दीपावली
              </span>
              <span className={styles.brandSub}>A wish for you</span>
            </span>
          </a>

          <nav className={styles.links} aria-label="Sections">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={go(link.id)}
                className={`${styles.link} ${
                  active === link.id ? styles.linkActive : ""
                }`}
                aria-current={active === link.id ? "true" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className={styles.actions}>
            <a
              href="#share"
              className={`btn btn--ghost btn--small ${styles.cta}`}
              onClick={go("share")}
            >
              Share the light
            </a>

            <button
              ref={menuButtonRef}
              type="button"
              className={`${styles.menuButton} ${
                menuOpen ? styles.menuButtonOpen : ""
              }`}
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        className={`${styles.menu} ${menuOpen ? styles.menuOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className={styles.menuInner}>
          <p className={styles.menuKicker}>
            A Diwali wish for {site.principalShort}
          </p>

          <nav className={styles.menuList} aria-label="Sections">
            {LINKS.map((link, index) => (
              <a
                key={link.id}
                ref={index === 0 ? firstLinkRef : undefined}
                href={`#${link.id}`}
                onClick={go(link.id)}
                tabIndex={menuOpen ? 0 : -1}
                className={`${styles.menuLink} ${
                  active === link.id ? styles.menuLinkActive : ""
                }`}
                aria-current={active === link.id ? "true" : undefined}
              >
                <span className={styles.menuIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {link.label}
              </a>
            ))}
          </nav>

          <a
            href="#share"
            className={`btn ${styles.menuCta}`}
            onClick={go("share")}
            tabIndex={menuOpen ? 0 : -1}
          >
            Share the light
            <span aria-hidden="true">✦</span>
          </a>

          <p className={styles.menuFoot}>
            {site.diwaliLabel} · Diwali {site.year}
          </p>
        </div>
      </div>
    </>
  );
}
