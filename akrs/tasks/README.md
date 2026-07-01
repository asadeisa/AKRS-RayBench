# Tasks index — Mirror Forge
A **Task** = one executable objective ("what to build"), small enough that a Worker completes it
without redesigning architecture. Each Task has **exactly one Road** ("what to read/change").
Tasks are generated on demand (Mode 3). References, never duplicated knowledge.

## PLAN-01 — Math Core ✅ complete
| Task | Phase | Road | Status |
|---|---|---|---|
| [vectors-ray](PLAN-01-M1-vectors-ray.md) | M1 | `../roads/PLAN-01-M1-vectors-ray.md` | DONE + superseded by memory/math.md |
| [matrix4](PLAN-01-M2-matrix4.md) | M2 | `../roads/PLAN-01-M2-matrix4.md` | DONE + superseded by memory/math.md |
| [quaternion](PLAN-01-M3-quaternion.md) | M3 | `../roads/PLAN-01-M3-quaternion.md` | DONE + superseded by memory/math.md |
| [bounds](PLAN-01-M4-bounds.md) | M4 | `../roads/PLAN-01-M4-bounds.md` | DONE + superseded by memory/math.md |
Shipped: `src/math/` Vector2, Vector3, Ray, Matrix4, Quaternion, AABB, BoundingSphere.

## PLAN-02 — Geometry & Scene (generated; G1 active, G2–G4 queued)
| Task | Phase | Road | Status |
|---|---|---|---|
| [primitives](PLAN-02-G1-primitives.md) | G1 | `../roads/PLAN-02-G1-primitives.md` | ACTIVE (current) |
| [mesh](PLAN-02-G2-mesh.md) | G2 | `../roads/PLAN-02-G2-mesh.md` | ACTIVE (queued, needs G1) |
| [scene-graph](PLAN-02-G3-scene-graph.md) | G3 | `../roads/PLAN-02-G3-scene-graph.md` | ACTIVE (queued, needs G2) |
| [bounds-wiring](PLAN-02-G4-bounds-wiring.md) | G4 | `../roads/PLAN-02-G4-bounds-wiring.md` | ACTIVE (queued, needs G3) |
Execution order: G1 → G2 → G3 → G4. Close out each Road when its work lands (see `../roads/README.md`).
