/**
 * Small, dependency-free puzzle helpers for the Light Lab.
 * Kept separate from the components so the placement logic can be checked
 * without a browser.
 */

export const SEARCH_SIZE = 10;

export const SEARCH_WORDS = [
  "DIWALI",
  "DIYA",
  "RANGOLI",
  "MITHAI",
  "TORAN",
  "AARTI",
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const randomIndex = (length) => Math.floor(Math.random() * length);

// A local copy keeps this module importable by plain Node for checks.
const shuffleItems = (items) => {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = randomIndex(index + 1);
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
};

const fillGrid = (grid) =>
  grid.map((row) =>
    row.map((letter) => letter || ALPHABET[randomIndex(ALPHABET.length)])
  );

const placeWord = (grid, word) => {
  for (let attempt = 0; attempt < 250; attempt += 1) {
    const horizontal = Math.random() < 0.5;
    const row = randomIndex(
      horizontal ? SEARCH_SIZE : SEARCH_SIZE - word.length + 1
    );
    const col = randomIndex(
      horizontal ? SEARCH_SIZE - word.length + 1 : SEARCH_SIZE
    );
    const cells = [];
    let fits = true;

    for (let index = 0; index < word.length; index += 1) {
      const cellRow = row + (horizontal ? 0 : index);
      const cellCol = col + (horizontal ? index : 0);
      if (grid[cellRow][cellCol] && grid[cellRow][cellCol] !== word[index]) {
        fits = false;
        break;
      }
      cells.push([cellRow, cellCol]);
    }

    if (!fits) continue;

    cells.forEach(([cellRow, cellCol], index) => {
      grid[cellRow][cellCol] = word[index];
    });
    return cells;
  }

  return null;
};

export function buildWordSearch() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const grid = Array.from({ length: SEARCH_SIZE }, () =>
      Array(SEARCH_SIZE).fill("")
    );
    const placements = [];
    let complete = true;

    for (const word of shuffleItems(SEARCH_WORDS)) {
      const cells = placeWord(grid, word);
      if (!cells) {
        complete = false;
        break;
      }
      placements.push({ word, cells });
    }

    if (complete) return { grid: fillGrid(grid), placements };
  }

  // One word per row: always fits the current ten-letter grid.
  const grid = Array.from({ length: SEARCH_SIZE }, () =>
    Array(SEARCH_SIZE).fill("")
  );
  const placements = SEARCH_WORDS.map((word, row) => {
    const cells = word.split("").map((_, col) => [row, col]);
    cells.forEach(([cellRow, cellCol], index) => {
      grid[cellRow][cellCol] = word[index];
    });
    return { word, cells };
  });

  return { grid: fillGrid(grid), placements };
}

export function pathBetween(start, end) {
  if (!start || !end) return null;

  const [startRow, startCol] = start;
  const [endRow, endCol] = end;

  if (startRow === endRow) {
    const low = Math.min(startCol, endCol);
    const high = Math.max(startCol, endCol);
    return Array.from({ length: high - low + 1 }, (_, index) => [
      startRow,
      low + index,
    ]);
  }

  if (startCol === endCol) {
    const low = Math.min(startRow, endRow);
    const high = Math.max(startRow, endRow);
    return Array.from({ length: high - low + 1 }, (_, index) => [
      low + index,
      startCol,
    ]);
  }

  return null;
}

export function pathMatches(placement, path) {
  if (!path || placement.cells.length !== path.length) return false;

  const forward = placement.cells.every(
    ([row, col], index) => row === path[index][0] && col === path[index][1]
  );
  if (forward) return true;

  return placement.cells.every(
    ([row, col], index) =>
      row === path[path.length - 1 - index][0] &&
      col === path[path.length - 1 - index][1]
  );
}

export const BINGO_PROMPTS = [
  "Light a diya",
  "Share a sweet",
  "Call someone you miss",
  "Clean one small corner",
  "Wear something new",
  "Draw a rangoli",
  "Send a Diwali wish",
  "Water a plant",
  "Thank someone quietly",
  "Learn one Hindi word",
  "Make chai for someone",
  "Open a window",
  "Donate something",
  "Take a festival photo",
  "Hang a toran",
  "Buy a clay diya",
  "Write a card",
  "Visit a neighbour",
  "Hum an aarti",
  "Share this page",
  "Light a candle",
  "Eat something sweet",
  "Forgive a small thing",
  "Make room for a guest",
];

export const BINGO_LINES = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [0, 5, 10, 15],
  [3, 6, 9, 12],
];
