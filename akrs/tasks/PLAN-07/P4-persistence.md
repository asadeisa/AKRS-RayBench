# TASK — persistence (restart + save/load)
Plan / Phase: PLAN-07 (Gameplay & Puzzles) / P4

## Objective
Progress that survives reload, in `src/game/`: **restart** (reset current room/level to initial state)
and **save/load** via the versioned `localStorage` schema in [[gameplay]]. Enables the main-menu
"continue" ([[ui]]).

## Constraints
- `src/game/` ES module; may import `src/engine/` (EventBus), `src/math/`. `localStorage` access is
  allowed here (persistence owner).
- Save target = `localStorage` key **`mirror-forge:save`**; shape **`{ version, currentRoom,
  collected[], switches{}, doors{}, settings }`** (`memory/gameplay.md`) — **versioned** (guard/migrate
  on load; ignore a mismatched version cleanly, never crash).
- `restart()` = reset in-memory game state (current room, collectibles, switch/door states) to initial.
- The settings blob is carried **opaquely** (owned by [[ui]] PLAN-08) — persist it, don't define it here.
- No new gameplay mechanics.

## References (read, do not duplicate)
- `memory/gameplay.md` (save target/key/shape; restart resets to initial)
- `memory/conventions.md` (localStorage + versioned JSON persistence)
- `memory/engine.md` (EventBus, if emitting a restart/loaded signal)
- `plans/PLAN-07-gameplay.md` → P4

## Expected output
- `src/game/save.js` (`save(state)`, `load()`, `clear()`, versioned) + a `restart()` reset; edit `src/game/index.js`.
- Road: `roads/PLAN-07/P4-persistence.md`.
