import { Vector3 } from '../math/index.js';

const WORLD_UP = new Vector3(0, 1, 0);
const DEG2RAD = Math.PI / 180;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Drives the C1 Camera from the engine input manager's normalized, polled
// state (PLAN-06/E3, not yet built — this codes to the interface, same
// pattern as PLAN-04/R1 coding to Camera before C1 landed). No DOM listeners
// here; the engine owns raw events (memory/engine.md).
//
// Expected `input` shape (assumption — the contract PLAN-06/E3 must supply,
// memory/camera-input.md):
//   { forward, backward, left, right: boolean,   // WASD, held-this-frame
//     mouseDeltaX, mouseDeltaY: number,           // pixels since last poll
//     pointerLocked: boolean,                     // mouse look active
//     fovDelta: number }                          // scroll/zoom input, radians
export class Controls {
  constructor({
    moveSpeed = 5, // m/s (memory/conventions.md: world units = meters)
    mouseSensitivity = 0.0022, // radians per pixel of mouse delta
    invertY = false,
    pitchLimit = 89 * DEG2RAD, // clamp ~89 deg (memory/camera-input.md)
    fovMin = 20 * DEG2RAD,
    fovMax = 100 * DEG2RAD,
  } = {}) {
    this.moveSpeed = moveSpeed;
    this.mouseSensitivity = mouseSensitivity;
    this.invertY = invertY;
    this.pitchLimit = pitchLimit;
    this.fovMin = fovMin;
    this.fovMax = fovMax;
  }

  update(camera, input, dt) {
    if (input.pointerLocked) {
      this._look(camera, input);
    }
    this._move(camera, input, dt);
    if (input.fovDelta) {
      camera.setFov(clamp(camera.fov + input.fovDelta, this.fovMin, this.fovMax));
    }
  }

  _look(camera, input) {
    const dx = input.mouseDeltaX ?? 0;
    const dy = input.mouseDeltaY ?? 0;
    camera.yaw -= dx * this.mouseSensitivity;
    const pitchSign = this.invertY ? 1 : -1;
    camera.pitch = clamp(
      camera.pitch + dy * this.mouseSensitivity * pitchSign,
      -this.pitchLimit,
      this.pitchLimit
    );
  }

  // Yaw-relative movement on the XZ plane (Y unchanged) — pitch does not tilt
  // movement; collision is deferred to the engine (memory/camera-input.md).
  _move(camera, input, dt) {
    const flatForward = new Vector3(-Math.sin(camera.yaw), 0, -Math.cos(camera.yaw));
    const flatRight = flatForward.cross(WORLD_UP).normalize();

    let moveX = 0;
    let moveZ = 0;
    if (input.forward) {
      moveX += flatForward.x;
      moveZ += flatForward.z;
    }
    if (input.backward) {
      moveX -= flatForward.x;
      moveZ -= flatForward.z;
    }
    if (input.right) {
      moveX += flatRight.x;
      moveZ += flatRight.z;
    }
    if (input.left) {
      moveX -= flatRight.x;
      moveZ -= flatRight.z;
    }

    if (moveX === 0 && moveZ === 0) return;

    const move = new Vector3(moveX, 0, moveZ).normalize().scale(this.moveSpeed * dt);
    camera.position = camera.position.add(move);
  }
}
