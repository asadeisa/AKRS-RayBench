# ROAD — primary rays & framebuffer
Status: DONE + superseded by memory/rendering.md
Task: pixel loop → camera.rayFor → background color into an RGBA8 ImageData buffer (clamp+gamma write-out).
Plan / Phase: PLAN-04 / R1   (PLAN-01/02/03 landed)

## Context to load (read order)
1. `../../memory/rendering.md` (pipeline order; write-out; contracts the tracer relies on)
2. `../../memory/conventions.md` (gamma 2.2; ImageData RGBA8 0–255; linear color)
3. `../../memory/camera-input.md` (`rayFor(px, py, width, height) → Ray`)
4. `../../plans/PLAN-04-ray-tracer.md` → R1
5. `src/math/index.js` (Vector3, Ray)

## Expected files (change scope)
- `src/render/Renderer.js`   — create (holds `{ width, height, data: Uint8ClampedArray }`; pixel
  loop; per pixel: `camera.rayFor` → background color → `writeColor`; render params injected)
- `src/render/writeColor.js` — create (linear `Vector3` → clamp[0,1] → gamma 2.2 → ×255 → RGBA8 at index)
- `src/render/index.js`      — create (barrel)
- (nothing outside `src/render/`; do not build a camera — that is PLAN-05)

## Boundaries
- Do: keep `src/render/` DOM-free — produce an ImageData-shaped buffer; boot (main.js/PLAN-06) blits it.
- Do: take render params (background, gamma) as injected options whose defaults mirror `conventions`.
- Do NOT: implement closest-hit, shading, shadows, reflections (R2–R3), or AA (R4).
- Do NOT: stub/redefine the camera or read budgets by redefining them in `render/`.

## Acceptance
- With a provided camera exposing `rayFor`, a W×H render fills the whole buffer with the background,
  gamma-encoded (a mid-gray linear input round-trips to its expected 0–255 byte, not raw ×255).
- Buffer is `Uint8ClampedArray` of length `W*H*4`, alpha = 255.
- Interim scratch-assert check with a fake camera (returns a fixed `Ray`); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md` (Done/Next/timestamp); set this Road `DONE + superseded by memory/rendering.md`
or refresh Expected files; keep `../../memory/rendering.md` in agreement.
