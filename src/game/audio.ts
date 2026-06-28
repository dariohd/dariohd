let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.04) {
  const ac = getCtx();
  if (!ac) return;
  if (ac.state === 'suspended') void ac.resume();

  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + duration);
}

export function playIconOpen() {
  tone(380, 0.05, 'triangle', 0.035);
  setTimeout(() => tone(520, 0.07, 'triangle', 0.03), 50);
}

export function playMoveBeep() {
  tone(180, 0.04, 'triangle', 0.02);
}

export function playInteract() {
  tone(440, 0.08, 'square', 0.05);
  setTimeout(() => tone(660, 0.12, 'square', 0.05), 80);
}

export function playDiscover() {
  tone(523, 0.1, 'sine', 0.06);
  setTimeout(() => tone(659, 0.1, 'sine', 0.06), 90);
  setTimeout(() => tone(784, 0.15, 'sine', 0.06), 180);
}

export function playWindowOpen() {
  tone(320, 0.06, 'triangle', 0.03);
}

export function playWindowClose() {
  tone(240, 0.06, 'triangle', 0.03);
}

export function playBootTick() {
  tone(880, 0.03, 'square', 0.025);
}

export function playBootComplete() {
  tone(392, 0.08, 'sine', 0.05);
  setTimeout(() => tone(523, 0.12, 'sine', 0.05), 80);
  setTimeout(() => tone(659, 0.18, 'sine', 0.04), 160);
}

export function playShutdown() {
  tone(300, 0.1, 'triangle', 0.04);
  setTimeout(() => tone(180, 0.15, 'triangle', 0.03), 100);
  setTimeout(() => tone(90, 0.25, 'sine', 0.02), 220);
}
