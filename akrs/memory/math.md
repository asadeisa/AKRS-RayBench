# Memory — Math
Owns: the public contracts of the math types. Truth lives in `src/math/` once built. Every
other module consumes these; they consume nothing. Contracts below — not implementations.

## Types & required surface (from data.md)
- **Vector2** — x,y; add, sub, scale, dot, length, normalize.
- **Vector3** — x,y,z; add, sub, scale, dot, **cross**, length, normalize, lerp, reflect(n).
- **Matrix4** — 4×4; multiply, identity, translate, scale, rotate(axis,θ), lookAt, perspective, inverse, transformPoint, transformDir.
- **Quaternion** — fromAxisAngle, multiply, normalize, toMatrix4, slerp.
- **Ray** — origin: Vector3, dir: Vector3 (normalized); `at(t)` → point.
- **Bounding volumes** — AABB(min,max) + bounding sphere; contains, expand, ray-AABB slab test. (Geometry/perf consume this; math owns the primitive.)

## Decisions
- Immutability: methods return **new** vectors by default; provide explicit in-place variants only where perf demands (PLAN-09). — **Assumption (Med)**.
- `reflect(I, N)` = `I − 2·(I·N)·N`, N normalized — the contract the ray-tracer relies on for mirrors.
- Matrix4 storage: **column-major**, length-16 array; `transformPoint` uses w=1, `transformDir` uses w=0; `lookAt`/`perspective` follow [[conventions]] handedness (right-handed, −Z forward). — **Assumption (Med)**.
- Quaternion: unit-length for rotations; `toMatrix4()` must agree with `Matrix4.rotate(axis,θ)` for the same rotation. — **Decided** (consistency contract).
- Coordinate handedness / units: owned by [[conventions]] (do not redefine here).

Related: [[conventions]] · [[geometry]] · [[rendering]] · [[camera-input]]
