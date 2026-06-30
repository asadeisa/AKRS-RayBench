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
- Movement collision is resolved by [[engine]] collision, not by the camera.
- Mouse sensitivity + invert-Y: settings-driven, defaults TBD ([[ui]]).

Related: [[math]] · [[rendering]] · [[engine]] · [[ui]]
