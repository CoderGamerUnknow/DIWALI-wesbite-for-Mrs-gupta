import { useEffect, useRef, useState } from "react";
import { LANGUAGES, MESSAGE_TONES } from "../../const/lab";
import { site } from "../../const/site";
import { downloadBlob, pad, useNow, useStoredState } from "../../lib/lab";
import { playDiyaChime } from "../../lib/chime";
import { Diya } from "../Diya";
import { CopyButton } from "./Shared";
import styles from "../LightLab.module.scss";

const padDate = (value) => String(value).padStart(2, "0");
const icsDate = (date) =>
  `${date.getFullYear()}${padDate(date.getMonth() + 1)}${padDate(date.getDate())}`;

function getDiwaliDates() {
  const [year, month, day] = site.diwaliISO.slice(0, 10).split("-").map(Number);
  const start = new Date(year, month - 1, day, 12);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export function Calendar() {
  const { start, end } = getDiwaliDates();
  const startCode = icsDate(start);
  const endCode = icsDate(end);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//A Diwali Wish//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:diwali-${site.year}@a-diwali-wish`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${startCode}`,
    `DTEND;VALUE=DATE:${endCode}`,
    `SUMMARY:Diwali ${site.year}`,
    `DESCRIPTION:${site.principalShort} — a wish from your students. Light a diya and keep the glow.`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:Diwali is tomorrow",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Diwali ${site.year}`
  )}&dates=${startCode}/${endCode}&details=${encodeURIComponent(
    `A Diwali wish for ${site.principalShort}, from ${site.from.toLowerCase()}.`
  )}`;

  const download = () => {
    downloadBlob(ics, "text/calendar;charset=utf-8", `diwali-${site.year}.ics`);
  };

  return (
    <div className={styles.feature}>
      <div className={`${styles.dateCard} ${styles.stageGlow}`}>
        <span className={styles.dateKicker}>The main night</span>
        <strong className={styles.dateBig}>{site.diwaliLabel}</strong>
        <span className={styles.dateSub}>Lakshmi Puja · Diwali {site.year}</span>
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={download}>
          Download the calendar file
          <span aria-hidden="true">↓</span>
        </button>
        <a className={styles.miniButton} href={googleUrl} target="_blank" rel="noreferrer">
          Add with Google Calendar ↗
        </a>
      </div>

      <p className={styles.hint}>
        The .ics file works with Apple Calendar, Outlook, Google Calendar and
        most phone calendars.
      </p>
    </div>
  );
}

export function CopyWish() {
  const [toneId, setToneId] = useState("whatsapp");
  const [name, setName] = useStoredState("name", "");
  const [pageUrl] = useState(() =>
    typeof window === "undefined" ? "" : window.location.href.split("#")[0]
  );
  const tone = MESSAGE_TONES.find((item) => item.id === toneId) ?? MESSAGE_TONES[0];
  const sender = name.trim() || site.from;
  const message = `${tone.text}\n\nFor ${site.principalShort}, with love from ${sender}.\n${pageUrl}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <div className={styles.feature}>
      <div className={styles.toneRow} role="group" aria-label="Message tone">
        {MESSAGE_TONES.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`${styles.miniButton} ${
              option.id === toneId ? styles.miniButtonActive : ""
            }`}
            onClick={() => setToneId(option.id)}
            aria-pressed={option.id === toneId}
          >
            {option.label}
          </button>
        ))}
      </div>

      <label className={styles.field}>
        <span>Sign it as</span>
        <input
          className={styles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={site.from}
          maxLength={30}
        />
      </label>

      <p className={styles.messagePreview}>{message}</p>

      <div className={styles.row}>
        <CopyButton text={message} label="Copy the message" />
        <a className={styles.miniButton} href={whatsappUrl} target="_blank" rel="noreferrer">
          Open WhatsApp ↗
        </a>
      </div>

      <p className={styles.hint}>
        Edit the message after copying it if you want to make it your own.
      </p>
    </div>
  );
}

const NOTE_LABELS = ["Sa", "Re", "Ga", "Pa", "Dha"];
const NOTE_COLORS = ["#f4c95d", "#ffab5e", "#ff8fb1", "#c9a2ff", "#7ce0c3"];

export function NoteKeyboard() {
  const [active, setActive] = useState(null);
  const timerRef = useRef(0);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.repeat) return;
      if (event.target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) {
        return;
      }
      const index = ["1", "2", "3", "4", "5"].indexOf(event.key);
      if (index === -1) return;
      event.preventDefault();
      playDiyaChime(index);
      setActive(index);
      window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => setActive(null), 420);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(timerRef.current);
    };
  }, []);

  const play = (index) => {
    playDiyaChime(index);
    setActive(index);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setActive(null), 420);
  };

  return (
    <div className={styles.feature}>
      <div className={styles.keyboardStage}>
        {NOTE_LABELS.map((label, index) => (
          <button
            key={label}
            type="button"
            className={`${styles.noteKey} ${active === index ? styles.noteKeyActive : ""}`}
            style={{ "--note-color": NOTE_COLORS[index] }}
            onClick={() => play(index)}
            aria-label={`Play note ${label}`}
          >
            <span className={styles.noteLight} aria-hidden="true" />
            <span className={styles.noteLabel}>{label}</span>
            <span className={styles.noteNumber}>{index + 1}</span>
          </button>
        ))}
      </div>
      <p className={styles.hint}>
        Tap the lamps, or press the number keys 1–5. Each flame holds one note.
      </p>
    </div>
  );
}

export function Dimmer() {
  const [glow, setGlow] = useStoredState("dimmer", 68);
  const strength = Number(glow) || 0;

  return (
    <div className={styles.feature}>
      <div className={styles.dimmerStage}>
        <span
          className={styles.dimmerGlow}
          style={{ opacity: 0.15 + (strength / 100) * 0.85 }}
          aria-hidden="true"
        />
        <span
          className={styles.dimmerLamp}
          style={{ transform: `scale(${0.75 + (strength / 100) * 0.35})` }}
        >
          <Diya lit />
        </span>
        <span className={styles.dimmerFloor} aria-hidden="true" />
      </div>

      <label className={styles.field}>
        <span>
          Glow: {strength}% ·{" "}
          {strength < 30 ? "almost out" : strength < 65 ? "cozy" : "bright enough to read by"}
        </span>
        <input
          className={styles.range}
          type="range"
          min="10"
          max="100"
          value={glow}
          onChange={(event) => setGlow(Number(event.target.value))}
        />
      </label>

      <p className={styles.hint}>A small experiment in how much light a room really needs.</p>
    </div>
  );
}

export function PersonalCountdown() {
  const [date, setDate] = useStoredState("countdown-date", site.diwaliISO.slice(0, 10));
  const now = useNow(1000);
  const target = date ? new Date(`${date}T00:00:00`).getTime() : NaN;
  const valid = Number.isFinite(target);
  const distance = valid ? Math.max(0, target - now) : 0;
  const done = valid && target <= now;

  const units = [
    { label: "days", value: Math.floor(distance / 86_400_000) },
    { label: "hours", value: Math.floor((distance / 3_600_000) % 24) },
    { label: "minutes", value: Math.floor((distance / 60_000) % 60) },
    { label: "seconds", value: Math.floor((distance / 1_000) % 60) },
  ];

  return (
    <div className={styles.feature}>
      <div className={styles.twoFields}>
        <label className={styles.field}>
          <span>Count down to</span>
          <input
            className={styles.input}
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <div className={styles.quickDates}>
          <button type="button" className={styles.miniButton} onClick={() => setDate(site.diwaliISO.slice(0, 10))}>
            Diwali
          </button>
          <button
            type="button"
            className={styles.miniButton}
            onClick={() => setDate(`${Number(site.year) + 1}-01-01`)}
          >
            New Year
          </button>
        </div>
      </div>

      <div className={styles.countdownRow} aria-live="polite">
        {units.map((unit) => (
          <span className={styles.countUnit} key={unit.label}>
            <strong>{pad(unit.value)}</strong>
            <small>{unit.label}</small>
          </span>
        ))}
      </div>

      <p className={styles.resultLine}>
        {!valid
          ? "Choose a date to begin."
          : done
            ? "That day has arrived. Look up from the screen."
            : `${new Date(target).toLocaleDateString(undefined, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })} is on its way.`}
      </p>
      <p className={styles.hint}>The date stays in your browser, not on a server.</p>
    </div>
  );
}

export function Languages() {
  const [active, setActive] = useState(0);
  const language = LANGUAGES[active];

  return (
    <div className={styles.feature}>
      <div className={styles.languageGrid} role="group" aria-label="Languages">
        {LANGUAGES.map((item, index) => (
          <button
            key={item.language}
            type="button"
            className={`${styles.languageButton} ${
              index === active ? styles.languageActive : ""
            }`}
            onClick={() => setActive(index)}
            aria-pressed={index === active}
          >
            {item.language}
          </button>
        ))}
      </div>

      <div className={`${styles.languageCard} ${styles.stageGlow}`} aria-live="polite">
        <p className={styles.languageGreeting} lang={language.language.toLowerCase()}>
          {language.greeting}
        </p>
        <p className={styles.languageRoman}>{language.roman}</p>
        <span className={styles.languageName}>{language.language}</span>
      </div>

      <div className={styles.row}>
        <CopyButton text={`${language.greeting} — ${language.roman}`} label="Copy the greeting" />
        <span className={styles.hint}>Twelve of the many languages Diwali is wished in.</span>
      </div>
    </div>
  );
}

export function CalmMode() {
  const [calm, setCalm] = useStoredState("calm", false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("calm-mode", calm);
    return () => root.classList.remove("calm-mode");
  }, [calm]);

  return (
    <div className={styles.feature}>
      <div className={`${styles.calmStage} ${calm ? styles.calmStill : ""}`}>
        <span className={styles.calmOrb} aria-hidden="true" />
        <span className={styles.calmSpark} style={{ "--x": "20%", "--y": "30%", "--d": "0s" }} aria-hidden="true" />
        <span className={styles.calmSpark} style={{ "--x": "68%", "--y": "24%", "--d": "0.7s" }} aria-hidden="true" />
        <span className={styles.calmSpark} style={{ "--x": "42%", "--y": "62%", "--d": "1.4s" }} aria-hidden="true" />
        <span className={styles.calmSpark} style={{ "--x": "78%", "--y": "70%", "--d": "2.1s" }} aria-hidden="true" />
        <p>{calm ? "Stillness, on request." : "A little movement, for the joy of it."}</p>
      </div>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => setCalm((value) => !value)}
          aria-pressed={calm}
        >
          {calm ? "Bring the movement back" : "Calm the page"}
        </button>
        <span className={styles.hint}>
          {calm
            ? "Animations are off. Close this light to restore the page."
            : "Useful if motion makes the page harder to enjoy."}
        </span>
      </div>

      <p className={styles.hint}>
        Your preference is remembered in this browser for the next visit to the
        lab.
      </p>
    </div>
  );
}

export function MarigoldShower() {
  const [raining, setRaining] = useState(true);

  return (
    <div className={styles.feature}>
      <div className={styles.petalStage}>
        {raining &&
          Array.from({ length: 26 }, (_, index) => (
            <span
              key={index}
              className={styles.petal}
              style={{
                left: `${(index * 37) % 100}%`,
                "--petal-delay": `${-((index * 0.37) % 5)}s`,
                "--petal-duration": `${5 + (index % 5) * 1.2}s`,
                "--petal-size": `${9 + (index % 4) * 3}px`,
                "--petal-drift": `${(index % 2 === 0 ? 1 : -1) * (16 + (index % 5) * 12)}px`,
              }}
              aria-hidden="true"
            />
          ))}
        <p className={styles.petalCaption}>
          {raining ? "Marigolds, by the handful." : "The petals are resting."}
        </p>
      </div>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={() => setRaining((value) => !value)}
          aria-pressed={raining}
        >
          {raining ? "Stop the shower" : "Let it rain marigolds"}
          <span aria-hidden="true">✿</span>
        </button>
        <span className={styles.hint}>A completely unnecessary, completely lovely button.</span>
      </div>
    </div>
  );
}
