# Memory — Camera & Input
Owns: the first-person camera contract and the player input contract. Truth lives in
`src/camera/`. Consumes [[math]]; input events flow from the engine input manager ([[engine]]).

## Camera contract
- State: position (Vector3), yaw/pitch (radians) → forward/right/up basis, FOV, near, far.
- `rayFor(px, py, width, height) → Ray` — the only thing the renderer needs ([[rendering]]).
- `viewMatrix()` / `projectionMatrix()` available for any raster/debug overlay.
- Aspect from canvas dimensions; FOV adjustable at runtime (data.md). — **Decided**.

## Controls (from data.md)
- **WASD** movement (relative to yaw, on the XZ plane). — **Decided**.
- **Mouse look** via Pointer Lock API; pitch clamped to ±~89°. — **Assumption (High)** (pointer lock is the standard FP approach in a browser).
- FOV adjust exposed to settings ([[ui]]).
- Near/far clipping configurable. — **Decided**.

## Decisions / open
- **FOV = vertical; aspect = width/height.** `rayFor` and `projectionMatrix` share that FOV meaning.
  `rayFor` casts through the pixel **center** `(px+0.5, py+0.5)`, spread by vertical FOV + aspect,
  rotated by the yaw/pitch basis, origin = position, direction normalized. — **Decided (PLAN-05)**.
- Movement collision is resolved by [[engine]] collision, not by the camera.
- Mouse sensitivity + invert-Y: settings-driven, defaults TBD ([[ui]]). `Controls` ships defaults
  (`mouseSensitivity = 0.0022` rad/px, `invertY = false`, `moveSpeed = 5` m/s) as constructor
  overrides pending real settings wiring — **Assumption (Med)**.
- **Input-manager contract (PLAN-06/E3, not yet built):** `Controls.update(camera, input, dt)`
  expects `input = { forward, backward, left, right: boolean, mouseDeltaX, mouseDeltaY: number,
  pointerLocked: boolean, fovDelta: number }` — a normalized, polled snapshot per frame. `Controls`
  was built against this shape (same pattern as PLAN-04/R1 coding to `Camera` before C1 landed);
  E3 must conform to it or this contract must be renegotiated. — **Assumption (Med), confirm when
  building E3**.
- Pitch clamp: ±89° (`Controls`' `pitchLimit`, default `89° in radians`). — **Decided (PLAN-05/C2)**.
- Movement is yaw-relative on the XZ plane only — pitch never tilts movement; Y is untouched by
  WASD. — **Decided (PLAN-05/C2)**.

Related: [[math]] · [[rendering]] · [[engine]] · [[ui]]
