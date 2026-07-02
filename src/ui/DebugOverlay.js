// Read-only debug panel (memory/ui.md — Decided PLAN-08/U2): camera pose,
// active-scene object count, and render config. Toggled by App's F3 hotkey;
// observes engine/render/camera/game state, never mutates it.
const RAD2DEG = 180 / Math.PI;

export class DebugOverlay {
  constructor({ camera, getScene, renderer, loop, frameBudget = null }) {
    this.camera = camera;
    this.getScene = getScene;
    this.renderer = renderer;
    this.loop = loop;
    this.frameBudget = frameBudget;
    this.visible = false;

    this.el = document.createElement('pre');
    this.el.className = 'debug-overlay';
    this.el.hidden = true;
  }

  toggle() {
    this.visible = !this.visible;
    this.el.hidden = !this.visible;
  }

  update() {
    if (!this.visible) return;
    const { position, yaw, pitch, fov } = this.camera;
    const scene = this.getScene();
    const objectCount = scene ? scene.renderables.length : 0;
    const { width, height, samples, maxDepth } = this.renderer;
    const lastFrameMs = this.loop.timing.dt * 1000;

    const lines = [
      `pos: ${position.x.toFixed(2)}, ${position.y.toFixed(2)}, ${position.z.toFixed(2)}`,
      `yaw: ${(yaw * RAD2DEG).toFixed(1)} deg  pitch: ${(pitch * RAD2DEG).toFixed(1)} deg`,
      `fov: ${(fov * RAD2DEG).toFixed(1)} deg`,
      `objects: ${objectCount}`,
      `resolution: ${width}x${height}  samples: ${samples}  maxDepth: ${maxDepth}`,
      `frame: ${lastFrameMs.toFixed(1)} ms`,
    ];
    // F3, read-only add: smoothed render()-only ms, distinct from the
    // Loop-dt-derived `frame` line above (which also covers update/idle).
    if (this.frameBudget) {
      lines.push(`render: ${this.frameBudget.smoothedMs.toFixed(1)} ms (target ${this.frameBudget.targetMs})`);
    }
    this.el.textContent = lines.join('\n');
  }

  mount(root) {
    root.appendChild(this.el);
  }

  unmount() {
    this.el.remove();
  }
}
