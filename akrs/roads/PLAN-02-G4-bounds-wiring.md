# ROAD — bounds-wiring
Status: DONE + superseded by memory/geometry.md
Task: expose per-object + scene-level AABBs as the acceleration hook per memory/geometry.md.
Plan / Phase: PLAN-02 / G4   (needs G3 landed)

## Context to load (read order)
1. `../memory/geometry.md` (`Scene.bounds()` = union of object world AABBs)
2. `../memory/performance.md` (the BVH/acceleration consumer — context only, do not build it)
3. `../plans/PLAN-02-geometry-scene.md` → G4
4. `src/geometry/Scene.js`, `src/geometry/Node.js`

## Expected files (change scope)
- `src/geometry/Scene.js`  — edit (add `bounds()` = union of renderable world AABBs; stable iteration of `{ object, worldAABB }`)
- `src/geometry/Node.js`   — edit only if needed for stable world-AABB access
- (nothing outside `src/geometry/`)

## Boundaries
- Do: provide a stable, documented interface PLAN-09 can build a BVH on (per-object world AABB + scene union); rebuild bounds when the scene/transforms change.
- Do NOT: implement a BVH, spatial split, or any traversal acceleration (PLAN-09). No render changes.

## Acceptance
- `Scene.bounds()` equals the union of every renderable's world AABB.
- Bounds update after a node transform change (respects the dirty-flag).
- The per-object AABB interface is stable enough that a BVH can be added later without touching geometry contracts.
- Interim scratch-assert check on a multi-object scene.

## Close-out (when it lands)
Update `../STATE.md`; set this Road `DONE + superseded by memory/geometry.md` (PLAN-02 then complete) or refresh Expected files; keep `memory/geometry.md` + `memory/performance.md` in agreement.
