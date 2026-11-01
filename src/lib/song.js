/**
 * An original Diwali melody, synthesized with the Web Audio API.
 *
 * There is no recording and no audio file: a plucked pentatonic line, a warm
 * drone, soft bells and a light pulse are scheduled a little ahead of time.
 * Browsers block sound until the visitor interacts, so this module also
 * remembers whether they chose to keep the song on.
 */

const STORAGE_KEY = "diwali-song-enabled";
const BPM = 92;
const STEP_SECONDS = 60 / BPM / 2; // eighth notes
const LOOKAHEAD = 0.55;
const TICK_MS = 140;
const MASTER_VOLUME = 0.7;

const NOTES = {
  D3: 146.83,
  A3: 220,
  D4: 293.66,
  E4: 329.63,
  Fs4: 369.99,
  A4: 440,
  B4: 493.88,
  D5: 587.33,
  Fs5: 739.99,
  A5: 880,
};

// Eight bars of eighth notes in D major pentatonic. null is a rest, so the
// melody has room to breathe between phrases.
const MELODY = [
  ["D5", null, "A4", "Fs4", null, "E4", null, "D4"],
  ["E4", null, "Fs4", null, "A4", null, "Fs4", null],
  ["B4", null, "A4", "Fs4", null, "E4", null, "D4"],
  ["D4", null, "E4", null, "Fs4", null, "A4", null],
  ["D5", null, "B4", "A4", null, "Fs4", null, "E4"],
  ["Fs4", null, "A4", null, "B4", null, "D5", null],
  ["A4", null, "Fs4", null, "E4", null, "Fs4", null],
  ["D4", null, "A4", null, "D5", null, null, null],
];

const BELLS = { 0: "D5", 2: "A5", 4: "Fs5", 6: "D5" };

let context = null;
let master = null;
let drone = null;
let noise = null;
let scheduler = null;
let nextNoteAt = 0;
let step = 0;
let playing = false;
let enabled = readEnabled();
const listeners = new Set();

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

function ensureContext() {
  if (typeof window === "undefined") return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  if (!context) {
    context = new AudioContext();
    master = context.createGain();
    master.gain.value = 0.0001;

    const warm = context.createBiquadFilter();
    warm.type = "lowpass";
    warm.frequency.value = 4600;

    master.connect(warm);
    warm.connect(context.destination);
  }

  return context;
}

/** A quiet tanpura-like bed under the melody. */
function buildDrone() {
  if (!context || drone) return;

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 760;

  const gain = context.createGain();
  gain.gain.value = 0.055;

  filter.connect(gain);
  gain.connect(master);

  [NOTES.D3, NOTES.A3, NOTES.D4].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const voice = context.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index === 1 ? 4 : -3;
    voice.gain.value = index === 2 ? 0.24 : 0.55;

    oscillator.connect(voice);
    voice.connect(filter);
    oscillator.start();
  });

  drone = gain;
}

function pluck(frequency, time, volume = 0.15) {
  if (!context) return;

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2400, time);
  filter.frequency.exponentialRampToValueAtTime(760, time + 0.85);

  const body = context.createGain();
  body.gain.setValueAtTime(0.0001, time);
  body.gain.exponentialRampToValueAtTime(volume, time + 0.018);
  body.gain.exponentialRampToValueAtTime(0.0001, time + 1.35);

  const fundamental = context.createOscillator();
  fundamental.type = "triangle";
  fundamental.frequency.value = frequency;

  const shimmer = context.createOscillator();
  const shimmerGain = context.createGain();
  shimmer.type = "sine";
  shimmer.frequency.value = frequency * 2;
  shimmerGain.gain.value = 0.16;

  fundamental.connect(filter);
  shimmer.connect(shimmerGain);
  shimmerGain.connect(filter);
  filter.connect(body);
  body.connect(master);

  fundamental.start(time);
  shimmer.start(time);
  fundamental.stop(time + 1.45);
  shimmer.stop(time + 1.45);
}

function bell(frequency, time) {
  if (!context) return;

  [1, 2.01, 2.99].forEach((multiple, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.value = frequency * multiple;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.05 / (index + 1), time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.1);

    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(time);
    oscillator.stop(time + 2.2);
  });
}

function drum(time, volume) {
  if (!context) return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(118, time);
  oscillator.frequency.exponentialRampToValueAtTime(48, time + 0.3);
  gain.gain.setValueAtTime(volume, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.45);

  oscillator.connect(gain);
  gain.connect(master);
  oscillator.start(time);
  oscillator.stop(time + 0.5);
}

function noiseBuffer() {
  if (!context) return null;
  if (noise) return noise;

  const frames = Math.floor(context.sampleRate * 0.2);
  noise = context.createBuffer(1, frames, context.sampleRate);
  const data = noise.getChannelData(0);

  for (let index = 0; index < frames; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / frames);
  }

  return noise;
}

function shaker(time) {
  const buffer = noiseBuffer();
  if (!context || !buffer) return;

  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  source.buffer = buffer;
  filter.type = "highpass";
  filter.frequency.value = 5400;
  gain.gain.setValueAtTime(0.028, time);
  gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(master);
  source.start(time);
  source.stop(time + 0.2);
}

function scheduleStep(index, time) {
  const bar = Math.floor(index / 8);
  const beat = index % 8;
  const note = MELODY[bar][beat];

  if (note) pluck(NOTES[note], time, beat === 0 ? 0.19 : 0.15);
  if (BELLS[bar] && beat === 0) bell(NOTES[BELLS[bar]], time);
  if (beat === 0 || beat === 4) drum(time, beat === 0 ? 0.11 : 0.07);
  if (beat === 2 || beat === 6) shaker(time);
}

function schedule() {
  if (!playing || !context) return;

  while (nextNoteAt < context.currentTime + LOOKAHEAD) {
    scheduleStep(step, nextNoteAt);
    step = (step + 1) % (MELODY.length * 8);
    nextNoteAt += STEP_SECONDS;
  }
}

function startPlayback() {
  if (!context || playing || context.state !== "running") return;

  playing = true;
  buildDrone();

  const now = context.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
  master.gain.exponentialRampToValueAtTime(MASTER_VOLUME, now + 2.2);

  step = 0;
  nextNoteAt = now + 0.12;
  schedule();
  scheduler = window.setInterval(schedule, TICK_MS);
  emit();
}

export function playSong() {
  enabled = true;
  persistEnabled();

  const audio = ensureContext();
  if (!audio) return;

  if (audio.state === "running") {
    startPlayback();
    return;
  }

  audio
    .resume()
    .then(() => {
      if (enabled) startPlayback();
    })
    .catch(() => {
      // The browser wants a gesture first; the next click or keypress retries.
    });
}

export function pauseSong() {
  enabled = false;
  persistEnabled();

  if (scheduler) {
    window.clearInterval(scheduler);
    scheduler = null;
  }

  if (!playing) return;

  playing = false;

  if (context) {
    const now = context.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
  }

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
