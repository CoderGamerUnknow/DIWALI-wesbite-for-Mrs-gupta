import { useEffect, useRef, useState } from "react";
import { playDiyaChime } from "../../lib/chime";
import { shuffle, useStoredState } from "../../lib/lab";
import { RIDDLES, SCRAMBLE_WORDS } from "../../const/lab2";
import { Diya } from "../Diya";
import styles from "../LightLab.module.scss";

const SIMON_PETALS = [
  { label: "Marigold", color: "#f0a23a" },
  { label: "Rose", color: "#ff8fb1" },
  { label: "Mint", color: "#7ce0c3" },
  { label: "Lotus", color: "#c9a2ff" },
  { label: "Gold", color: "#f4c95d" },
  { label: "Sky", color: "#8fd6ff" },
];

export function RangoliSimon() {
  const [sequence, setSequence] = useState([]);
  const [phase, setPhase] = useState("idle");
  const [inputIndex, setInputIndex] = useState(0);
  const [active, setActive] = useState(null);
  const [best, setBest] = useStoredState("simon-best", 0);
  const timersRef = useRef([]);

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    },
    []
  );

  const clearTimers = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
  };

  const flash = (seq) => {
    clearTimers();
    setPhase("showing");
    setActive(null);
    seq.forEach((petal, index) => {
      timersRef.current.push(
        window.setTimeout(() => {
          setActive(petal);
          playDiyaChime(petal);
        }, 560 * index + 300)
      );
      timersRef.current.push(
        window.setTimeout(() => setActive(null), 560 * index + 700)
      );
    });
    timersRef.current.push(
      window.setTimeout(() => {
        setPhase("input");
        setInputIndex(0);
      }, 560 * seq.length + 480)
    );
  };

  const start = () => {
    const next = [Math.floor(Math.random() * SIMON_PETALS.length)];
    setSequence(next);
    flash(next);
  };

  const hit = (petal) => {
    if (phase !== "input") return;

    if (sequence[inputIndex] !== petal) {
      setPhase("lost");
      setActive(petal);
      playDiyaChime(0);
      timersRef.current.push(window.setTimeout(() => setActive(null), 360));
      timersRef.current.push(
        window.setTimeout(() => {
          setPhase("idle");
          setSequence([]);
        }, 1200)
      );
      return;
    }

    playDiyaChime(petal);
    setActive(petal);
    timersRef.current.push(window.setTimeout(() => setActive(null), 260));

    const nextIndex = inputIndex + 1;
    if (nextIndex === sequence.length) {
      setBest((value) => Math.max(value, sequence.length));
      const nextSequence = [...sequence, Math.floor(Math.random() * SIMON_PETALS.length)];
      setSequence(nextSequence);
      setPhase("showing");
      timersRef.current.push(
        window.setTimeout(() => flash(nextSequence), 520)
      );
    } else {
      setInputIndex(nextIndex);
    }
  };

  return (
    <div className={styles.feature}>
      <div className={styles.gameHud}>
        <span>
          <strong>{Math.max(0, sequence.length - 1)}</strong> petals remembered
        </span>
        <span>
          Best <strong>{best}</strong>
        </span>
      </div>

      <div className={styles.simonStage}>
        {SIMON_PETALS.map((petal, index) => (
          <button
            key={petal.label}
            type="button"
            className={`${styles.simonPetal} ${
              active === index ? styles.simonPetalActive : ""
            }`}
            style={{
              "--petal-color": petal.color,
              transform: `rotate(${index * 60}deg) translateY(-7rem)`,
            }}
            onClick={() => hit(index)}
            disabled={phase === "showing" || phase === "lost"}
            aria-label={petal.label}
          >
            <span aria-hidden="true" />
          </button>
        ))}
        <span className={styles.simonHub} aria-hidden="true">
          ✺
        </span>
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={start}>
          {phase === "idle" ? "Start the pattern" : "Start again"}
        </button>
        <span className={styles.hint} aria-live="polite">
          {phase === "idle" && "The rangoli will blink a pattern. Repeat it."}
          {phase === "showing" && "Watch the petals…"}
          {phase === "input" && "Your turn. Repeat the pattern."}
          {phase === "lost" && "A petal out of place. Try again."}
        </span>
      </div>
    </div>
  );
}

const FLY_DURATION = 15;

const makeFlies = () =>
  Array.from({ length: 6 }, (_, index) => ({
    id: index,
    left: 8 + Math.random() * 80,
    top: 10 + Math.random() * 70,
  }));

export function FireflyJar() {
  const [phase, setPhase] = useState("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(FLY_DURATION);
  const [flies, setFlies] = useState(makeFlies);
  const [best, setBest] = useStoredState("firefly-best", 0);

  useEffect(() => {
    if (phase !== "playing") return undefined;
    const timer = window.setInterval(
      () => setTimeLeft((value) => Math.max(0, value - 1)),
      1000
    );
    const mover = window.setInterval(() => {
      setFlies((current) =>
        current.map((fly) => ({
          ...fly,
          left: 6 + Math.random() * 84,
          top: 8 + Math.random() * 74,
        }))
      );
    }, 760);
    return () => {
      window.clearInterval(timer);
      window.clearInterval(mover);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing" || timeLeft > 0) return;
    setPhase("done");
    setBest((value) => Math.max(value, score));
  }, [phase, timeLeft, score, setBest]);

  const start = () => {
    setScore(0);
    setTimeLeft(FLY_DURATION);
    setFlies(makeFlies());
    setPhase("playing");
  };

  const catchFly = (id) => {
    if (phase !== "playing") return;
    setScore((value) => {
      const next = value + 1;
      if (next % 4 === 0) playDiyaChime(next % 5);
      return next;
    });
    setFlies((current) =>
      current.map((fly) =>
        fly.id === id
          ? { ...fly, left: 6 + Math.random() * 84, top: 8 + Math.random() * 74 }
          : fly
      )
    );
  };

  return (
    <div className={styles.feature}>
      <div className={styles.gameHud}>
        <span>
          <strong>{String(timeLeft).padStart(2, "0")}</strong> seconds
        </span>
        <span>
          <strong>{score}</strong> fireflies
        </span>
        <span>
          Best <strong>{best}</strong>
        </span>
      </div>

      <div className={styles.fireflyField}>
        <span className={styles.catchMoon} aria-hidden="true" />
        {flies.map((fly) => (
          <button
            key={fly.id}
            type="button"
            className={styles.firefly}
            style={{ left: `${fly.left}%`, top: `${fly.top}%` }}
            onClick={() => catchFly(fly.id)}
            aria-label="Catch a firefly"
          />
        ))}
        {phase !== "playing" && (
          <p className={styles.overlayMessage}>
            {phase === "idle"
              ? "Fifteen seconds. Fill the jar with little lights."
              : `${score} caught. ${score >= best ? "A new best." : "The jar is glowing."}`}
          </p>
        )}
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={start}>
          {phase === "idle" ? "Open the jar" : phase === "playing" ? "Restart" : "Play again"}
          <span aria-hidden="true">✦</span>
        </button>
        <span className={styles.hint}>Tap each firefly before it drifts away.</span>
      </div>
    </div>
  );
}

const PUZZLE_NEIGHBOURS = (index) => {
  const row = Math.floor(index / 3);
  const column = index % 3;
  const neighbours = [];
  if (row > 0) neighbours.push(index - 3);
  if (row < 2) neighbours.push(index + 3);
  if (column > 0) neighbours.push(index - 1);
  if (column < 2) neighbours.push(index + 1);
  return neighbours;
};

const makePuzzle = () => {
  const board = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  let blank = 8;
  for (let step = 0; step < 90; step += 1) {
    const options = PUZZLE_NEIGHBOURS(blank);
    const pick = options[Math.floor(Math.random() * options.length)];
    [board[blank], board[pick]] = [board[pick], board[blank]];
    blank = pick;
  }
  return board;
};

export function SlidingPuzzle() {
  const [tiles, setTiles] = useState(makePuzzle);
  const [moves, setMoves] = useState(0);
  const solved = tiles.every((value, index) => value === (index === 8 ? 0 : index + 1));

  const slide = (index) => {
    if (solved) return;
    const blank = tiles.indexOf(0);
    if (!PUZZLE_NEIGHBOURS(blank).includes(index)) return;
    const next = [...tiles];
    [next[blank], next[index]] = [next[index], next[blank]];
    setTiles(next);
    setMoves((value) => value + 1);
    playDiyaChime(index % 5);
  };

  const reset = () => {
    setTiles(makePuzzle());
    setMoves(0);
  };

  return (
    <div className={styles.feature}>
      <div className={styles.gameHud}>
        <span>
          <strong>{moves}</strong> moves
        </span>
        <span>{solved ? "All lamps in order" : "Eight lamps, one empty space"}</span>
      </div>

      <div className={`${styles.puzzleGrid} ${solved ? styles.puzzleSolved : ""}`}>
        {tiles.map((tile, index) => (
          <button
            key={index}
            type="button"
            className={`${styles.puzzleTile} ${tile === 0 ? styles.puzzleBlank : ""}`}
            onClick={() => slide(index)}
            disabled={tile === 0 || solved}
            aria-label={tile === 0 ? "Empty space" : `Lamp ${tile}`}
          >
            {tile !== 0 && (
              <>
                <span className={styles.puzzleFlame} aria-hidden="true">✦</span>
                {tile}
              </>
            )}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={reset}>
          {solved ? "Shuffle again" : "New puzzle"}
        </button>
        <span className={styles.hint} aria-live="polite">
          {solved ? `Solved in ${moves} moves.` : "Slide a lamp into the empty square."}
        </span>
      </div>
    </div>
  );
}

export function FlameToss() {
  const [phase, setPhase] = useState("idle");
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");
  const markerRef = useRef(null);
  const positionRef = useRef(50);
  const rafRef = useRef(0);

  useEffect(() => () => window.cancelAnimationFrame(rafRef.current), []);

  const start = () => {
    window.cancelAnimationFrame(rafRef.current);
    setPhase("playing");
    setMessage("");
    const started = performance.now();
    const loop = (time) => {
      const position = 50 + 46 * Math.sin((time - started) / 520);
      positionRef.current = position;
      if (markerRef.current) markerRef.current.style.left = `${position}%`;
      rafRef.current = window.requestAnimationFrame(loop);
    };
    rafRef.current = window.requestAnimationFrame(loop);
  };

  const toss = () => {
    if (phase !== "playing") return;
    window.cancelAnimationFrame(rafRef.current);
    const won = Math.abs(positionRef.current - 50) <= 12;
    setPhase("result");
    setAttempts((value) => value + 1);
    if (won) {
      setScore((value) => value + 1);
      setMessage("In the bowl. A clean little landing.");
      playDiyaChime(4);
    } else {
      setMessage(positionRef.current < 50 ? "A little too far left." : "A little too far right.");
      playDiyaChime(0);
    }
  };

  const action = phase === "playing" ? toss : start;

  return (
    <div className={styles.feature}>
      <div className={styles.gameHud}>
        <span>
          <strong>{score}</strong> landings
        </span>
        <span>
          <strong>{attempts}</strong> tosses
        </span>
      </div>

      <div className={styles.tossStage}>
        <div className={styles.tossTrack}>
          <span className={styles.tossZone} aria-hidden="true" />
          <span ref={markerRef} className={styles.tossMarker}>
            <Diya lit />
          </span>
        </div>
        <p className={styles.resultLine} aria-live="polite">
          {message || "Send the little lamp into the bright band."}
        </p>
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={action}>
          {phase === "idle" ? "Begin the swing" : phase === "playing" ? "Toss now" : "Toss again"}
          <span aria-hidden="true">✦</span>
        </button>
        <span className={styles.hint}>The centre of the band is the sweet spot.</span>
      </div>
    </div>
  );
}

const makePool = (word) =>
  shuffle(word.split("")).map((letter, index) => ({
    id: `${index}-${letter}`,
    letter,
  }));

export function WordScramble() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState([]);
  const [pool, setPool] = useState(() => makePool(SCRAMBLE_WORDS[0].answer));
  const [status, setStatus] = useState("");
  const [solved, setSolved] = useState(0);
  const [finished, setFinished] = useState(false);
  const word = SCRAMBLE_WORDS[round];

  const take = (letter) => {
    if (selected.length >= word.answer.length) return;
    setSelected((current) => [...current, letter]);
    setPool((current) => current.filter((item) => item.id !== letter.id));
    setStatus("");
  };

  const putBack = (letter) => {
    setSelected((current) => current.filter((item) => item.id !== letter.id));
    setPool((current) => [...current, letter]);
    setStatus("");
  };

  const check = () => {
    if (selected.map((letter) => letter.letter).join("") === word.answer) {
      setSolved((value) => value + 1);
      if (round + 1 >= SCRAMBLE_WORDS.length) {
        setFinished(true);
        setStatus("All six words unwound.");
      } else {
        const nextRound = round + 1;
        setRound(nextRound);
        setSelected([]);
        setPool(makePool(SCRAMBLE_WORDS[nextRound].answer));
        setStatus("Correct. Here is another.");
        playDiyaChime(round % 5);
      }
    } else {
      setStatus("Not quite — try another order.");
    }
  };

  const restart = () => {
    setRound(0);
    setSelected([]);
    setPool(makePool(SCRAMBLE_WORDS[0].answer));
    setStatus("");
    setSolved(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className={`${styles.feature} ${styles.centerFeature}`}>
        <p className={styles.bigScore}>
          {solved} <span>/ {SCRAMBLE_WORDS.length}</span>
        </p>
        <p className={styles.resultLine}>Every word found its shape again.</p>
        <button type="button" className={styles.primaryButton} onClick={restart}>
          Scramble them again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.feature}>
      <div className={styles.quizTop}>
        <span>
          Word {round + 1} of {SCRAMBLE_WORDS.length}
        </span>
        <span>{word.hint}</span>
      </div>
      <div className={styles.progressTrack} aria-hidden="true">
        <span className={styles.progressFill} style={{ width: `${(round / SCRAMBLE_WORDS.length) * 100}%` }} />
      </div>

      <div className={styles.scrambleSlots} aria-live="polite">
        {Array.from({ length: word.answer.length }, (_, index) => {
          const letter = selected[index];
          return letter ? (
            <button
              key={index}
              type="button"
              className={styles.scrambleSlot}
              onClick={() => putBack(letter)}
              aria-label={`Remove ${letter.letter}`}
            >
              {letter.letter}
            </button>
          ) : (
            <span key={index} className={`${styles.scrambleSlot} ${styles.scrambleEmpty}`} />
          );
        })}
      </div>

      <div className={styles.scramblePool}>
        {pool.map((letter) => (
          <button
            key={letter.id}
            type="button"
            className={styles.scrambleLetter}
            onClick={() => take(letter)}
            aria-label={`Add ${letter.letter}`}
          >
            {letter.letter}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={check}
          disabled={selected.length !== word.answer.length}
        >
          Check the word
        </button>
        <button type="button" className={styles.miniButton} onClick={restart}>
          Start over
        </button>
        <span className={styles.hint} aria-live="polite">
          {status || "Tap the letters in the right order."}
        </span>
      </div>
    </div>
  );
}

const ODD_COUNT = 16;
const ODD_SECONDS = 20;

export function OddDiya() {
  const [phase, setPhase] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(ODD_SECONDS);
  const [score, setScore] = useState(0);
  const [odd, setOdd] = useState(0);
  const [message, setMessage] = useState("");
  const [best, setBest] = useStoredState("odd-best", 0);

  useEffect(() => {
    if (phase !== "playing") return undefined;
    const timer = window.setInterval(
      () => setTimeLeft((value) => Math.max(0, value - 1)),
      1000
    );
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing" || timeLeft > 0) return;
    setPhase("done");
    setBest((value) => Math.max(value, score));
  }, [phase, timeLeft, score, setBest]);

  const newOdd = () => setOdd(Math.floor(Math.random() * ODD_COUNT));

  const start = () => {
    setScore(0);
    setTimeLeft(ODD_SECONDS);
    setPhase("playing");
    setMessage("");
    newOdd();
  };

  const pick = (index) => {
    if (phase !== "playing") return;
    if (index === odd) {
      setScore((value) => value + 1);
      setMessage("Found it. Here is another.");
      setOdd(Math.floor(Math.random() * ODD_COUNT));
      playDiyaChime(score % 5);
    } else {
      setTimeLeft((value) => Math.max(0, value - 2));
      setMessage("Not that one. Two seconds gone.");
    }
  };

  return (
    <div className={styles.feature}>
      <div className={styles.gameHud}>
        <span>
          <strong>{String(timeLeft).padStart(2, "0")}</strong> seconds
        </span>
        <span>
          <strong>{score}</strong> found
        </span>
        <span>
          Best <strong>{best}</strong>
        </span>
      </div>

      <div className={styles.oddGrid}>
        {Array.from({ length: ODD_COUNT }, (_, index) => (
          <button
            key={index}
            type="button"
            className={styles.oddTile}
            onClick={() => pick(index)}
            disabled={phase !== "playing"}
            aria-label={`Diya ${index + 1}`}
          >
            <span style={index === odd ? { filter: "hue-rotate(42deg) brightness(1.16)", transform: "rotate(-7deg)" } : undefined}>
              <Diya lit />
            </span>
          </button>
        ))}
        {phase !== "playing" && (
          <p className={styles.overlayMessage}>
            {phase === "idle"
              ? "One flame is not like the others. Twenty seconds."
              : `${score} found. ${score >= best ? "A new best." : "A good eye."}`}
          </p>
        )}
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={start}>
          {phase === "idle" ? "Start looking" : phase === "playing" ? "Restart" : "Look again"}
          <span aria-hidden="true">✦</span>
        </button>
        <span className={styles.hint} aria-live="polite">
          {message || "A wrong tap costs two seconds."}
        </span>
      </div>
    </div>
  );
}

export function Riddles() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const riddle = RIDDLES[index];

  const next = () => {
    setIndex((value) => (value + 1) % RIDDLES.length);
    setRevealed(false);
  };

  return (
    <div className={styles.feature}>
      <div className={styles.factCard}>
        <span className={styles.factIndex}>
          Riddle {String(index + 1).padStart(2, "0")} / {String(RIDDLES.length).padStart(2, "0")}
        </span>
        <h4 className={styles.factTitle}>{riddle.question}</h4>
        {revealed ? (
          <p className={styles.factText} aria-live="polite">
            <strong>Answer:</strong> {riddle.answer}
          </p>
        ) : (
          <button type="button" className={styles.miniButton} onClick={() => setRevealed(true)}>
            Reveal the answer
          </button>
        )}
      </div>

      <div className={styles.carouselControls}>
        <button type="button" className={styles.miniButton} onClick={next}>
          Another riddle →
        </button>
        <div className={styles.dotNav}>
          {RIDDLES.map((item, dot) => (
            <button
              key={item.question}
              type="button"
              className={`${styles.dot} ${dot === index ? styles.dotActive : ""}`}
              onClick={() => {
                setIndex(dot);
                setRevealed(false);
              }}
              aria-label={`Riddle ${dot + 1}`}
              aria-pressed={dot === index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const TTT_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const tttOutcome = (board) => {
  for (const [a, b, c] of TTT_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return board.every(Boolean) ? "draw" : null;
};

const tttWinningMove = (board, mark) => {
  for (const [a, b, c] of TTT_LINES) {
    const values = [board[a], board[b], board[c]];
    if (values.filter((value) => value === mark).length === 2) {
      const empty = [a, b, c][values.indexOf(null)];
      if (empty !== undefined) return empty;
    }
  }
  return -1;
};

const tttComputerMove = (board) => {
  const winning = tttWinningMove(board, "flower");
  if (winning >= 0) return winning;
  const blocking = tttWinningMove(board, "diya");
  if (blocking >= 0) return blocking;
  if (!board[4]) return 4;
  const corners = [0, 2, 6, 8].filter((index) => !board[index]);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  const empty = board.map((value, index) => (value ? -1 : index)).filter((index) => index >= 0);
  return empty.length ? empty[Math.floor(Math.random() * empty.length)] : -1;
};

export function DiyaTicTacToe() {
  const [board, setBoard] = useState(() => Array(9).fill(null));
  const [turn, setTurn] = useState("diya");
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (turn !== "flower" || result) return undefined;
    const timer = window.setTimeout(() => {
      const move = tttComputerMove(board);
      if (move < 0) {
        setResult("draw");
        return;
      }
      const next = [...board];
      next[move] = "flower";
      const winner = tttOutcome(next);
      setBoard(next);
      if (winner) setResult(winner);
      else setTurn("diya");
    }, 520);
    return () => window.clearTimeout(timer);
  }, [board, result, turn]);

  const play = (index) => {
    if (board[index] || result || turn !== "diya") return;
    const next = [...board];
    next[index] = "diya";
    const winner = tttOutcome(next);
    setBoard(next);
    if (winner) setResult(winner);
    else setTurn("flower");
    playDiyaChime(index % 5);
  };

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn("diya");
    setResult(null);
  };

  return (
    <div className={styles.feature}>
      <div className={styles.gameHud}>
        <span>
          <strong>✦</strong> you
        </span>
        <span>
          <strong>✿</strong> the lamp
        </span>
      </div>

      <div className={styles.tttGrid}>
        {board.map((cell, index) => (
          <button
            key={index}
            type="button"
            className={styles.tttCell}
            onClick={() => play(index)}
            disabled={Boolean(cell) || Boolean(result) || turn !== "diya"}
            aria-label={`Square ${index + 1}${cell ? `, ${cell}` : ", empty"}`}
          >
            {cell === "diya" && <Diya lit />}
            {cell === "flower" && <span className={styles.tttFlower} aria-hidden="true">✿</span>}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={reset}>
          {result ? "Play again" : "Start over"}
        </button>
        <span className={styles.hint} aria-live="polite">
          {result === "diya" && "You win. The flame stays with you."}
          {result === "flower" && "The marigold wins this one."}
          {result === "draw" && "A draw — both lights keep their place."}
          {!result && (turn === "diya" ? "Your turn: place a diya." : "The marigold is thinking…")}
        </span>
      </div>
    </div>
  );
}
