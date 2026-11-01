import {
  useEffect, useRef, useState
} from "react";
import { playDiyaChime } from "../../lib/chime";

import styles from "../LightLab.module.scss";

const ROWS = 6;
const COLS = 6;
const CELLS = ROWS * COLS;
const LOTUS_SEEDS = 64;
const GOLDEN_PETALS = 4;

const PALETTE = [
  { name: "Marigold", color: "#f4a03a" },
  { name: "Rose", color: "#e1597a" },
  { name: "Mint", color: "#5fd2a0" },
  { name: "Lavender", color: "#b68dff" },
  { name: "Sky", color: "#6ec8f0" },
];

const MOTIFS = [
  { name: "Lotus", glyph: "❋" },
  { name: "Marigold", glyph: "✿" },
  { name: "Star", glyph: "✦" },
  { name: "Moon", glyph: "☽" },
  { name: "Hearth", glyph: "●" },
];

export function Play3() {
  const [grid, setGrid] = useState(() => buildEmptyGrid());
  const [palette, setPalette] = useState(0);
  const [motif, setMotif] = useState(0);
  const [renown, setRenown] = useState(0);
  const [moves, setMoves] = useState(0);
  const [lastPlaced, setLastPlaced] = useState(null);
  const boardRef = useRef(null);

  function buildEmptyGrid() {
    return Array.from({ length: CELLS }, () => ({
      motif: null,
      color: null,
      reveal: 0,
    }));
  }

  function place() {
    const freshGrid = [...grid];
    const empty = [];
    for (let index = 0; index < CELLS; index += 1) {
      if (freshGrid[index].motif === null) empty.push(index);
    }
    if (empty.length === 0) return;

    const picked = empty[Math.floor(Math.random() * empty.length)];
    const next = [...freshGrid];
    next[picked] = {
      motif,
      color: PALETTE[palette].color,
      reveal: Date.now(),
    };
    setGrid(next);
    setLastPlaced(picked);
    setMoves((m) => m + 1);      if (next[picked].motif !== null) {
      playDiyaChime(0);
    }
  }

  function pickEmpty() {
    const empty = [];
    for (let index = 0; index < CELLS; index += 1) {
      if (grid[index].motif === null) empty.push(index);
    }
    if (empty.length === 0) return;
    const picked = empty[Math.floor(Math.random() * empty.length)];
    const next = [...grid];
    next[picked] = {
      motif,
      color: PALETTE[palette].color,
      reveal: Date.now(),
    };
    setGrid(next);
    setRenown((r) => r + 1);
    setMoves((m) => m + 1);
    playDiyaChime(0);
  }

  function stampEmpty() {
    const empty = [];
    for (let index = 0; index < CELLS; index += 1) {
      if (grid[index].motif === null) empty.push(index);
    }
    if (empty.length === 0) return;
    const picked = empty[Math.floor(Math.random() * empty.length)];
    const next = [...grid];
    next[picked] = {
      motif,
      color: PALETTE[palette].color,
      reveal: Date.now(),
    };
    setGrid(next);
    setMoves((m) => m + 1);
    setRenown((r) => r + 1);
    playDiyaChime(0);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setRenown((r) => r + 3);
    }, 120000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRenown((r) => r + 1);
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (renown <= 0 || renown % LOTUS_SEEDS !== 0) return;
    playDiyaChime(0);
  }, [renown]);

  return (
    <div className={styles.lab}>
      <div className={styles.labHeader}>
        <h2 className={styles.labTitle}>A rangoli for Renown</h2>
        <p className={styles.labLead}>
          Fill the courtyard tile by tile. Every motif earns Renown and lets one
          more seed bloom.
        </p>
      </div>

      <div className={`${styles.featureCard} ${styles.fullCard}`}>
        <div className={styles.featureCover}>
          <span className={styles.featureTag}>Play</span>
          <div className={styles.courtyard}>
            <div className={styles.courtyardFloor} ref={boardRef}>
              {grid.map((cell, index) => (
                <button
                  key={index}
                  className={`${styles.tile} ${
                    cell.motif !== null ? styles.tilePlaced : ""
                  }`}
                  style={
                    cell.motif !== null
                      ? {
                          background: `radial-gradient(circle at 30% 30%, ${cell.color}, ${cell.color}dd 60%, transparent)`,
                        }
                      : {}
                  }
                  aria-label={cell.motif !== null ? `${MOTIFS[cell.motif].name}` : "empty tile"}
                >
                  {cell.motif !== null && (
                    <span className={styles.tileGlyph}>{MOTIFS[cell.motif].glyph}</span>
                  )}
                </button>
              ))}
            </div>
            <div className={styles.courtyardFringe} aria-hidden="true">
              {Array.from({ length: GOLDEN_PETALS }, (_, i) => (
                <span key={i} className={styles.courtyardPetal} />
              ))}
            </div>
          </div>
        </div>

        <div className={styles.featureBody}>
          <h3 className={styles.featureTitle}>A rangoli for Renown</h3>

          <div className={styles.hudRow}>
            <div className={styles.hudBlock}>
              <span className={styles.hudLabel}>Renown</span>
              <span className={styles.hudValue}>{renown}</span>
            </div>
            <div className={styles.hudBlock}>
              <span className={styles.hudLabel}>Tiles placed</span>
              <span className={styles.hudValue}>
                {grid.filter((c) => c.motif !== null).length} / {CELLS}
              </span>
            </div>
            <div className={styles.hudBlock}>
              <span className={styles.hudLabel}>Moves</span>
              <span className={styles.hudValue}>{moves}</span>
            </div>
          </div>

          <div className={styles.pickerRow} role="group" aria-label="Motif">
            {MOTIFS.map((item, index) => (
              <button
                key={item.name}
                className={`${styles.pickerChip} ${
                  index === motif ? styles.pickerChipActive : ""
                }`}
                onClick={() => setMotif(index)}
                aria-pressed={index === motif}
                aria-label={item.name}
              >
                <span aria-hidden="true">{item.glyph}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          <div className={styles.pickerRow} role="group" aria-label="Colour">
            {PALETTE.map((swatch, index) => (
              <button
                key={swatch.name}
                className={`${styles.swatch} ${
                  index === palette ? styles.swatchActive : ""
                }`}
                style={{ "--swatch": swatch.color }}
                onClick={() => setPalette(index)}
                aria-pressed={index === palette}
                aria-label={swatch.name}
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>

          <div className={styles.actionRow}>
            <button
              className={styles.primaryButton}
              onClick={place}
              disabled={grid.every((c) => c.motif !== null)}
            >
              Place a tile
              <span aria-hidden="true">✦</span>
            </button>
            <button
              className={styles.secondaryButton}
              onClick={pickEmpty}
              disabled={grid.every((c) => c.motif !== null)}
            >
              Pick an empty tile
            </button>
            <button
              className={styles.secondaryButton}
              onClick={stampEmpty}
              disabled={grid.every((c) => c.motif !== null)}
            >
              Stamp the floor
            </button>
          </div>

          {lastPlaced !== null && (
            <p className={styles.placeNote}>
              Placed on tile {lastPlaced + 1}.
            </p>
          )}

          <p className={styles.hint}>
            Renown grows by three every thirty seconds, and a little extra every
            two minutes. When it crosses {LOTUS_SEEDS}, a golden petal appears and
            the courtyard gets a little brighter.
          </p>
        </div>
      </div>
    </div>
  );
}
