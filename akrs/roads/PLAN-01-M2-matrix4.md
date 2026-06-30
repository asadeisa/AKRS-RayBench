# ROAD — matrix4
Status: ACTIVE
Task: implement Matrix4 per memory/math.md (column-major).
Plan / Phase: PLAN-01 / M2   (needs M1 landed)

## Context to load (read order)
1. `../memory/math.md` (Matrix4 surface + column-major storage + transformPoint/Dir w-rule)
2. `../memory/conventions.md` (right-handed, −Z forward — for lookAt/perspective)
3. `../plans/PLAN-01-math-core.md` → M2
4. `src/math/Vector3.js` (consumed by transforms)

## Expected files (change scope)
- `src/math/Matrix4.js`  — create
- `src/math/index.js`    — edit (add Matrix4 export)
- (nothing outside `src/math/`)

## Boundaries
- Do: identity, multiply, translate, scale, rotate(axis,θ), lookAt(eye,target,up), perspective(fovY,aspect,near,far), inverse, transformPoint, transformDir.
- Do NOT: implement Quaternion (M3) or bounds (M4). No camera/render imports.

## Acceptance
- `identity` is the multiplicative identity; `multiply` associative on a sample triple.
- `transformPoint` translates; `transformDir` ignores translation.
- `inverse(M)·M ≈ I`; `perspective` maps a near-plane point into NDC as expected.
- Header documents the column-major layout so M3/camera agree.

## Close-out (when it lands)
Update `../STATE.md`; set this Road `DONE + superseded by memory/math.md` or refresh Expected files; keep `memory/math.md` in agreement.
