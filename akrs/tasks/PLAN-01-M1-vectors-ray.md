# TASK — vectors-ray
Plan / Phase: PLAN-01 (Math Core) / M1

## Objective
Implement `Vector2`, `Vector3`, and `Ray` per the contract in `memory/math.md`.

## Constraints
- Vanilla JS, ES module per file; no libraries.
- Immutable by default: operations return **new** instances (`memory/math.md` decision).
- Honor `memory/conventions.md` (radians, right-handed); do not redefine conventions here.

## References (read, do not duplicate)
- `memory/math.md` (Vector2/Vector3/Ray surface; `reflect` formula)
- `memory/conventions.md` (axes/units)
- `plans/PLAN-01-math-core.md` → M1

## Expected output
- `src/math/Vector2.js`, `src/math/Vector3.js`, `src/math/Ray.js`, `src/math/index.js` (barrel).
- Road: `roads/PLAN-01-M1-vectors-ray.md`.
