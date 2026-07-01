# ROAD — vectors-ray
Status: DONE + superseded by memory/math.md
Task: implement Vector2, Vector3, Ray per memory/math.md.
Plan / Phase: PLAN-01 / M1

## Context to load (read order)
1. `../memory/math.md` (the type surface + `reflect(I,N)=I−2(I·N)N`)
2. `../memory/conventions.md` (right-handed, +Y up, radians)
3. `../plans/PLAN-01-math-core.md` → M1

## Expected files (change scope)
- `src/math/Vector2.js`   — create
- `src/math/Vector3.js`   — create
- `src/math/Ray.js`       — create
- `src/math/index.js`     — create (re-export the three)
- (nothing outside `src/math/`)

## Boundaries
- Do: Vector2 (add, sub, scale, dot, length, normalize). Vector3 (add, sub, scale, dot, **cross**, length, lengthSq, normalize, lerp, **reflect(n)**). Ray (origin, dir, `at(t)`).
- Do: immutable methods return new instances; constructors validate arity only.
- Do NOT: implement Matrix4 / Quaternion / bounds (M2–M4). No in-place mutators yet. No rendering/scene imports.

## Acceptance
- Exact-value checks: `dot`, `cross` (right-handed: x̂×ŷ=ẑ), `normalize` (unit length), `lerp(a,b,0/1)`, `reflect` off an axis-aligned normal, `Ray.at(t)=origin+dir·t`.
- Interim verification: a scratch assert check (Node or browser). Formal tests land under PLAN-10 once the harness is chosen (STATE open question).

## Close-out (when it lands)
Update `../STATE.md` (Done/Next/timestamp); set this Road `DONE + superseded by memory/math.md` or refresh Expected files; ensure `memory/math.md` still matches what shipped.
