import { useMemo, useState } from "react";
import { playDiyaChime } from "../../lib/chime";
import { shuffle } from "../../lib/lab";
import {
  BINGO_LINES,
  BINGO_PROMPTS,
  buildWordSearch,
  pathBetween,
  pathMatches,
} from "../../lib/puzzles";
import { CopyButton } from "./Shared";
import styles from "../LightLab.module.scss";

const cellKey = (row, col) => `${row}-${col}`;

export function WordSearch() {
  const [puzzle, setPuzzle] = useState(buildWordSearch);
  const [start, setStart] = useState(null);
  const [found, setFound] = useState([]);
  const [message, setMessage] = useState("Tap the first letter, then the last.");

  const foundCells = useMemo(() => {
    const cells = new Set();
    puzzle.placements
      .filter((placement) => found.includes(placement.word))
      .forEach((placement) => {
        placement.cells.forEach(([row, col]) => cells.add(cellKey(row, col)));
      });
    return cells;
  }, [found, puzzle]);

  const choose = (row, col) => {
    if (!start) {
      setStart([row, col]);
      setMessage("Now tap the last letter of the word.");
      return;
    }

    const path = pathBetween(start, [row, col]);
    if (!path) {
      setStart([row, col]);
      setMessage("Words run in a straight line. Start again from here.");
      return;
    }

    const hit = puzzle.placements.find(
      (placement) => !found.includes(placement.word) && pathMatches(placement, path)
    );

    if (hit) {
      const next = [...found, hit.word];
      setFound(next);
      playDiyaChime(next.length);
      setMessage(
        next.length === puzzle.placements.length
          ? "Every word found. The grid is all light."
          : `${hit.word} found. ${next.length} of ${puzzle.placements.length}.`
      );
    } else {
      setMessage("Not a word this time. Try another line.");
    }

    setStart(null);
  };

  const reset = () => {
    setPuzzle(buildWordSearch());
    setStart(null);
    setFound([]);
    setMessage("Tap the first letter, then the last.");
  };

  return (
    <div className={styles.feature}>
      <div className={styles.quizTop}>
        <span>
          {found.length} of {puzzle.placements.length} words
        </span>
        <span>Across or down</span>
      </div>
      <div className={styles.progressTrack} aria-hidden="true">
        <span
          className={styles.progressFill}
          style={{ width: `${(found.length / puzzle.placements.length) * 100}%` }}
        />
      </div>

      <div
        className={styles.wordSearchGrid}
        role="group"
        aria-label="Festival word search grid"
      >
        {puzzle.grid.map((row, rowIndex) =>
          row.map((letter, colIndex) => {
            const key = cellKey(rowIndex, colIndex);
            const isFound = foundCells.has(key);
            const isStart = start?.[0] === rowIndex && start?.[1] === colIndex;
            return (
              <button
                key={key}
                type="button"
                className={`${styles.wordSearchCell} ${
                  isFound ? styles.wordSearchCellFound : ""
                } ${isStart ? styles.wordSearchCellStart : ""}`}
                onClick={() => choose(rowIndex, colIndex)}
                aria-pressed={isFound}
                aria-label={`Row ${rowIndex + 1}, column ${colIndex + 1}: ${letter}${
                  isFound ? ", found" : ""
                }`}
              >
                {letter}
              </button>
            );
          })
        )}
      </div>

      <ul className={styles.wordSearchWords}>
        {puzzle.placements.map(({ word }) => (
          <li
            key={word}
            className={`${styles.wordSearchWord} ${
              found.includes(word) ? styles.wordSearchWordFound : ""
            }`}
          >
            {word}
          </li>
        ))}
      </ul>

      <p className={styles.resultLine} aria-live="polite">
        {message}
      </p>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={reset}>
          New grid
          <span aria-hidden="true">✦</span>
        </button>
        <span className={styles.hint}>Find all six words to fill the grid.</span>
      </div>
    </div>
  );
}

export function DiwaliBingo() {
  const [card, setCard] = useState(() => shuffle(BINGO_PROMPTS).slice(0, 16));
  const [marked, setMarked] = useState([]);

  const completed = BINGO_LINES.filter((line) =>
    line.every((index) => marked.includes(index))
  );

  const toggle = (index) => {
    setMarked((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
  };

  const reset = () => {
    setCard(shuffle(BINGO_PROMPTS).slice(0, 16));
    setMarked([]);
  };

  const textCard = `Diwali bingo\n\n${card
    .map((prompt, index) => `${marked.includes(index) ? "✓" : "•"} ${prompt}`)
    .join("\n")}`;

  return (
    <div className={styles.feature}>
      <div className={styles.gameHud}>
        <span>
          <strong>{marked.length}</strong> / 16 marked
        </span>
        <span>
          <strong>{completed.length}</strong>{" "}
          {completed.length === 1 ? "line" : "lines"}
        </span>
      </div>

      <div className={styles.bingoGrid} role="group" aria-label="Diwali bingo card">
        {card.map((prompt, index) => {
          const isMarked = marked.includes(index);
          return (
            <button
              key={`${prompt}-${index}`}
              type="button"
              className={`${styles.bingoCell} ${
                isMarked ? styles.bingoCellMarked : ""
              }`}
              onClick={() => toggle(index)}
              aria-pressed={isMarked}
            >
              <span className={styles.bingoMark} aria-hidden="true">
                {isMarked ? "✦" : ""}
              </span>
              {prompt}
            </button>
          );
        })}
      </div>

      <p className={styles.resultLine} aria-live="polite">
        {marked.length === 16
          ? "Every square marked. A very full festival."
          : completed.length > 0
            ? `${completed.length} ${completed.length === 1 ? "line" : "lines"} — bingo. Keep going.`
            : "Mark a square each time you do the small thing."}
      </p>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={reset}>
          New card
          <span aria-hidden="true">✦</span>
        </button>
        <CopyButton text={textCard} label="Copy the card" />
        <span className={styles.hint}>Four in a row, across, down or diagonal.</span>
      </div>
    </div>
  );
}
