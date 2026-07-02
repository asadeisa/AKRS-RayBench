const DEFAULT_TARGET_MS = 33; // ~30 fps — Assumption (Med), memory/performance.md
const DEFAULT_WINDOW = 10; // frames averaged, so a single spike doesn't jolt the scale

// Measures render()-only ms (distinct from Loop's dt, which also covers
// update + idle work) and smooths it with a short moving average, so
// PLAN-09/F2's AdaptiveController reacts to a trend rather than one spike.
// `targetMs` is the tunable budget U3's resolution/quality setting can set.
export class FrameBudget {
  constructor({ targetMs = DEFAULT_TARGET_MS, window = DEFAULT_WINDOW } = {}) {
    this.targetMs = targetMs;
    this.window = window;
    this._samples = [];
    this.smoothedMs = 0;
  }

  // Records one render-only duration (ms); returns the updated moving average.
  sample(ms) {
    this._samples.push(ms);
    if (this._samples.length > this.window) this._samples.shift();
    const sum = this._samples.reduce((a, b) => a + b, 0);
    this.smoothedMs = sum / this._samples.length;
    return this.smoothedMs;
  }
}
