# ROAD — bounds
Status: DONE + superseded by memory/math.md
Task: implement AABB + BoundingSphere per memory/math.md.
Plan / Phase: PLAN-01 / M4   (needs M1 landed)

## Context to load (read order)
1. `../memory/math.md` (Bounding volumes: AABB + bounding sphere, ray-AABB slab test)
2. `../plans/PLAN-01-math-core.md` → M4
3. `src/math/Vector3.js`, `src/math/Ray.js`

## Expected files (change scope)
- `src/math/AABB.js`           — create
- `src/math/BoundingSphere.js` — create
- `src/math/index.js`          — edit (add exports)
- (nothing outside `src/math/`)

## Boundaries
- Do: AABB(min,max) — contains(point), expandByPoint, union(other), intersectRay (slab test → t or null). BoundingSphere(center,radius) — contains, intersectRay.
- Do NOT: build the BVH or scene wiring (that is PLAN-09 / PLAN-02). Return data only; no scene-graph imports.

## Acceptance
- Ray-AABB slab test: correct hit/miss + entry `t` for axis-aligned and angled rays; ray starting inside returns t=0/near.
- `expandByPoint` / `union` grow bounds correctly; `contains` boundary-inclusive.
- BoundingSphere ray intersection matches the analytic solution.

## Close-out (when it lands)
Update `../STATE.md`; retire/refresh this Road; keep `memory/math.md` in agreement.
