// Coarse-first-pass -> refine progressive rendering (memory/performance.md
// — Assumption (Med), kept simple). While the camera is still, `advance()`
// steps the render scale up frame by frame from `startScale` toward
// `maxScale`, so a static frame sharpens over a few frames instead of
// paying full-res cost on the very first idle frame. The caller decides
// "still" (e.g. no input delta) and calls `reset()` on movement.
export class ProgressiveRefiner {
  constructor({ startScale = 0.5, maxScale = 1, step = 0.1 } = {}) {
    this.startScale = startScale;
    this.maxScale = maxScale;
    this.step = step;
    this.scale = maxScale;
  }

  reset() {
    this.scale = this.startScale;
    return this.scale;
  }

  advance() {
    this.scale = Math.min(this.maxScale, this.scale + this.step);
    return this.scale;
  }
}
