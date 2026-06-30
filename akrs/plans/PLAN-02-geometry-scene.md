# PLAN-02 — Geometry & Scene
**Capability:** the intersectable world — primitives, meshes, and the scene graph.
**Depends on:** PLAN-01.
**Memory:** [[geometry]], [[math]].   **Source:** `docs/data.md` → Geometry.

## Phases
### G1 — Primitives & intersection
- Objective: Sphere, Plane, Box, Triangle, each returning the `Hit` contract in `memory/geometry.md`.
- Outputs: interchangeable intersectables behind one interface.
- Depends on: PLAN-01/M1, M4.

### G2 — Mesh abstraction
- Objective: triangle mesh with its own AABB; delegates intersect to triangles.
- Outputs: reusable mesh type for level geometry.
- Depends on: G1.

### G3 — Scene graph
- Objective: Node hierarchy (local transforms → world matrices) + Scene (renderables + lights).
- Outputs: a Scene the tracer can iterate; per-object AABBs exposed.
- Depends on: G2, PLAN-01/M2.

### G4 — Spatial bounds wiring
- Objective: expose per-object + scene AABBs as the hook for the acceleration structure.
- Outputs: bounds available to PLAN-09 (no BVH yet — just the data).
- Depends on: G3.

**Done when:** a hand-built scene returns correct closest hits for every primitive.
