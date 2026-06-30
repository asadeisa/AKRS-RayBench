# TASK — bounds
Plan / Phase: PLAN-01 (Math Core) / M4

## Objective
Implement `AABB` and `BoundingSphere` (bounding volumes, math side) per `memory/math.md`.

## Constraints
- Vanilla JS ES module; no libraries.
- These are the primitives geometry intersection ([[geometry]]) and the acceleration structure
  ([[performance]]) build on — keep them dependency-free beyond Vector3/Ray.

## References (read, do not duplicate)
- `memory/math.md` (Bounding volumes line)
- `plans/PLAN-01-math-core.md` → M4

## Expected output
- `src/math/AABB.js`, `src/math/BoundingSphere.js` (+ exports from `src/math/index.js`).
- Road: `roads/PLAN-01-M4-bounds.md`. Depends on M1.
