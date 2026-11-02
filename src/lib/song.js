/** Diwali song player using the downloaded audio file. Remembers user preference. */
const STORAGE_KEY = "diwali-song-enabled";
const AUDIO_SRC = "/diwali-song.m4a";
const listeners = new Set();
let enabled = readEnabled();
let playing = false;
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
    const audio = new Audio(AUDIO_SRC);
    audio.crossOrigin = "anonymous";
    return audio;
  } catch (e) {
    console.warn("Could not create audio element from", AUDIO_SRC, e);
    return null;
  }
}

export function playSong() {
  enabled = true;
  persistEnabled();
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {
      // Browser may block auto-play until user interaction.
    });
    playing = true;
    return;
  }
  audio = createAudio();
  if (!audio) return;
  audio.play().catch(() => {
    // User gesture required to start audio.
  });
  playing = true;
}

export function pauseSong() {
  enabled = false;
  persistEnabled();
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  playing = false;
  emit();
}

export function toggleSong() {
  if (playing) pauseSong();
  else playSong();
}

export function songEnabled() {
  return enabled;
}

export function isSongPlaying() {
  return playing;
}

export function subscribeSong(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}