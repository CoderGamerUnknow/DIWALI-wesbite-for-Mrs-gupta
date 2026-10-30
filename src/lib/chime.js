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
