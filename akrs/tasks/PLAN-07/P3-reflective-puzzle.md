# TASK — reflective puzzle mechanics
Plan / Phase: PLAN-07 (Gameplay & Puzzles) / P3

## Objective
The signature mirror mechanic + a per-level win condition in `src/game/`: a beam that reflects off
mirror/metallic surfaces (reusing real reflections, PLAN-04/R3) which the player routes onto a target
receiver by toggling a movable mirror (a P2 interactable). Solving it emits **`level:won`**. Ship **at
least one solvable** puzzle. **The exact rule is specified in this phase's Road** (per `memory/gameplay.md`).

## Constraints
- `src/game/` ES modules; may import `src/geometry/` (`scene.intersect`), `src/materials/`
  (`material.reflect`), `src/render/`, `src/camera/`, `src/engine/` (EventBus), `src/math/` (`Ray`).
- Beam = a **reflecting ray march** that **reuses** `scene.intersect(ray) → Hit` + `material.reflect
  (hit, ray) → { ray, weight } | null` with the project depth cap ([[conventions]] `maxDepth`) — do
  **not** reimplement intersection or reflection. Report the terminal hit object (receiver vs not).
- Win: when the beam's terminal hit is the receiver, emit `LEVEL_WON` on the bus **once**.
- Reuse P2's `Switch` + EventBus to move the mirror (no new continuous input). No save/restart (P4).

## References (read, do not duplicate)
- `memory/gameplay.md` (reflective mechanic is the premise; win emits `level:won`; rule defined per-puzzle)
- `memory/rendering.md` (`traceRay` reflection accumulation; reflection direction lives in `material.reflect`)
- `memory/materials.md` (`reflect(hit, ray) → { ray, weight } | null`), `memory/geometry.md` (`scene.intersect`)
- `plans/PLAN-07-gameplay.md` → P3

## Expected output
- `src/game/beam.js` (reflecting line-of-sight trace), `src/game/Puzzle.js` (rule + win emit), one
  concrete puzzle setup; edit `src/game/index.js`.
- Road: `roads/PLAN-07/P3-reflective-puzzle.md`.
