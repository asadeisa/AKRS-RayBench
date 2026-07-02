# TASK — frame timing & budgets
Plan / Phase: PLAN-09 (Performance & Acceleration) / F3

## Objective
Give the adaptive controller a real signal: per-frame **render-ms** measurement (smoothed) + a target
**frame budget**, so quality scales to hold an interactive frame rate. Feeds F2's `AdaptiveController`
and the FPS/debug overlay ([[ui]]).

## Constraints
- `src/perf/` ES module + a boot hook. Measure the **render() ms specifically** (distinct from the
  `Loop` `dt`, which includes idle/other work); smooth over a short window (moving average) so the
  scale doesn't jitter; expose a `targetMs` budget (e.g. 33 ms / 30 fps — **Assumption (Med)**).
- Feed `AdaptiveController.update(smoothedRenderMs)` from the boot loop; optionally surface render-ms in
  the debug overlay (U2, already built — read-only add).
- No visual change; measurement + control only.

## References (read, do not duplicate)
- `memory/performance.md` (frame timing feeds the adaptive controller)
- `memory/engine.md` (`Loop` timing snapshot `{ dt, elapsed, frame, fps }`)
- `memory/ui.md` (FPS/debug overlay consumers), `plans/PLAN-09-performance.md` → F3

## Expected output
- `src/perf/FrameBudget.js` (measure + smooth + target budget); edit boot wiring + `src/perf/index.js`.
- Road: `roads/PLAN-09/F3-frame-budget.md`.
