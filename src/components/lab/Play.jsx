import { useEffect, useRef, useState } from "react";
import { playDiyaChime } from "../../lib/chime";
import { pad, shuffle, useStoredState } from "../../lib/lab";
import { WHEEL } from "../../const/lab";
import { Diya } from "../Diya";
import { SparkPad } from "./Shared";
import styles from "../LightLab.module.scss";

const DURATION = 15;
const MEMORY_SYMBOLS = ["✦", "❖", "✺", "✹", "✿", "❋"];

const buildDeck = () =>
  shuffle(
    MEMORY_SYMBOLS.flatMap((symbol) => [
      { id: `${symbol}-a`, symbol },
      { id: `${symbol}-b`, symbol },
    ])
  );

export function TapSprint() {
  const [phase, setPhase] = useState("idle");
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [best, setBest] = useStoredState("tap-best", 0);

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
    setBest((value) => Math.max(value, taps));
  }, [phase, timeLeft, taps, setBest]);

  const start = () => {
    setTaps(0);
    setTimeLeft(DURATION);
    setPhase("playing");
  };

  const tap = () => {
    if (phase !== "playing") return;
    setTaps((value) => {
      const next = value + 1;
      if (next % 5 === 0) playDiyaChime((next / 5) % 5);
      return next;
    });
  };

  return (
    <div className={styles.feature}>
      <div className={styles.gameHud}>
        <span>
          <strong>{pad(timeLeft)}</strong> seconds
        </span>
        <span>
          <strong>{taps}</strong> taps
        </span>
        <span>
          Best <strong>{best}</strong>
        </span>
      </div>

      <div className={styles.tapStage}>
        <button
          type="button"
          className={styles.tapTarget}
          onClick={tap}
          disabled={phase !== "playing"}
          aria-label="Tap the diya"
        >
          <Diya lit={phase !== "done" || taps > 0} />
        </button>
        {phase === "idle" && (
          <p className={styles.overlayMessage}>Fifteen seconds. One little flame. Go.</p>
        )}
        {phase === "done" && (
          <p className={styles.overlayMessage} aria-live="polite">
            {taps === 0
              ? "The flame stayed patient."
              : `${taps} taps. ${taps >= best ? "A new best." : "The flame is impressed."}`}
          </p>
        )}
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={start}>
          {phase === "idle" ? "Start the sprint" : phase === "playing" ? "Restart" : "Play again"}
          <span aria-hidden="true">✦</span>
        </button>
        <span className={styles.hint}>Tap the diya, not the page.</span>
      </div>
    </div>
  );
}

export function MemoryMatch() {
  const [deck, setDeck] = useState(buildDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const timerRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const reset = () => {
    window.clearTimeout(timerRef.current);
    setDeck(buildDeck());
    setFlipped([]);
    setMatched([]);
    setMoves(0);
  };

  const flip = (card) => {
    if (flipped.length === 2 || flipped.includes(card.id) || matched.includes(card.id)) {
      return;
    }

    const next = [...flipped, card.id];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((value) => value + 1);
      const first = deck.find((item) => item.id === next[0]);
      const second = deck.find((item) => item.id === next[1]);

      if (first?.symbol === second?.symbol) {
        setMatched((current) => [...current, ...next]);
        setFlipped([]);
      } else {
        timerRef.current = window.setTimeout(() => setFlipped([]), 760);
      }
    }
  };

  const won = matched.length === deck.length;

  return (
    <div className={styles.feature}>
      <div className={styles.gameHud}>
        <span>
          <strong>{moves}</strong> moves
        </span>
        <span>
          <strong>{matched.length / 2}</strong> / {MEMORY_SYMBOLS.length} pairs
        </span>
      </div>

      <div className={styles.memoryGrid}>
        {deck.map((card, index) => {
          const isOpen = flipped.includes(card.id) || matched.includes(card.id);
          return (
            <button
              key={card.id}
              type="button"
              className={`${styles.memoryCard} ${isOpen ? styles.memoryCardOpen : ""} ${
                matched.includes(card.id) ? styles.memoryCardMatched : ""
              }`}
              onClick={() => flip(card)}
              disabled={matched.includes(card.id)}
              aria-label={`Card ${index + 1}${isOpen ? `, ${card.symbol}` : ", hidden"}`}
            >
              <span aria-hidden="true">{isOpen ? card.symbol : "•"}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={reset}>
          {won ? "Deal again" : "New game"}
        </button>
        <span className={styles.hint} aria-live="polite">
          {won ? `All six pairs found in ${moves} moves.` : "Find the six pairs."}
        </span>
      </div>
    </div>
  );
}

export function FireworkLab() {
  const [color, setColor] = useState("#ffd166");
  const colors = ["#ffd166", "#ff8a3d", "#ff6f91", "#c9a2ff", "#7ce0c3", "#8fd6ff"];

  return (
    <div className={styles.feature}>
      <div className={styles.swatchRow} role="group" aria-label="Firework colours">
        {colors.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.swatch} ${color === option ? styles.swatchActive : ""}`}
            style={{ "--swatch": option }}
            onClick={() => setColor(option)}
            aria-pressed={color === option}
            aria-label={`Firework colour ${option}`}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>

      <SparkPad
        mode="burst"
        color={color}
        hint="Tap or click anywhere in the night to send up a burst."
      />
    </div>
  );
}

export function Sparkler() {
  const [color, setColor] = useState("#ffe6a3");
  const colors = ["#ffe6a3", "#ff8fb1", "#7ce0c3"];

  return (
    <div className={styles.feature}>
      <div className={styles.swatchRow} role="group" aria-label="Sparkler colours">
        {colors.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.swatch} ${color === option ? styles.swatchActive : ""}`}
            style={{ "--swatch": option }}
            onClick={() => setColor(option)}
            aria-pressed={color === option}
            aria-label={`Sparkler colour ${option}`}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>

      <SparkPad
        mode="trail"
        color={color}
        hint="Move your finger or pointer through the dark. On a phone, drag slowly."
      />
    </div>
  );
}

export function BlessingWheel() {
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const wheelGradient = `conic-gradient(${WHEEL.map(
    (_, index) =>
      `${index % 2 === 0 ? "#3a1224" : "#2a0d1c"} ${index * 45}deg ${(index + 1) * 45}deg`
  ).join(", ")})`;

  const spin = () => {
    if (spinning) return;
    const index = Math.floor(Math.random() * WHEEL.length);
    setSpinning(true);
    setResult(null);
    setAngle((value) => value + 360 * 5 + (360 - index * 45));
    timerRef.current = window.setTimeout(() => {
      setSpinning(false);
      setResult(WHEEL[index]);
    }, 3600);
  };

  return (
    <div className={styles.feature}>
      <div className={styles.wheelStage}>
        <span className={styles.wheelPointer} aria-hidden="true" />
        <div className={styles.wheelWrap}>
          <div
            className={styles.wheel}
            style={{ transform: `rotate(${angle}deg)`, background: wheelGradient }}
            aria-hidden="true"
          >
            {WHEEL.map((segment, index) => (
              <span
                key={segment.label}
                className={styles.wheelLabel}
                style={{ transform: `rotate(${index * 45 + 22.5}deg) translateY(-86px)` }}
              >
                {segment.label}
              </span>
            ))}
          </div>
          <span className={styles.wheelHub} aria-hidden="true">
            ॐ
          </span>
        </div>
      </div>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={spin}
          disabled={spinning}
        >
          {spinning ? "Turning…" : result ? "Spin again" : "Spin the wheel"}
        </button>
      </div>

      <p className={styles.resultLine} aria-live="polite">
        {result ? (
          <>
            <strong>{result.label}</strong> — {result.text}
          </>
        ) : spinning ? (
          "The wheel is deciding…"
        ) : (
          "Eight small words. One for this year."
        )}
      </p>
    </div>
  );
}

export function ShellGame() {
  const [order, setOrder] = useState([0, 1, 2]);
  const [lit, setLit] = useState(1);
  const [phase, setPhase] = useState("idle");
  const [picked, setPicked] = useState(null);
  const [wins, setWins] = useState(0);
  const [rounds, setRounds] = useState(0);
  const timersRef = useRef([]);

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
    },
    []
  );

  const start = () => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
    setPhase("shuffling");
    setPicked(null);
    setOrder([0, 1, 2]);

    const litIndex = Math.floor(Math.random() * 3);
    setLit(litIndex);

    [1, 2, 3, 4, 5].forEach((step) => {
      const timer = window.setTimeout(() => {
        setOrder((current) => {
          const copy = [...current];
          const first = Math.floor(Math.random() * 3);
          let second = Math.floor(Math.random() * 3);
          while (second === first) {
            second = Math.floor(Math.random() * 3);
          }
          [copy[first], copy[second]] = [copy[second], copy[first]];
          return copy;
        });
        if (step === 5) setPhase("choosing");
      }, 420 * step);
      timersRef.current.push(timer);
    });
  };

  const pick = (identity) => {
    if (phase !== "choosing") return;
    setPicked(identity);
    setPhase("revealed");
    setRounds((value) => value + 1);
    if (identity === lit) {
      setWins((value) => value + 1);
      playDiyaChime(4);
    } else {
      playDiyaChime(0);
    }
  };

  const reveal = phase === "revealed";

  return (
    <div className={styles.feature}>
      <div className={styles.gameHud}>
        <span>
          <strong>{wins}</strong> found
        </span>
        <span>
          <strong>{rounds}</strong> rounds
        </span>
      </div>

      <div className={styles.shellRow}>
        {order.map((identity, slot) => (
          <button
            key={identity}
            type="button"
            className={`${styles.shellCard} ${reveal ? styles.shellRevealed : ""}`}
            onClick={() => pick(identity)}
            disabled={phase !== "choosing"}
            aria-label={`Card ${slot + 1}${reveal ? (identity === lit ? ", held the lit diya" : ", unlit") : ""}`}
          >
            {reveal ? (
              <span className={styles.shellDiya}>
                <Diya lit={identity === lit} />
              </span>
            ) : (
              <span className={styles.shellMark} aria-hidden="true">
                {slot + 1}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={start}
          disabled={phase === "shuffling"}
        >
          {phase === "idle" ? "Start the shuffle" : "Shuffle again"}
        </button>
        <span className={styles.hint} aria-live="polite">
          {phase === "idle" && "One of three cards hides a lit diya."}
          {phase === "shuffling" && "Keep your eyes on the flame…"}
          {phase === "choosing" && "Where is the flame?"}
          {reveal &&
            (picked === lit
              ? "You found it. The flame stays with you."
              : `Not this time — the flame was card ${order.indexOf(lit) + 1}.`)}
        </span>
      </div>
    </div>
  );
}

const PAINT_COLORS = ["#f4c95d", "#ff8a3d", "#ff6f91", "#c9a2ff", "#7ce0c3", "#fff7e8"];

export function RangoliPainter() {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const [color, setColor] = useState(PAINT_COLORS[0]);

  const paint = (event) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((event.clientX - rect.left) / rect.width) * 640;
    const y = ((event.clientY - rect.top) / rect.height) * 640;
    const dx = x - 320;
    const dy = y - 320;

    ctx.save();
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 10;

    for (let index = 0; index < 8; index += 1) {
      ctx.save();
      ctx.translate(320, 320);
      ctx.rotate((Math.PI / 4) * index);
      ctx.beginPath();
      ctx.arc(dx, dy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  };

  const startStroke = (event) => {
    drawingRef.current = true;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    paint(event);
  };

  const endStroke = () => {
    drawingRef.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, 640, 640);
  };

  return (
    <div className={styles.feature}>
      <div className={styles.swatchRow} role="group" aria-label="Rangoli colours">
        {PAINT_COLORS.map((option) => (
          <button
            key={option}
            type="button"
            className={`${styles.swatch} ${color === option ? styles.swatchActive : ""}`}
            style={{ "--swatch": option }}
            onClick={() => setColor(option)}
            aria-pressed={color === option}
            aria-label={`Rangoli colour ${option}`}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className={styles.paintPad}
        width={640}
        height={640}
        onPointerDown={startStroke}
        onPointerMove={paint}
        onPointerUp={endStroke}
        onPointerLeave={endStroke}
        onPointerCancel={endStroke}
        aria-label="Rangoli drawing canvas"
      />

      <div className={styles.row}>
        <button type="button" className={styles.miniButton} onClick={clear}>
          Clear the slate
        </button>
        <span className={styles.hint}>Every dot is mirrored eight times around the centre.</span>
      </div>
    </div>
  );
}

const CATCH_DURATION = 20;

export function MarigoldCatch() {
  const [phase, setPhase] = useState("idle");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(CATCH_DURATION);
  const [flowers, setFlowers] = useState([]);
  const [best, setBest] = useStoredState("catch-best", 0);

  useEffect(() => {
    if (phase !== "playing") return undefined;

    const timer = window.setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1));
      setFlowers((current) =>
        current.filter((flower) => Date.now() - flower.born < 5200)
      );
    }, 1000);

    const spawner = window.setInterval(() => {
      setFlowers((current) => [
        ...current.slice(-12),
        {
          id: `${Date.now()}-${Math.random()}`,
          left: 4 + Math.random() * 86,
          duration: 2.7 + Math.random() * 1.7,
          drift: (Math.random() - 0.5) * 100,
          size: 20 + Math.random() * 20,
          born: Date.now(),
        },
      ]);
    }, 470);

    return () => {
      window.clearInterval(timer);
      window.clearInterval(spawner);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "playing" || timeLeft > 0) return;
    setPhase("done");
    setFlowers([]);
    setBest((value) => Math.max(value, score));
  }, [phase, timeLeft, score, setBest]);

  const start = () => {
    setScore(0);
    setTimeLeft(CATCH_DURATION);
    setFlowers([]);
    setPhase("playing");
  };

  const catchFlower = (id) => {
    if (phase !== "playing") return;
    setScore((value) => {
      const next = value + 1;
      if (next % 4 === 0) playDiyaChime(next % 5);
      return next;
    });
    setFlowers((current) => current.filter((flower) => flower.id !== id));
  };

  return (
    <div className={styles.feature}>
      <div className={styles.gameHud}>
        <span>
          <strong>{pad(timeLeft)}</strong> seconds
        </span>
        <span>
          <strong>{score}</strong> marigolds
        </span>
        <span>
          Best <strong>{best}</strong>
        </span>
      </div>

      <div className={styles.catchField}>
        <span className={styles.catchMoon} aria-hidden="true" />
        {flowers.map((flower) => (
          <button
            key={flower.id}
            type="button"
            className={styles.marigold}
            style={{
              left: `${flower.left}%`,
              "--fall-duration": `${flower.duration}s`,
              "--drift": `${flower.drift}px`,
              "--size": `${flower.size}px`,
            }}
            onClick={() => catchFlower(flower.id)}
            aria-label="Catch a marigold"
          >
            <span aria-hidden="true">✿</span>
          </button>
        ))}
        {phase !== "playing" && (
          <p className={styles.overlayMessage}>
            {phase === "idle"
              ? "Catch the falling marigolds before they reach the ground."
              : `${score} caught. ${score >= best ? "A new best." : "The garden applauds."}`}
          </p>
        )}
      </div>

      <div className={styles.row}>
        <button type="button" className={styles.primaryButton} onClick={start}>
          {phase === "idle" ? "Start catching" : phase === "playing" ? "Restart" : "Play again"}
          <span aria-hidden="true">✿</span>
        </button>
        <span className={styles.hint}>Tap each flower as it falls.</span>
      </div>
    </div>
  );
}
