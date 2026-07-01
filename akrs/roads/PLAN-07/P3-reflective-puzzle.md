# ROAD — reflective puzzle mechanics
Status: DONE + superseded by memory/gameplay.md
Task: reflecting beam + one solvable mirror puzzle that emits level:won.
Plan / Phase: PLAN-07 / P3   (needs P2)

## Context to load (read order)
1. `../../memory/gameplay.md` (reflective premise; win emits `level:won`; per-puzzle rule)
2. `../../memory/materials.md` (`reflect(hit, ray) → { ray, weight } | null` — reflection direction owner)
3. `../../memory/geometry.md` (`scene.intersect(ray) → Hit | null`)
4. `../../memory/rendering.md` (reflection recursion + depth cap precedent) · `../../memory/conventions.md` (`maxDepth`)
5. `../../plans/PLAN-07-gameplay.md` → P3
6. `src/geometry/index.js`, `src/materials/index.js`, `src/game/index.js` (events + Switch from P2)

## The puzzle rule (this level)
- A fixed **emitter** casts a single ray in a fixed direction into the active room's scene.
- The ray **marches by reflection**: at each `scene.intersect` hit, if `hit.material.reflect(...)`
  returns a ray, continue along it; stop at the first non-reflective hit or the `maxDepth` cap.
- One **movable mirror** has two orientations, toggled by a P2 `Switch` (via the EventBus). In exactly
  **one** orientation the reflected beam's terminal hit is the **receiver** object.
- When the beam's terminal hit **is the receiver**, the level is solved → emit `LEVEL_WON` **once**
  (re-solving does not re-emit until reset). This is the whole win condition for the level.

## Expected files (change scope)
- `src/game/beam.js`    — create (`traceBeam(ray, scene, maxDepth) → { hits[], terminal }`; reuses
  `scene.intersect` + `material.reflect` — never reimplements them)
- `src/game/Puzzle.js`  — create (holds emitter/mirror/receiver refs + the movable mirror's switch;
  on `SWITCH_TOGGLED` / update, re-traces the beam; emits `LEVEL_WON` once when `terminal === receiver`)
- `src/game/index.js`   — edit (export `traceBeam`, `Puzzle`)
- (nothing outside `src/game/`; do not modify the ray tracer/materials/geometry — reuse them)

## Boundaries
- Do: reuse `scene.intersect` + `material.reflect` + the `maxDepth` cap; treat the mirror orientation
  as switch-driven (reuse P2), not free-rotated (no new continuous input).
- Do NOT: reimplement reflection/intersection, add a new input axis, alter materials/geometry/render,
  or hard-code a win that ignores the beam actually reaching the receiver.

## Acceptance
- In the non-solving mirror orientation the beam's terminal hit is **not** the receiver and no
  `LEVEL_WON` fires; toggling the switch to the solving orientation routes the terminal hit to the
  receiver and emits `LEVEL_WON` exactly once.
- `traceBeam` reflects off a Mirror/Metallic surface and terminates on a diffuse/receiver surface or
  at `maxDepth` (no infinite loop between two facing mirrors).
- Interim scratch-assert check (hand-placed emitter/mirror/receiver in a tiny scene; no DOM); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/gameplay.md` or refresh Expected
files; record the concrete rule's outcome in `../../memory/gameplay.md`. **P3 unblocks P4.**
