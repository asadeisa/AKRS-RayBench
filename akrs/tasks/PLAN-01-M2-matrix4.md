# TASK — matrix4
Plan / Phase: PLAN-01 (Math Core) / M2

## Objective
Implement `Matrix4` per the contract + storage decision in `memory/math.md`.

## Constraints
- Vanilla JS ES module; no libraries.
- Column-major, length-16 array; `transformPoint` w=1, `transformDir` w=0 (`memory/math.md`).
- `lookAt` / `perspective` follow `memory/conventions.md` handedness (right-handed, −Z forward).

## References (read, do not duplicate)
- `memory/math.md` (Matrix4 surface + storage decision)
- `memory/conventions.md` (handedness)
- `plans/PLAN-01-math-core.md` → M2

## Expected output
- `src/math/Matrix4.js` (+ export from `src/math/index.js`).
- Road: `roads/PLAN-01-M2-matrix4.md`. Depends on M1.
