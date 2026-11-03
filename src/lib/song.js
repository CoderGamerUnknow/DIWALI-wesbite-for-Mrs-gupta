/** Diwali song player using the downloaded audio file. Remembers user preference. */
const STORAGE_KEY = "diwali-song-enabled";
const AUDIO_SRC = "/diwali-song.m4a";
const listeners = new Set();
let enabled = readEnabled();
let audio = null;

function readEnabled() {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

function persistEnabled() {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Private mode can block storage; the song still works for this visit.
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function createAudio() {
  if (typeof window === "undefined") return null;
  try {
    const element = new Audio(AUDIO_SRC);
    element.crossOrigin = "anonymous";
    element.preload = "auto";
    // Keep the UI in sync with what the browser is actually doing.
    element.addEventListener("play", emit);
    element.addEventListener("playing", emit);
    element.addEventListener("pause", emit);
    element.addEventListener("ended", emit);
    return element;
  } catch (e) {
    console.warn("Could not create audio element from", AUDIO_SRC, e);
    return null;
  }
}

function ensureAudio() {
  if (!audio) audio = createAudio();
  return audio;
}

/**
 * Starts or resumes playback. Rewinds only when asked to restart or when the
 * track has finished, so page interactions never send the song back to 0:00.
 */
function startSong({ restart = false } = {}) {
  const element = ensureAudio();
  if (!element) return;

  try {
    if (restart || element.ended) element.currentTime = 0;
  } catch {
    // Seeking can fail before metadata loads; playback still works.
  }

  const attempt = element.play();
  if (attempt && typeof attempt.catch === "function") {
    // Browsers may block auto-play until the visitor interacts.
    attempt.catch(() => emit());
  }
  emit();
}

export function playSong() {
  enabled = true;
  persistEnabled();
  startSong();
}

/** Resume without changing the saved preference, used by the autoplay unlock. */
export function resumeSong() {
  if (isSongPlaying()) return;
  startSong();
}

export function pauseSong() {
  enabled = false;
  persistEnabled();
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  emit();
}

export function toggleSong() {
  if (isSongPlaying()) pauseSong();
  else playSong();
}

export function songEnabled() {
  return enabled;
}

export function isSongPlaying() {
  return Boolean(audio && !audio.paused && !audio.ended);
}

export function subscribeSong(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}