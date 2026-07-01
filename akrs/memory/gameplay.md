# Memory — Gameplay & Puzzles
Owns: room model, interactable objects, the reflective puzzle rules, win/restart, and the save
format. Truth lives in `src/game/`. Consumes [[engine]], [[geometry]], [[camera-input]],
[[rendering]] (mirror puzzles depend on real reflections). `src/game/` is the **integration /
injection layer** — it may import engine + geometry + camera + render + math (per [[architecture]]).

## Model (from data.md)
- **Rooms** — multiple discrete rooms; transitions via doors. Scene manager swaps active room ([[engine]]).
- **Interactables** — switches, doors, collectibles. Each emits/consumes events on the engine bus.
- **Reflective puzzle mechanics** — the signature mechanic: puzzles solved using mirror/metallic surfaces and what they reflect (light/line-of-sight through mirrors). Exact rule set is **design-Unknown** — define per puzzle in its Road, not here.
- **Win condition** — per-level goal reached → emits `level:won`.
- **Restart** — reset current room/level state to initial.

## Contracts / decisions (PLAN-07 Phase G)
- **Room** — descriptor `{ key, scene, spawn { position, yaw }, transitions: [{ volume, toRoom, toSpawn }] }`.
  `RoomManager` registers each room's `Scene` as an **opaque handle** with `SceneManager.register(key,
  scene)`, `enter(key)` sets the active scene + player spawn, and `update(playerPos)` swaps rooms when
  the player enters a transition `volume` ([[math]] bounds). — **Decided (PLAN-07/P1)**.
- **Event names are gameplay-owned** — one owner: `src/game/events.js` (the engine [[engine]] `EventBus`
  stays generic). Names: `SWITCH_TOGGLED`, `DOOR_OPENED`/`DOOR_CLOSED`, `COLLECTIBLE_PICKED`,
  `ROOM_ENTERED`, `LEVEL_WON`, `GAME_RESTARTED`. — **Decided (PLAN-07/P2)**.
- **Interaction model** = **proximity + `interact`** — a switch in range fires once per `interact`
  edge; collectibles auto-pick on proximity. Needs an **additive `interact` edge** on the engine input
  snapshot ([[camera-input]] / [[engine]] `InputManager.poll()`); `Controls` is unaffected. — **Decided
  (PLAN-07/P2)**.
- **Collision wiring** — P2 builds the world collider list from `Scene.objectBounds()` ([[geometry]]) +
  closed-door AABBs and resolves player movement with `Collision.resolve(oldPos, desiredMove, radius,
  colliders)` ([[engine]]); an opened door drops its collider. — **Decided (PLAN-07/P2)**.
- **Beam (line-of-sight through mirrors)** — `src/game/beam.js` `traceBeam(ray, scene, maxDepth) →
  { hits[], terminal }` **reuses** `scene.intersect` + `material.reflect` + the `maxDepth` cap
  ([[conventions]]); it does not reimplement intersection/reflection. `Puzzle` re-traces on
  `SWITCH_TOGGLED` and emits `LEVEL_WON` once when `terminal === receiver`. — **Decided (PLAN-07/P3)**;
  the concrete level rule lives in `roads/PLAN-07/P3-reflective-puzzle.md`.

## Save format (single owner)
- Target: browser `localStorage`, key `mirror-forge:save`. — **Assumption (Med)**.
- Shape: `{ version, currentRoom, collected[], switches{}, doors{}, settings }`. — **Assumption (Med)**, confirm in STATE.
- Versioned so format changes can migrate (guard/ignore a mismatch on load, never crash). Consumed by
  [[ui]] (continue/settings); the `settings` blob is persisted **opaquely** ([[ui]] owns its shape). — **Decided (PLAN-07/P4)** wiring.

## Decisions / open
- Whether reflections are gameplay-significant (ray-traced line-of-sight) vs purely visual: **Assumption (Med)** they are significant (it is the game's premise) — confirm the exact mechanic per puzzle.
- The signature puzzle (P3) = switch-toggled movable mirror routes a reflecting beam onto a receiver → `level:won`. — **Assumption (Med)**, confirm the mechanic is the intended one.
- **Mirror "orientation" = the mirror's own geometry `normal`, not a Node rotation** — `Node.setRotation`
  only feeds `worldBounds()` (collision), never ray `intersect()` (geometry primitives test the
  world-space ray directly against their own stored fields, per `src/geometry/*.js`). `Puzzle` swaps
  the mirror's `Plane.normal` in place on toggle. — **Decided (PLAN-07/P3)**, a Worker-level
  implementation detail the Road left open ("two orientations" not otherwise specified).

## Landed (PLAN-07, P1–P4 — all Roads DONE)
- `src/game/Room.js` — `Room({ key, scene, spawn, transitions })` descriptor, data only.
- `src/game/RoomManager.js` — `register(room)` (registers the room's `Scene` as an opaque
  `SceneManager` handle), `enter(key)` (sets the active scene, returns the target spawn),
  `update(playerPos)` (tests the active room's transition volumes — `[[math]] AABB`/
  `BoundingSphere`, both duck-typed via `contains(point)` — and swaps rooms on entry).
- `src/game/events.js` — the one owner of gameplay event names: `SWITCH_TOGGLED`,
  `DOOR_OPENED`/`DOOR_CLOSED`, `COLLECTIBLE_PICKED`, `ROOM_ENTERED`, `LEVEL_WON`, `GAME_RESTARTED`.
- `src/game/Switch.js` / `Door.js` / `Collectible.js` — proximity + `interact`-edge switch (toggles,
  emits `SWITCH_TOGGLED {id, on}`); door subscribed to a linked switch id (opens/closes, emits
  `DOOR_OPENED`/`DOOR_CLOSED`, `collider()` returns its AABB while closed, `null` once open);
  collectible (proximity auto-pick, emits `COLLECTIBLE_PICKED {id}` once, self-marks `picked`).
- `src/game/index.js` also exports `worldColliders(scene, doors)` — assembles
  `scene.objectBounds()` AABBs + each closed door's collider for `Collision.resolve`.
- `src/engine/InputManager.js` — additive `interact` field on `poll()` (use-key `KeyE`,
  edge-detected via `!e.repeat`, poll-and-clear); every prior field unchanged.
- `src/game/beam.js` — `traceBeam(ray, scene, maxDepth) → { hits[], terminal }`, a `while` loop
  reusing `scene.intersect` + `material.reflect`, stopping at the first non-reflective hit or the
  `maxDepth` cap (mirrors `render/trace.js`'s recursion, iteratively).
- `src/game/Puzzle.js` — holds `emitterRay`, `scene`, `receiver`, the mirror's own geometry object
  (`mirror`, not a Node — see Decisions above), `orientations: [offNormal, onNormal]`, a
  `linkedSwitch` id; subscribes to `SWITCH_TOGGLED`, swaps `mirror.normal`, re-traces, and emits
  `LEVEL_WON` once (`won` flag guards re-emission) when `traceBeam(...).terminal.object === receiver`.
- `src/game/save.js` — `SAVE_KEY = 'mirror-forge:save'`, `SAVE_VERSION = 1`; `save(state)` /
  `load() → state | null` (guards absent key, JSON parse errors, and version mismatch — never
  throws) / `clear()`; `snapshot({ roomManager, collectibles, switches, doors, settings })` builds
  the `{ currentRoom, collected[], switches{}, doors{}, settings }` shape from the live P1–P3
  objects; `restart({ initialRoom, roomManager, collectibles, switches, doors })` un-picks
  collectibles, resets switches to `on = false`, closes doors, and re-enters the initial room.
- Scratch-assert verification passed for all four Roads (no DOM/localStorage — synthetic
  positions/input and a stubbed `localStorage`): P1 — room swap on transition-volume entry,
  spawn repositioning; P2 — `interact` edge press/clear/no-repeat-refire, switch proximity+edge
  toggle, door open/close + collider add/drop, collectible one-shot pickup, `Collision.resolve`
  stopping at a closed door / passing an opened one / sliding along a wall; P3 — `traceBeam`
  reflecting off a `Mirror` `Plane` onto a receiver, a two-facing-mirrors fixture capping at
  `maxDepth + 1` hits with no infinite loop, `Puzzle` emitting `LEVEL_WON` exactly once on the
  solving toggle and not re-emitting on re-solving; P4 — save/load round-trip, null (not a crash)
  on version mismatch and corrupt JSON, `clear()`, `restart()` resetting room/collectibles/
  switches/doors, `snapshot()` reading state back off the live objects.
- **PLAN-07 (Gameplay & Puzzles) is now complete.** `src/game/` wires engine + geometry + camera +
  materials into the first playable slice: rooms → interactables/collision → the reflective puzzle
  → restart/save. Feeds PLAN-08 (UI: main-menu "continue" reads `load()`; settings own the
  `settings` blob opaquely) and the boot step (assembling `Loop` + `Renderer` + `InputManager` +
  `src/game/` in `src/main.js`, not yet built).

Related: [[engine]] · [[rendering]] · [[geometry]] · [[ui]] · [[conventions]] · [[architecture]] · [[camera-input]]
