# TASK — renderer & gameplay regression
Plan / Phase: PLAN-10 (Quality, Testing & Docs) / Q2

## Objective
Guard the integrated pipeline against silent breakage: a **pixel-hash regression** for the ray
tracer over a fixed tiny scene, plus **smoke tests** for the engine loop, event bus, and the
gameplay save round-trip. Extends the Q1 harness — no new dependency.

## Constraints
- Build on Q1's `tests/harness.js` / `tests/run.js`; add `*.test.js` files only. **No libraries.**
- **Renderer regression:** render a small deterministic scene (fixed camera, `samples: 1` for
  determinism, small W×H) through the real `Renderer.render(camera, scene)`; hash the RGBA buffer
  (a plain hand-written hash over the `Uint8ClampedArray`) and assert it equals a committed golden.
  Include the **BVH-vs-linear-scan equality** and **early-termination epsilon** checks (currently
  only scratch-asserted, per STATE → Next) as real regression cases here.
- **Adaptive/scale math:** assert `Renderer.setScale(1)` is byte-identical to no-scale, `setScale(0.5)`
  halves the buffer, and the `AdaptiveController` scale-step + `FrameBudget` smoothing math match
  their `memory/performance.md` contracts. (The canvas upscale-blit itself is DOM/Playwright-verified
  in [[ui]], not unit-tested — reference that, don't duplicate it.)
- **Smoke:** `Loop` ticks `update`→`render` with a clamped dt (stub rAF/`performance.now`); `EventBus`
  `on`/`emit` fires; `save`/`load` round-trips a snapshot through a **stubbed `localStorage`** (no DOM).
- Determinism is mandatory — no wall-clock, no `Math.random` without a fixed seed/`samples:1` path.
  Do NOT modify `src/` to fit the test; flag any true blocker as an Open question.

## References (read, do not duplicate)
- `memory/testing.md` (snapshot/regression + smoke strategy), `memory/rendering.md` (`traceRay`,
  `Renderer.render(camera, scene)`, gamma), `memory/performance.md` (BVH output-identical, early-term
  epsilon, `setScale`, `AdaptiveController`/`FrameBudget` math)
- `memory/engine.md` (Loop timing, EventBus), `memory/gameplay.md` (`save`/`load`/`snapshot`)
- `plans/PLAN-10-quality.md` → Q2 (depends on Q1, PLAN-04, PLAN-07 — all landed)

## Expected output
- `tests/render.test.js`, `tests/perf.test.js`, `tests/engine.test.js`, `tests/gameplay.test.js`
  (create) + a committed golden hash constant. Green under `node tests/run.js`.
- Road: `roads/PLAN-10/Q2-regression.md`.
