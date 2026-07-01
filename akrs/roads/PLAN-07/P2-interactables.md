# ROAD — interactables (switches, doors, collectibles)
Status: DONE + superseded by memory/gameplay.md
Task: switches/doors/collectibles via EventBus + wire player-vs-world collision (walls, closed doors).
Plan / Phase: PLAN-07 / P2   (needs P1)

## Context to load (read order)
1. `../../memory/gameplay.md` (interactables; event names are gameplay-owned)
2. `../../memory/engine.md` (EventBus; `Collision.resolve(position, desiredMove, radius, colliders)`; input owner)
3. `../../memory/camera-input.md` (input snapshot — you add `interact` here)
4. `../../memory/geometry.md` (`Scene.objectBounds()` → the world AABB colliders)
5. `../../plans/PLAN-07-gameplay.md` → P2
6. `src/engine/index.js` (EventBus, Collision, InputManager), `src/game/index.js` (P1 rooms)

## Expected files (change scope)
- `src/game/events.js`      — create (gameplay event-name constants: switch/door/collectible/level/room)
- `src/game/Switch.js`      — create (proximity + `interact` → toggle; emit `SWITCH_TOGGLED { id, on }`)
- `src/game/Door.js`        — create (subscribe to its trigger event → open/close; contributes an AABB
  collider while closed; emit `DOOR_OPENED` / `DOOR_CLOSED`)
- `src/game/Collectible.js` — create (proximity auto-pick → emit `COLLECTIBLE_PICKED { id }`, remove self)
- `src/engine/InputManager.js` — edit (**additive**: add an `interact` edge to `poll()`, poll-and-clear;
  every existing field unchanged)
- `src/game/index.js`       — edit (export interactables + events)
- (nothing else; no puzzle/save; `Controls` and other engine files untouched)

## Boundaries
- Do: route every interaction through the engine `EventBus`; keep event **names** in `events.js` (one owner).
- Do: assemble the collider list from `Scene.objectBounds()` + closed-door AABBs and resolve player
  movement with `Collision.resolve` (slide on walls; closed door blocks, opened door passes).
- Do: add **only** an `interact` edge to the input snapshot (poll-and-clear); leave every existing field intact.
- Do NOT: implement the mirror puzzle/win (P3) or save/restart (P4); add DOM listeners outside the
  engine input manager; or rename/repurpose existing input fields or `Controls`.

## Acceptance
- A switch in range fires once per `interact` edge, emitting `SWITCH_TOGGLED`; a door subscribed to
  that switch opens (its collider drops) and emits `DOOR_OPENED`; walking into a collectible emits
  `COLLECTIBLE_PICKED` and increments a count.
- With a closed door, `Collision.resolve` stops the player at it; after the switch opens it, the player
  passes; walls always slide-stop the player.
- `InputManager.poll()` returns all prior fields plus `interact` (true only on the press frame, cleared on read).
- Interim scratch-assert check (synthetic input/positions + a stub EventBus subscriber; no DOM); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/gameplay.md` or refresh Expected
files; keep `../../memory/gameplay.md`, `../../memory/camera-input.md`, `../../memory/engine.md` in
agreement (the `interact` field now exists). **P2 unblocks P3.**
