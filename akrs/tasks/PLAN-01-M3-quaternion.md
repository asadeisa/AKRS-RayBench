# TASK — quaternion
Plan / Phase: PLAN-01 (Math Core) / M3

## Objective
Implement `Quaternion` per `memory/math.md`; `toMatrix4()` must agree with `Matrix4.rotate`.

## Constraints
- Vanilla JS ES module; no libraries. Unit-length for rotations.
- Consistency contract (`memory/math.md`): same rotation via quaternion == via Matrix4.

## References (read, do not duplicate)
- `memory/math.md` (Quaternion surface + consistency decision)
- `plans/PLAN-01-math-core.md` → M3

## Expected output
- `src/math/Quaternion.js` (+ export from `src/math/index.js`).
- Road: `roads/PLAN-01-M3-quaternion.md`. Depends on M2.
