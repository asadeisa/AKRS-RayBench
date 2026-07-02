# ROAD — renderer & gameplay regression
Status: DONE + superseded by memory/testing.md
Task: Pixel-hash regression for the tracer + BVH/early-term/scale checks + engine/save smoke tests.
Plan / Phase: PLAN-10 / Q2   (deps Q1, PLAN-04, PLAN-07 — all landed)

## Context to load (read order)
1. `../../memory/testing.md` (snapshot/regression + smoke strategy)
2. `../../memory/rendering.md` (`traceRay`, `Renderer.render(camera, scene)`, single-gamma write-out)
3. `../../memory/performance.md` (BVH **output-identical**; `EARLY_TERM_EPS`; `Renderer.setScale`; `AdaptiveController`/`FrameBudget` math)
4. `../../memory/engine.md` (Loop timing + clamp, EventBus) · `../../memory/gameplay.md` (`save`/`load`/`snapshot`/`restart`)
5. `../../plans/PLAN-10-quality.md` → Q2
6. `tests/harness.js`, `tests/run.js` (Q1 — extend, do not rewrite); `src/render/`, `src/perf/`, `src/engine/`, `src/game/save.js`

## Expected files (change scope)
- `tests/render.test.js`    — create (fixed tiny scene + fixed camera, `samples: 1`; hash the RGBA
  buffer; assert `=== GOLDEN_HASH`; a lit-vs-background pixel differs, alpha 255)
- `tests/perf.test.js`      — create (BVH `intersect` == linear `Scene.intersect` over many random
  rays incl. misses/inside; `setAccelerator(null)` restores linear; early-term within `EARLY_TERM_EPS`
  of full-depth while a strong mirror is unaffected; `setScale(1)` byte-identical, `setScale(0.5)`
  halves; `AdaptiveController` step + `FrameBudget` sliding-window math)
- `tests/engine.test.js`    — create (Loop dt clamp + update→render order via stubbed rAF/`performance.now`; EventBus on/emit/off)
- `tests/gameplay.test.js`  — create (`save`→`load` round-trip through a **stubbed `localStorage`**; `restart()` reset)
- (extend `tests/run.js` discovery only if it doesn't already glob `*.test.js`; **no `src/` changes**)

## Boundaries
- Do: keep everything deterministic (fixed camera, `samples: 1`, seeded/none `Math.random`, stubbed
  clock + `localStorage`); commit the golden hash as a constant; reuse the real `src/` modules.
- Do NOT: modify `src/` to fit a test; unit-test the canvas upscale-blit or pointer-lock (those are
  DOM/Playwright-verified in [[ui]] — reference, don't duplicate); re-test the pure core covered by Q1.
  If a real bug surfaces (e.g. the blown-out reference level, STATE → Open questions), **record it, do
  not fix it here** — Q2 builds guards, it does not change behavior.

## Acceptance
- `node tests/run.js` still exits 0 with the new suites; the renderer hash test fails (exit 1) if the
  tracer output changes, proving it's a real guard.
- BVH-vs-linear equality and the early-termination epsilon bound are now **automated** (no longer only
  scratch-asserted); save round-trip and loop/event smoke pass.

## Close-out (when it lands)
Update `../../STATE.md` (Done / Next: Q3; timestamp+author; note any bug the regression surfaced);
set this Road `DONE + superseded by memory/testing.md` or refresh Expected files. **Q2 unblocks Q3.**
