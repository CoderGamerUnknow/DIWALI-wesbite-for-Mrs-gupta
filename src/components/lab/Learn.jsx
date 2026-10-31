import { useState } from "react";
import {
  ECO_TASKS,
  FACTS,
  FIVE_DAYS,
  MITHAI_QUESTIONS,
  MITHAI_RESULTS,
  SHLOKAS,
  TRIVIA,
  WORDS,
  WORLD_FACTS,
} from "../../const/lab";
import { useStoredState } from "../../lib/lab";
import styles from "../LightLab.module.scss";

export function Trivia() {
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const question = TRIVIA[step];

  const choose = (index) => {
    if (chosen !== null) return;
    setChosen(index);
    if (index === question.answer) setScore((value) => value + 1);
  };

  const next = () => {
    if (step + 1 >= TRIVIA.length) {
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
          {score} <span>/ {TRIVIA.length}</span>
        </p>
        <p className={styles.resultLine}>
          {score === TRIVIA.length
            ? "Every lamp accounted for. You know your festival."
            : score >= 3
              ? "A well-lit score. A few corners of the story still to explore."
              : "The festival has more to tell you. Try again — the diyas are patient."}
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
          Question {step + 1} of {TRIVIA.length}
        </span>
        <span>{score} correct</span>
      </div>
      <div className={styles.progressTrack} aria-hidden="true">
        <span
          className={styles.progressFill}
          style={{ width: `${(step / TRIVIA.length) * 100}%` }}
        />
      </div>

      <h4 className={styles.quizQuestion}>{question.question}</h4>

      <div className={styles.optionList}>
        {question.options.map((option, index) => {
          const isChosen = chosen === index;
          const isCorrect = index === question.answer;
          const showAnswer = chosen !== null;
          return (
            <button
              key={option}
              type="button"
              className={`${styles.option} ${showAnswer && isCorrect ? styles.optionCorrect : ""} ${
                showAnswer && isChosen && !isCorrect ? styles.optionWrong : ""
              }`}
              onClick={() => choose(index)}
              disabled={showAnswer}
              aria-pressed={isChosen}
            >
              <span className={styles.optionLetter}>
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      <div className={styles.feedbackRow} aria-live="polite">
        <p className={styles.feedback}>
          {chosen === null
            ? "Pick the answer that feels right."
            : chosen === question.answer
              ? `Correct. ${question.note}`
              : `Not quite. ${question.note}`}
        </p>
        {chosen !== null && (
          <button type="button" className={styles.primaryButton} onClick={next}>
            {step + 1 === TRIVIA.length ? "See the score" : "Next question"}
          </button>
        )}
      </div>
    </div>
  );
}

export function FactCarousel() {
  const [index, setIndex] = useState(0);
  const fact = FACTS[index];

  const move = (direction) => {
    setIndex((value) => (value + direction + FACTS.length) % FACTS.length);
  };

  return (
    <div className={styles.feature}>
      <div className={styles.factCard}>
        <span className={styles.factIndex}>
          {String(index + 1).padStart(2, "0")} / {String(FACTS.length).padStart(2, "0")}
        </span>
        <h4 className={styles.factTitle}>{fact.title}</h4>
        <p className={styles.factText}>{fact.text}</p>
      </div>

      <div className={styles.carouselControls}>
        <button type="button" className={styles.miniButton} onClick={() => move(-1)}>
          ← Previous
        </button>
        <div className={styles.dotNav}>
          {FACTS.map((item, dot) => (
            <button
              key={item.title}
              type="button"
              className={`${styles.dot} ${dot === index ? styles.dotActive : ""}`}
              onClick={() => setIndex(dot)}
              aria-label={`Fact ${dot + 1}`}
              aria-pressed={dot === index}
            />
          ))}
        </div>
        <button type="button" className={styles.miniButton} onClick={() => move(1)}>
          Next →
        </button>
      </div>
    </div>
  );
}

export function WordCards() {
  const [flipped, setFlipped] = useState(() => WORDS.map(() => false));

  const toggle = (index) => {
    setFlipped((current) => current.map((value, i) => (i === index ? !value : value)));
  };

  return (
    <div className={styles.feature}>
      <div className={styles.wordGrid}>
        {WORDS.map((word, index) => (
          <button
            key={word.hindi}
            type="button"
            className={`${styles.wordCard} ${flipped[index] ? styles.wordOpen : ""}`}
            onClick={() => toggle(index)}
            aria-pressed={flipped[index]}
          >
            {flipped[index] ? (
              <>
                <span className={`${styles.wordHindi} hindi`} lang="hi">
                  {word.hindi}
                </span>
                <span className={styles.wordMeaning}>{word.meaning}</span>
              </>
            ) : (
              <>
                <span className={styles.wordRoman}>{word.roman}</span>
                <span className={styles.wordPrompt}>Tap to flip</span>
              </>
            )}
          </button>
        ))}
      </div>
      <p className={styles.hint}>Six small words that make the festival.</p>
    </div>
  );
}

export function MithaiMatch() {
  const [answers, setAnswers] = useState([]);
  const step = answers.length;
  const finished = step >= MITHAI_QUESTIONS.length;

  let winner = "ladoo";
  if (finished) {
    let best = -1;
    Object.keys(MITHAI_RESULTS).forEach((key) => {
      const count = answers.filter((answer) => answer === key).length;
      if (count > best) {
        best = count;
        winner = key;
      }
    });
  }

  const result = MITHAI_RESULTS[winner];

  if (finished) {
    return (
      <div className={styles.feature}>
        <div className={`${styles.mithaiResult} ${styles.stageGlow}`}>
          <span className={styles.mithaiGlyph} aria-hidden="true">
            ✿
          </span>
          <p className={styles.mithaiKicker}>You are</p>
          <h4 className={styles.mithaiName}>{result.name}</h4>
          <p className={styles.mithaiLine}>{result.line}</p>
          <p className={styles.bodyCopy}>{result.text}</p>
        </div>
        <div className={styles.row}>
          <button type="button" className={styles.primaryButton} onClick={() => setAnswers([])}>
            Take the quiz again
          </button>
          <span className={styles.hint}>No wrong answers, only different sweets.</span>
        </div>
      </div>
    );
  }

  const question = MITHAI_QUESTIONS[step];

  return (
    <div className={styles.feature}>
      <div className={styles.quizTop}>
        <span>
          Question {step + 1} of {MITHAI_QUESTIONS.length}
        </span>
        <span>Which mithai?</span>
      </div>
      <div className={styles.progressTrack} aria-hidden="true">
        <span
          className={styles.progressFill}
          style={{ width: `${(step / MITHAI_QUESTIONS.length) * 100}%` }}
        />
      </div>

      <h4 className={styles.quizQuestion}>{question.question}</h4>

      <div className={styles.optionList}>
        {question.options.map((option) => (
          <button
            key={option.label}
            type="button"
            className={styles.option}
            onClick={() => setAnswers((current) => [...current, option.sweet])}
          >
            <span className={styles.optionLetter} aria-hidden="true">
              ✦
            </span>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function WorldTour() {
  const [active, setActive] = useState(0);
  const place = WORLD_FACTS[active];

  return (
    <div className={styles.feature}>
      <div className={styles.worldList} role="group" aria-label="Places that celebrate Diwali">
        {WORLD_FACTS.map((item, index) => (
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
        <span className={styles.worldPin} aria-hidden="true">
          ✦
        </span>
        <div>
          <h4>{place.place}</h4>
          <p>{place.fact}</p>
        </div>
      </div>

      <p className={styles.hint}>
        One festival, many front doors. These are five of them.
      </p>
    </div>
  );
}

export function EcoChecklist() {
  const [checked, setChecked] = useStoredState("eco", ECO_TASKS.map(() => false));
  const safeChecked = ECO_TASKS.map((_, index) => Boolean(checked?.[index]));
  const count = safeChecked.filter(Boolean).length;

  const toggle = (index) => {
    setChecked((current) => {
      const next = ECO_TASKS.map((_, item) => Boolean(current?.[item]));
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <div className={styles.feature}>
      <div className={styles.quizTop}>
        <span>
          {count} of {ECO_TASKS.length} promises
        </span>
        <span>{count === ECO_TASKS.length ? "Beautifully done" : "Small is enough"}</span>
      </div>
      <div className={styles.progressTrack} aria-hidden="true">
        <span
          className={styles.progressFill}
          style={{ width: `${(count / ECO_TASKS.length) * 100}%` }}
        />
      </div>

      <div className={styles.checkList}>
        {ECO_TASKS.map((task, index) => (
          <button
            key={task}
            type="button"
            className={`${styles.checkItem} ${safeChecked[index] ? styles.checkDone : ""}`}
            onClick={() => toggle(index)}
            aria-pressed={safeChecked[index]}
          >
            <span className={styles.checkMark} aria-hidden="true">
              {safeChecked[index] ? "✓" : ""}
            </span>
            {task}
          </button>
        ))}
      </div>

      <p className={styles.hint}>
        Your ticks are remembered in this browser. Reset any time.
      </p>
    </div>
  );
}

export function FiveDays() {
  const [active, setActive] = useState(0);
  const day = FIVE_DAYS[active];

  return (
    <div className={styles.feature}>
      <ol className={styles.dayList}>
        {FIVE_DAYS.map((item, index) => (
          <li key={item.name}>
            <button
              type="button"
              className={`${styles.dayButton} ${index === active ? styles.dayActive : ""}`}
              onClick={() => setActive(index)}
              aria-pressed={index === active}
            >
              <span className={styles.dayNumber}>{String(index + 1).padStart(2, "0")}</span>
              <span>
                <strong>{item.name}</strong>
                <small>{item.sub}</small>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className={styles.dayPanel} aria-live="polite">
        <span className={styles.dayPanelLabel}>{day.sub}</span>
        <h4>{day.name}</h4>
        <p>{day.text}</p>
      </div>
    </div>
  );
}

export function Shlokas() {
  const [revealed, setRevealed] = useState(() => SHLOKAS.map(() => false));

  const toggle = (index) => {
    setRevealed((current) => current.map((value, i) => (i === index ? !value : value)));
  };

  return (
    <div className={styles.feature}>
      <div className={styles.shlokaList}>
        {SHLOKAS.map((shloka, index) => (
          <div className={styles.shlokaCard} key={shloka.hindi}>
            <p className={`${styles.shlokaHindi} hindi`} lang="hi">
              {shloka.hindi}
            </p>
            <p className={styles.shlokaTranslit}>{shloka.translit}</p>
            {revealed[index] ? (
              <p className={styles.shlokaMeaning} aria-live="polite">
                {shloka.meaning}
                <span className={styles.shlokaSource}>{shloka.source}</span>
              </p>
            ) : (
              <button
                type="button"
                className={styles.miniButton}
                onClick={() => toggle(index)}
              >
                Reveal the meaning
              </button>
            )}
          </div>
        ))}
      </div>
      <p className={styles.hint}>Old lines, still warm. No chanting required.</p>
    </div>
  );
}
