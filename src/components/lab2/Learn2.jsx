import { useState } from "react";
import {
  DIYA_PARTS,
  HINDI_NUMBERS,
  REGIONAL_SWEETS,
  SANSKRIT_PHRASES,
  SYMBOLS,
  TRUE_FALSE_STATEMENTS,
} from "../../const/lab2";
import {
  playCymbal,
  playDiyaChime,
  playDrum,
  playConch,
  playTempleBell,
} from "../../lib/chime";
import { Diya } from "../Diya";
import styles from "../LightLab.module.scss";

export function HindiNumbers() {
  const [active, setActive] = useState(0);
  const number = HINDI_NUMBERS[active];

  const choose = (index) => {
    setActive(index);
    playDiyaChime(index % 5);
  };

  return (
    <div className={styles.feature}>
      <div className={styles.numberGrid} role="group" aria-label="Hindi numbers">
        {HINDI_NUMBERS.map((item, index) => (
          <button
            key={item.number}
            type="button"
            className={`${styles.numberButton} ${
              index === active ? styles.numberButtonActive : ""
            }`}
            onClick={() => choose(index)}
            aria-pressed={index === active}
          >
            {item.number}
          </button>
        ))}
      </div>

      <div className={styles.numberDetail} aria-live="polite">
        <span className={`${styles.numberHindi} hindi`} lang="hi">
          {number.hindi}
        </span>
        <span className={styles.numberRoman}>{number.roman}</span>
        <span className={styles.numberValue}>{number.number}</span>
      </div>

      <p className={styles.hint}>
        Each number gets a note from the diya shelf. One through ten, ten little
        flames.
      </p>
    </div>
  );
}

export function SanskritPhrases() {
  const [revealed, setRevealed] = useState(() => SANSKRIT_PHRASES.map(() => false));

  const toggle = (index) => {
    setRevealed((current) => current.map((value, item) => (item === index ? !value : value)));
  };

  return (
    <div className={styles.feature}>
      <div className={styles.shlokaList}>
        {SANSKRIT_PHRASES.map((phrase, index) => (
          <div className={styles.shlokaCard} key={phrase.sanskrit}>
            <p className={`${styles.shlokaHindi} hindi`} lang="hi">
              {phrase.sanskrit}
            </p>
            <p className={styles.shlokaTranslit}>{phrase.roman}</p>
            {revealed[index] ? (
              <p className={styles.shlokaMeaning} aria-live="polite">
                {phrase.meaning}
                <span className={styles.shlokaSource}>{phrase.source}</span>
              </p>
            ) : (
              <button type="button" className={styles.miniButton} onClick={() => toggle(index)}>
                Reveal the meaning
              </button>
            )}
          </div>
        ))}
      </div>
      <p className={styles.hint}>Five gentle lines, borrowed from old conversations.</p>
    </div>
  );
}

export function Symbols() {
  const [active, setActive] = useState(0);
  const symbol = SYMBOLS[active];

  return (
    <div className={styles.feature}>
      <div className={styles.symbolGrid} role="group" aria-label="Diwali symbols">
        {SYMBOLS.map((item, index) => (
          <button
            key={item.name}
            type="button"
            className={`${styles.symbolButton} ${
              index === active ? styles.symbolButtonActive : ""
            }`}
            onClick={() => setActive(index)}
            aria-pressed={index === active}
          >
            <span className={styles.symbolGlyph} aria-hidden="true">
              {item.glyph}
            </span>
            {item.name}
          </button>
        ))}
      </div>

      <div className={styles.factCard} aria-live="polite">
        <span className={styles.symbolGlyph} aria-hidden="true">
          {symbol.glyph}
        </span>
        <h4 className={styles.factTitle}>{symbol.name}</h4>
        <p className={styles.factText}>{symbol.text}</p>
      </div>
    </div>
  );
}

export function SweetsOfIndia() {
  const [active, setActive] = useState(0);
  const region = REGIONAL_SWEETS[active];

  return (
    <div className={styles.feature}>
      <div className={styles.worldList} role="group" aria-label="Regional sweets">
        {REGIONAL_SWEETS.map((item, index) => (
          <button
            key={item.place}
            type="button"
            className={`${styles.worldButton} ${index === active ? styles.worldActive : ""}`}
            onClick={() => setActive(index)}
            aria-pressed={index === active}
          >
            {item.place}
          </button>
        ))}
      </div>

      <div className={styles.worldFact} aria-live="polite">
        <span className={styles.worldPin} aria-hidden="true">✿</span>
        <div>
          <h4>{region.sweet}</h4>
          <p>{region.fact}</p>
        </div>
      </div>

      <p className={styles.hint}>Six regions, six ways to say something sweet.</p>
    </div>
  );
}

export function TrueFalse() {
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const statement = TRUE_FALSE_STATEMENTS[step];

  const choose = (value) => {
    if (chosen !== null) return;
    setChosen(value);
    if (value === statement.answer) setScore((current) => current + 1);
  };

  const next = () => {
    if (step + 1 >= TRUE_FALSE_STATEMENTS.length) {
      setDone(true);
      return;
    }
    setStep((value) => value + 1);
    setChosen(null);
  };

  const restart = () => {
    setStep(0);
    setChosen(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    return (
      <div className={`${styles.feature} ${styles.centerFeature}`}>
        <p className={styles.bigScore}>
          {score} <span>/ {TRUE_FALSE_STATEMENTS.length}</span>
        </p>
        <p className={styles.resultLine}>
          {score === TRUE_FALSE_STATEMENTS.length
            ? "Every claim sorted. The festival has no surprises left."
            : "A few claims still need another look."}
        </p>
        <button type="button" className={styles.primaryButton} onClick={restart}>
          Play again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.feature}>
      <div className={styles.quizTop}>
        <span>
          Statement {step + 1} of {TRUE_FALSE_STATEMENTS.length}
        </span>
        <span>{score} correct</span>
      </div>
      <div className={styles.progressTrack} aria-hidden="true">
        <span
          className={styles.progressFill}
          style={{ width: `${(step / TRUE_FALSE_STATEMENTS.length) * 100}%` }}
        />
      </div>

      <h4 className={styles.quizQuestion}>{statement.statement}</h4>

      <div className={styles.optionList}>
        {[true, false].map((value) => {
          const show = chosen !== null;
          const isCorrect = value === statement.answer;
          const isChosen = chosen === value;
          return (
            <button
              key={String(value)}
              type="button"
              className={`${styles.option} ${show && isCorrect ? styles.optionCorrect : ""} ${
                show && isChosen && !isCorrect ? styles.optionWrong : ""
              }`}
              onClick={() => choose(value)}
              disabled={show}
              aria-pressed={isChosen}
            >
              <span className={styles.optionLetter} aria-hidden="true">
                {value ? "✓" : "×"}
              </span>
              {value ? "True" : "False"}
            </button>
          );
        })}
      </div>

      <div className={styles.feedbackRow} aria-live="polite">
        <p className={styles.feedback}>
          {chosen === null
            ? "Trust your instinct."
            : `${chosen === statement.answer ? "Correct." : "Not quite."} ${statement.note}`}
        </p>
        {chosen !== null && (
          <button type="button" className={styles.primaryButton} onClick={next}>
            {step + 1 === TRUE_FALSE_STATEMENTS.length ? "See the score" : "Next statement"}
          </button>
        )}
      </div>
    </div>
  );
}

export function DiyaAnatomy() {
  const [active, setActive] = useState("flame");
  const part = DIYA_PARTS.find((item) => item.id === active) ?? DIYA_PARTS[0];

  return (
    <div className={styles.feature}>
      <div className={styles.anatomyStage}>
        <span className={styles.anatomyDiya}>
          <Diya lit />
        </span>
        {DIYA_PARTS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.hotspot} ${
              active === item.id ? styles.hotspotActive : ""
            }`}
            style={{ top: `${item.top}%`, left: `${item.left}%` }}
            onClick={() => setActive(item.id)}
            aria-pressed={active === item.id}
            aria-label={item.label}
          />
        ))}
      </div>

      <div className={styles.hotspotDetail} aria-live="polite">
        <span className={styles.stageIndex}>{part.label}</span>
        <p>{part.text}</p>
      </div>

      <p className={styles.hint}>Tap the bright dots to inspect the little lamp.</p>
    </div>
  );
}

export function MoonPhase() {
  const [phase, setPhase] = useState(100);
  const isNew = phase > 92;
  const isFull = phase < 8;

  return (
    <div className={styles.feature}>
      <div className={styles.moonStage}>
        <span className={styles.moonDisk}>
          <span
            className={styles.moonShadow}
            style={{ transform: `translateX(${phase - 100}%)` }}
          />
        </span>
      </div>

      <label className={styles.field}>
        <span>{isNew ? "New moon — the Diwali night" : isFull ? "Full moon" : "The moon in between"}</span>
        <input
          className={styles.range}
          type="range"
          min="0"
          max="100"
          value={phase}
          onChange={(event) => setPhase(Number(event.target.value))}
        />
      </label>

      <p className={styles.resultLine}>
        {isNew
          ? "With no moonlight to help, every diya on the doorstep matters a little more."
          : isFull
            ? "The moon can carry the light on its own. Diwali waits for the dark."
            : "Waxing or waning, the moon is still on its way somewhere."}
      </p>
    </div>
  );
}

const INSTRUMENTS = [
  { id: "bell", label: "Temple bell", glyph: "✦", play: playTempleBell, note: "A low, clear bell." },
  { id: "conch", label: "Conch", glyph: "◉", play: playConch, note: "A breathy call to gather." },
  { id: "drum", label: "Drum", glyph: "◌", play: playDrum, note: "A soft membrane thump." },
  { id: "cymbal", label: "Cymbal", glyph: "✺", play: playCymbal, note: "A bright wash of noise." },
];

export function Instruments() {
  const [last, setLast] = useState(null);
  const instrument = INSTRUMENTS.find((item) => item.id === last);

  return (
    <div className={styles.feature}>
      <div className={styles.instrumentGrid}>
        {INSTRUMENTS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${styles.instrumentButton} ${
              last === item.id ? styles.instrumentButtonActive : ""
            }`}
            onClick={() => {
              item.play();
              setLast(item.id);
            }}
          >
            <span className={styles.instrumentGlyph} aria-hidden="true">
              {item.glyph}
            </span>
            {item.label}
          </button>
        ))}
      </div>

      <p className={styles.resultLine} aria-live="polite">
        {instrument ? `${instrument.label}: ${instrument.note}` : "Tap an instrument to hear it."}
      </p>
      <p className={styles.hint}>
        These are synthesized in your browser — no recordings, no downloads.
      </p>
    </div>
  );
}
