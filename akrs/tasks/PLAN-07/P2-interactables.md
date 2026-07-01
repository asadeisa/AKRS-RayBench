# TASK — interactables (switches, doors, collectibles)
Plan / Phase: PLAN-07 (Gameplay & Puzzles) / P2

## Objective
Cause→effect interactables in `src/game/`, wired through the engine **EventBus**: **switches**
(toggle → emit), **doors** (open/close on a linked event; block movement while closed), **collectibles**
(pick up on proximity → count). Also wire **player-vs-world collision** (PLAN-06/E4) so walls and
closed doors stop the player.

## Constraints
- `src/game/` ES modules; may import `src/engine/` (EventBus, Collision), `src/geometry/`
  (`Scene.objectBounds()` → collider AABBs), `src/math/`, `src/camera/`.
- Event names are **gameplay-owned** — define them once in `src/game/events.js` (the engine bus stays generic).
- Collision: build the world collider list from `Scene.objectBounds()` + closed-door AABBs; feed
  `Collision.resolve(oldPos, desiredMove, radius, colliders)` so the player slides on walls and can't
  pass a **closed** door; an **opened** door removes its collider.
- **Interaction input:** extend `InputManager.poll()` with an additive **`interact`** edge (use-key,
  poll-and-clear) — the single input owner stays the engine ([[engine]]); `Controls` is unaffected.
  Interaction model = **proximity + `interact`** (switch in range + interact → toggle); collectibles
  auto-pick on proximity. Do not invent extra input axes beyond `interact`.
- No puzzle rule (P3); no save (P4).

## References (read, do not duplicate)
- `memory/gameplay.md` (interactables model; gameplay-owned event names)
- `memory/engine.md` (EventBus `on/off/emit`; `Collision.resolve`; InputManager owns input)
- `memory/camera-input.md` (input snapshot — the `interact` field is added here)
- `memory/geometry.md` (`Scene.objectBounds()` → world AABBs)
- `plans/PLAN-07-gameplay.md` → P2

## Expected output
- `src/game/events.js`, `src/game/Switch.js`, `src/game/Door.js`, `src/game/Collectible.js`;
  edit `src/game/index.js`; additive edit `src/engine/InputManager.js` (add `interact` to `poll()`).
- Road: `roads/PLAN-07/P2-interactables.md`.
