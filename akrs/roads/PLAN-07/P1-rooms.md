# ROAD — rooms & navigation
Status: DONE + superseded by memory/gameplay.md
Task: multiple rooms with spawn + transitions; SceneManager swaps the active room on player entry.
Plan / Phase: PLAN-07 / P1   (deps PLAN-06/E3, PLAN-02/G3 — both landed)

## Context to load (read order)
1. `../../memory/gameplay.md` (room model; transitions via doors; scene manager swaps active room)
2. `../../memory/engine.md` (SceneManager `register/setActive/getActive`; game = injection layer)
3. `../../memory/architecture.md` (src/game may import engine + geometry + camera + math)
4. `../../plans/PLAN-07-gameplay.md` → P1
5. `src/engine/index.js` (SceneManager), `src/geometry/index.js` (Scene/Node), `src/camera/index.js` (Camera/Controls)

## Expected files (change scope)
- `src/game/Room.js`         — create (room descriptor: `key`, `scene`, `spawn { position, yaw }`,
  `transitions: [{ volume, toRoom, toSpawn }]`)
- `src/game/RoomManager.js`  — create (build/register rooms with `SceneManager`; `enter(key)` sets the
  active scene + player spawn; `update(playerPos)` checks transition volumes → swap room)
- `src/game/index.js`        — create (barrel)
- (nothing outside `src/game/`; no interactables/puzzle/save; no renderer/loop boot)

## Boundaries
- Do: register each room's `Scene` as an opaque handle; swap active room via `SceneManager.setActive`;
  reposition the player to the target spawn on transition; test transition volumes with [[math]] bounds.
- Do: move the player with the existing `Controls.update(camera, input, dt)`.
- Do NOT: resolve wall collision (P2), add interactables/puzzle/save, add DOM listeners, or assemble
  the render loop (boot/UI step).

## Acceptance
- Two registered rooms; `enter('a')` makes `SceneManager.getActive()` return room A's scene and places
  the player at A's spawn; moving the player into the A→B transition volume swaps the active scene to B
  and repositions to B's spawn.
- Interim scratch-assert check (synthetic player positions; no DOM); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/gameplay.md` or refresh Expected
files; keep `../../memory/gameplay.md` in agreement. **P1 unblocks P2.**
