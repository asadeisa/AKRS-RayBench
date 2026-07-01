# ROAD — persistence (restart + save/load)
Status: DONE + superseded by memory/gameplay.md
Task: restart-to-initial + versioned localStorage save/load of progress.
Plan / Phase: PLAN-07 / P4   (needs P3)

## Context to load (read order)
1. `../../memory/gameplay.md` (save key `mirror-forge:save`; shape `{ version, currentRoom, collected[], switches{}, doors{}, settings }`; restart resets to initial)
2. `../../memory/conventions.md` (localStorage, versioned JSON)
3. `../../memory/engine.md` (EventBus — optional loaded/restart signal)
4. `../../plans/PLAN-07-gameplay.md` → P4
5. `src/game/index.js` (rooms, interactables, puzzle to snapshot/reset)

## Expected files (change scope)
- `src/game/save.js`   — create (`save(state)`, `load() → state | null`, `clear()`; write/read the
  `mirror-forge:save` key; stamp + check `version`, ignore/migrate a mismatch)
- `src/game/*`         — edit as needed to expose a `restart()` that resets the current room/level to
  initial and a serializable progress snapshot (`currentRoom`, `collected[]`, `switches{}`, `doors{}`)
- `src/game/index.js`  — edit (export `save` / `load` / `clear` / `restart`)
- (nothing outside `src/game/`; the settings blob is persisted opaquely — UI owns its shape)

## Boundaries
- Do: serialize exactly the schema in `memory/gameplay.md`; version it and guard load; reset to initial on restart.
- Do NOT: define the settings schema (UI/PLAN-08), add new mechanics, or persist anything outside the documented shape.

## Acceptance
- `save(snapshot)` then `load()` round-trips `{ version, currentRoom, collected, switches, doors, settings }`;
  a wrong/absent version yields `null` (or a migrated value), never a crash; `clear()` removes the key.
- `restart()` returns the current room/level state to initial (collectibles back, switches/doors reset).
- Interim scratch-assert check (stub/in-memory `localStorage`; no DOM); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/gameplay.md` or refresh Expected
files; keep `../../memory/gameplay.md` in agreement. **P4 completes PLAN-07** (solve → win → restart →
resume after reload) — feeds [[ui]] "continue" (PLAN-08).
