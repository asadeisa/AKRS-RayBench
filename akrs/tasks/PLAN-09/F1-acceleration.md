# TASK — acceleration structure (BVH) + early ray termination
Plan / Phase: PLAN-09 (Performance & Acceleration) / F1

## Objective
Make hit queries sub-linear **without changing pixels**: a BVH over per-object AABBs that
`scene.intersect` uses instead of a linear scan, plus **early ray termination** in `traceRay` when the
remaining reflection weight is negligible. Same output, fewer tests.

## Constraints
- `src/perf/` ES modules + **minimal additive hooks** in `src/geometry/Scene.js` and `src/render/trace.js`.
  May import `src/math/` (`AABB`) and read `scene.objectBounds()` ([[geometry]]).
- BVH built from `scene.objectBounds()` (`{ object, worldAABB }`, PLAN-02/G4); prune nodes with
  `AABB.intersectRay` (PLAN-01/M4); leaf tests call each object's own `intersect(ray)`; narrow `tMax`
  to the nearest. **Output-identical** to the linear scan — the same closest `Hit` (`memory/performance.md`).
- **Accelerator seam:** `Scene.setAccelerator(accel)` + `Scene.intersect` delegates to a duck-typed
  `accel.intersect(ray, tMax)` when set, else the existing linear scan. Geometry does **not** import
  perf (the concrete BVH is injected at boot) — additive, Mode 4-authorized. Rebuild on scene change
  (room swap), **not per frame**.
- **Early termination:** in `traceRay`, stop recursing when the remaining reflection weight is below
  `EARLY_TERM_EPS` (a render budget, [[conventions]]) — a negligible contribution, output-identical
  within epsilon; the existing depth cap stays.
- Do NOT change any visual contract owned by [[rendering]]/[[materials]] — only how fast it is reached.

## References (read, do not duplicate)
- `memory/performance.md` (BVH over objectBounds; output-identical; rebuild on scene change; early term)
- `memory/rendering.md` (`traceRay` reflection recursion + weight; depth cap)
- `memory/geometry.md` (`Scene.intersect`, `Scene.objectBounds()`), `memory/math.md` (`AABB.intersectRay`)
- `memory/conventions.md` (render budgets), `plans/PLAN-09-performance.md` → F1

## Expected output
- `src/perf/BVH.js`, `src/perf/index.js`; edit `src/geometry/Scene.js` (accelerator seam), `src/render/trace.js` (early term).
- Road: `roads/PLAN-09/F1-acceleration.md`.
