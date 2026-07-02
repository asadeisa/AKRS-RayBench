const RAD2DEG = 180 / Math.PI;
const DEG2RAD = Math.PI / 180;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Settings panel (memory/ui.md — Decided PLAN-08/U3): FOV, AA samples,
// reflection depth, mouse sensitivity, invert-Y, internal resolution scale,
// and an adaptive-resolution toggle. Reads its **initial** values straight
// off the live objects it's given (UI does not own the budget defaults —
// conventions/camera-input do; this panel only overrides them at runtime).
// Every input applies to its live target immediately on change and then
// calls `onPersist` with the full settings blob so the caller can save it.
//
// `resolutionScale` is tracked here rather than derived from
// `renderer.width / renderer.baseWidth`, because while `adaptive` is on the
// render loop drives that ratio every frame (PLAN-09/F2's
// `AdaptiveController`) — the slider instead remembers the user's manual
// choice and is only applied directly (via `renderer.setScale`) whenever
// adaptive is off; while adaptive is on, `AdaptiveController` owns the
// scale within its own independent `[minScale, maxScale]` band (Worker-level
// decision — tying the slider to that band collapses it to a single point
// whenever the slider matches the controller's default `minScale`, which
// would silently disable adaptation; keeping the two ranges separate avoids
// that trap).
export class Settings {
  constructor({ camera, renderer, controls, adaptiveController, fovMin, fovMax, onPersist, onClose }) {
    this.camera = camera;
    this.renderer = renderer;
    this.controls = controls;
    this.adaptiveController = adaptiveController;
    this.fovMin = fovMin;
    this.fovMax = fovMax;
    this.onPersist = onPersist;
    this.onClose = onClose;
    this.resolutionScale = this.renderer.baseWidth ? this.renderer.width / this.renderer.baseWidth : 1;

    this._buildDom();
    this.refresh();
  }

  _buildDom() {
    this.el = document.createElement('div');
    this.el.className = 'menu settings-panel';
    this.el.innerHTML = `
      <h2>Settings</h2>
      <label class="settings-row">
        <span>Field of view <output data-out="fov"></output>&deg;</span>
        <input type="range" data-input="fov" min="20" max="100" step="1">
      </label>
      <label class="settings-row">
        <span>AA samples</span>
        <input type="number" data-input="samples" min="1" max="16" step="1">
      </label>
      <label class="settings-row">
        <span>Reflection depth</span>
        <input type="number" data-input="maxDepth" min="0" max="10" step="1">
      </label>
      <label class="settings-row">
        <span>Mouse sensitivity <output data-out="sensitivity"></output></span>
        <input type="range" data-input="sensitivity" min="0.0005" max="0.01" step="0.0005">
      </label>
      <label class="settings-row settings-row--check">
        <span>Invert Y</span>
        <input type="checkbox" data-input="invertY">
      </label>
      <label class="settings-row">
        <span>Resolution scale <output data-out="resolution"></output></span>
        <input type="range" data-input="resolution" min="0.25" max="1" step="0.05">
      </label>
      <label class="settings-row settings-row--check">
        <span>Adaptive resolution</span>
        <input type="checkbox" data-input="adaptive">
      </label>
      <button type="button" data-action="close">Close</button>
    `;

    this.fovInput = this.el.querySelector('[data-input="fov"]');
    this.fovOut = this.el.querySelector('[data-out="fov"]');
    this.samplesInput = this.el.querySelector('[data-input="samples"]');
    this.maxDepthInput = this.el.querySelector('[data-input="maxDepth"]');
    this.sensitivityInput = this.el.querySelector('[data-input="sensitivity"]');
    this.sensitivityOut = this.el.querySelector('[data-out="sensitivity"]');
    this.invertYInput = this.el.querySelector('[data-input="invertY"]');
    this.resolutionInput = this.el.querySelector('[data-input="resolution"]');
    this.resolutionOut = this.el.querySelector('[data-out="resolution"]');
    this.adaptiveInput = this.el.querySelector('[data-input="adaptive"]');
    this.closeBtn = this.el.querySelector('[data-action="close"]');

    this.fovInput.addEventListener('input', () => {
      const deg = clamp(parseFloat(this.fovInput.value), this.fovMin * RAD2DEG, this.fovMax * RAD2DEG);
      this.camera.setFov(deg * DEG2RAD);
      this.fovOut.textContent = Math.round(deg);
      this._persist();
    });

    this.samplesInput.addEventListener('change', () => {
      const value = Math.max(1, parseInt(this.samplesInput.value, 10) || 1);
      this.renderer.samples = value;
      this.samplesInput.value = value;
      this._persist();
    });

    this.maxDepthInput.addEventListener('change', () => {
      const value = Math.max(0, parseInt(this.maxDepthInput.value, 10) || 0);
      this.renderer.maxDepth = value;
      this.maxDepthInput.value = value;
      this._persist();
    });

    this.sensitivityInput.addEventListener('input', () => {
      const value = parseFloat(this.sensitivityInput.value);
      this.controls.mouseSensitivity = value;
      this.sensitivityOut.textContent = value.toFixed(4);
      this._persist();
    });

    this.invertYInput.addEventListener('change', () => {
      this.controls.invertY = this.invertYInput.checked;
      this._persist();
    });

    this.resolutionInput.addEventListener('input', () => {
      this.resolutionScale = parseFloat(this.resolutionInput.value);
      this.resolutionOut.textContent = this.resolutionScale.toFixed(2);
      if (!this.adaptiveController.enabled) {
        this.renderer.setScale(this.resolutionScale);
      }
      this._persist();
    });

    this.adaptiveInput.addEventListener('change', () => {
      this.adaptiveController.enabled = this.adaptiveInput.checked;
      this.resolutionInput.disabled = this.adaptiveController.enabled;
      if (!this.adaptiveController.enabled) {
        this.renderer.setScale(this.resolutionScale);
      }
      this._persist();
    });

    this.closeBtn.addEventListener('click', () => this.onClose());
  }

  _persist() {
    this.onPersist(this.getBlob());
  }

  getBlob() {
    return {
      resolutionScale: this.resolutionScale,
      adaptive: this.adaptiveController.enabled,
      fov: this.camera.fov,
      samples: this.renderer.samples,
      maxDepth: this.renderer.maxDepth,
      mouseSensitivity: this.controls.mouseSensitivity,
      invertY: this.controls.invertY,
    };
  }

  // Re-syncs every input to the current live values. Called on mount and
  // after an external apply (boot / Continue loading a persisted blob),
  // since `resolutionScale` in particular can't be derived from the live
  // renderer buffer while adaptive is actively resizing it.
  refresh(resolutionScale) {
    if (typeof resolutionScale === 'number') this.resolutionScale = resolutionScale;

    const fovDeg = Math.round(this.camera.fov * RAD2DEG);
    this.fovInput.min = Math.round(this.fovMin * RAD2DEG);
    this.fovInput.max = Math.round(this.fovMax * RAD2DEG);
    this.fovInput.value = fovDeg;
    this.fovOut.textContent = fovDeg;

    this.samplesInput.value = this.renderer.samples;
    this.maxDepthInput.value = this.renderer.maxDepth;

    this.sensitivityInput.value = this.controls.mouseSensitivity;
    this.sensitivityOut.textContent = this.controls.mouseSensitivity.toFixed(4);

    this.invertYInput.checked = this.controls.invertY;

    this.resolutionInput.value = this.resolutionScale;
    this.resolutionOut.textContent = this.resolutionScale.toFixed(2);
    this.resolutionInput.disabled = this.adaptiveController.enabled;

    this.adaptiveInput.checked = this.adaptiveController.enabled;
  }

  mount(root) {
    this.refresh();
    root.appendChild(this.el);
  }

  unmount() {
    this.el.remove();
  }
}
