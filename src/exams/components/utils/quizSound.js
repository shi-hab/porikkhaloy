const STORAGE_KEY = "quizBattle:soundEnabled";

let audioCtx = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  // Some browsers start the context suspended until a user gesture.
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled() {
  if (typeof window === "undefined") return true;
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === null ? true : saved === "true";
}

export function setSoundEnabled(enabled) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, String(enabled));
}

export function toggleSound() {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  return next;
}

function playTone({ freq, start, duration, type = "sine", gain = 0.18 }) {
  const ctx = getCtx();
  if (!ctx || !isSoundEnabled()) return;

  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + duration);

  osc.connect(g);
  g.connect(ctx.destination);

  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + duration + 0.05);
}

/** Bright two-note "ding" for a correct answer */
export function playCorrectSound() {
  playTone({ freq: 880, start: 0, duration: 0.14, type: "sine" });
  playTone({ freq: 1318.5, start: 0.1, duration: 0.22, type: "sine" });
}

/** Low buzzy "womp" for a wrong answer */
export function playWrongSound() {
  playTone({ freq: 220, start: 0, duration: 0.18, type: "sawtooth", gain: 0.14 });
  playTone({ freq: 160, start: 0.12, duration: 0.24, type: "sawtooth", gain: 0.12 });
}

/** Little ascending fanfare for a milestone / streak modal */
export function playStreakSound() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    playTone({ freq, start: i * 0.09, duration: 0.2, type: "triangle", gain: 0.16 });
  });
}

/** Soft confirmation chime for finishing the quiz */
export function playFinishSound() {
  const notes = [659.25, 523.25, 783.99];
  notes.forEach((freq, i) => {
    playTone({ freq, start: i * 0.12, duration: 0.3, type: "sine", gain: 0.14 });
  });
}