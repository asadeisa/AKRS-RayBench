// The PLAN-08/U3 seam: `enabled` binds to the settings adaptive-resolution
// toggle, `targetMs`/`minScale` bind to the resolution/quality setting
// (memory/ui.md). `update(frameMs)` is driven once per frame from measured
// render time (PLAN-09/F3's FrameBudget owns the smoothing/measurement;
// this class only reacts to whatever ms it's given).
export class AdaptiveController {
  constructor({ enabled = false, targetMs = 33, minScale = 0.5, maxScale = 1, step = 0.05 } = {}) {
    this.enabled = enabled;
    this.targetMs = targetMs;
    this.minScale = minScale;
    this.maxScale = maxScale;
    this.step = step;
    this.currentScale = 1;
  }

  // Lowers currentScale (fewer pixels) when over budget, raises it back
  // toward maxScale when under, always clamped to [minScale, maxScale].
  // enabled = false forces scale 1 (full res, byte-identical to no adaptive).
  update(frameMs) {
    if (!this.enabled) {
      this.currentScale = 1;
      return this.currentScale;
    }

    const next = frameMs > this.targetMs
      ? this.currentScale - this.step
      : this.currentScale + this.step;
    this.currentScale = Math.min(this.maxScale, Math.max(this.minScale, next));
    return this.currentScale;
  }
}
