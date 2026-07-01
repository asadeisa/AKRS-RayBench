# TASK — primitives
Plan / Phase: PLAN-02 (Geometry & Scene) / G1

## Objective
Implement `Sphere`, `Plane`, `Box`, `Triangle` in `src/geometry/`, each exposing
`intersect(ray, tMin, tMax) → Hit | null` per the contract in `memory/geometry.md`, plus the
shared `Hit` shape they all return.

## Constraints
- Vanilla JS ES module; no libraries. Import math via `../math/index.js`.
- Normals returned **outward, unit length**. Respect `[tMin, tMax]`; misses return `null`.
- Box is **axis-aligned first** (OBB deferred — `memory/geometry.md`).
- Carry a `material` reference **opaquely** (no shading logic — that is PLAN-03).

## References (read, do not duplicate)
- `memory/geometry.md` (Hit contract + primitive set)
- `memory/math.md` (Vector3, Ray, AABB)
- `plans/PLAN-02-geometry-scene.md` → G1

## Expected output
- `src/geometry/Hit.js`, `Sphere.js`, `Plane.js`, `Box.js`, `Triangle.js`, `src/geometry/index.js`.
- Road: `roads/PLAN-02-G1-primitives.md`.
