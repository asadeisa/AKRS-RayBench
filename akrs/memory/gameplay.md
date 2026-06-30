# Memory — Gameplay & Puzzles
Owns: room model, interactable objects, the reflective puzzle rules, win/restart, and the save
format. Truth lives in `src/game/`. Consumes [[engine]], [[geometry]], [[camera-input]],
[[rendering]] (mirror puzzles depend on real reflections).

## Model (from data.md)
- **Rooms** — multiple discrete rooms; transitions via doors. Scene manager swaps active room ([[engine]]).
- **Interactables** — switches, doors, collectibles. Each emits/consumes events on the engine bus.
- **Reflective puzzle mechanics** — the signature mechanic: puzzles solved using mirror/metallic surfaces and what they reflect (light/line-of-sight through mirrors). Exact rule set is **design-Unknown** — define per puzzle in its Road, not here.
- **Win condition** — per-level goal reached → emits `level:won`.
- **Restart** — reset current room/level state to initial.

## Save format (single owner)
- Target: browser `localStorage`, key `mirror-forge:save`. — **Assumption (Med)**.
- Shape: `{ version, currentRoom, collected[], switches{}, doors{}, settings }`. — **Assumption (Med)**, confirm in STATE.
- Versioned so format changes can migrate. Consumed by [[ui]] (continue/settings).

## Decisions / open
- Whether reflections are gameplay-significant (ray-traced line-of-sight) vs purely visual: **Assumption (Med)** they are significant (it is the game's premise) — confirm the exact mechanic per puzzle.

Related: [[engine]] · [[rendering]] · [[geometry]] · [[ui]] · [[conventions]]
