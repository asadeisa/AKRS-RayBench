# ROAD — primitives
Status: DONE + superseded by memory/geometry.md
Task: implement Sphere, Plane, Box, Triangle + the shared Hit shape per memory/geometry.md.
Plan / Phase: PLAN-02 / G1   (PLAN-01 math is landed)

## Context to load (read order)
1. `../memory/geometry.md` (Hit contract: `{ t, point, normal, material, object }`; primitive set)
2. `../memory/math.md` (Vector3, Ray; AABB slab test for Box)
3. `../plans/PLAN-02-geometry-scene.md` → G1
4. `src/math/index.js` (named exports: Vector3, Ray, AABB)

## Expected files (change scope)
- `src/geometry/Hit.js`      — create (the single owner of the Hit shape/factory)
- `src/geometry/Sphere.js`   — create
- `src/geometry/Plane.js`    — create
- `src/geometry/Box.js`      — create (axis-aligned)
- `src/geometry/Triangle.js` — create (Möller–Trumbore)
- `src/geometry/index.js`    — create (barrel)
- (nothing outside `src/geometry/`; do not modify `src/math/`)

## Boundaries
- Do: each primitive `intersect(ray, tMin, tMax) → Hit | null`; outward unit normals; honor tMin/tMax.
- Do: store an opaque `material` ref + back-pointer `object` on the Hit.
- Do NOT: implement Mesh (G2), Node/Scene (G3), the BVH (PLAN-09), or any material/shading logic (PLAN-03).

## Acceptance
- Sphere: two-root quadratic, nearest root in `[tMin,tMax]`; ray from inside returns the exit/forward hit; tangent + miss handled.
- Plane: single-sided/double-sided handled; parallel ray misses.
- Box: slab test (may reuse AABB math) returns entry `t` + correct axis-aligned face normal; ray starting inside handled.
- Triangle: Möller–Trumbore barycentric inside test; degenerate/parallel misses; normal from edge cross (consistent winding).
- Interim scratch-assert check covers each (hand-computed `t`, point, normal); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../STATE.md` (Done/Next/timestamp); set this Road `DONE + superseded by memory/geometry.md` or refresh Expected files; keep `memory/geometry.md` in agreement.
