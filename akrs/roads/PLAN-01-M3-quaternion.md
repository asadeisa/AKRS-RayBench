# ROAD — quaternion
Status: ACTIVE
Task: implement Quaternion per memory/math.md.
Plan / Phase: PLAN-01 / M3   (needs M2 landed)

## Context to load (read order)
1. `../memory/math.md` (Quaternion surface + `toMatrix4` agrees with `Matrix4.rotate`)
2. `../plans/PLAN-01-math-core.md` → M3
3. `src/math/Matrix4.js`, `src/math/Vector3.js`

## Expected files (change scope)
- `src/math/Quaternion.js` — create
- `src/math/index.js`      — edit (add Quaternion export)
- (nothing outside `src/math/`)

## Boundaries
- Do: fromAxisAngle, multiply, normalize, toMatrix4, slerp.
- Do NOT: replace Matrix4 rotation paths or touch camera/entities. No bounds (M4).

## Acceptance
- `fromAxisAngle(axis,θ).toMatrix4()` equals `Matrix4.rotate(axis,θ)` (within epsilon).
- `multiply` composes rotations correctly; `normalize` yields unit length.
- `slerp(a,b,0)=a`, `slerp(a,b,1)=b`, midpoint is the shortest-arc interpolation.

## Close-out (when it lands)
Update `../STATE.md`; retire/refresh this Road; keep `memory/math.md` in agreement.
