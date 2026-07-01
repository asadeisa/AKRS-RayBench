# ROAD — mesh
Status: DONE + superseded by memory/geometry.md
Task: implement Mesh (triangles + own AABB, nearest-hit delegation) per memory/geometry.md.
Plan / Phase: PLAN-02 / G2   (needs G1 landed)

## Context to load (read order)
1. `../memory/geometry.md` (Mesh abstraction + Hit contract)
2. `../plans/PLAN-02-geometry-scene.md` → G2
3. `src/geometry/Triangle.js`, `src/geometry/Hit.js`, `src/math/index.js` (AABB)

## Expected files (change scope)
- `src/geometry/Mesh.js`   — create
- `src/geometry/index.js`  — edit (add Mesh export)
- (nothing outside `src/geometry/`)

## Boundaries
- Do: build from a triangle list (or vertex+index arrays); compute the enclosing AABB; `intersect` = nearest Hit across triangles within `[tMin,tMax]`; optional AABB early-out before the scan.
- Do NOT: build a BVH / spatial split (PLAN-09). No scene-graph wiring (G3). Per-mesh `material` carried opaquely.

## Acceptance
- N-triangle mesh returns the nearest hit (not the first); empty mesh returns `null`.
- AABB encloses all vertices; a ray missing the AABB returns `null` without scanning (if early-out implemented).
- Interim scratch-assert check vs a hand-built 2–3 triangle mesh.

## Close-out (when it lands)
Update `../STATE.md`; set this Road `DONE + superseded by memory/geometry.md` or refresh Expected files; keep `memory/geometry.md` in agreement.
