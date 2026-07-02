# TASK — progressive + adaptive rendering
Plan / Phase: PLAN-09 (Performance & Acceleration) / F2

## Objective
Keep the loop responsive on heavy scenes: **drop internal render resolution under frame-time pressure**
and upscale to the canvas, plus coarse→refine **progressive** rendering across frames. **This phase
delivers the `AdaptiveController` seam that PLAN-08/U3's adaptive-resolution toggle binds to** — it is
what unblocks U3.

## Constraints
- `src/perf/` ES modules + a hook on `src/render/Renderer.js` (settable internal buffer size) + boot
  integration. May import `src/math/`, `src/render/`.
- **AdaptiveController** — `{ enabled, targetMs, minScale, maxScale, currentScale }`; `update(frameMs) →
  scale` lowers `currentScale` when `frameMs > targetMs`, raises it when under, clamped to
  `[minScale, maxScale]`; `enabled = false` ⇒ `scale = 1` (full res). This is the **U3 seam** (the
  toggle sets `enabled`; the resolution setting sets `targetMs`/`minScale`).
- Renderer renders at internal `width×height = canvas × scale`; boot upscales the DOM-free
  `{ width, height, data }` buffer to the canvas (`putImageData` at internal size + CSS/`drawImage`
  upscale). **`scale = 1` must be byte-identical to today's output** — no visual change except the
  deliberate resolution drop under pressure (`memory/performance.md`).
- **Progressive:** coarse first pass → refine on subsequent still frames. Keep it simple — **Assumption (Med)**.
- The adaptive path must work **independent of F1's BVH** (adaptive resolution doesn't need the
  accelerator) — so F2 can land right after F1, or be pulled ahead if U3 is the priority.
- No visual-contract change beyond resolution scaling.

## References (read, do not duplicate)
- `memory/performance.md` (adaptive resolution + progressive; output-identical at scale 1)
- `memory/rendering.md` (Renderer DOM-free buffer + injected params), `memory/engine.md` (`Loop` timing)
- `memory/ui.md` (U3 binds `AdaptiveController.enabled`/`targetMs`)
- `plans/PLAN-09-performance.md` → F2

## Expected output
- `src/perf/AdaptiveController.js` (+ `src/perf/progressive.js` if used); edit `src/render/Renderer.js` (settable size), `src/perf/index.js`.
- Road: `roads/PLAN-09/F2-adaptive.md`.
