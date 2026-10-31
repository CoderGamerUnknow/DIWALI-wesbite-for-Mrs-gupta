import { useState } from "react";
import { site } from "../../const/site";
import { MOODS, PRIORITY_WORDS } from "../../const/lab2";
import { downloadBlob, escapeXml, useNow, useStoredState } from "../../lib/lab";
import { Diya } from "../Diya";
import { CopyButton } from "./../lab/Shared";
import styles from "../LightLab.module.scss";

const constellationFor = (name, offset) => {
  const input = `${name.trim() || "Diwali"}::${offset}`;
  let seed = 2166136261;
  for (const character of input) {
    seed = Math.imul(seed ^ character.charCodeAt(0), 16777619) >>> 0;
  }
  const points = [];
  for (let index = 0; index < 8; index += 1) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const x = 42 + (seed % 316);
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const y = 30 + (seed % 140);
    points.push({ x, y, radius: 1.4 + ((seed >> 8) % 14) / 10 });
  }
  return points;
};

export function StarName() {
  const [name, setName] = useStoredState("name", "");
  const [offset, setOffset] = useState(0);
  const points = constellationFor(name, offset);
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className={styles.feature}>
      <label className={styles.field}>
        <span>Whose constellation?</span>
        <input
          className={styles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Type a name"
          maxLength={26}
        />
      </label>

      <div className={styles.constellationStage}>
        <span className={styles.constellationKicker}>A small constellation for</span>
        <svg
          className={styles.constellationSvg}
          viewBox="0 0 400 210"
          role="img"
          aria-label={`A constellation for ${name.trim() || "you"}`}
        >
          <polyline
            points={polyline}
            fill="none"
            stroke="rgba(244, 201, 93, 0.32)"
            strokeWidth="0.8"
          />
          {points.map((point, index) => (
            <g key={index}>
              <circle cx={point.x} cy={point.y} r={point.radius * 3.4} fill="rgba(244, 201, 93, 0.08)" />
              <circle cx={point.x} cy={point.y} r={point.radius} fill="#ffe6a3" />
            </g>
          ))}
        </svg>
        <p className={styles.constellationName}>{name.trim() || "You"}</p>
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={() => setOffset((value) => value + 1)}>
          Rearrange the sky
          <span aria-hidden="true">✦</span>
        </button>
        <span className={styles.hint}>The same name always draws the same stars.</span>
      </div>
    </div>
  );
}

export function BirthdayDiya() {
  const [birthday, setBirthday] = useStoredState("birthday", "");
  const now = useNow(60_000);
  let days = null;
  let nextLabel = "";

  if (birthday) {
    const [, month, day] = birthday.split("-").map(Number);
    const today = new Date(now);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let next = new Date(today.getFullYear(), month - 1, day);
    if (next.getTime() < todayStart.getTime()) {
      next = new Date(today.getFullYear() + 1, month - 1, day);
    }
    days = Math.ceil((next.getTime() - todayStart.getTime()) / 86_400_000);
    nextLabel = next.toLocaleDateString(undefined, { day: "numeric", month: "long" });
  }

  return (
    <div className={styles.feature}>
      <div className={styles.dateCard}>
        <span className={styles.dateKicker}>The next little new year</span>
        <strong className={styles.dateBig}>
          {days === null ? "Pick a day" : days === 0 ? "Today" : `${days} days`}
        </strong>
        <span className={styles.dateSub}>
          {days === null ? "and we will keep a flame ready" : nextLabel}
        </span>
        <span className={styles.birthdayLamp}>
          <Diya lit />
        </span>
      </div>

      <label className={styles.field}>
        <span>Your birthday</span>
        <input
          className={styles.input}
          type="date"
          value={birthday}
          onChange={(event) => setBirthday(event.target.value)}
        />
      </label>

      <p className={styles.hint}>
        We only use the month and day to count down. The date stays in this
        browser.
      </p>
    </div>
  );
}

export function MoodLamp() {
  const [moodIndex, setMoodIndex] = useStoredState("mood", 0);
  const mood = MOODS[moodIndex] ?? MOODS[0];

  return (
    <div className={styles.feature}>
      <div className={styles.diyaStage}>
        <span
          className={styles.diyaDye}
          style={{ filter: `hue-rotate(${mood.hue}deg) saturate(1.12)` }}
        >
          <Diya lit />
        </span>
      </div>

      <div className={styles.moodGrid} role="group" aria-label="Choose a mood">
        {MOODS.map((option, index) => (
          <button
            key={option.label}
            type="button"
            className={`${styles.moodButton} ${
              index === moodIndex ? styles.moodButtonActive : ""
            }`}
            onClick={() => setMoodIndex(index)}
            aria-pressed={index === moodIndex}
          >
            <span className={styles.moodDot} style={{ background: option.color }} aria-hidden="true" />
            {option.label}
          </button>
        ))}
      </div>

      <p className={styles.resultLine} aria-live="polite">
        <strong>{mood.label}</strong> — {mood.line}
      </p>
    </div>
  );
}

export function WaxSeal() {
  const [initials, setInitials] = useStoredState("seal-initials", "MG");
  const [stamped, setStamped] = useState(0);
  const mark = (initials.trim() || "MG").slice(0, 3).toUpperCase();

  return (
    <div className={styles.feature}>
      <div className={styles.sealStage}>
        <div
          key={stamped}
          className={styles.waxSeal}
          role="img"
          aria-label={`A wax seal with the initials ${mark}`}
        >
          <span className={styles.sealRing} aria-hidden="true" />
          <span className={styles.sealInitials}>{mark}</span>
          <span className={styles.sealSpark} aria-hidden="true">✦</span>
        </div>
      </div>

      <div className={styles.twoFields}>
        <label className={styles.field}>
          <span>Initials, up to three</span>
          <input
            className={styles.input}
            value={initials}
            onChange={(event) => setInitials(event.target.value.toUpperCase().slice(0, 3))}
            maxLength={3}
          />
        </label>
        <div className={styles.field}>
          <span>The seal</span>
          <button type="button" className={styles.primaryButton} onClick={() => setStamped((value) => value + 1)}>
            Press the seal
            <span aria-hidden="true">❖</span>
          </button>
        </div>
      </div>

      <p className={styles.hint}>A digital bit of wax, minus the mess.</p>
    </div>
  );
}

export function GratitudeTrio() {
  const [person, setPerson] = useStoredState("gratitude-person", "");
  const [place, setPlace] = useStoredState("gratitude-place", "");
  const [small, setSmall] = useStoredState("gratitude-small", "");
  const card = `For ${person.trim() || "the person who keeps showing up"} — for being the kind of light that does not need a match.\nFor ${place.trim() || "the place that feels like a deep breath"} — for the welcome that waits at the door.\nFor ${small.trim() || "one small good thing"} — for the quiet proof that today was worth keeping.`;

  return (
    <div className={styles.feature}>
      <div className={styles.stack}>
        <label className={styles.field}>
          <span>A person</span>
          <input
            className={styles.input}
            value={person}
            onChange={(event) => setPerson(event.target.value)}
            placeholder="Who made the year lighter?"
            maxLength={40}
          />
        </label>
        <label className={styles.field}>
          <span>A place</span>
          <input
            className={styles.input}
            value={place}
            onChange={(event) => setPlace(event.target.value)}
            placeholder="Where do you feel most yourself?"
            maxLength={40}
          />
        </label>
        <label className={styles.field}>
          <span>A small thing</span>
          <input
            className={styles.input}
            value={small}
            onChange={(event) => setSmall(event.target.value)}
            placeholder="A cup of chai, a text, a window…"
            maxLength={40}
          />
        </label>
      </div>

      <div className={styles.gratitudeCard}>
        {card.split("\n").map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className={styles.row}>
        <CopyButton text={card} label="Copy the three thanks" />
        <span className={styles.hint}>Blank lines become gentle placeholders.</span>
      </div>
    </div>
  );
}

const MATERIALS = [
  { id: "brass", label: "Brass", bg: "#3a2a12", ink: "#ffe6a3", accent: "#d7b96a" },
  { id: "wood", label: "Wood", bg: "#2b160d", ink: "#f6dfc1", accent: "#b8793b" },
  { id: "clay", label: "Terracotta", bg: "#3a1710", ink: "#ffd8b5", accent: "#d98a5a" },
];

const buildNameplate = (family, number, material) => `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="260" viewBox="0 0 600 260">
  <rect width="600" height="260" fill="#0b0610" />
  <rect x="8" y="8" width="584" height="244" rx="28" fill="${material.bg}" stroke="${material.accent}" stroke-width="2.5" />
  <rect x="24" y="24" width="552" height="212" rx="20" fill="none" stroke="${material.accent}" stroke-width="1" stroke-opacity="0.35" />
  <text x="300" y="78" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="15" letter-spacing="8" fill="${material.accent}">A WELCOME TO</text>
  <text x="300" y="156" text-anchor="middle" font-family="Georgia, serif" font-size="62" fill="${material.ink}">${escapeXml(family || "Your family")}</text>
  <text x="300" y="202" text-anchor="middle" font-family="Outfit, Arial, sans-serif" font-size="18" letter-spacing="4" fill="${material.accent}">NO. ${escapeXml(number || "—")} · DIWALI ${site.year}</text>
  <text x="300" y="230" text-anchor="middle" font-family="Georgia, serif" font-size="13" fill="${material.ink}" opacity="0.7">✦</text>
</svg>`;

export function HouseNameplate() {
  const [family, setFamily] = useStoredState("nameplate-family", "");
  const [number, setNumber] = useStoredState("nameplate-number", "");
  const [materialId, setMaterialId] = useStoredState("nameplate-material", "brass");
  const material = MATERIALS.find((item) => item.id === materialId) ?? MATERIALS[0];

  const download = () => {
    downloadBlob(
      buildNameplate(family.trim(), number.trim(), material),
      "image/svg+xml",
      "diwali-nameplate.svg"
    );
  };

  return (
    <div className={styles.feature}>
      <svg
        className={styles.nameplatePreview}
        viewBox="0 0 600 260"
        role="img"
        aria-label={`Nameplate for ${family.trim() || "your family"}`}
      >
        <rect width="600" height="260" fill="#0b0610" />
        <rect x="8" y="8" width="584" height="244" rx="28" fill={material.bg} stroke={material.accent} strokeWidth="2.5" />
        <rect x="24" y="24" width="552" height="212" rx="20" fill="none" stroke={material.accent} strokeOpacity="0.35" />
        <text x="300" y="78" textAnchor="middle" fill={material.accent} fontFamily="Outfit, Arial, sans-serif" fontSize="15" letterSpacing="8">
          A WELCOME TO
        </text>
        <text x="300" y="156" textAnchor="middle" fill={material.ink} fontFamily="Georgia, serif" fontSize="62">
          {family.trim() || "Your family"}
        </text>
        <text x="300" y="202" textAnchor="middle" fill={material.accent} fontFamily="Outfit, Arial, sans-serif" fontSize="18" letterSpacing="4">
          NO. {number.trim() || "—"} · DIWALI {site.year}
        </text>
        <text x="300" y="230" textAnchor="middle" fill={material.ink} fontFamily="Georgia, serif" fontSize="13" opacity="0.7">
          ✦
        </text>
      </svg>

      <div className={styles.twoFields}>
        <label className={styles.field}>
          <span>Family name</span>
          <input
            className={styles.input}
            value={family}
            onChange={(event) => setFamily(event.target.value)}
            placeholder="Your family"
            maxLength={24}
          />
        </label>
        <label className={styles.field}>
          <span>House number</span>
          <input
            className={styles.input}
            value={number}
            onChange={(event) => setNumber(event.target.value)}
            placeholder="12A"
            maxLength={8}
          />
        </label>
      </div>

      <div className={styles.row}>
        {MATERIALS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.miniButton} ${
              item.id === materialId ? styles.miniButtonActive : ""
            }`}
            onClick={() => setMaterialId(item.id)}
            aria-pressed={item.id === materialId}
          >
            {item.label}
          </button>
        ))}
        <button type="button" className={styles.primaryButton} onClick={download}>
          Download the plaque
          <span aria-hidden="true">↓</span>
        </button>
      </div>
    </div>
  );
}

export function MemoryJar() {
  const [memories, setMemories] = useStoredState("memories", []);
  const [draft, setDraft] = useState("");
  const safe = Array.isArray(memories) ? memories : [];

  const add = (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || safe.length >= 10) return;
    setMemories((current) => {
      const list = Array.isArray(current) ? current : [];
      return [{ id: `${Date.now()}-${Math.random()}`, text }, ...list].slice(0, 10);
    });
    setDraft("");
  };

  return (
    <div className={styles.feature}>
      <div className={styles.memoryJarStage}>
        <div className={styles.memoryJar}>
          <span className={styles.memoryJarNeck} aria-hidden="true" />
          {safe.length === 0 && <span className={styles.memoryEmpty}>the jar is waiting</span>}
          {safe.map((memory, index) => (
            <span
              key={memory.id}
              className={styles.memoryFirefly}
              title={memory.text}
              style={{
                left: `${18 + ((index * 27) % 62)}%`,
                top: `${20 + ((index * 31) % 56)}%`,
                "--fly-delay": `${index * 0.28}s`,
              }}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      <form className={styles.row} onSubmit={add}>
        <label className={`${styles.field} ${styles.growField}`}>
          <span>A small bright moment</span>
          <input
            className={styles.input}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="The first chai of the holiday…"
            maxLength={80}
          />
        </label>
        <button type="submit" className={styles.primaryButton} disabled={!draft.trim() || safe.length >= 10}>
          Add a firefly
        </button>
      </form>

      {safe.length > 0 && (
        <>
          <ul className={styles.memoryList}>
            {safe.slice(0, 4).map((memory) => (
              <li key={memory.id}>{memory.text}</li>
            ))}
          </ul>
          <button
            type="button"
            className={styles.miniButton}
            onClick={() => setMemories([])}
          >
            Empty the jar
          </button>
        </>
      )}
      <p className={styles.hint}>Up to ten memories, kept only in this browser.</p>
    </div>
  );
}

export function ThreeWords() {
  const [selected, setSelected] = useStoredState("three-words", []);
  const safe = Array.isArray(selected) ? selected : [];

  const toggle = (word) => {
    setSelected((current) => {
      const list = Array.isArray(current) ? current : [];
      if (list.includes(word)) return list.filter((item) => item !== word);
      if (list.length >= 3) return list;
      return [...list, word];
    });
  };

  const phrase =
    safe.length === 3
      ? `More ${safe[0]}. More ${safe[1]}. More ${safe[2]}.`
      : "Choose three words for the year.";

  return (
    <div className={styles.feature}>
      <div className={styles.wordChipGrid} role="group" aria-label="Choose three words">
        {PRIORITY_WORDS.map((word) => (
          <button
            key={word}
            type="button"
            className={`${styles.wordChip} ${safe.includes(word) ? styles.wordChipActive : ""}`}
            onClick={() => toggle(word)}
            aria-pressed={safe.includes(word)}
          >
            {word}
          </button>
        ))}
      </div>

      <div className={styles.threeWordsCard}>
        <span className={styles.stageIndex}>For the year ahead</span>
        <p className={styles.threeWordsLine}>{phrase}</p>
      </div>

      <div className={styles.row}>
        <CopyButton text={phrase} label="Copy the intention" />
        <span className={styles.hint}>{safe.length} / 3 chosen</span>
      </div>
    </div>
  );
}
