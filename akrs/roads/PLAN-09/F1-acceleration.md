# ROAD — acceleration structure (BVH) + early ray termination
Status: DONE + superseded by memory/performance.md
Task: BVH behind scene.intersect (output-identical) + early ray termination on negligible weight.
Plan / Phase: PLAN-09 / F1   (deps PLAN-02/G4, PLAN-04/R2 — both landed)

## Context to load (read order)
1. `../../memory/performance.md` (BVH over objectBounds; rebuild on scene change; output-identical; early term)
2. `../../memory/geometry.md` (`Scene.intersect`, `Scene.objectBounds()` → `{ object, worldAABB }`)
3. `../../memory/math.md` (`AABB.intersectRay` slab test — reuse)
4. `../../memory/rendering.md` (`traceRay` reflection recursion + weight; depth cap) · `../../memory/conventions.md` (budgets)
5. `../../plans/PLAN-09-performance.md` → F1
6. `src/geometry/Scene.js`, `src/render/trace.js`, `src/math/index.js` (the files you hook)

## Expected files (change scope)
- `src/perf/BVH.js`        — create (build from `scene.objectBounds()`; nodes = `AABB` + children; leaf
  = object(s); `intersect(ray, tMax) → Hit | null` prunes with `AABB.intersectRay`, leaf-tests via each
  object's own `intersect`, narrows to nearest; median split — **Assumption**)
- `src/geometry/Scene.js`  — edit (additive `setAccelerator(accel)`; `intersect` delegates to
  `accel.intersect(ray, tMax)` when set, else the existing linear scan — no perf import)
- `src/render/trace.js`    — edit (early termination: skip the reflection recursion when the remaining
  weight's max component < `EARLY_TERM_EPS`; depth cap unchanged)
- `src/perf/index.js`      — create (barrel, export `BVH`)
- (nothing else; do not alter materials/geometry hit math or the Renderer)

## Boundaries
- Do: return the **same closest `Hit`** the linear scan would (BVH is an optimization, not a visual
  change); rebuild the BVH on scene change (room swap), not per frame; reuse `AABB.intersectRay`.
- Do NOT: import perf from geometry (inject the accelerator at boot); change reflection/shadow/AA math;
  drop contributions above `EARLY_TERM_EPS`.

## Acceptance
- On a multi-object fixture, `BVH.intersect` returns the identical `Hit` (object, t, point, normal) as
  the linear `Scene.intersect` for many random rays, including misses and inside-ray cases.
- A ray missing all AABBs returns `null` without leaf tests; `setAccelerator(null)` restores the linear scan.
- Early termination: a scene with a near-black (tiny-weight) reflector yields output within `EARLY_TERM_EPS`
  of the full-depth trace while doing fewer recursions; a strong mirror is unaffected.
- Interim scratch-assert check (BVH-vs-linear equality over random rays; early-term epsilon bound); full
  regression vs the un-accelerated path deferred to PLAN-10 ([[testing]]).

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/performance.md` or refresh Expected
files; keep `../../memory/performance.md` in agreement. **F1 unblocks F2** and supplies the
early-termination hook referenced by PLAN-08/U3.
