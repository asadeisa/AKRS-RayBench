# Memory — Geometry & Scene
Owns: the primitive set, the ray-intersection contract, the mesh abstraction, and the scene
graph. Truth lives in `src/geometry/`. Consumes [[math]]; consumed by [[rendering]].

## Intersection contract (the load-bearing interface)
Every intersectable exposes `intersect(ray, tMin, tMax) → Hit | null` where
**Hit = { t, point: Vector3, normal: Vector3 (unit, outward), material, object }**.
The ray-tracer depends only on this shape — primitives are interchangeable behind it.

## Primitives (from data.md)
- **Sphere** (center, radius)
- **Plane** (point, normal)
- **Box** (AABB or oriented — **Assumption**: axis-aligned first, OBB later)
- **Triangle** (v0,v1,v2; Möller–Trumbore intersection)
- **Mesh** — collection of triangles + own AABB; delegates intersect to its triangles.

## Scene graph
- **Node**: local transform (Matrix4 from position/rotation/scale), children, optional geometry + material.
- World matrices computed by traversal; cache + dirty-flag. — **Assumption (Med)**.
- **Scene**: flat list of renderables + lights for the tracer; built from the graph each frame or on change.
  - Lights = point-light descriptors `{ position: Vector3, color: Vector3, intensity: number }`; a formal `PointLight` type is deferred to the renderer (PLAN-04). — **Assumption (Med)**.
  - `Scene.intersect(ray, tMin = 1e-4, tMax = Infinity) → Hit | null`: closest-hit linear scan over
    `renderables` (each node's `geometry.intersect`). Added in PLAN-03/S2 — `materials.shade()`'s
    shadow rays and the future tracer's primary/reflection rays both go through this. No
    acceleration structure yet (PLAN-09 hook is `objectBounds()`/`bounds()`). — **Decided (PLAN-03)**.
- Per-object **AABB** (world space) exposed for the acceleration structure ([[performance]]); `Scene.bounds()` = union of object AABBs.

## Decisions / open
- Normals: outward, unit length; back-face handling for refraction is **out of scope** (no transmission in data.md).
- OBB vs AABB box: **Unknown** until a puzzle needs rotated boxes — track in STATE if it arises.

Related: [[math]] · [[materials]] · [[rendering]] · [[performance]]
