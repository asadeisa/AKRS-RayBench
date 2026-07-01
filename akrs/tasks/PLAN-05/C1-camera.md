# TASK — first-person camera
Plan / Phase: PLAN-05 (Camera & Input) / C1

## Objective
Build the first-person `Camera` in `src/camera/`: position + yaw/pitch basis, FOV, near/far, and the
methods the renderer + any debug raster need — `rayFor(px, py, width, height) → Ray`, `viewMatrix()`,
`projectionMatrix(aspect)`. **This is the task that unblocks PLAN-04/R1.**

## Constraints
- Vanilla JS ES module in `src/camera/`; no libraries. Import `Vector3`/`Matrix4`/`Quaternion`/`Ray`
  via `../math/index.js`.
- Convention: right-handed, **+X right, +Y up, −Z forward** (camera looks −Z); angles in **radians** (`memory/conventions.md`).
- **FOV = vertical**; aspect = `width / height`. `rayFor` and `projectionMatrix` MUST agree on that FOV meaning.
- `rayFor`: origin = camera position; direction through the **pixel center**, spread by vertical FOV
  + aspect, rotated into world by the yaw/pitch basis; return a **unit-direction** `Ray`.
- FOV adjustable at runtime; near/far configurable.
- No controls/input (C2); no collision (engine owns it); do not read DOM events here.

## References (read, do not duplicate)
- `memory/camera-input.md` (camera contract: `rayFor`/`viewMatrix`/`projectionMatrix`)
- `memory/conventions.md` (axes, radians)
- `memory/math.md` (Matrix4 `lookAt`/`perspective`/`inverse`; Vector3; Ray)
- `plans/PLAN-05-camera-input.md` → C1

## Expected output
- `src/camera/Camera.js` (state + basis + `rayFor`/`viewMatrix`/`projectionMatrix`), `src/camera/index.js` (barrel).
- Road: `roads/PLAN-05/C1-camera.md`.
