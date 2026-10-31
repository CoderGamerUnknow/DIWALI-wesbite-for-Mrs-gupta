import { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { site } from "../../const/site";
import { EMOJI_SYMBOLS, PREP_TASKS } from "../../const/lab2";
import { downloadBlob, escapeXml, useStoredState } from "../../lib/lab";
import { CopyButton } from "../lab/Shared";
import styles from "../LightLab.module.scss";

const WALLPAPER_THEMES = [
  { name: "Night", bg: "#0b0718", glow: "#371133", accent: "#f4c95d", ink: "#fff7e8" },
  { name: "Rose", bg: "#1d0712", glow: "#5b1736", accent: "#ff9db8", ink: "#fff1f5" },
  { name: "Mint", bg: "#061310", glow: "#104238", accent: "#7ce0c3", ink: "#edfff9" },
];

const buildWallpaper = (theme) => `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <radialGradient id="glow" cx="50%" cy="32%" r="70%">
      <stop offset="0%" stop-color="${theme.glow}" />
      <stop offset="65%" stop-color="${theme.bg}" />
      <stop offset="100%" stop-color="${theme.bg}" />
    </radialGradient>
  </defs>
  <rect width="1080" height="1920" fill="url(#glow)" />
  <circle cx="540" cy="650" r="290" fill="none" stroke="${theme.accent}" stroke-opacity="0.16" />
  <circle cx="540" cy="650" r="220" fill="none" stroke="${theme.accent}" stroke-opacity="0.12" stroke-dasharray="2 12" />
  <text x="540" y="420" text-anchor="middle" font-family="Georgia, serif" font-size="46" fill="${theme.accent}">✦</text>
  <text x="540" y="850" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="118" fill="${theme.ink}">Happy</text>
  <text x="540" y="970" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="118" fill="${theme.accent}">Diwali</text>
  <text x="540" y="1065" text-anchor="middle" font-family="Georgia, serif" font-size="52" fill="${theme.accent}">शुभ दीपावली</text>
  <line x1="380" y1="1130" x2="700" y2="1130" stroke="${theme.accent}" stroke-opacity="0.45" />
  <text x="540" y="1210" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="24" letter-spacing="6" fill="${theme.ink}" opacity="0.72">FOR ${escapeXml(site.principalShort).toUpperCase()}</text>
  <text x="540" y="1720" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="18" letter-spacing="5" fill="${theme.ink}" opacity="0.45">WITH LOVE, FROM ${escapeXml(site.from).toUpperCase()}</text>
  <text x="540" y="1775" text-anchor="middle" font-family="Georgia, serif" font-size="22" fill="${theme.accent}">✦  ✦  ✦</text>
</svg>`;

export function Wallpaper() {
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = WALLPAPER_THEMES[themeIndex];

  return (
    <div className={styles.feature}>
      <div
        className={styles.wallpaperPreview}
        style={{
          background: `radial-gradient(circle at 50% 30%, ${theme.glow}, ${theme.bg} 68%)`,
          color: theme.ink,
          borderColor: theme.accent,
        }}
      >
        <span className={styles.wallpaperKicker} style={{ color: theme.accent }}>✦</span>
        <p className={styles.wallpaperTitle}>Happy<br />Diwali</p>
        <p className={styles.wallpaperHindi} style={{ color: theme.accent }} lang="hi">शुभ दीपावली</p>
        <span className={styles.wallpaperFoot}>for {site.principalShort} · {site.year}</span>
      </div>

      <div className={styles.row}>
        {WALLPAPER_THEMES.map((item, index) => (
          <button
            key={item.name}
            type="button"
            className={`${styles.miniButton} ${
              index === themeIndex ? styles.miniButtonActive : ""
            }`}
            onClick={() => setThemeIndex(index)}
            aria-pressed={index === themeIndex}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => downloadBlob(buildWallpaper(theme), "image/svg+xml", "diwali-wallpaper.svg")}
        >
          Download the wallpaper
          <span aria-hidden="true">↓</span>
        </button>
        <span className={styles.hint}>1080 × 1920, sized for most phones.</span>
      </div>
    </div>
  );
}

const buildTagSheet = (names) => {
  const slots = Array.from({ length: 4 }, (_, index) => names[index] || "A friend");
  const tag = (name, index) => {
    const x = 40 + (index % 2) * 560;
    const y = 40 + Math.floor(index / 2) * 360;
    return `<g transform="translate(${x} ${y})">
      <rect width="520" height="320" rx="24" fill="#fff8ea" stroke="#c1974a" stroke-width="2" />
      <rect x="16" y="16" width="488" height="288" rx="16" fill="none" stroke="#c1974a" stroke-opacity="0.35" />
      <text x="260" y="70" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="14" letter-spacing="6" fill="#a06a1c">HAPPY DIWALI</text>
      <text x="260" y="170" text-anchor="middle" font-family="Georgia, serif" font-size="52" fill="#3b1c10">${escapeXml(name)}</text>
      <line x1="150" y1="208" x2="370" y2="208" stroke="#c1974a" stroke-opacity="0.5" />
      <text x="260" y="248" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="13" letter-spacing="4" fill="#8a5a14">WITH LOVE, FROM ${escapeXml(site.from).toUpperCase()}</text>
      <text x="260" y="286" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#b8791d">✦  ✦  ✦</text>
    </g>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
    <rect width="1200" height="800" fill="#fdf3e2" />
    ${slots.map(tag).join("")}
  </svg>`;
};

export function GiftTags() {
  const [draft, setDraft] = useState(site.principalShort);
  const names = draft
    .split(/[,\n]/)
    .map((name) => name.trim())
    .filter(Boolean)
    .slice(0, 4);
  const slots = Array.from({ length: 4 }, (_, index) => names[index] || "A friend");

  return (
    <div className={styles.feature}>
      <label className={styles.field}>
        <span>Names, separated by commas — up to four</span>
        <input
          className={styles.input}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Mrs. Gupta, Ananya, Rohan"
          maxLength={100}
        />
      </label>

      <div className={styles.tagGrid}>
        {slots.map((name, index) => (
          <div className={styles.giftTag} key={`${name}-${index}`}>
            <span className={styles.tagKicker}>Happy Diwali</span>
            <span className={styles.tagName}>{name}</span>
            <span className={styles.tagFoot}>with love, from {site.from.toLowerCase()}</span>
          </div>
        ))}
      </div>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => downloadBlob(buildTagSheet(names), "image/svg+xml", "diwali-gift-tags.svg")}
        >
          Download the tag sheet
          <span aria-hidden="true">↓</span>
        </button>
        <span className={styles.hint}>Four tags on one printable SVG sheet.</span>
      </div>
    </div>
  );
}

export function PrepChecklist() {
  const [checked, setChecked] = useStoredState("prep", PREP_TASKS.map(() => false));
  const safe = PREP_TASKS.map((_, index) => Boolean(checked?.[index]));
  const count = safe.filter(Boolean).length;

  const toggle = (index) => {
    setChecked((current) => {
      const next = PREP_TASKS.map((_, item) => Boolean(current?.[item]));
      next[index] = !next[index];
      return next;
    });
  };

  const download = () => {
    const text = PREP_TASKS.map(
      (task, index) => `${safe[index] ? "[x]" : "[ ]"} ${task}`
    ).join("\r\n");
    downloadBlob(
      `Diwali ${site.year} — the checklist\r\n\r\n${text}\r\n`,
      "text/plain;charset=utf-8",
      "diwali-checklist.txt"
    );
  };

  return (
    <div className={styles.feature}>
      <div className={styles.quizTop}>
        <span>
          {count} of {PREP_TASKS.length} ready
        </span>
        <span>{count === PREP_TASKS.length ? "The house is ready" : "One small thing at a time"}</span>
      </div>
      <div className={styles.progressTrack} aria-hidden="true">
        <span
          className={styles.progressFill}
          style={{ width: `${(count / PREP_TASKS.length) * 100}%` }}
        />
      </div>

      <div className={styles.checkList}>
        {PREP_TASKS.map((task, index) => (
          <button
            key={task}
            type="button"
            className={`${styles.checkItem} ${safe[index] ? styles.checkDone : ""}`}
            onClick={() => toggle(index)}
            aria-pressed={safe[index]}
          >
            <span className={styles.checkMark} aria-hidden="true">
              {safe[index] ? "✓" : ""}
            </span>
            {task}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.miniButton} onClick={download}>
          Download the list
          <span aria-hidden="true">↓</span>
        </button>
        <button type="button" className={styles.miniButton} onClick={() => setChecked(PREP_TASKS.map(() => false))}>
          Clear all ticks
        </button>
      </div>
    </div>
  );
}

export function TabTitle() {
  const [title, setTitle] = useStoredState("tab-title", "");
  const originalRef = useRef(null);

  useEffect(() => {
    if (originalRef.current === null) originalRef.current = document.title;
    document.title = title.trim() || originalRef.current;
    return () => {
      if (originalRef.current) document.title = originalRef.current;
    };
  }, [title]);

  return (
    <div className={styles.feature}>
      <label className={styles.field}>
        <span>What should the browser tab say?</span>
        <input
          className={styles.input}
          value={title}
          onChange={(event) => setTitle(event.target.value.slice(0, 60))}
          placeholder="A little light, a lot of love"
          maxLength={60}
        />
      </label>

      <div className={styles.factCard}>
        <span className={styles.factIndex}>The tab now reads</span>
        <h4 className={styles.factTitle}>{title.trim() || "Happy Diwali, Mrs. Gupta — A Wish From Your Students"}</h4>
        <p className={styles.factText}>A tiny piece of the wish, living up there beside the other tabs.</p>
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.miniButton} onClick={() => setTitle("")}>
          Restore the original title
        </button>
        <span className={styles.hint}>The tab returns to its first name when you close this light.</span>
      </div>
    </div>
  );
}

const READING_SIZES = [
  { label: "Normal", value: "" },
  { label: "Larger", value: "112.5%" },
  { label: "Largest", value: "125%" },
];

export function ReadingMode() {
  const [scale, setScale] = useStoredState("reading-scale", 0);
  const active = READING_SIZES[scale] ?? READING_SIZES[0];

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.fontSize;
    root.style.fontSize = active.value;
    return () => {
      root.style.fontSize = previous;
    };
  }, [active.value]);

  return (
    <div className={styles.feature}>
      <div className={styles.readingPreview}>
        <p>
          A page should be as easy to read as a lamp is to see. Choose a size
          and the whole page will lean in a little closer.
        </p>
        <span>This preview grows with your choice.</span>
      </div>

      <div className={styles.row} role="group" aria-label="Reading size">
        {READING_SIZES.map((option, index) => (
          <button
            key={option.label}
            type="button"
            className={`${styles.miniButton} ${
              index === scale ? styles.miniButtonActive : ""
            }`}
            onClick={() => setScale(index)}
            aria-pressed={index === scale}
          >
            {option.label}
          </button>
        ))}
        <span className={styles.hint}>Applies while this panel is open.</span>
      </div>
    </div>
  );
}

const emojiMatrix = (seedValue) => {
  let seed = seedValue >>> 0;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const quadrant = Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => EMOJI_SYMBOLS[Math.floor(random() * EMOJI_SYMBOLS.length)])
  );
  return Array.from({ length: 7 }, (_, row) =>
    Array.from({ length: 7 }, (_, column) => {
      const mirrorRow = row < 4 ? row : 6 - row;
      const mirrorColumn = column < 4 ? column : 6 - column;
      return quadrant[mirrorRow][mirrorColumn];
    })
  );
};

export function EmojiRangoli() {
  const [seed, setSeed] = useState(4);
  const matrix = emojiMatrix(seed);
  const text = matrix.map((row) => row.join(" ")).join("\n");

  return (
    <div className={styles.feature}>
      <div className={styles.symbolRangoli} aria-label="A symmetric symbol rangoli">
        {matrix.flatMap((row, rowIndex) =>
          row.map((cell, columnIndex) => (
            <span
              key={`${rowIndex}-${columnIndex}`}
              className={styles.symbolCell}
              style={{
                "--cell-hue": `${(seed * 13 + rowIndex * 7 + columnIndex * 11) % 360}deg`,
              }}
              aria-hidden="true"
            >
              {cell}
            </span>
          ))
        )}
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={() => setSeed((value) => value + 1)}>
          Grow another pattern
          <span aria-hidden="true">✺</span>
        </button>
        <CopyButton text={text} label="Copy the pattern" />
      </div>
      <p className={styles.hint}>Seven rows, mirrored both ways. Paste it anywhere you like.</p>
    </div>
  );
}

export function EmailWish() {
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("I thought of you when I saw this little Diwali page. Light a diya and keep the glow.");
  const [pageUrl] = useState(() =>
    typeof window === "undefined" ? "" : window.location.href.split("#")[0]
  );
  const body = `${note.trim() || "A small Diwali wish."}\n\nFor ${site.principalShort}, from ${site.from.toLowerCase()}.\n${pageUrl}`;
  const mailto = `mailto:${encodeURIComponent(recipient.trim())}?subject=${encodeURIComponent(
    `A Diwali wish for ${site.principalShort}`
  )}&body=${encodeURIComponent(body)}`;

  return (
    <div className={styles.feature}>
      <label className={styles.field}>
        <span>To</span>
        <input
          className={styles.input}
          type="email"
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
          placeholder="friend@example.com"
          maxLength={80}
        />
      </label>

      <label className={styles.field}>
        <span>Your note</span>
        <textarea
          className={styles.textarea}
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
          maxLength={220}
        />
      </label>

      <div className={styles.row}>
        <a className={styles.primaryButton} href={mailto}>
          Open the email app
          <span aria-hidden="true">↗</span>
        </a>
        <CopyButton text={body} label="Copy the note" />
      </div>
      <p className={styles.hint}>
        This opens your own mail app with everything filled in. Nothing is sent
        from this page.
      </p>
    </div>
  );
}

const QR_COLORS = ["#170a12", "#3b0d1b", "#0b3d33", "#3a2410"];

export function CustomQR() {
  const [value, setValue] = useState(() =>
    typeof window === "undefined" ? "Happy Diwali" : window.location.href.split("#")[0]
  );
  const [foreground, setForeground] = useState(QR_COLORS[0]);
  const qrRef = useRef(null);

  const download = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "diwali-qr.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className={styles.feature}>
      <label className={styles.field}>
        <span>A link or a short message</span>
        <textarea
          className={styles.textarea}
          value={value}
          onChange={(event) => setValue(event.target.value.slice(0, 300))}
          rows={3}
          maxLength={300}
        />
      </label>

      <div className={styles.row}>
        {QR_COLORS.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.swatch} ${foreground === option ? styles.swatchActive : ""}`}
            style={{ "--swatch": option }}
            onClick={() => setForeground(option)}
            aria-pressed={foreground === option}
            aria-label={`QR colour ${option}`}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className={styles.labQr} ref={qrRef}>
        <QRCodeCanvas
          value={value.trim() || "Happy Diwali"}
          size={420}
          level="H"
          marginSize={2}
          bgColor="#fff8ea"
          fgColor={foreground}
          title="QR code"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={download}>
          Download the QR
          <span aria-hidden="true">↓</span>
        </button>
        <span className={styles.hint}>A PNG with a quiet cream border, ready to scan.</span>
      </div>
    </div>
  );
}
