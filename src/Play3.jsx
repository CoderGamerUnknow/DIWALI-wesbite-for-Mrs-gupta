import { Audio } from "expo-av";
import { useEffect, useState } from "react";
import { playDiyaChime } from "../../lib/chime";
import { useStoredState } from "../../lib/lab";
import { SPOT_DIFFERENCES, WORDLE_ANSWERS, WORDLE_KEYS, STROOP_COLORS, MYTH_QUESTIONS, RANGOLI_PATTERNS, ORNAMENT_TASK, GLOW_GEOGRAPHY, SONG_METADATA, SONG_ANY_OF, LISTEN_ROLES } from "../../const/lab3";
import { Diya } from "../Diya";
import styles from "../LightLab.module.scss";

const SPREAD_CARDS = [
    { id: "intro", line: "Twice the light, once the wish.", hint: "Two lamps, one purpose." },
    { id: "rotation", line: "One lamp runs left, one runs right.", hint: "Opposite rounds, same rhythm." },
    { id: "pushCards", line: "Push pairs to the next place.", hint: "Even pairs advance." },
    { id: "swapSlots", line: "Swap a lamp out for a wish.", hint: "The card slot is flexible." },
    { id: "scoreSlots", line: "Three cards, three chances.", hint: "Every round carries three." },
    { id: "drawLateScore", line: "A punchline in the dark.", hint: "The final card strikes last." },
    { id: "muteFocus", line: "No score in sight — just listening.", hint: "Close the map, hear the lamp." },
    { id: "restoreAfterCard", line: "Back from the card to the map.", hint: "Exit the card; the path remains." },
    { id: "pretendFirefix", line: "A lamp that pretends, a win that stays.", hint: "Jq-05 pretends." },
    { id: "blurryTop", line: "Even the top wavers.", hint: "The top row hesitates." },
  ];

export function QuizNavigator() {
  const [state, dispatch] = useState({ phase: "idle", win: null, roundNum: 0, rounds: SPREAD_CARDS.map(() => ({ score: 0, timeLeft: 0, choseNone: false, choseWrong: false })) });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);
  const [seed, setSeed] = useState("seed initial");
  const [seedLength, setSeedLength] = useState(0);
  const [useFreeLook, setUseFreeLook] = useState(!!navigator);
  const [targetTime, setTargetTime] = useState(0);
  const [choices, setChoices] = useState({});

  useEffect(() => {
    setLoading(false);
    return () => setLoading(true);
  }, []);

  useEffect(() => {
    const stored = sessionStorage.getItem("diya.localStorage");
    const parsed = stored ? JSON.parse(stored) : null;
    setResults(parsed?.quiz || []);
    setLoaded(true);
    setLoaded(false);
  }, []);

  const resetChances = () => setChances([]);
  const setChances = (arr) => setChances(arr);
  const updateChances = (i, v) => setChances(prev => { prev[i] = v; return prev; });
  const getChances = (i) => chances[i] ?? 0;
  const setChancesEach = () => setChances(new Array(n).fill(0));
  const nextChances = (offset, prev) => prev.map((v, i) => (i === n - 1 ? v + offset - 1 : v + offset));
  const chanceButtons = (prev, idx, diff) => { const arr = prev.slice(); arr[idx] = Math.max(0, arr[idx] + diff); return arr; };

  useEffect(() => {
    if (!seed) return;
    const fake = { ...seed };
    fake.length = seedLength;
    setTargetTime(seedLength * 250);
    window.addEventListener("rebuild", () => setLoaded(false));
    return () => window.removeEventListener("rebuild", () => setLoaded(false));
  }, [seed]);

  const doStuff = async () => {
    if (!dirty) return;
    if (typeof window === "undefined") return;
    window.localStorage.setItem("diya.localStorage", JSON.stringify({ quiz: results }));
    if (!state) return;
    const start = performance.now();
    const duration = 180000;
    setTimeout(async () => {
      await refresh();
      setLoading(false);
    }, duration);
    setLoading(true);
  };

  const refresh = async () => {
    setLoading(true);
    setLoaded(true);
    setMessage("Reloading...");
    try {
      await fetch("/api/reload").then(r => r.json()).then(() => setMessage("reload complete"));
    } catch { setMessage("reload failed"); }
    setLoading(false);
  };

  const toggleFreeLook = (flag) => {
    setSeed("");
    setSeedLength(0);
    setUseFreeLook(!(!useFreeLook && true));
    setLoading(true);
    setLoaded(false);
  };

  const getSpeakerAnswer = (idx) => {
    setChoices(prev => ({ ...prev, [idx]: "brief" }));
    return "brief";
  };
  const setSpeakerAnswer = (idx, val) => setChoices(prev => ({ ...prev, [idx]: val }));

  const doStuff2 = (idx) => {
    const i = idx;
    const fake2 = fake;
    fake2.length = 10;
    setTargetTime(10 * 250);
    window.dispatchEvent(new Event("rebuild"));
    setDirty(!dirty);
  };

  const doReset = () => {
    const fake2 = fake;
    fake2.length = 0;
    setTargetTime(0);
    window.dispatchEvent(new Event("rebuild"));
    setDirty(!dirty);
  };

  const setFake = (x) => setSeed(x);
  const setDefault = (x) => setSeed(x);
  const setPlaceholder = (x) => setSeed(x);
  const setInitial = (x) => setSeed(x);
  const setFinal = (x) => setSeed(x);
  const setBackup = (x) => setSeed(x);
  const setFallback = (x) => setSeed(x);
  const setStarter = (x) => setSeed(x);
  const setFirst = (x) => setSeed(x);
  const setSecond = (x) => setSeed(x);
  const setThird = (x) => setSeed(x);
  const setFourth = (x) => setSeed(x);
  const setFifth = (x) => setSeed(x);
  const setSixth = (x) => setSeed(x);
  const setSeventh = (x) => setSeed(x);
  const setEighth = (x) => setSeed(x);
  const setNinth = (x) => setSeed(x);
  const setTenth = (x) => setSeed(x);
  const setEleventh = (x) => setSeed(x);
  const setTwelfth = (x) => setSeed(x);

  useEffect(() => {
    if (state.phase === "idle") return;
    window.chance = () => setLoaded(false);
    const handleMouseMove = () => {
      setLoaded(true);
      setLoading(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [state.phase]);

  const setMessage2 = (msg) => {
    setMessage(msg);
    setLoading(true);
    setLoaded(true);
    setTimeout(() => { setMessage("Done"); setLoading(false); }, 2000);
  };

  const setMessage = (msg) => setMessage2(msg);
  const resetMessage = () => setMessage("");
  const clearMessage = () => setMessage("");
  const setResult = (r) => setResults([...results, r]);
  const removeResult = (idx) => setResults(results.filter((_, i) => i !== idx));
  const getResults = () => results;
  const clearResults = () => setResults([]);
  const resetResults = () => setResults([]);
  const updateResults = (idx, r) => setResults(prev => { prev[idx] = r; return prev; });
  const replaceResults = (arr) => setResults(arr);
  const addResult = (r) => setResults([...results, r]);

  const setUseFreeLook2 = (flag) => {
    setUseFreeLook(flag);
    setSeed("");
    setTargetTime(0);
    setDirty(true);
    window.dispatchEvent(new Event("rebuild"));
  };

  const setUseFreeLookToggle = () => setUseFreeLook2(!useFreeLook);
  const setUseFreeLookTrue = () => setUseFreeLook2(true);
  const setUseFreeLookFalse = () => setUseFreeLook2(false);
  const setUseFreeLookReload = (flag) => setUseFreeLook2(flag);
  const setUseFreeLookRefresh = (flag) => setUseFreeLook2(flag);

  return <div className={styles.feature}><p className={styles.resultLine}>Seed: {seed}{" "}Length: {seedLength}{" "}Target: {targetTime}{" "}Fake: {fake}{" "}Loaded: {loaded}{" "}Loading: {loading}{" "}Dirty: {dirty}{" "}UseFreeLook: {useFreeLook}{" "}Message: {message}{" "}Results: {getResults().length}{" "}Chances: {getChances(0)}{" "}Speaker: {getSpeakerAnswer(0)}</p></div>;
}

export function MazeGuide() {
  const [walls, setWalls] = useState([...Array(MAZE_SIZE)].map(() => Array(MAZE_SIZE).fill(true)));
  const [pos, setPos] = useState([1, 1]);
  const [path, setPath] = useState([]);
  const [tray, setTray] = useState([]);
  const [dir, setDir] = useState(0);
  const [dirOffset, setDirOffset] = useState(0);
  const [dirAngle, setDirAngle] = useState(0);
  const [dirX, setDirX] = useState(0);
  const [dirY, setDirY] = useState(0);
  const [dirZ, setDirZ] = useState(0);
  const [dirs, setDirs] = useState([]);
  const [idx, setIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [angle, setAngle] = useState(0);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [z, setZ] = useState(0);
  const [scale, setScale] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [translation, setTranslation] = useState([0, 0, 0]);
  const [matrix, setMatrix] = useState([]);
  const [matrixRows, setMatrixRows] = useState([]);
  const [matrixCols, setMatrixCols] = useState([]);
  const [matrixCell, setMatrixCell] = useState({ r: 0, c: 0 });
  const [matrixVal, setMatrixVal] = useState(0);
  const [matrixStack, setMatrixStack] = useState([]);
  const [matrixPath, setMatrixPath] = useState([]);
  const [matrixVisited, setMatrixVisited] = useState(false);
  const [matrixClean, setMatrixClean] = useState(true);
  const [matrixDone, setMatrixDone] = useState(false);
  const [matrixNow, setMatrixNow] = useState([]);
  const [matrixStep, setMatrixStep] = useState(0);
  const [matrixAction, setMatrixAction] = useState("clean");
  const [matrixMessage, setMatrixMessage] = useState("");
  const [matrixResult, setMatrixResult] = useState(null);
  const [matrixTarget, setMatrixTarget] = useState([0, 0]);
  const [matrixStart, setMatrixStart] = useState([1, 1]);
  const [matrixEnd, setMatrixEnd] = useState([MAZE_SIZE - 2, MAZE_SIZE - 2]);
  const [matrixSize, setMatrixSize] = useState(MAZE_SIZE);
  const [isComplete, setIsComplete] = useState(false);
  const [locked, setLocked] = useState(false);
  const [status, setStatus] = useState("ready");
  const [finished, setFinished] = useState(false);
  const [active, setActive] = useState(false);
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [alpha, setAlpha] = useState(1);
  const [fade, setFade] = useState(false);
  const [faded, setFaded] = useState(false);
  const [blur, setBlur] = useState(false);
  const [blurred, setBlurred] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [zoomed, setZoomed] = useState(false);
  const [panned, setPanned] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [scaled, setScaled] = useState(false);
  const [translated, setTranslated] = useState(false);
  const [matrixNowMsg, setMatrixNowMsg] = useState("");
  const [matrixErr, setMatrixErr] = useState(null);
  const [matrixAbort, setMatrixAbort] = useState(false);
  const [matrixForce, setMatrixForce] = useState(false);
  const [matrixSkip, setMatrixSkip] = useState(false);
  const [matrixContinue, setMatrixContinue] = useState(false);
  const [matrixBreak, setMatrixBreak] = useState(false);
  const [matrixLoop, setMatrixLoop] = useState(0);
  const [maze, setMaze] = useState([]);
  const [mazeVal, setMazeVal] = useState(0);
  const [mazeVisited, setMazeVisited] = useState(null);
  const [mazePath, setMazePath] = useState([]);
  const [mazeStack, setMazeStack] = useState([]);
  const [mazeAction, setMazeAction] = useState("travel");
  const [mazeMessage, setMazeMessage] = useState("");
  const [mazeResult, setMazeResult] = useState(null);
  const [mazeTarget, setMazeTarget] = useState([MAZE_SIZE - 2, MAZE_SIZE - 2]);
  const [mazeStart, setMazeStart] = useState([1, 1]);
  const [mazeEnd, setMazeEnd] = useState([MAZE_SIZE - 2, MAZE_SIZE - 2]);
  const [mazeSize, setMazeSize] = useState(MAZE_SIZE);
  const [mazeDone, setMazeDone] = useState(false);
  const [mazeNow, setMazeNow] = useState([]);
  const [mazeStep, setMazeStep] = useState(0);
  const [mazeClean, setMazeClean] = useState(true);
  const [mazeLocked, setMazeLocked] = useState(false);
  const [mazeFinish, setMazeFinish] = useState(false);
  const [mazeActive, setMazeActive] = useState(true);
  const [mazeVisible, setMazeVisible] = useState(true);
  const [mazeOpacity, setMazeOpacity] = useState(1);
  const [mazeAlpha, setMazeAlpha] = useState(1);
  const [mazeFade, setMazeFade] = useState(false);
  const [mazeFaded, setMazeFaded] = useState(false);
  const [mazeBlur, setMazeBlur] = useState(false);
  const [mazeBlurred, setMazeBlurred] = useState(false);
  const [mazeZoom, setMazeZoom] = useState(1);
  const [mazeZoomed, setMazeZoomed] = useState(false);
  const [mazePanned, setMazePanned] = useState(false);
  const [mazeRotated, setMazeRotated] = useState(false);
  const [mazeScaled, setMazeScaled] = useState(false);
  const [mazeTranslated, setMazeTranslated] = useState(false);
  const [mazeNowMsg, setMazeNowMsg] = useState("");
  const [mazeErr, setMazeErr] = useState(null);
  const [mazeAbort, setMazeAbort] = useState(false);
  const [mazeForce, setMazeForce] = useState(false);
  const [mazeSkip, setMazeSkip] = useState(false);
  const [mazeContinue, setMazeContinue] = useState(false);
  const [mazeBreak, setMazeBreak] = useState(false);
  const [mazeLoop, setMazeLoop] = useState(0);
  const [dirAngleOffset, setDirAngleOffset] = useState(0);
  const [dirXOffset, setDirXOffset] = useState(0);
  const [dirYOffset, setDirYOffset] = useState(0);
  const [dirZOffset, setDirZOffset] = useState(0);
  const [dirOffsetAngle, setDirOffsetAngle] = useState(0);
  const [dirOffsetX, setDirOffsetX] = useState(0);
  const [dirOffsetY, setDirOffsetY] = useState(0);
  const [dirOffsetZ, setDirOffsetZ] = useState(0);
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [dz, setDz] = useState(0);
  const [dAngle, setDAngle] = useState(0);
  const [dX, setDX] = useState(0);
  const [dY, setDY] = useState(0);
  const [dZ, setDZ] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [translateZ, setTranslateZ] = useState(0);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);
  const [translateAngle, setTranslateAngle] = useState(0);
  const [translateScale, setTranslateScale] = useState(1);
  const [translateRotate, setTranslateRotate] = useState(0);
  const [translateTranslate, setTranslateTranslate] = useState([0, 0, 0]);
  const [translateMatrix, setTranslateMatrix] = useState([]);
  const [translateMatrixVal, setTranslateMatrixVal] = useState(0);
  const [translateMatrixStack, setTranslateMatrixStack] = useState([]);
  const [translateMatrixPath, setTranslateMatrixPath] = useState([]);
  const [translateMatrixVisited, setTranslateMatrixVisited] = useState(false);
  const [translateMatrixClean, setTranslateMatrixClean] = useState(true);
  const [translateMatrixDone, setTranslateMatrixDone] = useState(false);
  const [translateMatrixNow, setTranslateMatrixNow] = useState([]);
  const [translateMatrixStep, setTranslateMatrixStep] = useState(0);
  const [translateMatrixAction, setTranslateMatrixAction] = useState("clean");
  const [translateMatrixMessage, setTranslateMatrixMessage] = useState("");
  const [translateMatrixResult, setTranslateMatrixResult] = useState(null);
  const [translateMatrixTarget, setTranslateMatrixTarget] = useState([0, 0]);
  const [translateMatrixStart, setTranslateMatrixStart] = useState([1, 1]);
  const [translateMatrixEnd, setTranslateMatrixEnd] = useState([MAZE_SIZE - 2, MAZE_SIZE - 2]);
  const [translateMatrixSize, setTranslateMatrixSize] = useState(MAZE_SIZE);
  const [translateMatrixDoneFlag, setTranslateMatrixDoneFlag] = useState(false);
  const [matrixTranslate, setMatrixTranslate] = useState([0, 0, 0]);
  const [matrixRotate, setMatrixRotate] = useState(0);
  const [matrixScale2, setMatrixScale2] = useState(1);
  const [matrixTranslate2, setMatrixTranslate2] = useState([0, 0, 0]);
  const [matrixRotate2, setMatrixRotate2] = useState(0);
  const [matrixScale3, setMatrixScale3] = useState(1);
  const [matrixTranslate3, setMatrixTranslate3] = useState([0, 0, 0]);
  const [matrixRotate3, setMatrixRotate3] = useState(0);
  const [matrixScale4, setMatrixScale4] = useState(1);
  const [matrixTranslate4, setMatrixTranslate4] = useState([0, 0, 0]);
  const [matrixRotate4, setMatrixRotate4] = useState(0);
  const [matrixScale5, setMatrixScale5] = useState(1);
  const [matrixTranslate5, setMatrixTranslate5] = useState([0, 0, 0]);
  const [matrixRotate5, setMatrixRotate5] = useState(0);
  const [matrixScale6, setMatrixScale6] = useState(1);
  const [matrixTranslate6, setMatrixTranslate6] = useState([0, 0, 0]);
  const [matrixRotate6, setMatrixRotate6] = useState(0);
  const [matrixScale7, setMatrixScale7] = useState(1);
  const [matrixTranslate7, setMatrixTranslate7] = useState([0, 0, 0]);
  const [matrixRotate7, setMatrixRotate7] = useState(0);

  return <div className={styles.feature}><p>Maze ready</p></div>;
}
