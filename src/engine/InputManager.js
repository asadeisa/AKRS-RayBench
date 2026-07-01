const KEY_BINDINGS = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
};

const INTERACT_CODE = 'KeyE';

const DEG2RAD = Math.PI / 180;
const FOV_DELTA_PER_WHEEL = 1 * DEG2RAD; // radians of FOV change per wheel "click" (deltaY=100)

// Owns the raw DOM input listeners (memory/engine.md: DOM globals allowed only
// here). poll() returns the exact normalized snapshot Controls consumes
// (memory/camera-input.md) and clears the accumulated deltas on read.
export class InputManager {
  constructor(target = window) {
    this._target = target;
    this._keys = { forward: false, backward: false, left: false, right: false };
    this._mouseDeltaX = 0;
    this._mouseDeltaY = 0;
    this._fovDelta = 0;
    this._pointerLocked = false;
    this._interact = false;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onMouseMove = this._onMouseMove.bind(this);
    this._onWheel = this._onWheel.bind(this);
    this._onPointerLockChange = this._onPointerLockChange.bind(this);
    this._onClick = this._onClick.bind(this);

    target.addEventListener('keydown', this._onKeyDown);
    target.addEventListener('keyup', this._onKeyUp);
    target.addEventListener('mousemove', this._onMouseMove);
    target.addEventListener('wheel', this._onWheel, { passive: true });
    document.addEventListener('pointerlockchange', this._onPointerLockChange);
    target.addEventListener('click', this._onClick);
  }

  requestPointerLock() {
    if (this._target.requestPointerLock) this._target.requestPointerLock();
  }

  poll() {
    const snapshot = {
      forward: this._keys.forward,
      backward: this._keys.backward,
      left: this._keys.left,
      right: this._keys.right,
      mouseDeltaX: this._mouseDeltaX,
      mouseDeltaY: this._mouseDeltaY,
      pointerLocked: this._pointerLocked,
      fovDelta: this._fovDelta,
      interact: this._interact,
    };
    this._mouseDeltaX = 0;
    this._mouseDeltaY = 0;
    this._fovDelta = 0;
    this._interact = false;
    return snapshot;
  }

  dispose() {
    this._target.removeEventListener('keydown', this._onKeyDown);
    this._target.removeEventListener('keyup', this._onKeyUp);
    this._target.removeEventListener('mousemove', this._onMouseMove);
    this._target.removeEventListener('wheel', this._onWheel);
    document.removeEventListener('pointerlockchange', this._onPointerLockChange);
    this._target.removeEventListener('click', this._onClick);
  }

  _onKeyDown(e) {
    const action = KEY_BINDINGS[e.code];
    if (action) this._keys[action] = true;
    if (e.code === INTERACT_CODE && !e.repeat) this._interact = true;
  }

  _onKeyUp(e) {
    const action = KEY_BINDINGS[e.code];
    if (action) this._keys[action] = false;
  }

  _onMouseMove(e) {
    if (!this._pointerLocked) return;
    this._mouseDeltaX += e.movementX ?? 0;
    this._mouseDeltaY += e.movementY ?? 0;
  }

  _onWheel(e) {
    this._fovDelta += Math.sign(e.deltaY) * FOV_DELTA_PER_WHEEL;
  }

  _onPointerLockChange() {
    this._pointerLocked = document.pointerLockElement === this._target;
  }

  _onClick() {
    this.requestPointerLock();
  }
}
