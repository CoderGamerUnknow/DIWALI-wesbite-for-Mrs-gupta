import { useEffect, useState } from "react";
import { diwaliDate, site } from "../../const/site";
import { toDevanagari, useNow, useStoredState } from "../../lib/lab";
import { Diya } from "../Diya";
import { CopyButton } from "./Shared";
import styles from "../LightLab.module.scss";

const DYES = [
  { name: "Saffron", hue: 0, color: "#ff9d3c" },
  { name: "Rose", hue: 320, color: "#ff8fb1" },
  { name: "Mint", hue: 140, color: "#8af0cf" },
  { name: "Lotus", hue: 250, color: "#c9a2ff" },
  { name: "Sky", hue: 190, color: "#8fd6ff" },
];

const ACCENTS = [
  { name: "Marigold", main: "#f4c95d", bright: "#ffe6a3", color: "#f4c95d" },
  { name: "Rose", main: "#ff8fb1", bright: "#ffd0de", color: "#ff8fb1" },
  { name: "Mint", main: "#7ce0c3", bright: "#c9f8ea", color: "#7ce0c3" },
  { name: "Lotus", main: "#c9a2ff", bright: "#e8d9ff", color: "#c9a2ff" },
  { name: "Saffron", main: "#ffab5e", bright: "#ffdfc0", color: "#ffab5e" },
];

export function NameInLights() {
  const [name, setName] = useStoredState("name", "");
  const display = name.trim() || "you";

  return (
    <div className={styles.feature}>
      <label className={styles.field}>
        <span>Whose name shall we light?</span>
        <input
          className={styles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Mrs. Gupta"
          maxLength={28}
        />
      </label>

      <div className={`${styles.greetingStage} ${styles.stageGlow}`}>
        <span className={styles.greetingSmall}>A wish for</span>
        <p className={styles.greetingName}>{display}</p>
        <span className={styles.greetingTail}>Happy Diwali · {site.year}</span>
      </div>

      <p className={styles.hint}>
        Saved in this browser, so the greeting is still waiting next time you
        visit.
      </p>
    </div>
  );
}

export function HindiName() {
  const [name, setName] = useStoredState("hindi-name", "");
  const hindi = name.trim() ? toDevanagari(name) : "आपका नाम";

  return (
    <div className={styles.feature}>
      <label className={styles.field}>
        <span>Write a name in English letters</span>
        <input
          className={styles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Ananya"
          maxLength={32}
        />
      </label>

      <div className={`${styles.hindiCard} ${styles.stageGlow}`}>
        <p className={`${styles.hindiResult} hindi`} lang="hi">
          {hindi}
        </p>
        <p className={styles.hindiRoman}>
          {name.trim() || "your name"} · Devanagari
        </p>
      </div>

      <div className={styles.row}>
        <CopyButton text={hindi} label="Copy the script" />
        <span className={styles.hint}>
          A playful phonetic rendering, not a translation. Common names use
          hand-written spellings.
        </span>
      </div>
    </div>
  );
}

export function PaintDiya() {
  const [dyeIndex, setDyeIndex] = useStoredState("dye", 0);
  const dye = DYES[dyeIndex] ?? DYES[0];

  return (
    <div className={styles.feature}>
      <div className={styles.diyaStage}>
        <span
          className={styles.diyaDye}
          style={{ filter: `hue-rotate(${dye.hue}deg) saturate(1.18)` }}
        >
          <Diya lit />
        </span>
        <p className={styles.stageCaption}>{dye.name} flame</p>
      </div>

      <div className={styles.swatchRow} role="group" aria-label="Diya colours">
        {DYES.map((option, index) => (
          <button
            key={option.name}
            type="button"
            className={`${styles.swatch} ${
              index === dyeIndex ? styles.swatchActive : ""
            }`}
            style={{ "--swatch": option.color }}
            onClick={() => setDyeIndex(index)}
            aria-pressed={index === dyeIndex}
            aria-label={option.name}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>

      <p className={styles.hint}>
        A filter, a little pigment and a very patient clay lamp.
      </p>
    </div>
  );
}

export function PageAccent() {
  const [accentIndex, setAccentIndex] = useStoredState("accent", 0);
  const accent = ACCENTS[accentIndex] ?? ACCENTS[0];

  useEffect(() => {
    const root = document.documentElement;
    const previousGold = root.style.getPropertyValue("--gold");
    const previousBright = root.style.getPropertyValue("--gold-bright");
    root.style.setProperty("--gold", accent.main);
    root.style.setProperty("--gold-bright", accent.bright);

    return () => {
      if (previousGold) root.style.setProperty("--gold", previousGold);
      else root.style.removeProperty("--gold");
      if (previousBright) root.style.setProperty("--gold-bright", previousBright);
      else root.style.removeProperty("--gold-bright");
    };
  }, [accent]);

  return (
    <div className={styles.feature}>
      <p className={styles.bodyCopy}>
        Choose a colour and the whole page will lean towards it — the buttons,
        the rules, the little stars.
      </p>

      <div className={styles.accentGrid} role="group" aria-label="Page accent colours">
        {ACCENTS.map((option, index) => (
          <button
            key={option.name}
            type="button"
            className={`${styles.accentCard} ${
              index === accentIndex ? styles.accentCardActive : ""
            }`}
            onClick={() => setAccentIndex(index)}
            aria-pressed={index === accentIndex}
            style={{ "--swatch": option.color }}
          >
            <span className={styles.accentDot} aria-hidden="true" />
            {option.name}
          </button>
        ))}
      </div>

      <div className={styles.accentPreview}>
        <span className={styles.accentPreviewKicker}>The page, in {accent.name.toLowerCase()}</span>
        <span className={styles.accentPreviewLine} aria-hidden="true" />
        <span className={styles.accentPreviewText}>शुभ दीपावली</span>
      </div>

      <p className={styles.hint}>The colour returns to marigold when you close this light.</p>
    </div>
  );
}

export function BlessingJar() {
  const [drawn, setDrawn] = useState(null);
  const blessing = drawn === null ? null : site.blessings[drawn];

  const draw = () => {
    let next = Math.floor(Math.random() * site.blessings.length);
    if (next === drawn && site.blessings.length > 1) {
      next = (next + 1) % site.blessings.length;
    }
    setDrawn(next);
  };

  return (
    <div className={styles.feature}>
      {!blessing ? (
        <div className={styles.jarWrap}>
          <button type="button" className={styles.jar} onClick={draw}>
            <span className={styles.jarLid} aria-hidden="true" />
            <span className={styles.jarBody} aria-hidden="true">
              <span>✦</span>
            </span>
            <span className={styles.jarLabel}>Open the jar</span>
          </button>
          <p className={styles.hint}>
            Six blessings, written for {site.principalShort}. Take one.
          </p>
        </div>
      ) : (
        <div className={styles.feature} key={drawn}>
          <div className={`${styles.blessingCard} ${styles.stageGlow}`} aria-live="polite">
            <span className={styles.blessingNumber}>
              {String(drawn + 1).padStart(2, "0")} / {String(site.blessings.length).padStart(2, "0")}
            </span>
            <p className={`${styles.blessingHindi} hindi`} lang="hi">
              {blessing.hindi}
            </p>
            <p className={styles.blessingEnglish}>{blessing.text}</p>
          </div>
          <button type="button" className={styles.primaryButton} onClick={draw}>
            Draw another
            <span aria-hidden="true">✦</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function WishLantern() {
  const [wish, setWish] = useState("");
  const [lanterns, setLanterns] = useState([]);

  const release = (event) => {
    event.preventDefault();
    const text = wish.trim();
    if (!text) return;
    setLanterns((current) => [
      ...current.slice(-5),
      { id: `${Date.now()}-${Math.random()}`, text },
    ]);
    setWish("");
  };

  return (
    <div className={styles.feature}>
      <form className={styles.stack} onSubmit={release}>
        <label className={styles.field}>
          <span>What are you sending up?</span>
          <textarea
            className={styles.textarea}
            value={wish}
            onChange={(event) => setWish(event.target.value)}
            placeholder="A small wish for the year ahead…"
            maxLength={120}
            rows={3}
          />
        </label>
        <div className={styles.row}>
          <button type="submit" className={styles.primaryButton} disabled={!wish.trim()}>
            Release the lantern
            <span aria-hidden="true">↗</span>
          </button>
          <span className={styles.counter}>{wish.length}/120</span>
        </div>
      </form>

      <div className={styles.lanternSky}>
        <div className={styles.lanternStars} aria-hidden="true" />
        {lanterns.length === 0 && (
          <p className={styles.skyEmpty}>The sky is waiting.</p>
        )}
        {lanterns.map((lantern) => (
          <span
            key={lantern.id}
            className={styles.lantern}
            title={lantern.text}
            aria-label={`Released wish: ${lantern.text}`}
            onAnimationEnd={() =>
              setLanterns((current) => current.filter((item) => item.id !== lantern.id))
            }
          >
            <span className={styles.lanternGlow} aria-hidden="true" />
            <span className={styles.lanternBody} aria-hidden="true" />
          </span>
        ))}
        <span className={styles.lanternHorizon} aria-hidden="true" />
      </div>

      <p className={styles.hint}>
        Lanterns drift away on this screen only. Nothing is sent anywhere.
      </p>
    </div>
  );
}

export function WishWall() {
  const [notes, setNotes] = useStoredState("wall", []);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const safeNotes = Array.isArray(notes) ? notes : [];
  const isFull = safeNotes.length >= 12;

  const addNote = (event) => {
    event.preventDefault();
    const text = message.trim();
    if (!text || isFull) return;
    setNotes((current) => {
      const list = Array.isArray(current) ? current : [];
      return [
        {
          id: `${Date.now()}-${Math.random()}`,
          name: name.trim() || "A friend",
          text,
          at: Date.now(),
        },
        ...list,
      ].slice(0, 12);
    });
    setMessage("");
  };

  const removeNote = (id) => {
    setNotes((current) => (Array.isArray(current) ? current.filter((note) => note.id !== id) : []));
  };

  return (
    <div className={styles.feature}>
      <form className={styles.noteForm} onSubmit={addNote}>
        <div className={styles.twoFields}>
          <label className={styles.field}>
            <span>Your name</span>
            <input
              className={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Optional"
              maxLength={24}
            />
          </label>
          <label className={styles.field}>
            <span>Your note</span>
            <input
              className={styles.input}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="A line for the wall…"
              maxLength={90}
            />
          </label>
        </div>
        <div className={styles.row}>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={!message.trim() || isFull}
          >
            Pin it to the wall
          </button>
          <span className={styles.counter}>{safeNotes.length} / 12 notes</span>
        </div>
      </form>

      {safeNotes.length === 0 ? (
        <p className={styles.emptyState}>
          The wall is bare. Leave the first little note — for{" "}
          {site.principalShort}, for the year, for whoever needs it.
        </p>
      ) : (
        <ul className={styles.noteWall}>
          {safeNotes.map((note) => (
            <li className={styles.noteCard} key={note.id}>
              <p className={styles.noteText}>{note.text}</p>
              <div className={styles.noteFoot}>
                <span>{note.name}</span>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => removeNote(note.id)}
                  aria-label={`Remove note from ${note.name}`}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className={styles.hint}>
        Notes live in this browser only. Clear your site data and they go with
        it.
      </p>
    </div>
  );
}

export function TimeCapsule() {
  const [capsule, setCapsule] = useStoredState("capsule", null);
  const [message, setMessage] = useState("");
  const now = useNow(30_000);
  const opensAt = diwaliDate.getTime();
  const isOpen = now >= opensAt;
  const daysLeft = Math.max(0, Math.ceil((opensAt - now) / 86_400_000));

  const seal = (event) => {
    event.preventDefault();
    const text = message.trim();
    if (!text) return;
    setCapsule({ message: text, sealedAt: Date.now() });
    setMessage("");
  };

  if (!capsule) {
    return (
      <div className={styles.feature}>
        <p className={styles.bodyCopy}>
          Write something to your future self. It stays on this device, sealed
          until {site.diwaliLabel}.
        </p>
        <form className={styles.stack} onSubmit={seal}>
          <label className={styles.field}>
            <span>Your letter</span>
            <textarea
              className={styles.textarea}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="By next Diwali, I hope…"
              maxLength={400}
              rows={4}
            />
          </label>
          <div className={styles.row}>
            <button type="submit" className={styles.primaryButton} disabled={!message.trim()}>
              Seal it until Diwali
              <span aria-hidden="true">✦</span>
            </button>
            <span className={styles.counter}>{message.length}/400</span>
          </div>
        </form>
        <p className={styles.hint}>
          No account, no cloud. It is saved in this browser and cannot be opened
          early.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.feature}>
      <div className={`${styles.capsuleCard} ${isOpen ? styles.capsuleOpen : ""}`}>
        <span className={styles.capsuleSeal} aria-hidden="true">
          {isOpen ? "✦" : "❖"}
        </span>
        <p className={styles.capsuleKicker}>
          {isOpen ? "Your letter is open" : `Sealed for ${daysLeft} more ${daysLeft === 1 ? "day" : "days"}`}
        </p>
        {isOpen ? (
          <p className={styles.capsuleMessage}>{capsule.message}</p>
        ) : (
          <p className={styles.capsuleLocked}>
            It will open on {site.diwaliLabel}. The wait is part of the wish.
          </p>
        )}
        <span className={styles.capsuleDate}>
          Sealed {new Date(capsule.sealedAt).toLocaleDateString()}
        </span>
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.miniButton} onClick={() => setCapsule(null)}>
          Write a new letter
        </button>
        <span className={styles.hint}>This replaces the sealed note.</span>
      </div>
    </div>
  );
}
