# ROAD — entity system
Status: DONE + superseded by memory/engine.md
Task: lightweight entity + component bag; a World iterates entities by component.
Plan / Phase: PLAN-06 / E2   (needs E1)

## Context to load (read order)
1. `../../memory/engine.md` (entity-system contract: Entity / World shapes, opaque refs)
2. `../../memory/architecture.md` (engine imports only math — no geometry import)
3. `../../memory/conventions.md` (naming; classes for identity types)
4. `../../plans/PLAN-06-engine-runtime.md` → E2
5. `src/engine/index.js` (barrel from E1)

## Expected files (change scope)
- `src/engine/Entity.js`  — create (`id`, component Map, `add / get / has / remove(name, data)`)
- `src/engine/World.js`   — create (`create()`, `remove(id)`, `each(name, fn)`, `query(name)`)
- `src/engine/index.js`   — edit (export `Entity`, `World`)
- (nothing outside `src/engine/`; store renderable / light as opaque refs — do not import geometry)

## Boundaries
- Do: give each entity a unique id + a component bag; let `World` add / remove / iterate by component name.
- Do: use `Vector3` / `Quaternion` from math for a transform component if you add one.
- Do NOT: build a full archetypal ECS, import geometry / camera / render, or add managers / collision (E3 / E4).

## Acceptance
- `World.create()` returns an entity with a unique id; `add` / `get` / `has` / `remove` round-trip a component.
- `each('collider', fn)` visits exactly the entities that have that component; `remove(id)` drops one.
- Interim scratch-assert check (create a few entities with mixed components; assert query / each membership); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/engine.md` or refresh Expected files;
keep `../../memory/engine.md` in agreement. **E2 unblocks E3.**
