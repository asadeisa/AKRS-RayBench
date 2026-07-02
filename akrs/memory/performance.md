# Memory — Performance & Acceleration
Owns: the acceleration structure and the progressive/adaptive rendering techniques. Truth lives
in `src/perf/` (+ hooks inside `src/render/`). Cross-cuts [[rendering]] + [[engine]]; structural
changes here are Mode 4.

## Techniques (from data.md)
- **Object acceleration structure** — BVH over per-object AABBs ([[geometry]]); scene.intersect uses it instead of a linear scan. — **Decided** (data.md "object acceleration structure"); BVH is the **Assumption (Med)** choice.
- **Early ray termination** — stop when remaining reflection weight is negligible or depth limit hit ([[conventions]]).
- **Progressive rendering** — render coarse → refine across frames so the loop stays responsive. — **Decided**.
- **Adaptive resolution** — drop internal render resolution under frame-time pressure, upscale to canvas. — **Decided**.
- **Frame timing** — measure per-frame ms; feed FPS counter + adaptive controller ([[engine]], [[ui]]).

## Contract
- The acceleration structure rebuilds when the active scene changes (room swap), not per frame. — **Assumption (Med)**.
- Performance must not change visual contracts owned by [[rendering]]/[[materials]] — only how fast they are reached.

## Contracts / decisions (PLAN-09 Phase I)
- **BVH accelerator (F1)** — `src/perf/BVH.js` builds from `scene.objectBounds()` ([[geometry]]); prunes
  with `AABB.intersectRay` ([[math]]); leaf-tests each object's own `intersect`; returns the **same
  closest `Hit`** as the linear scan (output-identical). Median split — **Assumption (Med)**.
- **Accelerator seam (F1)** — `Scene.setAccelerator(accel)` + `Scene.intersect` delegates to duck-typed
  `accel.intersect(ray, tMax)` when set, else the linear scan. Geometry does **not** import perf (BVH
  injected at boot); rebuilt on scene change, not per frame. Additive, Mode 4-authorized. — **Decided (PLAN-09/F1)**.
- **Early ray termination (F1)** — `traceRay` skips the reflection recursion when the remaining weight's
  max component < `EARLY_TERM_EPS` (a [[conventions]] budget); output-identical within epsilon; depth
  cap unchanged. — **Decided (PLAN-09/F1)**.
- **AdaptiveController (F2) — the PLAN-08/U3 seam** — `src/perf/AdaptiveController.js`:
  `{ enabled, targetMs, minScale, maxScale, currentScale }`; `update(frameMs) → scale` (lower over
  budget, raise under, clamp); `enabled = false` ⇒ `scale = 1` (full res, **byte-identical** to today).
  Renderer renders at `canvas × scale`; boot upscales the DOM-free buffer to the canvas. **U3's adaptive
  toggle binds `enabled`; the resolution setting binds `targetMs`/`minScale`** ([[ui]]). Adaptive path is
  independent of the BVH. — **Decided (PLAN-09/F2)**.
- **Progressive (F2)** — coarse first pass → refine on still frames. Keep simple. — **Assumption (Med)**.
- **Frame budget (F3)** — `src/perf/FrameBudget.js` measures **render-only ms** (not `Loop` dt), smooths
  it (moving average), holds a `targetMs` budget (~33 ms / 30 fps — **Assumption (Med)**), and feeds
  `AdaptiveController.update`. — **Decided (PLAN-09/F3)**.

## Landed
- **F1 (BVH + early ray termination)** — `src/perf/BVH.js`: median-split tree over
  `scene.objectBounds()` (`LEAF_SIZE = 4`, splits the longer axis at the median of each entry's AABB
  centroid); `intersect(ray, tMin, tMax)` prunes with `AABB.intersectRay` on each node's bounds
  (compared against the caller's `tMax`, not the node's own entry `t`), leaf-tests every object's own
  `intersect`, narrows `tMax` to the nearest hit exactly like the linear scan. `src/perf/index.js`
  barrel exports `BVH`. `src/geometry/Scene.js`: constructor now carries `_accelerator = null`;
  `setAccelerator(accel)` setter; `intersect()` delegates to `accel.intersect(ray, tMin, tMax)` first
  when set, else falls through to the unchanged linear scan — no perf import in geometry, the concrete
  `BVH` is injected at boot. `src/render/trace.js`: `traceRay` gained a `weight` param (default
  `Vector3(1,1,1)`) tracking the accumulated reflection weight along the current ray path; before
  recursing into a reflection, computes `nextWeight = mulColor(weight, reflection.weight)` and skips
  the recursive call (and its contribution) when `Math.max(nextWeight.x, nextWeight.y, nextWeight.z) <
  EARLY_TERM_EPS` — the depth cap and the rest of the local-shade computation are untouched.
  `EARLY_TERM_EPS = 1/255` exported from `trace.js` (not promoted to `conventions.md` — still a
  perf-local tuning constant per the Road's scope).
  **Scratch-assert verification passed**: BVH matched the linear scan's closest `Hit` (object, t) over
  500 random rays plus an inside-a-sphere case and an all-miss case; `setAccelerator(bvh)` then
  `setAccelerator(null)` reproduced the identical linear result; a weak reflector (reflectivity 0.02)
  produced output within `EARLY_TERM_EPS` between `maxDepth=2` and `maxDepth=20`; a strong mirror pair
  (reflectivity 0.95, two facing ambient-lit Planes) showed a meaningfully larger accumulated color at
  `maxDepth=20` than `maxDepth=3` — confirming early termination does not truncate a still-significant
  reflection chain. **PLAN-09/F1 now complete — unblocks F2.**

- **F2 (progressive + adaptive rendering)** — `src/perf/AdaptiveController.js`: `{ enabled, targetMs,
  minScale, maxScale, currentScale, step }` (constructor defaults `enabled=false`, `targetMs=33`,
  `minScale=0.5`, `maxScale=1`, `step=0.05`); `update(frameMs)` — `enabled=false` short-circuits to
  `currentScale = 1` (byte-identical, no adaptive); otherwise steps `currentScale` down when
  `frameMs > targetMs`, up otherwise, clamped to `[minScale, maxScale]`. `src/perf/progressive.js`:
  `ProgressiveRefiner` — `{ startScale, maxScale, step }`, `reset()` drops to `startScale` (caller
  calls this on camera movement), `advance()` steps toward `maxScale` (caller calls this per still
  frame). Kept deliberately simple, no scene-aware logic. `src/render/Renderer.js`: constructor now
  also stores `baseWidth`/`baseHeight`; new `setScale(scale)` recomputes `this.width/height =
  round(base × scale)` (min 1) — `render()` itself is unchanged, still reads `this.width/height`, so
  `setScale(1)` reproduces the exact constructor dimensions and byte-identical output. `src/perf/index.js`
  now also exports `AdaptiveController`, `ProgressiveRefiner`.
  **Scope note:** per the Road's boundaries, F2 does **not** touch `src/main.js`/boot — the canvas
  upscale/blit-at-internal-size wiring, and actually driving `AdaptiveController.update` from a live
  frame-ms + calling `renderer.setScale(controller.currentScale)`, is left for **PLAN-08/U3** to wire
  (that's the seam this phase exists to deliver). Live-in-browser adaptive behavior is unverified until
  U3 lands; only the pieces themselves are scratch-asserted here.
  **Scratch-assert verification passed**: an over-budget `frameMs` lowered `currentScale`, a cheap one
  raised it, repeated over/under-budget updates stayed within `[minScale, maxScale]`; `enabled=false`
  forced `currentScale=1` even after simulating a stale low value; `Renderer.setScale(1)` reproduced
  byte-identical output to a renderer never touched by `setScale` (16×12, 1 sample, deterministic
  center-jitter); `setScale(0.5)` halved the internal buffer dimensions and produced a correctly-sized
  smaller buffer, and a subsequent `setScale(1)` restored the original base size;
  `ProgressiveRefiner` defaulted to `maxScale`, `reset()` dropped to `startScale`, `advance()` stepped
  up and clamped at `maxScale`. **PLAN-09/F2 now complete — unblocks F3 and (once F3 lands) PLAN-08/U3
  can wire the adaptive toggle for real.**

- **F3 (frame timing & budgets)** — `src/perf/FrameBudget.js`: `{ targetMs, window, smoothedMs }`
  (constructor defaults `targetMs=33` — Assumption (Med), `window=10` frames); `sample(ms)` pushes into
  a fixed-size sliding window (oldest dropped once full) and recomputes `smoothedMs` as the window's
  plain average — a spike moves the average by roughly `1/window` of its size, not the full spike.
  `src/perf/index.js` now also exports `FrameBudget`. **Boot wiring** (`src/main.js`): a module-level
  `frameBudget = new FrameBudget()` and `adaptiveController = new AdaptiveController({ targetMs:
  frameBudget.targetMs })`; `render()` times `renderer.render(camera, scene)` with `performance.now()`
  (render-only ms, not `Loop`'s `dt`), feeds it through `frameBudget.sample()`, then
  `adaptiveController.update(smoothedMs)` — **the controller's `currentScale` is computed live every
  frame but nothing calls `renderer.setScale()` with it yet**, so this changes zero pixels regardless
  of `AdaptiveController.enabled`'s state (kept `false` by default). `src/ui/DebugOverlay.js` gained an
  optional `frameBudget` constructor param (`null` by default, fully backward compatible); when
  present, appends a read-only `render: <ms> ms (target <targetMs>)` line, distinct from the existing
  Loop-dt-derived `frame:` line.
  **Scope note:** applying `adaptiveController.currentScale` to `renderer.setScale()` and the
  canvas upscale-on-blit are left for **PLAN-08/U3** (per F2's boundary — boot's DOM/blit ownership is
  U3's, not F3's) — F3 only supplies the live, smoothed ms signal and the already-computing controller
  value for U3 to consume.
  **Scratch-assert verification passed**: a single large spike moved the smoothed value by ~1/window
  of the spike (not to the spike itself); smoothed ms tracked a sustained heavier run upward and a
  sustained lighter run downward; feeding `FrameBudget.sample()` output into `AdaptiveController.update()`
  under a sustained 60ms (>33ms target) synthetic render pushed `currentScale` down from 1 toward
  `minScale`, and a subsequent sustained 5ms run recovered it; `targetMs` is mutable at runtime.
  **PLAN-09 (F1 + F2 + F3) now complete** — the reference boot has a live, output-identical adaptive
  signal ready; unblocks PLAN-08/U3.
- **Consumed by PLAN-08/U3 (landed)** — `AdaptiveController.enabled` now binds to a live settings
  toggle; `render()` calls `renderer.setScale(adaptiveController.currentScale)` whenever enabled (the
  first thing to actually apply a non-1 scale to pixels); boot added a canvas upscale-on-blit for when
  the internal buffer is smaller than the canvas. U3 deliberately did **not** map the manual
  resolution-scale setting onto `AdaptiveController.minScale`/`maxScale` — see `memory/ui.md` →
  Landed (U3) for why (a collapsed-band bug caught live in Playwright). The controller's `[minScale,
  maxScale]` stays at its own F2 defaults (`0.5`–`1`), independent of the manual slider.

## Decisions / open
- WebWorker tiling for parallel CPU tracing: **Unknown / future** — only if single-thread misses budget; would be a Mode 4 decision.
- `EARLY_TERM_EPS` + target frame budget ms are perf tuning values (Assumptions) — promote to [[conventions]] budgets if they need a single canonical owner. Confirm in STATE.

Related: [[rendering]] · [[geometry]] · [[engine]] · [[conventions]] · [[ui]]
