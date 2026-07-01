# TASK — primary rays & framebuffer
Plan / Phase: PLAN-04 (Ray Tracer) / R1

## Objective
Stand up the renderer: iterate every pixel, get a primary ray from `camera.rayFor(px, py, width,
height)`, and write a constant background color into a Canvas-compatible RGBA8 `ImageData` buffer
through a single clamp→gamma→×255 write-out. Proves the camera→pixel path with a visible frame.

## Constraints
- Vanilla JS ES module in `src/render/`; no libraries. Import `Vector3`/`Ray` via `../math/index.js`.
- **Prerequisite (blocked):** `camera.rayFor()` (PLAN-05/C1) is not built yet. R1 codes to that
  interface but cannot *run* until C1 lands — see STATE. Do not stub a camera here (owned by PLAN-05).
- Renderer operates on an `ImageData`-shaped buffer `{ width, height, data: Uint8ClampedArray }`;
  the boot layer (main.js / PLAN-06) blits it to the canvas. Keep `src/render/` DOM-free.
- Write-out: clamp [0,1] → gamma 2.2 → ×255 (`memory/conventions.md`, `memory/rendering.md`). No double gamma.
- Background/sky = a constant color param (`memory/rendering.md` — Assumption Med).
- No closest-hit, shading, shadows, or reflections yet (R2–R3).

## References (read, do not duplicate)
- `memory/rendering.md` (pipeline order; write-out; contracts the tracer relies on)
- `memory/conventions.md` (gamma 2.2; ImageData RGBA8 0–255; linear color)
- `memory/camera-input.md` (`rayFor` contract)
- `plans/PLAN-04-ray-tracer.md` → R1

## Expected output
- `src/render/Renderer.js` (pixel loop + ImageData buffer + background fill via camera rays),
  `src/render/writeColor.js` (linear Vector3 → clamp+gamma+RGBA8 write), `src/render/index.js` (barrel).
- Road: `roads/PLAN-04/R1-primary-rays.md`.
