# ROAD — first-person camera
Status: DONE + superseded by memory/camera-input.md
Task: build the Camera (state + basis + rayFor/viewMatrix/projectionMatrix). Unblocks PLAN-04/R1.
Plan / Phase: PLAN-05 / C1   (deps PLAN-01/M2 Matrix4, M3 Quaternion — both landed)

## Context to load (read order)
1. `../../memory/camera-input.md` (camera contract; the renderer needs only `rayFor`)
2. `../../memory/conventions.md` (right-handed, +X/+Y, −Z forward; radians)
3. `../../memory/math.md` (Matrix4 `lookAt`/`perspective`/`inverse`; Vector3; Ray)
4. `../../plans/PLAN-05-camera-input.md` → C1
5. `src/math/index.js` (Vector3, Matrix4, Quaternion, Ray)

## Expected files (change scope)
- `src/camera/Camera.js`  — create (position, yaw, pitch, fov, near, far; forward/right/up basis;
  `rayFor(px, py, width, height)`, `viewMatrix()`, `projectionMatrix(aspect)`; runtime FOV setter)
- `src/camera/index.js`   — create (barrel)
- (nothing outside `src/camera/`; do not touch `src/math/`, `src/render/`)

## Boundaries
- Do: derive forward/right/up from yaw/pitch; **−Z forward** convention; angles in radians.
- Do: `rayFor` origin = position, direction through the pixel **center** `(px+0.5, py+0.5)`, spread
  by vertical FOV + aspect (`width/height`), rotated by the basis, **normalized**.
- Do: keep `projectionMatrix` FOV meaning (vertical) consistent with `rayFor`.
- Do NOT: implement controls/input (C2), read DOM events, resolve collision, or build a renderer.

## Acceptance
- Center-pixel ray direction ≈ camera forward (−Z when yaw=pitch=0); the four corner rays fan out
  symmetrically by the vertical FOV and aspect; all `rayFor` directions are unit length.
- Yawing 90° about +Y rotates forward from −Z toward −X (matches the math-core handedness check).
- `projectionMatrix(aspect)` maps near/far to NDC z = ∓1 (consistent with Matrix4.perspective).
- Interim scratch-assert check (center + corner ray directions; forward after a yaw); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md` (Done/Next/timestamp) — note this **unblocks PLAN-04/R1**; set this Road
`DONE + superseded by memory/camera-input.md` or refresh Expected files; keep `../../memory/camera-input.md` in agreement.
