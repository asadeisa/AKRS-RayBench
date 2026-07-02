# ROAD — frame timing & budgets
Status: DONE + superseded by memory/performance.md
Task: smoothed per-frame render-ms + a target frame budget driving the adaptive controller.
Plan / Phase: PLAN-09 / F3   (needs F2)

## Context to load (read order)
1. `../../memory/performance.md` (frame timing feeds the adaptive controller; stable target budget)
2. `../../memory/engine.md` (`Loop` timing snapshot `{ dt, elapsed, frame, fps }`)
3. `../../memory/ui.md` (FPS/debug overlay consumers — read-only add)
4. `../../plans/PLAN-09-performance.md` → F3
5. `src/perf/index.js` (AdaptiveController from F2), `src/engine/index.js` (Loop)

## Expected files (change scope)
- `src/perf/FrameBudget.js` — create (measure the `render()` ms specifically; smooth over a short window
  = moving average; hold a `targetMs` budget, default ~33 ms — Assumption; expose the smoothed ms)
- boot wiring (`src/main.js`, PLAN-08) — edit (time the render call → `FrameBudget` → feed
  `AdaptiveController.update(smoothedRenderMs)`; optionally show render-ms in the debug overlay)
- `src/perf/index.js`       — edit (export `FrameBudget`)
- (nothing else; measurement + control only)

## Boundaries
- Do: measure render-only ms (not full `dt`); smooth it; expose a tunable `targetMs`; drive F2's controller.
- Do NOT: change any pixels; couple the budget to a specific scene; duplicate the `Loop`'s existing dt/fps.

## Acceptance
- `FrameBudget` reports a smoothed render-ms that tracks a rising/falling synthetic render time without
  jumping on a single spike; a heavy synthetic frame pushes the fed `AdaptiveController` to lower scale,
  a light one lets it recover.
- `targetMs` is adjustable (the U3 resolution/quality setting can set it later).
- Interim scratch-assert check (smoothing + budget→controller feed with synthetic ms); live browser
  verification that a heavy scene stays responsive; formal regression deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/performance.md` or refresh Expected
files; keep `../../memory/performance.md` in agreement. **F3 completes PLAN-09** — the reference scene
holds an interactive frame rate with output identical to the un-accelerated path (regression = PLAN-10).
