let context;

const NOTES = [523.25, 587.33, 659.25, 783.99, 880];

function getContext() {
  if (typeof window === "undefined") return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!context) context = new AudioContext();
  if (context.state === "suspended") context.resume();
  return context;
}

function playNote(frequency, delay = 0, duration = 2.6) {
  const audio = getContext();
  if (!audio) return;

  const start = audio.currentTime + delay;
  const master = audio.createGain();
  master.gain.setValueAtTime(0.0001, start);
  master.gain.exponentialRampToValueAtTime(0.085, start + 0.02);
  master.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  master.connect(audio.destination);

  // A soft bell: fundamental plus two quiet, slightly inharmonic overtones.
  [1, 2.01, 2.99].forEach((multiple, index) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.type = index === 0 ? "sine" : "triangle";
    oscillator.frequency.value = frequency * multiple;
    gain.gain.value = index === 0 ? 1 : 0.14 / index;
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(start);
    oscillator.stop(start + duration);
  });
}

export function playDiyaChime(index = 0) {
  playNote(NOTES[index % NOTES.length], 0, 2.8);
}

export function playCelebrationChime() {
  [0, 1, 2, 3, 4].forEach((index) => {
    playNote(NOTES[index], index * 0.11, 3.4);
  });
}

/** A lower temple bell, for the instrument shelf. */
export function playTempleBell() {
  playNote(329.63, 0, 3.8);
}

/** A breathy conch-like tone. */
export function playConch() {
  const audio = getContext();
  if (!audio) return;

  const start = audio.currentTime;
  const master = audio.createGain();
  master.gain.setValueAtTime(0.0001, start);
  master.gain.exponentialRampToValueAtTime(0.06, start + 0.18);
  master.gain.exponentialRampToValueAtTime(0.0001, start + 1.9);
  master.connect(audio.destination);

  const oscillator = audio.createOscillator();
  const lfo = audio.createOscillator();
  const lfoGain = audio.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(196, start);
  oscillator.frequency.linearRampToValueAtTime(294, start + 0.35);
  lfo.frequency.value = 5.5;
  lfoGain.gain.value = 3;
  lfo.connect(lfoGain);
  lfoGain.connect(oscillator.frequency);
  oscillator.connect(master);
  oscillator.start(start);
  oscillator.stop(start + 2);
  lfo.start(start);
  lfo.stop(start + 2);
}

/** A soft membrane drum. */
export function playDrum() {
  const audio = getContext();
  if (!audio) return;

  const start = audio.currentTime;
  const master = audio.createGain();
  master.gain.setValueAtTime(0.14, start);
  master.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
  master.connect(audio.destination);

  const oscillator = audio.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(120, start);
  oscillator.frequency.exponentialRampToValueAtTime(48, start + 0.4);
  oscillator.connect(master);
  oscillator.start(start);
  oscillator.stop(start + 0.6);
}

/** A short cymbal wash made from filtered noise. */
export function playCymbal() {
  const audio = getContext();
  if (!audio) return;

  const start = audio.currentTime;
  const frames = Math.floor(audio.sampleRate * 0.8);
  const buffer = audio.createBuffer(1, frames, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < frames; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / frames);
  }

  const source = audio.createBufferSource();
  const filter = audio.createBiquadFilter();
  const master = audio.createGain();
  filter.type = "highpass";
  filter.frequency.value = 4200;
  master.gain.setValueAtTime(0.08, start);
  master.gain.exponentialRampToValueAtTime(0.0001, start + 0.75);
  source.buffer = buffer;
  source.connect(filter);
  filter.connect(master);
  master.connect(audio.destination);
  source.start(start);
}
