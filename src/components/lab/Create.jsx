import { useEffect, useState } from "react";
import {
  COUPLET_FIRSTS,
  COUPLET_SECONDS,
  NIGHT_PALETTES,
  THALI_ITEMS,
  TORAN_COLORS,
} from "../../const/lab";
import { site } from "../../const/site";
import { copyText, downloadBlob, escapeXml, useStoredState } from "../../lib/lab";
import { playDiyaChime } from "../../lib/chime";
import { Diya } from "../Diya";
import { Rangoli } from "../Rangoli";
import { CopyButton } from "./Shared";
import styles from "../LightLab.module.scss";

const PATTERNS = {
  star: [
    0, 0, 1, 0, 0,
    0, 1, 1, 1, 0,
    1, 1, 1, 1, 1,
    0, 1, 1, 1, 0,
    0, 0, 1, 0, 0,
  ],
  border: [
    1, 1, 1, 1, 1,
    1, 0, 0, 0, 1,
    1, 0, 1, 0, 1,
    1, 0, 0, 0, 1,
    1, 1, 1, 1, 1,
  ],
  wave: [
    1, 0, 1, 0, 1,
    0, 1, 0, 1, 0,
    1, 0, 1, 0, 1,
    0, 1, 0, 1, 0,
    1, 0, 1, 0, 1,
  ],
};

const CARD_THEMES = {
  night: {
    label: "Midnight",
    page: "#0b0718",
    panel: "#140a20",
    ink: "#fff7e8",
    accent: "#f4c95d",
    soft: "rgba(255, 247, 232, 0.62)",
  },
  wine: {
    label: "Wine & gold",
    page: "#2a0a18",
    panel: "#3a0f21",
    ink: "#fff3e2",
    accent: "#f4c95d",
    soft: "rgba(255, 243, 226, 0.66)",
  },
  cream: {
    label: "Cream paper",
    page: "#fdf3e2",
    panel: "#fffaf1",
    ink: "#3b1c10",
    accent: "#a06a1c",
    soft: "rgba(59, 28, 16, 0.66)",
  },
};

const wrapLines = (text, maxChars = 42, maxLines = 4) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length <= maxChars) {
      line = candidate;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  });
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].slice(0, maxChars - 1)}…`;
    return kept;
  }
  return lines;
};

const buildCardSvg = ({ name, message, motif, theme }) => {
  const safeName = escapeXml(name.trim() || site.principalShort);
  const safeMessage = escapeXml(message.trim() || "A little light, a lot of love.");
  const lines = wrapLines(safeMessage);
  const mark = motif === "rangoli" ? "❋" : "✦";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="700" viewBox="0 0 1000 700">
  <rect width="1000" height="700" fill="${theme.page}" />
  <rect x="34" y="34" width="932" height="632" fill="none" stroke="${theme.accent}" stroke-width="2.5" stroke-opacity="0.7" />
  <rect x="48" y="48" width="904" height="604" fill="none" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.22" />
  <circle cx="500" cy="210" r="148" fill="none" stroke="${theme.accent}" stroke-width="1.5" stroke-opacity="0.16" />
  <circle cx="500" cy="210" r="122" fill="none" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.12" stroke-dasharray="2 9" />
  <text x="500" y="93" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="17" letter-spacing="8" fill="${theme.accent}">THE FESTIVAL OF LIGHTS</text>
  <text x="500" y="145" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="15" letter-spacing="4" fill="${theme.soft}">A DIWALI WISH FOR</text>
  <text x="500" y="196" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="48" fill="${theme.ink}">${safeName}</text>
  <text x="500" y="258" text-anchor="middle" font-family="Georgia, serif" font-size="34" fill="${theme.accent}">${mark}</text>
  <text x="500" y="352" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="64" fill="${theme.ink}">Happy Diwali</text>
  <text x="500" y="424" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="21" fill="${theme.soft}">
    ${lines.map((line, index) => `<tspan x="500" dy="${index === 0 ? 0 : 34}">${line}</tspan>`).join("")}
  </text>
  <line x1="360" y1="568" x2="640" y2="568" stroke="${theme.accent}" stroke-width="1" stroke-opacity="0.45" />
  <text x="500" y="606" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="13" letter-spacing="5" fill="${theme.soft}">WITH LOVE, FROM ${escapeXml(site.from).toUpperCase()}</text>
  <text x="500" y="640" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="${theme.accent}">✦  ✦  ✦</text>
</svg>`;
};

export function RangoliGenerator() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 9000) + 1000);
  const petalCount = 8 + (seed % 5);
  const length = 44 + (seed % 24);
  const palette = NIGHT_PALETTES[seed % NIGHT_PALETTES.length];

  return (
    <div className={styles.feature}>
      <div className={styles.rangoliStage} style={{ "--seed-color": palette.colors[3] }}>
        <svg viewBox="0 0 240 240" aria-label={`Generated rangoli, seed ${seed}`}>
          <circle cx="120" cy="120" r="112" fill="none" stroke={palette.colors[3]} strokeOpacity="0.2" strokeDasharray="2 8" />
          {[96, 78, 56, 34].map((radius) => (
            <circle
              key={radius}
              cx="120"
              cy="120"
              r={radius}
              fill="none"
              stroke={palette.colors[3]}
              strokeOpacity="0.24"
            />
          ))}

          {Array.from({ length: petalCount }, (_, index) => {
            const rotation = (360 / petalCount) * index;
            const jitter = (seed + index * 17) % 11;
            return (
              <g key={index} transform={`rotate(${rotation} 120 120)`}>
                <ellipse
                  cx="120"
                  cy={120 - 34}
                  rx={5 + (jitter % 4)}
                  ry={length / 2}
                  fill={palette.colors[2]}
                  fillOpacity="0.18"
                  stroke={palette.colors[3]}
                  strokeWidth="0.8"
                />
                <circle
                  cx="120"
                  cy={120 - 34 - length / 2}
                  r={2 + (jitter % 3)}
                  fill={palette.colors[4]}
                  fillOpacity="0.85"
                />
                <circle cx="120" cy={120 - 34} r="1.6" fill={palette.colors[4]} />
              </g>
            );
          })}

          {Array.from({ length: petalCount }, (_, index) => {
            const rotation = (360 / petalCount) * index + 180 / petalCount;
            return (
              <g key={`inner-${index}`} transform={`rotate(${rotation} 120 120)`}>
                <path
                  d={`M120 ${120 - 6} C ${120 + 10} ${120 - 18}, ${120 + 8} ${120 - 30}, 120 ${120 - 38} C ${120 - 8} ${120 - 30}, ${120 - 10} ${120 - 18}, 120 ${120 - 6} Z`}
                  fill={palette.colors[3]}
                  fillOpacity="0.25"
                />
              </g>
            );
          })}

          <circle cx="120" cy="120" r="15" fill={palette.colors[2]} fillOpacity="0.3" stroke={palette.colors[3]} />
          <circle cx="120" cy="120" r="5" fill={palette.colors[4]} />
        </svg>
      </div>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => setSeed(Math.floor(Math.random() * 9000) + 1000)}
        >
          Grow another
          <span aria-hidden="true">↺</span>
        </button>
        <span className={styles.counter}>
          seed {seed} · {petalCount} petals · {palette.name}
        </span>
      </div>
      <p className={styles.hint}>Every seed grows a slightly different flower.</p>
    </div>
  );
}

export function DiyaPatternBoard() {
  const [cells, setCells] = useStoredState("diya-pattern", PATTERNS.star);
  const safeCells = Array.from({ length: 25 }, (_, index) => Boolean(cells?.[index]));
  const litCount = safeCells.filter(Boolean).length;

  const toggle = (index) => {
    setCells(() => {
      const next = Array.from({ length: 25 }, (_, item) => Boolean(cells?.[item]));
      next[index] = !next[index];
      return next;
    });
  };

  const apply = (pattern) => setCells(pattern.map(Boolean));

  return (
    <div className={styles.feature}>
      <div className={styles.patternGrid}>
        {safeCells.map((lit, index) => (
          <button
            key={index}
            type="button"
            className={styles.patternCell}
            onClick={() => toggle(index)}
            aria-pressed={lit}
            aria-label={`Diya ${index + 1} ${lit ? "lit" : "unlit"}`}
          >
            <Diya lit={lit} />
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <span className={styles.counter}>{litCount} lamps lit</span>
        <button type="button" className={styles.miniButton} onClick={() => apply(PATTERNS.star)}>
          Star
        </button>
        <button type="button" className={styles.miniButton} onClick={() => apply(PATTERNS.border)}>
          Border
        </button>
        <button type="button" className={styles.miniButton} onClick={() => apply(PATTERNS.wave)}>
          Wave
        </button>
        <button
          type="button"
          className={styles.miniButton}
          onClick={() => setCells(Array(25).fill(false))}
        >
          Dark
        </button>
      </div>
      <p className={styles.hint}>Tap any lamp to light it. Arrange your own pattern, or borrow one.</p>
    </div>
  );
}

export function CoupletMaker() {
  const [first, setFirst] = useState(0);
  const [second, setSecond] = useState(0);

  const randomise = () => {
    setFirst(Math.floor(Math.random() * COUPLET_FIRSTS.length));
    setSecond(Math.floor(Math.random() * COUPLET_SECONDS.length));
  };

  const couplet = `${COUPLET_FIRSTS[first]}\n${COUPLET_SECONDS[second]}`;

  return (
    <div className={styles.feature}>
      <div className={styles.coupletCard}>
        <p>{COUPLET_FIRSTS[first]}</p>
        <p>{COUPLET_SECONDS[second]}</p>
        <span className={styles.coupletSign}>— with love, {site.from.toLowerCase()}</span>
      </div>

      <div className={styles.twoFields}>
        <label className={styles.field}>
          <span>The opening</span>
          <select
            className={styles.select}
            value={first}
            onChange={(event) => setFirst(Number(event.target.value))}
          >
            {COUPLET_FIRSTS.map((line, index) => (
              <option key={line} value={index}>
                {index + 1}. {line.slice(0, 34)}…
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span>The close</span>
          <select
            className={styles.select}
            value={second}
            onChange={(event) => setSecond(Number(event.target.value))}
          >
            {COUPLET_SECONDS.map((line, index) => (
              <option key={line} value={index}>
                {index + 1}. {line.slice(0, 34)}…
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={randomise}>
          Surprise me
          <span aria-hidden="true">✦</span>
        </button>
        <CopyButton text={`${couplet}\n— ${site.from}`} label="Copy the couplet" />
      </div>
    </div>
  );
}

export function CardMaker() {
  const [name, setName] = useStoredState("name", "");
  const [message, setMessage] = useState(
    "A little light, a lot of love. Wishing you a year as warm as this lamp."
  );
  const [motif, setMotif] = useState("diya");
  const [themeId, setThemeId] = useState("night");
  const [status, setStatus] = useState("");
  const theme = CARD_THEMES[themeId];

  const download = () => {
    const svg = buildCardSvg({
      name: name.trim() || site.principalShort,
      message,
      motif,
      theme,
    });
    downloadBlob(svg, "image/svg+xml", "diwali-card.svg");
    setStatus("Saved as an SVG — open it, print it, or send it on.");
  };

  return (
    <div className={styles.feature}>
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
            value={themeId}
            onChange={(event) => setThemeId(event.target.value)}
          >
            {Object.entries(CARD_THEMES).map(([id, option]) => (
              <option key={id} value={id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span>Your message</span>
        <textarea
          className={styles.textarea}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={160}
          rows={3}
        />
      </label>

      <div className={styles.motifRow} role="group" aria-label="Card motif">
        {["diya", "star", "rangoli"].map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.miniButton} ${motif === option ? styles.miniButtonActive : ""}`}
            onClick={() => setMotif(option)}
            aria-pressed={motif === option}
          >
            {option}
          </button>
        ))}
        <span className={styles.counter}>{message.length}/160</span>
      </div>

      <div
        className={styles.cardPreview}
        style={{
          background: theme.page,
          borderColor: theme.accent,
          color: theme.ink,
        }}
      >
        <span className={styles.cardPreviewKicker} style={{ color: theme.accent }}>
          The festival of lights
        </span>
        <span className={styles.cardPreviewFor} style={{ color: theme.soft }}>
          A Diwali wish for
        </span>
        <p className={styles.cardPreviewName}>{name.trim() || site.principalShort}</p>

        <span className={styles.cardPreviewMotif} style={{ color: theme.accent }}>
          {motif === "diya" ? (
            <span className={styles.cardPreviewDiya}>
              <Diya lit />
            </span>
          ) : motif === "rangoli" ? (
            <Rangoli className={styles.cardPreviewRangoli} />
          ) : (
            "✦"
          )}
        </span>

        <p className={styles.cardPreviewTitle}>Happy Diwali</p>
        <p className={styles.cardPreviewMessage} style={{ color: theme.soft }}>
          {message.trim() || "A little light, a lot of love."}
        </p>
        <span className={styles.cardPreviewFoot} style={{ color: theme.soft }}>
          With love, from {site.from.toLowerCase()}
        </span>
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={download}>
          Download the card
          <span aria-hidden="true">↓</span>
        </button>
        <span className={styles.hint} aria-live="polite">
          {status || "A vector SVG, sized for sharing or printing."}
        </span>
      </div>
    </div>
  );
}

export function Palette() {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState("");
  const palette = NIGHT_PALETTES[index];

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(""), 1700);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const pull = () => {
    let next = Math.floor(Math.random() * NIGHT_PALETTES.length);
    if (next === index) next = (next + 1) % NIGHT_PALETTES.length;
    setIndex(next);
    setCopied("");
  };

  const copy = async (hex) => {
    const ok = await copyText(hex);
    setCopied(ok ? hex : "Could not copy");
  };

  return (
    <div className={styles.feature}>
      <div className={styles.paletteBar} aria-hidden="true">
        {palette.colors.map((hex) => (
          <span key={hex} style={{ background: hex }} />
        ))}
      </div>

      <div className={styles.paletteName}>
        <span>{palette.name}</span>
        <span>{copied || "Tap a colour to copy its hex"}</span>
      </div>

      <div className={styles.swatchGrid} role="group" aria-label="Palette colours">
        {palette.colors.map((hex) => (
          <button
            key={hex}
            type="button"
            className={styles.paletteSwatch}
            onClick={() => copy(hex)}
            aria-label={`Copy ${hex}`}
          >
            <span style={{ background: hex }} aria-hidden="true" />
            {hex}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={pull}>
          Pull another palette
          <span aria-hidden="true">↺</span>
        </button>
        <span className={styles.hint}>Five colours, drawn from the same night.</span>
      </div>
    </div>
  );
}

export function SkyWriter() {
  const [word, setWord] = useState("Diwali");
  const [sparkKey, setSparkKey] = useState(0);
  const text = word.trim().slice(0, 18) || "Diwali";

  const light = (event) => {
    event.preventDefault();
    setSparkKey((value) => value + 1);
    playDiyaChime(text.length % 5);
  };

  return (
    <div className={styles.feature}>
      <form className={styles.skyForm} onSubmit={light}>
        <label className={styles.field}>
          <span>A word for the sky</span>
          <input
            className={styles.input}
            value={word}
            onChange={(event) => setWord(event.target.value)}
            placeholder="Diwali"
            maxLength={18}
          />
        </label>
        <button type="submit" className={styles.primaryButton}>
          Set it alight
          <span aria-hidden="true">✦</span>
        </button>
      </form>

      <div className={styles.skyField}>
        <span className={styles.skyStars} aria-hidden="true" />
        <p className={styles.skyWord} key={sparkKey} aria-label={text}>
          {Array.from(text).map((character, index) => (
            <span
              key={`${character}-${index}`}
              className={styles.skyChar}
              style={{ "--char-index": index }}
            >
              {character === " " ? "\u00A0" : character}
            </span>
          ))}
        </p>
        <p className={styles.skyCaption}>written in sparks, somewhere above the rooftops</p>
      </div>
      <p className={styles.hint}>Up to 18 characters. Press the button to light it again.</p>
    </div>
  );
}

export function ToranMaker() {
  const [count, setCount] = useState(9);
  const [colorIndex, setColorIndex] = useState(0);
  const color = TORAN_COLORS[colorIndex];

  return (
    <div className={styles.feature}>
      <div className={styles.toranDoorway}>
        <span className={styles.toranString} aria-hidden="true" />
        {Array.from({ length: count }, (_, index) => (
          <span
            key={index}
            className={styles.toranFlower}
            style={{
              left: `${((index + 1) / (count + 1)) * 100}%`,
              "--drop": `${14 + ((index * 17) % 42)}px`,
              "--flower-size": `${9 + ((index * 7) % 7)}px`,
              "--flower-color": color.color,
              "--flower-glow": color.glow,
              "--flower-delay": `${(index % 5) * 0.3}s`,
            }}
            aria-hidden="true"
          />
        ))}
        <span className={styles.toranDoorLabel}>your doorway</span>
      </div>

      <label className={styles.field}>
        <span>Flowers across the top: {count}</span>
        <input
          className={styles.range}
          type="range"
          min="5"
          max="17"
          value={count}
          onChange={(event) => setCount(Number(event.target.value))}
        />
      </label>

      <div className={styles.swatchRow} role="group" aria-label="Toran colours">
        {TORAN_COLORS.map((option, index) => (
          <button
            key={option.name}
            type="button"
            className={`${styles.swatch} ${colorIndex === index ? styles.swatchActive : ""}`}
            style={{ "--swatch": option.color }}
            onClick={() => setColorIndex(index)}
            aria-pressed={colorIndex === index}
            aria-label={option.name}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>

      <p className={styles.hint}>A toran is the garland that turns a doorway into a welcome.</p>
    </div>
  );
}

export function Thali() {
  const [selected, setSelected] = useState(["diya"]);
  const [rung, setRung] = useState(false);
  const complete = selected.length === THALI_ITEMS.length;

  const toggle = (id) => {
    setRung(false);
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const ring = () => {
    playDiyaChime(4);
    setRung(true);
  };

  return (
    <div className={styles.feature}>
      <div className={styles.thaliStage}>
        <div className={styles.thaliPlate}>
          <span className={styles.thaliPivot}>आरती</span>
          {THALI_ITEMS.map((item, index) => {
            if (!selected.includes(item.id)) return null;
            const angle = index * 72 - 90;
            return (
              <span
                key={item.id}
                className={styles.thaliItem}
                style={{
                  transform: `rotate(${angle}deg) translate(76px) rotate(${-angle}deg)`,
                }}
              >
                <span className={styles.thaliGlyph} aria-hidden="true">
                  {item.glyph}
                </span>
                <span className={styles.thaliLabel}>{item.label}</span>
              </span>
            );
          })}
        </div>
      </div>

      <div className={styles.thaliControls}>
        {THALI_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.miniButton} ${
              selected.includes(item.id) ? styles.miniButtonActive : ""
            }`}
            onClick={() => toggle(item.id)}
            aria-pressed={selected.includes(item.id)}
          >
            {selected.includes(item.id) ? "✓ " : "+ "}
            {item.label}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={ring}
          disabled={!selected.includes("bell")}
        >
          Ring the bell
          <span aria-hidden="true">◔</span>
        </button>
        <span className={styles.hint} aria-live="polite">
          {complete
            ? "The thali is complete. Aarti can begin."
            : rung
              ? "The bell rings through the house."
              : "Add the bell to ring it."}
        </span>
      </div>
    </div>
  );
}
