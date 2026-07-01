# TASK — rooms & navigation
Plan / Phase: PLAN-07 (Gameplay & Puzzles) / P1

## Objective
Multiple connected rooms in `src/game/`: each room owns a [[geometry]] `Scene` + a player spawn +
transition triggers to other rooms. Register rooms with the engine **SceneManager** (opaque handle by
key) and swap the active room when the player enters a transition, repositioning them at the target
spawn. The first playable world to move around in.

## Constraints
- Vanilla JS ES modules in `src/game/` — the integration layer; may import `src/engine/`,
  `src/geometry/`, `src/camera/`, `src/math/` (per `memory/architecture.md`).
- Rooms register their `Scene` as an **opaque handle** via `SceneManager.register(key, scene)`;
  transitions call `SceneManager.setActive(targetKey)` + set the player position/yaw to the target spawn.
- Player movement via the existing `Controls.update(camera, input, dt)` — **no wall collision yet**
  (that is P2, which pulls in PLAN-06/E4). No DOM listeners (engine owns input).
- Transition trigger = a volume test ([[math]] AABB/sphere) against the player position each frame.
- No interactables / puzzle / save (P2–P4); no renderer/loop boot assembly (that is the UI/boot step).

## References (read, do not duplicate)
- `memory/gameplay.md` (room model; scene manager swaps active room)
- `memory/engine.md` (SceneManager opaque-handle contract; game is the boot/injection layer)
- `memory/architecture.md` (src/game consumes engine + geometry + camera)
- `plans/PLAN-07-gameplay.md` → P1

## Expected output
- `src/game/Room.js`, `src/game/RoomManager.js`, `src/game/index.js` (barrel — create).
- Road: `roads/PLAN-07/P1-rooms.md`.
