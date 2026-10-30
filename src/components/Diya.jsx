import { useId } from "react";
import styles from "./Diya.module.scss";

/**
 * A hand-drawn clay diya. The flame and warm glow only appear when `lit`.
 * Purely decorative — label the surrounding control instead.
 */
export function Diya({ lit = false, className = "" }) {
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9_-]/g, "");
  const glowId = `diya-glow-${uid}`;
  const flameId = `diya-flame-${uid}`;
  const bowlId = `diya-bowl-${uid}`;
  const rimId = `diya-rim-${uid}`;

  return (
    <svg
      className={`${styles.diya} ${lit ? styles.lit : ""} ${className}`.trim()}
      viewBox="0 0 160 165"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd77a" stopOpacity="0.75" />
          <stop offset="38%" stopColor="#ff9d3c" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#ff8a3d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={flameId} x1="80" y1="20" x2="80" y2="72" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fffbe6" />
          <stop offset="0.35" stopColor="#ffe28a" />
          <stop offset="0.72" stopColor="#ffb020" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id={bowlId} x1="28" y1="96" x2="132" y2="134" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d9a05b" />
          <stop offset="0.45" stopColor="#a45c2a" />
          <stop offset="1" stopColor="#5c2d13" />
        </linearGradient>
        <linearGradient id={rimId} x1="22" y1="96" x2="138" y2="96" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8a4a1f" />
          <stop offset="0.3" stopColor="#f0b45c" />
          <stop offset="0.55" stopColor="#ffe0a0" />
          <stop offset="0.8" stopColor="#c98334" />
          <stop offset="1" stopColor="#7a3f18" />
        </linearGradient>
      </defs>

      <ellipse
        className={styles.glow}
        cx="80"
        cy="76"
        rx="76"
        ry="76"
        fill={`url(#${glowId})`}
      />

      <g className={styles.flameWrap}>
        <path
          className={styles.flame}
          d="M80 18c11.5 16.5 19 25.4 13.6 38.4-3.6 8.7-10.3 12.6-13.6 12.6s-10-3.9-13.6-12.6C61 43.4 68.5 34.5 80 18Z"
          fill={`url(#${flameId})`}
        />
        <path
          className={styles.flameCore}
          d="M80 37c5.2 7.4 8.4 11.6 6 17.4-1.5 3.6-4.1 5.3-6 5.3s-4.5-1.7-6-5.3c-2.4-5.8.8-10 6-17.4Z"
          fill="#fffbea"
        />
      </g>

      <rect className={styles.wick} x="78.6" y="64" width="2.8" height="10" rx="1.4" fill="#4a2711" />

      <ellipse cx="80" cy="100" rx="62" ry="10" fill="#160a06" opacity="0.35" />

      <path
        className={styles.bowl}
        d="M20 94c6.8 4.4 28.8 8 60 8s53.2-3.6 60-8c-2.2 24.4-26 44-60 44s-57.8-19.6-60-44Z"
        fill={`url(#${bowlId})`}
      />
      <ellipse cx="80" cy="94" rx="60" ry="10" fill={`url(#${rimId})`} />
      <ellipse cx="80" cy="95" rx="47" ry="6" fill="#3d1d0d" opacity="0.55" />
      <path
        d="M32 103c4.8 12.6 21.6 22 48 22 9.7 0 18.5-1.6 26-4.5"
        stroke="#ffe2ab"
        strokeOpacity="0.28"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M43 118c8 4.9 21.2 8 37 8 7.4 0 14.4-.8 20.5-2.3"
        stroke="#2e1208"
        strokeOpacity="0.4"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
