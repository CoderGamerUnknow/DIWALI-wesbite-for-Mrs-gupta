import { useEffect, useRef, useState } from "react";
import { HAIKU_FIVE, HAIKU_SEVEN, MITHAI_TRAY } from "../../const/lab2";
import { site } from "../../const/site";
import { downloadBlob, escapeXml, useStoredState } from "../../lib/lab";
import { playDiyaChime } from "../../lib/chime";
import { CopyButton } from "../lab/Shared";
import styles from "../LightLab.module.scss";

const LANTERN_THEMES = [
  { name: "Marigold", color: "#f0a23a", glow: "#ffd166" },
  { name: "Rose", color: "#e56b8a", glow: "#ffb3c6" },
  { name: "Mint", color: "#5fc4a8", glow: "#b8f5e5" },
];

const PATTERNS = [
  { id: "plain", label: "Plain" },
  { id: "stripes", label: "Stripes" },
  { id: "dots", label: "Dots" },
];

export function LanternStudio() {
  const [themeIndex, setThemeIndex] = useState(0);
  const [pattern, setPattern] = useState("plain");
  const [message, setMessage] = useState("A little light, a lot of love.");
  const theme = LANTERN_THEMES[themeIndex];
  const patternStyle =
    pattern === "stripes"
      ? "repeating-linear-gradient(90deg, transparent 0 14px, rgba(255, 247, 232, 0.18) 14px 18px)"
      : pattern === "dots"
        ? "radial-gradient(circle, rgba(255, 247, 232, 0.34) 2px, transparent 3px)"
        : "none";

  return (
    <div className={styles.feature}>
      <div className={styles.lanternStudioStage}>
        <div className={styles.studioLantern} style={{ "--lantern-color": theme.color, "--lantern-glow": theme.glow }}>
          <span className={styles.studioLanternTop} aria-hidden="true" />
          <span
            className={styles.studioLanternBody}
            style={{
              backgroundImage: patternStyle,
              backgroundSize: pattern === "dots" ? "18px 18px" : "auto",
            }}
          >
            <span>{message.trim() || "Your wish here"}</span>
          </span>
          <span className={styles.studioLanternTassel} aria-hidden="true" />
        </div>
      </div>

      <div className={styles.row}>
        {LANTERN_THEMES.map((item, index) => (
          <button
            key={item.name}
            type="button"
            className={`${styles.swatch} ${index === themeIndex ? styles.swatchActive : ""}`}
            style={{ "--swatch": item.color }}
            onClick={() => setThemeIndex(index)}
            aria-pressed={index === themeIndex}
            aria-label={item.name}
          >
            <span aria-hidden="true" />
          </button>
        ))}
        {PATTERNS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.miniButton} ${pattern === item.id ? styles.miniButtonActive : ""}`}
            onClick={() => setPattern(item.id)}
            aria-pressed={pattern === item.id}
          >
            {item.label}
          </button>
        ))}
      </div>

      <label className={styles.field}>
        <span>A message for the lantern</span>
        <input
          className={styles.input}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={32}
        />
      </label>

      <p className={styles.hint}>A lantern is a wish with a handle.</p>
    </div>
  );
}

const RANGOLI_PALETTE = ["#f4c95d", "#ff8a3d", "#ff6f91", "#c9a2ff", "#7ce0c3"];
const RANGOLI_EMPTY = "#241026";

export function RangoliColour() {
  const [color, setColor] = useState(RANGOLI_PALETTE[0]);
  const [fills, setFills] = useState(() => Array(8).fill(RANGOLI_EMPTY));
  const filled = fills.filter((fill) => fill !== RANGOLI_EMPTY).length;

  const paint = (index) => {
    setFills((current) => current.map((fill, item) => (item === index ? color : fill)));
  };

  const handleKey = (event, index) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    paint(index);
  };

  return (
    <div className={styles.feature}>
      <div className={styles.swatchRow} role="group" aria-label="Rangoli colours">
        {RANGOLI_PALETTE.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.swatch} ${color === option ? styles.swatchActive : ""}`}
            style={{ "--swatch": option }}
            onClick={() => setColor(option)}
            aria-pressed={color === option}
            aria-label={`Colour ${option}`}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>

      <svg className={styles.colourStage} viewBox="0 0 240 240" role="img" aria-label="Rangoli colouring page">
        <circle cx="120" cy="120" r="108" fill="none" stroke="rgba(244, 201, 93, 0.2)" strokeDasharray="2 7" />
        <circle cx="120" cy="120" r="70" fill="none" stroke="rgba(244, 201, 93, 0.18)" />
        {Array.from({ length: 8 }, (_, index) => (
          <g key={index} transform={`rotate(${index * 45} 120 120)`}>
            <path
              d="M120 42 C151 67 153 101 120 122 C87 101 89 67 120 42 Z"
              fill={fills[index]}
              stroke="rgba(255, 247, 232, 0.45)"
              strokeWidth="1"
              className={styles.colourPetal}
              role="button"
              tabIndex={0}
              aria-label={`Colour petal ${index + 1}`}
              onClick={() => paint(index)}
              onKeyDown={(event) => handleKey(event, index)}
            />
          </g>
        ))}
        <circle cx="120" cy="120" r="22" fill={fills[0]} stroke="rgba(255, 247, 232, 0.5)" />
        <circle cx="120" cy="120" r="7" fill="#ffe6a3" />
      </svg>

      <div className={styles.row}>
        <span className={styles.counter}>{filled} / 8 petals coloured</span>
        <button type="button" className={styles.miniButton} onClick={() => setFills(Array(8).fill(RANGOLI_EMPTY))}>
          Clear the colours
        </button>
        <span className={styles.hint}>Tap a petal to fill it.</span>
      </div>
    </div>
  );
}

const SHOW_COLORS = ["#ffd166", "#ff8a3d", "#ff6f91", "#c9a2ff", "#7ce0c3"];

export function FireworkShow() {
  const [color, setColor] = useState(SHOW_COLORS[0]);
  const [bursts, setBursts] = useState([]);
  const [show, setShow] = useState(0);

  const addBurst = (event) => {
    if (bursts.length >= 5) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    setBursts((current) => [
      ...current,
      {
        id: `${Date.now()}-${Math.random()}`,
        left: ((event.clientX - rect.left) / rect.width) * 100,
        top: ((event.clientY - rect.top) / rect.height) * 100,
        color,
      },
    ]);
  };

  return (
    <div className={styles.feature}>
      <div className={styles.swatchRow} role="group" aria-label="Firework show colours">
        {SHOW_COLORS.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.swatch} ${color === option ? styles.swatchActive : ""}`}
            style={{ "--swatch": option }}
            onClick={() => setColor(option)}
            aria-pressed={color === option}
            aria-label={`Show colour ${option}`}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.showStage}
        onClick={addBurst}
        aria-label="Add a firework burst to the show"
      >
        {bursts.map((burst) => (
          <span
            key={`${burst.id}-${show}`}
            className={styles.showBurst}
            style={{
              left: `${burst.left}%`,
              top: `${burst.top}%`,
              "--burst-color": burst.color,
            }}
            aria-hidden="true"
          />
        ))}
        <span className={styles.showHint}>
          {bursts.length === 0 ? "Tap the sky to place a burst" : `${bursts.length} / 5 bursts placed`}
        </span>
      </button>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => setShow((value) => value + 1)}
          disabled={bursts.length === 0}
        >
          Play the show
          <span aria-hidden="true">✦</span>
        </button>
        <button
          type="button"
          className={styles.miniButton}
          onClick={() => setBursts([])}
          disabled={bursts.length === 0}
        >
          Clear the sky
        </button>
      </div>
      <p className={styles.hint}>Your show is saved until you clear it or leave the lab.</p>
    </div>
  );
}

const paintDoodleBackground = (ctx) => {
  ctx.clearRect(0, 0, 800, 600);
  const background = ctx.createLinearGradient(0, 0, 0, 600);
  background.addColorStop(0, "#06030d");
  background.addColorStop(1, "#1b0a1c");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 800, 600);

  ctx.strokeStyle = "rgba(244, 201, 93, 0.12)";
  ctx.lineWidth = 1;
  [120, 190, 260].forEach((radius) => {
    ctx.beginPath();
    ctx.arc(400, 300, radius, 0, Math.PI * 2);
    ctx.stroke();
  });
};

export function DiyaDoodle() {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [color, setColor] = useState("#f4c95d");
  const [size, setSize] = useState(10);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) paintDoodleBackground(ctx);
  }, []);

  const paint = (event) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((event.clientX - rect.left) / rect.width) * 800;
    const y = ((event.clientY - rect.top) / rect.height) * 600;
    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const start = (event) => {
    drawingRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    paint(event);
  };

  const stop = () => {
    drawingRef.current = false;
  };

  const clear = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) paintDoodleBackground(ctx);
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "diwali-doodle.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className={styles.feature}>
      <div className={styles.doodleTools}>
        {["#f4c95d", "#ff8a3d", "#ff6f91", "#c9a2ff", "#7ce0c3", "#fff7e8"].map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.swatch} ${color === option ? styles.swatchActive : ""}`}
            style={{ "--swatch": option }}
            onClick={() => setColor(option)}
            aria-pressed={color === option}
            aria-label={`Brush colour ${option}`}
          >
            <span aria-hidden="true" />
          </button>
        ))}
        <label className={styles.brushSize}>
          <span>Brush {size}px</span>
          <input
            className={styles.range}
            type="range"
            min="3"
            max="26"
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
          />
        </label>
      </div>

      <canvas
        ref={canvasRef}
        className={styles.doodlePad}
        width={800}
        height={600}
        onPointerDown={start}
        onPointerMove={paint}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        aria-label="Diya doodle canvas"
      />

      <div className={styles.row}>
        <button type="button" className={styles.miniButton} onClick={clear}>
          Clear the page
        </button>
        <button type="button" className={styles.primaryButton} onClick={save}>
          Save the doodle
          <span aria-hidden="true">↓</span>
        </button>
      </div>
    </div>
  );
}

export function Haiku() {
  const [seed, setSeed] = useState(0);
  const lines = [
    HAIKU_FIVE[seed % HAIKU_FIVE.length],
    HAIKU_SEVEN[(seed + 2) % HAIKU_SEVEN.length],
    HAIKU_FIVE[(seed + 4) % HAIKU_FIVE.length],
  ];
  const text = lines.join("\n");

  return (
    <div className={styles.feature}>
      <div className={styles.coupletCard}>
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <span className={styles.coupletSign}>five · seven · five</span>
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={() => setSeed((value) => value + 1)}>
          Another haiku
          <span aria-hidden="true">✦</span>
        </button>
        <CopyButton text={text} label="Copy the haiku" />
      </div>
      <p className={styles.hint}>Written from a small shelf of festival lines.</p>
    </div>
  );
}

export function MithaiBox() {
  const [selected, setSelected] = useState([]);
  const [ribbon, setRibbon] = useState(false);
  const full = selected.length === MITHAI_TRAY.length;

  const toggle = (id) => {
    setRibbon(false);
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <div className={styles.feature}>
      <div className={styles.mithaiTray}>
        {MITHAI_TRAY.map((sweet) => (
          <button
            key={sweet.id}
            type="button"
            className={`${styles.mithaiChoice} ${
              selected.includes(sweet.id) ? styles.mithaiChoiceActive : ""
            }`}
            onClick={() => toggle(sweet.id)}
            aria-pressed={selected.includes(sweet.id)}
          >
            <span className={styles.mithaiDot} style={{ background: sweet.color }} aria-hidden="true" />
            {sweet.name}
          </button>
        ))}
      </div>

      <div className={styles.mithaiBox}>
        {ribbon && <span className={styles.mithaiRibbon} aria-hidden="true" />}
        <div className={styles.mithaiSlots}>
          {selected.map((id) => {
            const sweet = MITHAI_TRAY.find((item) => item.id === id);
            return (
              <span className={styles.mithaiSlot} key={id}>
                <span className={styles.mithaiDot} style={{ background: sweet.color }} aria-hidden="true" />
                <small>{sweet.name}</small>
              </span>
            );
          })}
          {Array.from({ length: Math.max(0, 6 - selected.length) }, (_, index) => (
            <span className={`${styles.mithaiSlot} ${styles.mithaiSlotEmpty}`} key={`empty-${index}`} />
          ))}
        </div>
      </div>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => setRibbon((value) => !value)}
          disabled={!full}
        >
          {ribbon ? "Untie the ribbon" : "Tie the ribbon"}
          <span aria-hidden="true">✦</span>
        </button>
        <span className={styles.hint} aria-live="polite">
          {full ? "The box is full. Someone is going to be delighted." : `${selected.length} / 6 sweets in the box`}
        </span>
      </div>
    </div>
  );
}

const BOOKMARK_THEMES = [
  { name: "Night", bg: "#0b0718", ink: "#fff7e8", accent: "#f4c95d" },
  { name: "Wine", bg: "#360e20", ink: "#fff0e4", accent: "#f4c95d" },
  { name: "Cream", bg: "#fdf3e2", ink: "#3b1c10", accent: "#a06a1c" },
];

const wrapQuote = (text, max = 25, maxLines = 6) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= max) line = candidate;
    else {
      if (line) lines.push(line);
      line = word;
    }
  });
  if (line) lines.push(line);
  return lines.slice(0, maxLines);
};

const buildBookmark = (name, quote, theme) => `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="960" viewBox="0 0 320 960">
  <rect width="320" height="960" fill="${theme.bg}" />
  <rect x="16" y="16" width="288" height="928" fill="none" stroke="${theme.accent}" stroke-width="2" stroke-opacity="0.7" />
  <text x="160" y="70" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="12" letter-spacing="6" fill="${theme.accent}">A DIWALI WISH</text>
  <text x="160" y="130" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="${theme.accent}">✦</text>
  <text x="160" y="188" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="${theme.ink}">${escapeXml(name || "For you")}</text>
  <line x1="92" y1="220" x2="228" y2="220" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.5" />
  ${wrapQuote(quote || "May every page you turn bring a little more light.")
    .map(
      (line, index) =>
        `<text x="160" y="${310 + index * 46}" text-anchor="middle" font-family="Georgia, serif" font-size="20" fill="${theme.ink}" opacity="0.9">${escapeXml(line)}</text>`
    )
    .join("")}
  <text x="160" y="820" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="${theme.accent}">✦</text>
  <text x="160" y="875" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="11" letter-spacing="4" fill="${theme.ink}" opacity="0.6">WITH LOVE, FROM ${escapeXml(site.from).toUpperCase()}</text>
</svg>`;

export function Bookmark() {
  const [name, setName] = useStoredState("name", "");
  const [quote, setQuote] = useState("May every page you turn bring a little more light.");
  const [themeIndex, setThemeIndex] = useState(0);
  const theme = BOOKMARK_THEMES[themeIndex];

  const download = () => {
    downloadBlob(
      buildBookmark(name.trim(), quote.trim(), theme),
      "image/svg+xml",
      "diwali-bookmark.svg"
    );
  };

  return (
    <div className={styles.feature}>
      <div
        className={styles.bookmarkPreview}
        style={{ background: theme.bg, color: theme.ink, borderColor: theme.accent }}
      >
        <span className={styles.bookmarkKicker} style={{ color: theme.accent }}>A Diwali wish</span>
        <span className={styles.bookmarkSpark} style={{ color: theme.accent }}>✦</span>
        <p className={styles.bookmarkName}>{name.trim() || "For you"}</p>
        <span className={styles.bookmarkRule} style={{ background: theme.accent }} />
        <p className={styles.bookmarkQuote}>{quote.trim() || "May every page you turn bring a little more light."}</p>
        <span className={styles.bookmarkFoot}>with love, from {site.from.toLowerCase()}</span>
      </div>

      <div className={styles.twoFields}>
        <label className={styles.field}>
          <span>For whom?</span>
          <input
            className={styles.input}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={site.principalShort}
            maxLength={26}
          />
        </label>
        <label className={styles.field}>
          <span>Paper</span>
          <select
            className={styles.select}
            value={themeIndex}
            onChange={(event) => setThemeIndex(Number(event.target.value))}
          >
            {BOOKMARK_THEMES.map((item, index) => (
              <option key={item.name} value={index}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span>The line on the bookmark</span>
        <input
          className={styles.input}
          value={quote}
          onChange={(event) => setQuote(event.target.value)}
          maxLength={120}
        />
      </label>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={download}>
          Download the bookmark
          <span aria-hidden="true">↓</span>
        </button>
        <span className={styles.hint}>A vector SVG, ready to print and cut.</span>
      </div>
    </div>
  );
}

const BRACELET_COLORS = ["#f4c95d", "#ff8a3d", "#ff6f91", "#c9a2ff", "#7ce0c3", "#fff7e8"];

export function WishBracelet() {
  const [beads, setBeads] = useStoredState("bracelet", []);
  const safe = Array.isArray(beads) ? beads : [];
  const [color, setColor] = useState(BRACELET_COLORS[0]);

  const addBead = () => {
    if (safe.length >= 12) return;
    setBeads((current) => [...(Array.isArray(current) ? current : []), color]);
    playDiyaChime(safe.length % 5);
  };

  const removeBead = (index) => {
    setBeads((current) => (Array.isArray(current) ? current.filter((_, item) => item !== index) : []));
  };

  return (
    <div className={styles.feature}>
      <div className={styles.braceletStage}>
        <div className={styles.bracelet}>
          {safe.length === 0 && <span className={styles.braceletEmpty}>An empty string, waiting.</span>}
          {safe.map((bead, index) => (
            <button
              key={`${bead}-${index}`}
              type="button"
              className={styles.bead}
              style={{ background: bead }}
              onClick={() => removeBead(index)}
              aria-label={`Remove bead ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className={styles.row}>
        {BRACELET_COLORS.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.swatch} ${color === option ? styles.swatchActive : ""}`}
            style={{ "--swatch": option }}
            onClick={() => setColor(option)}
            aria-pressed={color === option}
            aria-label={`Bead colour ${option}`}
          >
            <span aria-hidden="true" />
          </button>
        ))}
        <button type="button" className={styles.primaryButton} onClick={addBead} disabled={safe.length >= 12}>
          Add a bead
          <span aria-hidden="true">✦</span>
        </button>
        <button type="button" className={styles.miniButton} onClick={() => setBeads([])}>
          Unstring
        </button>
      </div>
      <p className={styles.hint}>
        {safe.length} / 12 beads. Tap a bead to take it off the string.
      </p>
    </div>
  );
}
