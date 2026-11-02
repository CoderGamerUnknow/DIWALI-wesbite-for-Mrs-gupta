import { useEffect, useSyncExternalStore } from "react";
import {
  isSongPlaying,
  playSong,
  songEnabled,
  subscribeSong,
  toggleSong,
} from "../lib/song";
import styles from "./MusicToggle.module.scss";

export function MusicToggle() {
  const playing = useSyncExternalStore(
    subscribeSong,
    () => isSongPlaying(),
    () => false
  );

  useEffect(() => {
    if (!songEnabled()) return undefined;

    // Browsers hold audio until the visitor interacts. Try immediately, then
    // start on the first tap, click or keypress unless the song was paused.
    playSong();

    const unlock = (event) => {
      if (
        event.target instanceof Element &&
        event.target.closest("[data-music-toggle]")
      ) {
        return;
      }
      if (songEnabled()) playSong();
    };

    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return (
    <button
      type="button"
      className={`${styles.button} ${playing ? styles.playing : ""}`}
      data-music-toggle=""
      onClick={toggleSong}
      aria-pressed={playing}
      aria-label={playing ? "Pause the Diwali song" : "Play the Diwali song"}
      title={playing ? "Pause the Diwali song" : "Play the Diwali song"}
    >
      <span className={styles.icon} aria-hidden="true">
        {playing ? (
          <span className={styles.bars}>
            <i />
            <i />
            <i />
          </span>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18V6l10-2v12" />
            <circle cx="6.5" cy="18" r="2.5" />
            <circle cx="16.5" cy="16" r="2.5" />
          </svg>
        )}
      </span>
      <span className={styles.label} aria-hidden="true">
        {playing ? "Song on" : "Diwali song"}
      </span>
    </button>
  );
}
