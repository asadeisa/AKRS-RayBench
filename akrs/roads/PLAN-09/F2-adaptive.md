# ROAD — progressive + adaptive rendering
Status: DONE + superseded by memory/performance.md
Task: adaptive internal resolution under frame pressure + progressive refine — delivers the U3 seam.
Plan / Phase: PLAN-09 / F2   (needs F1; adaptive path also needs only PLAN-06/E1, landed)

## Context to load (read order)
1. `../../memory/performance.md` (adaptive resolution + progressive; output-identical at scale 1)
2. `../../memory/rendering.md` (Renderer DOM-free `{ width, height, data }` buffer; injected params)
3. `../../memory/engine.md` (`Loop` timing snapshot), `../../memory/ui.md` (U3 binds the controller)
4. `../../plans/PLAN-09-performance.md` → F2
5. `src/render/Renderer.js`, `src/perf/index.js` (F1)

## Expected files (change scope)
- `src/perf/AdaptiveController.js` — create (`{ enabled, targetMs, minScale, maxScale, currentScale }`;
  `update(frameMs) → scale` — lower when over budget, raise when under, clamp; `enabled=false` ⇒ scale 1)
- `src/perf/progressive.js`        — create (optional: coarse first pass → refine on still frames)
- `src/render/Renderer.js`         — edit (settable internal buffer size; scale 1 stays byte-identical)
- `src/perf/index.js`              — edit (export `AdaptiveController` [+ progressive])
- (nothing outside this list; the canvas upscale/blit itself lives in boot — main.js, PLAN-08)

## Boundaries
- Do: expose a clean `AdaptiveController` — `enabled` + `targetMs` + `currentScale` — that **U3's
  adaptive toggle / resolution setting bind to**; render internally at `canvas × scale`.
- Do: keep `scale = 1` output byte-identical to the current renderer (adaptive off = no visual change).
- Do NOT: require F1's BVH (adaptive works on the linear path too); change shading/reflection/AA math;
  reach into the DOM (boot owns `putImageData` + upscale).

## Acceptance
- With `enabled` and a simulated over-budget `frameMs`, `update` lowers `currentScale` (fewer pixels);
  cheap frames raise it back toward `maxScale`; values stay within `[minScale, maxScale]`.
- `enabled = false` ⇒ `currentScale === 1` and the rendered buffer is byte-identical to the
  pre-adaptive renderer for the same inputs.
- The internal buffer upscales to fill the canvas with no gaps (verify the blit path in boot).
- Interim scratch-assert check (controller scale math up/down/clamp; scale-1 byte-identity); live browser
  verification that frame rate responds; formal regression deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md` — note **U3's adaptive toggle can now wire to `AdaptiveController` for real**
(no more inert seam); set this Road `DONE + superseded by memory/performance.md` or refresh Expected
files; keep `../../memory/performance.md` + `../../memory/ui.md` in agreement. **F2 unblocks F3 + PLAN-08/U3.**
