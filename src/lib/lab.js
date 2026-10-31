import { useEffect, useState } from "react";

const STORAGE_PREFIX = "diwali-light-lab:";

/** A tiny localStorage-backed state hook that survives refreshes. */
export function useStoredState(key, initialValue) {
  const storageKey = `${STORAGE_PREFIX}${key}`;
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      return stored === null ? initialValue : JSON.parse(stored);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      // Storage can be full or blocked; the feature still works this session.
    }
  }, [storageKey, value]);

  return [value, setValue];
}

/** A ticking clock for countdown-style features. */
export function useNow(interval = 1000, active = true) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(timer);
  }, [active, interval]);

  return now;
}

export function shuffle(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function pad(value) {
  return String(value).padStart(2, "0");
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      const ok = document.execCommand("copy");
      helper.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function downloadBlob(content, type, filename) {
  const blob = new Blob([content], { type });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 2000);
}

export function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/* ------------------------------------------------------------------ */
/* A deliberately playful Latin-to-Devanagari approximation.           */
/* It prefers a short dictionary of names, then falls back to sounds.  */
/* ------------------------------------------------------------------ */

const NAME_DICTIONARY = {
  aarav: "आरव",
  aarohi: "आरोही",
  aditi: "अदिति",
  aditya: "आदित्य",
  amit: "अमित",
  ananya: "अनन्या",
  arjun: "अर्जुन",
  dev: "देव",
  diya: "दीया",
  gauri: "गौरी",
  gupta: "गुप्ता",
  hari: "हरि",
  isha: "ईशा",
  jaya: "जया",
  kabir: "कबीर",
  kavya: "काव्या",
  kiran: "किरण",
  krishna: "कृष्ण",
  lakshmi: "लक्ष्मी",
  maya: "माया",
  meera: "मीरा",
  mr: "श्री",
  mrs: "श्रीमती",
  naina: "नैना",
  neha: "नेहा",
  nisha: "निशा",
  om: "ॐ",
  pooja: "पूजा",
  priya: "प्रिया",
  radha: "राधा",
  rahul: "राहुल",
  ram: "राम",
  riya: "रिया",
  rohan: "रोहन",
  sanjay: "संजय",
  shiva: "शिव",
  shri: "श्री",
  shubh: "शुभ",
  sita: "सीता",
  sneha: "स्नेहा",
  tara: "तारा",
  uma: "उमा",
  varun: "वरुण",
  vivaan: "विवान",
  yash: "यश",
  zara: "ज़ारा",
};

const CONSONANTS = {
  b: "ब",
  c: "च",
  d: "द",
  f: "फ़",
  g: "ग",
  h: "ह",
  j: "ज",
  k: "क",
  l: "ल",
  m: "म",
  n: "न",
  p: "प",
  q: "क़",
  r: "र",
  s: "स",
  t: "त",
  v: "व",
  w: "व",
  x: "क्स",
  y: "य",
  z: "ज़",
};

const CONSONANT_DIGRAPHS = {
  chh: "छ",
  ch: "च",
  kh: "ख",
  gh: "घ",
  jh: "झ",
  th: "थ",
  dh: "ध",
  ph: "फ",
  bh: "भ",
  sh: "श",
  ksh: "क्ष",
  tr: "त्र",
};

const VOWELS = {
  ai: { matra: "ै", independent: "ऐ" },
  au: { matra: "ौ", independent: "औ" },
  aa: { matra: "ा", independent: "आ" },
  ee: { matra: "ी", independent: "ई" },
  ii: { matra: "ी", independent: "ई" },
  oo: { matra: "ू", independent: "ऊ" },
  uu: { matra: "ू", independent: "ऊ" },
  a: { matra: "", independent: "अ" },
  e: { matra: "े", independent: "ए" },
  i: { matra: "ि", independent: "इ" },
  o: { matra: "ो", independent: "ओ" },
  u: { matra: "ु", independent: "उ" },
};

function transliterateWord(word) {
  const lower = word.toLowerCase();
  if (NAME_DICTIONARY[lower]) return NAME_DICTIONARY[lower];

  let output = "";
  let afterConsonant = false;
  let index = 0;

  while (index < lower.length) {
    const rest = lower.slice(index);
    const digraph = Object.keys(CONSONANT_DIGRAPHS)
      .sort((a, b) => b.length - a.length)
      .find((candidate) => rest.startsWith(candidate));

    if (digraph) {
      output += CONSONANT_DIGRAPHS[digraph];
      afterConsonant = true;
      index += digraph.length;
      continue;
    }

    const vowelKey = ["ai", "au", "aa", "ee", "ii", "oo", "uu", "a", "e", "i", "o", "u"].find(
      (candidate) => rest.startsWith(candidate)
    );

    if (vowelKey) {
      const vowel = VOWELS[vowelKey];
      if (afterConsonant) {
        output += vowel.matra;
        afterConsonant = vowelKey === "a";
      } else {
        output += vowel.independent;
        afterConsonant = false;
      }
      index += vowelKey.length;
      continue;
    }

    if (CONSONANTS[lower[index]]) {
      output += CONSONANTS[lower[index]];
      afterConsonant = true;
    } else if (lower[index] === " ") {
      output += " ";
      afterConsonant = false;
    } else if (/[a-z]/.test(lower[index])) {
      output += lower[index];
      afterConsonant = false;
    } else if (lower[index] === ".") {
      output += "।";
      afterConsonant = false;
    }
    index += 1;
  }

  return output;
}

export function toDevanagari(name) {
  return String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(transliterateWord)
    .join(" ");
}
