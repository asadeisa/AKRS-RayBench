# ROAD — events & collision
Status: DONE + superseded by memory/engine.md
Task: EventBus (pub/sub) + player-vs-world collision (sphere-vs-AABB, slide) reusing math bounds.
Plan / Phase: PLAN-06 / E4   (needs E3; deps PLAN-01/M4 AABB / BoundingSphere — landed)

## Context to load (read order)
1. `../../memory/engine.md` (event-bus + collision contracts; sphere proxy, slide, colliders fed in)
2. `../../memory/math.md` (`AABB` / `BoundingSphere` API — reuse)
3. `../../memory/geometry.md` (`Scene.objectBounds()` → the world-AABB list collision consumes)
4. `../../memory/architecture.md` (engine imports only math)
5. `../../plans/PLAN-06-engine-runtime.md` → E4
6. `src/math/index.js` (AABB, BoundingSphere), `src/engine/index.js` (barrel)

## Expected files (change scope)
- `src/engine/EventBus.js`   — create (`on` / `off` / `emit`, synchronous dispatch)
- `src/engine/Collision.js`  — create (`resolve(position, desiredMove, radius, colliders) → newPosition`;
  sphere-vs-AABB closest-point, slide by removing the into-surface component; reuse math `AABB`)
- `src/engine/index.js`      — edit (export `EventBus` + the collision resolver)
- (nothing outside `src/engine/`; take `AABB` colliders as input — do not import geometry)

## Boundaries
- Do: EventBus subscribe / unsubscribe / emit with a payload; multiple handlers per type; `off` removes one.
- Do: resolve movement as a **sphere sliding** against a list of world `AABB`s — no tunneling for a
  normal step; slide along a wall instead of stopping dead; reuse `AABB` / `BoundingSphere` from math.
- Do NOT: import geometry (colliders are math AABBs handed in), add gravity / full physics, or emit
  gameplay-specific event names (gameplay owns those — the bus is generic).

## Acceptance
- `emit(type, payload)` calls every handler registered via `on(type, …)`; `off` stops one; unknown type is a no-op.
- A sphere moving straight into an AABB is stopped at the surface (no penetration); a sphere moving at
  a glancing angle **slides** along the face and keeps its tangential motion; free space returns the
  full requested move.
- Collision consumes a plain `AABB[]` (the shape of `Scene.objectBounds()[i].worldAABB`); no geometry import.
- Interim scratch-assert check (hand-computed head-on stop + glancing slide vs one AABB; EventBus on / off / emit); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/engine.md` or refresh Expected files;
keep `../../memory/engine.md` in agreement. **E4 completes PLAN-06** (loop ticks, input flows, rooms
set, events fire, player can't walk through walls) — enables real `Controls` collision + PLAN-07 gameplay.
