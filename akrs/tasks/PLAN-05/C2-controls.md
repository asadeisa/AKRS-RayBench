# TASK — controls (WASD + mouse look)
Plan / Phase: PLAN-05 (Camera & Input) / C2

## Objective
Drive the C1 `Camera` from player input: **WASD** movement (yaw-relative, on the XZ plane), **mouse
look** via Pointer Lock (pitch clamped to ±~89°), and runtime **FOV adjust**.

## Constraints
- **Blocked:** consumes the **normalized input state** from the engine **input manager (PLAN-06/E3)**
  — not built yet. Code to that polled-state interface; do NOT attach raw DOM/pointer-lock listeners
  here (event ownership = engine, `memory/engine.md`).
- Movement is yaw-relative on the **XZ plane** (no vertical fly); collision is **deferred to the
  engine** — the camera does not resolve it (`memory/camera-input.md`).
- Mouse look: pitch **clamp ±~89°**; sensitivity + invert-Y are settings-driven (defaults TBD, [[ui]]).
- Mutates the Camera via its API (yaw/pitch/position/FOV); no rendering, no new math.

## References (read, do not duplicate)
- `memory/camera-input.md` (controls contract; collision deferred to engine)
- `memory/engine.md` (input manager = normalized state polled by camera)
- `memory/conventions.md` (axes, radians)
- `plans/PLAN-05-camera-input.md` → C2

## Expected output
- `src/camera/Controls.js` (updates Camera from polled input each frame); edit `src/camera/index.js`.
- Road: `roads/PLAN-05/C2-controls.md`.
