# Tasks index — Mirror Forge
A **Task** = one executable objective ("what to build"), small enough that a Worker completes it
without redesigning architecture. Each Task has **exactly one Road** ("what to read/change").
Tasks are generated on demand (Mode 3). References, never duplicated knowledge.

> **Layout:** PLAN-01/02 Tasks are flat (`tasks/PLAN-0x-…`). From **PLAN-03 onward** each plan's
> Tasks live in a per-plan **subfolder** (`tasks/PLAN-03/…`) for clarity; Roads mirror this
> (`roads/PLAN-03/…`).

## PLAN-01 — Math Core ✅ complete
| Task | Phase | Road | Status |
|---|---|---|---|
| [vectors-ray](PLAN-01-M1-vectors-ray.md) | M1 | `../roads/PLAN-01-M1-vectors-ray.md` | DONE + superseded by memory/math.md |
| [matrix4](PLAN-01-M2-matrix4.md) | M2 | `../roads/PLAN-01-M2-matrix4.md` | DONE + superseded by memory/math.md |
| [quaternion](PLAN-01-M3-quaternion.md) | M3 | `../roads/PLAN-01-M3-quaternion.md` | DONE + superseded by memory/math.md |
| [bounds](PLAN-01-M4-bounds.md) | M4 | `../roads/PLAN-01-M4-bounds.md` | DONE + superseded by memory/math.md |
Shipped: `src/math/` Vector2, Vector3, Ray, Matrix4, Quaternion, AABB, BoundingSphere.

## PLAN-02 — Geometry & Scene ✅ complete
| Task | Phase | Road | Status |
|---|---|---|---|
| [primitives](PLAN-02-G1-primitives.md) | G1 | `../roads/PLAN-02-G1-primitives.md` | DONE + superseded by memory/geometry.md |
| [mesh](PLAN-02-G2-mesh.md) | G2 | `../roads/PLAN-02-G2-mesh.md` | DONE + superseded by memory/geometry.md |
| [scene-graph](PLAN-02-G3-scene-graph.md) | G3 | `../roads/PLAN-02-G3-scene-graph.md` | DONE + superseded by memory/geometry.md |
| [bounds-wiring](PLAN-02-G4-bounds-wiring.md) | G4 | `../roads/PLAN-02-G4-bounds-wiring.md` | DONE + superseded by memory/geometry.md |
Shipped: `src/geometry/` primitives, Mesh, Node, Scene (incl. `Scene.intersect`).

## PLAN-03 — Materials & Shading ✅ complete — folder [PLAN-03/](PLAN-03/)
| Task | Phase | Road | Status |
|---|---|---|---|
| [material-model](PLAN-03/S1-material-model.md) | S1 | `../roads/PLAN-03/S1-material-model.md` | DONE + superseded by memory/materials.md |
| [local-shading](PLAN-03/S2-local-shading.md) | S2 | `../roads/PLAN-03/S2-local-shading.md` | DONE + superseded by memory/materials.md |
| [reflection](PLAN-03/S3-reflection.md) | S3 | `../roads/PLAN-03/S3-reflection.md` | DONE + superseded by memory/materials.md |
Shipped: `src/materials/` Diffuse/Mirror/Metallic/Emissive + `shade()`/`reflect()` + shading helpers.

## PLAN-04 — Ray Tracer (generated; R1–R4 queued) — folder [PLAN-04/](PLAN-04/)
| Task | Phase | Road | Status |
|---|---|---|---|
| [primary-rays](PLAN-04/R1-primary-rays.md) | R1 | `../roads/PLAN-04/R1-primary-rays.md` | ACTIVE (blocked by PLAN-05/C1 camera) |
| [shading-shadows](PLAN-04/R2-shading-shadows.md) | R2 | `../roads/PLAN-04/R2-shading-shadows.md` | ACTIVE (queued, needs R1) |
| [reflections](PLAN-04/R3-reflections.md) | R3 | `../roads/PLAN-04/R3-reflections.md` | ACTIVE (queued, needs R2) |
| [image-quality](PLAN-04/R4-image-quality.md) | R4 | `../roads/PLAN-04/R4-image-quality.md` | ACTIVE (queued, needs R3) |
Execution order: R1 → R2 → R3 → R4. Owner: `src/render/` → `memory/rendering.md`.
⚠ R1 needs `camera.rayFor()` (PLAN-05/C1) — build that first (deps M2/M3 are done).

## PLAN-05 — Camera & Input (generated; C1 ready, C2 blocked) — folder [PLAN-05/](PLAN-05/)
| Task | Phase | Road | Status |
|---|---|---|---|
| [camera](PLAN-05/C1-camera.md) | C1 | `../roads/PLAN-05/C1-camera.md` | ACTIVE (**ready — do first; unblocks PLAN-04/R1**) |
| [controls](PLAN-05/C2-controls.md) | C2 | `../roads/PLAN-05/C2-controls.md` | ACTIVE (blocked by PLAN-06/E3 input manager) |
Owner: `src/camera/` → `memory/camera-input.md`. C1 deps (M2/M3) are done — buildable now.
