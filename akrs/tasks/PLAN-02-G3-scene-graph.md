# TASK — scene-graph
Plan / Phase: PLAN-02 (Geometry & Scene) / G3

## Objective
Implement `Node` (transform hierarchy → world matrices) and `Scene` (flat renderables + lights),
per `memory/geometry.md`. Expose per-object world-space AABB.

## Constraints
- Vanilla JS ES module; no libraries. Transforms via `Matrix4`/`Quaternion` from math.
- World matrices cached with a **dirty-flag**; recompute only when a transform changes.
- Lights = point-light descriptors `{ position, color, intensity }` (`memory/geometry.md`); no shading here.

## References (read, do not duplicate)
- `memory/geometry.md` (scene graph + Scene + light descriptor)
- `memory/math.md` (Matrix4, Quaternion, AABB)
- `plans/PLAN-02-geometry-scene.md` → G3

## Expected output
- `src/geometry/Node.js`, `src/geometry/Scene.js` (+ exports from `src/geometry/index.js`).
- Road: `roads/PLAN-02-G3-scene-graph.md`. Depends on G2.
