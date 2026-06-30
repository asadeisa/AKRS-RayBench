# PLAN-01 — Math Core
**Capability:** the numeric primitives every other system is built on.
**Depends on:** nothing (foundation — build first).
**Memory:** [[math]], [[conventions]].   **Source:** `docs/data.md` → Math.

## Phases
### M1 — Vectors & Ray
- Objective: Vector2, Vector3, Ray with the full op surface in `memory/math.md`.
- Outputs: `src/math/` vector + ray types; `reflect()` correct (mirror-critical).
- Depends on: —.

### M2 — Matrices & transforms
- Objective: Matrix4 (multiply, translate, scale, rotate, lookAt, perspective, inverse, transform point/dir).
- Outputs: transform stack usable by camera + scene graph.
- Depends on: M1.

### M3 — Quaternion & orientation
- Objective: Quaternion (fromAxisAngle, multiply, normalize, toMatrix4, slerp).
- Outputs: stable orientation type for camera/entities (no gimbal lock).
- Depends on: M2.

### M4 — Bounding volumes (math)
- Objective: AABB + bounding sphere with containment, expand, ray-AABB slab test.
- Outputs: bounds primitives consumed by geometry + the acceleration structure.
- Depends on: M1.

**Done when:** all four phases unit-tested ([[testing]]) with exact expected values.
