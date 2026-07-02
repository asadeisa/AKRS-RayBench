// Read-only FPS readout (memory/ui.md — Decided PLAN-08/U2): reads the Loop
// timing snapshot { dt, elapsed, frame, fps } each frame, never mutates it.
// Throttled so the DOM write itself doesn't become a frame-time cost.
const UPDATE_INTERVAL = 0.25; // seconds between DOM text updates

export class FpsCounter {
  constructor({ loop }) {
    this.loop = loop;
    this._sinceUpdate = 0;

    this.el = document.createElement('div');
    this.el.className = 'fps-counter';
    this.el.textContent = 'FPS: --';
  }

  update(dt) {
    this._sinceUpdate += dt;
    if (this._sinceUpdate < UPDATE_INTERVAL) return;
    this._sinceUpdate = 0;
    this.el.textContent = `FPS: ${Math.round(this.loop.timing.fps)}`;
  }

  mount(root) {
    root.appendChild(this.el);
  }

  unmount() {
    this.el.remove();
  }
}
