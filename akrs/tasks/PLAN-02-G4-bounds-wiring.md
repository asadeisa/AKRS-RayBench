# TASK — bounds-wiring
Plan / Phase: PLAN-02 (Geometry & Scene) / G4

## Objective
Expose the spatial-bounds interface the acceleration structure (PLAN-09) will consume: per-object
world AABB (from G3) + a scene-level AABB, per `memory/geometry.md`. Data only — no BVH.

## Constraints
- Vanilla JS ES module; no libraries. Build on Node/Scene from G3.
- This is the **hook** for PLAN-09, not the acceleration structure itself.

## References (read, do not duplicate)
- `memory/geometry.md` (`Scene.bounds()` = union of object AABBs)
- `memory/performance.md` (who consumes this next)
- `plans/PLAN-02-geometry-scene.md` → G4

## Expected output
- Edits to `src/geometry/Scene.js` (+ `Node.js` if needed) adding `bounds()` / stable per-object AABB access.
- Road: `roads/PLAN-02-G4-bounds-wiring.md`. Depends on G3.
