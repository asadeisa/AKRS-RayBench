# TASK — mesh
Plan / Phase: PLAN-02 (Geometry & Scene) / G2

## Objective
Implement `Mesh` — a triangle collection with its own AABB that delegates `intersect` to its
triangles and returns the nearest `Hit`, per `memory/geometry.md`.

## Constraints
- Vanilla JS ES module; no libraries. Reuse `Triangle` + `Hit` from G1; `AABB` from math.
- Linear nearest-hit scan only — the acceleration structure is PLAN-09, not here.

## References (read, do not duplicate)
- `memory/geometry.md` (Mesh line + Hit contract)
- `plans/PLAN-02-geometry-scene.md` → G2

## Expected output
- `src/geometry/Mesh.js` (+ export from `src/geometry/index.js`).
- Road: `roads/PLAN-02-G2-mesh.md`. Depends on G1.
