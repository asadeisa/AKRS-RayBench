const DT_MAX = 0.1; // seconds — spiral-of-death guard on tab-switch / stall

export class Loop {
  constructor({ update, render }) {
    this.update = update;
    this.render = render;
    this._running = false;
    this._rafId = null;
    this._lastTime = 0;
    this._timing = { dt: 0, elapsed: 0, frame: 0, fps: 0 };
  }

  get timing() {
    return this._timing;
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._lastTime = performance.now();
    this._rafId = requestAnimationFrame(this._tick);
  }

  stop() {
    this._running = false;
    if (this._rafId !== null) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  _tick = (now) => {
    if (!this._running) return;

    const rawDt = (now - this._lastTime) / 1000;
    const dt = Math.min(rawDt, DT_MAX);
    this._lastTime = now;

    this.update(dt);
    this.render();

    const t = this._timing;
    t.dt = dt;
    t.elapsed += dt;
    t.frame += 1;
    t.fps = dt > 0 ? 1 / dt : 0;

    this._rafId = requestAnimationFrame(this._tick);
  };
}
