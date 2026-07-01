# TASK — entity system
Plan / Phase: PLAN-06 (Engine Runtime) / E2

## Objective
Lightweight **entity + component** containers in `src/engine/`: entities own a component bag; a
`World` holds entities and lets systems iterate them by component. Containers for player,
interactables, and lights ([[gameplay]] consumes them).

## Constraints
- Vanilla JS ES module in `src/engine/`; **import only `src/math/`** (Vector3 / Quaternion for
  transform components). **No geometry import** — renderable / light handles are stored as **opaque refs**.
- **Lightweight**, not full ECS: `Entity` = `id` + component Map (`add / get / has / remove(name, data)`);
  `World` = `create()`, `remove(id)`, `each(name, fn)` / `query(name)`. Systems are plain functions.
- Data + iteration only — no rendering, no per-frame game logic (systems / gameplay own that), no managers (E3).

## References (read, do not duplicate)
- `memory/engine.md` (entity-system contract; lightweight over ECS; opaque component refs)
- `memory/architecture.md` (engine imports only math)
- `memory/conventions.md` (classes for identity types; naming)
- `plans/PLAN-06-engine-runtime.md` → E2

## Expected output
- `src/engine/Entity.js`, `src/engine/World.js`; edit `src/engine/index.js`.
- Road: `roads/PLAN-06/E2-entity-system.md`.
