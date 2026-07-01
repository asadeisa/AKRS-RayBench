# TASK — events & collision
Plan / Phase: PLAN-06 (Engine Runtime) / E4

## Objective
Two pieces in `src/engine/`: an **EventBus** (pub/sub for decoupled gameplay signals) and
**collision** (player-vs-world movement, AABB / sphere, slide resolution — no physics lib), so events
fire and the player can't walk through walls.

## Constraints
- Vanilla JS ES modules in `src/engine/`; **import only `src/math/`** (`AABB` / `BoundingSphere` from PLAN-01/M4).
- **EventBus:** `on(type, fn)`, `off(type, fn)`, `emit(type, payload)`; synchronous dispatch.
- **Collision:** player proxy = **sphere** (radius); world = a list of `AABB` **colliders** passed in
  (boot / gameplay builds it from `Scene.objectBounds()` — already exists, PLAN-02/G4).
  `resolve(position, desiredMove, radius, colliders) → newPosition`; resolution = **slide** (remove the
  into-surface component), not stop-dead. Reuse math bounds; do not reimplement intersection.
- No external physics engine (data.md). Collision does **not** import geometry — it takes math AABBs.

## References (read, do not duplicate)
- `memory/engine.md` (event-bus + collision contracts; sphere-vs-AABB slide; colliders fed in)
- `memory/math.md` (`AABB`, `BoundingSphere` — reuse, don't reimplement)
- `memory/geometry.md` (`Scene.objectBounds()` — the `{ object, worldAABB }` list boot feeds to collision)
- `memory/architecture.md` (engine imports only math)
- `plans/PLAN-06-engine-runtime.md` → E4

## Expected output
- `src/engine/EventBus.js`, `src/engine/Collision.js`; edit `src/engine/index.js`.
- Road: `roads/PLAN-06/E4-events-collision.md`.
