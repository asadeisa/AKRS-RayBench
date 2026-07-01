# STATE
Updated: 2026-07-01T04:15Z by claude-code (Worker / Sonnet 5)

## Active
- PLAN-02 (Geometry & Scene) complete — G1–G4 all landed. Awaiting next Leader-assigned Plan.

## Done
- Road `roads/PLAN-02-G4-bounds-wiring.md` (Status: DONE + superseded by memory/geometry.md):
  added `Scene.objectBounds()` (stable `{ object, worldAABB }` list, per-renderable, built from
  `Node.worldBounds()`; entries with no finite local bounds — e.g. an infinite Plane — are
  omitted since a BVH has nothing spatial to index them by) and `Scene.bounds()` (union of every
  entry's `worldAABB` via `AABB.union`, `null` if none finite). No BVH — this is the PLAN-09 hook
  only. Scratch-assert verification passed: a 2-object scene (sphere + box, plus an
  infinite-plane renderable) — `objectBounds()` returned exactly the 2 finite-bounded entries,
  `bounds()` matched the hand-computed union of sphere/box world AABBs, moving the box via
  `setPosition` (dirty-flag cascade) was reflected in a subsequent `bounds()` call, and repeated
  calls without rebuilding the scene stayed consistent. `memory/geometry.md` contract unchanged —
  implementation matches as shipped. **PLAN-02 (Geometry & Scene) now complete.**
- Road `roads/PLAN-02-G3-scene-graph.md` (Status: DONE + superseded by memory/geometry.md):
  built `src/geometry/Node.js` (position/rotation(Quaternion)/scale → local Matrix4 via
  translate*rotate*scale; `children`/`parent`; cached `worldMatrix` getter with a `_dirty`
  flag that `markDirty()` cascades through the subtree on any transform-setter call or
  `add()`; `worldBounds()` transforms the geometry's local AABB corners through the world
  matrix; `Node.localBounds()` duck-types local bounds from `geometry.bounds` (Mesh),
  `.min`/`.max` (Box), or `.center`/`.radius` (Sphere) — Plane and unrecognized geometry
  return `null`, i.e. no finite bounds) and `src/geometry/Scene.js` (`build()` walks the
  graph from `root`, pushing geometry-bearing nodes into `renderables` and transforming
  light-bearing nodes' local origin into world-space point-light descriptors
  `{ position, color, intensity }` into `lights`), both exported from `src/geometry/index.js`.
  Scratch-assert verification passed: 3-node hierarchy (root → parent → child-with-sphere,
  plus a sibling light node) — nested transform composition matched hand-computed world
  position, the cached `worldMatrix` returned the identical object across repeated reads
  until a transform changed, moving the parent cascaded the dirty flag and recomputed the
  child's world position correctly, `worldBounds()` matched the hand-computed translated
  sphere AABB, `Scene.build()` collected exactly the one geometry node and one light with
  correct world-space light position, and a `Plane`-geometry node's `worldBounds()` returned
  `null`. `memory/geometry.md` contract unchanged — implementation matches as shipped.
- Road `roads/PLAN-02-G2-mesh.md` (Status: DONE + superseded by memory/geometry.md):
  built `src/geometry/Mesh.js` (triangle-list constructor, own AABB computed via
  `AABB.expandByPoint` over all vertices, `intersect` = linear nearest-hit scan across
  triangles narrowing `tMax` to the closest hit so far, AABB early-out miss before scanning,
  empty mesh returns `null`), exported from `src/geometry/index.js`. Scratch-assert
  verification passed: a 2-triangle mesh (near z=0, far z=5) returns the near triangle's hit
  (not the first-encountered one) when both are in range, a ray missing the AABB returns
  `null` without a triangle scan, an empty mesh returns `null`, and computed bounds matched
  the hand-computed enclosing box of both triangles' vertices. `memory/geometry.md` contract
  unchanged — implementation matches as shipped.
- Road `roads/PLAN-02-G1-primitives.md` (Status: DONE + superseded by memory/geometry.md):
  built `src/geometry/Hit.js` (createHit factory: `{ t, point, normal, material, object }`),
  `Sphere.js` (quadratic, nearest root in range, inside-ray falls through to exit hit),
  `Plane.js` (double-sided, stored normal returned as-is, parallel rays miss),
  `Box.js` (axis-aligned slab test tracking near/far face+axis for correct outward face
  normal; inside-ray falls through to exit face), `Triangle.js` (Möller–Trumbore, normal =
  edge1×edge2, degenerate/parallel miss), and `src/geometry/index.js` barrel. Scratch-assert
  verification passed (21 checks): hand-computed t/point/normal for each primitive, tangent
  sphere hit, ray-from-inside exit hits (sphere + box), axis-aligned box face normals on both
  entry and exit, plane hit from both sides, triangle barycentric miss + tMin/tMax bounds.
  `memory/geometry.md` contract unchanged — implementation matches as shipped.
- Phase B (Leader): generated PLAN-02 Tasks + Roads (G1–G4) in `akrs/tasks/` + `akrs/roads/`;
  recorded the Scene point-light descriptor shape + `Scene.bounds()` in `memory/geometry.md`.
- Road `roads/PLAN-01-M4-bounds.md` (Status: DONE + superseded by memory/math.md):
  built `src/math/AABB.js` (contains/expandByPoint/union/intersectRay slab test) and
  `src/math/BoundingSphere.js` (contains/intersectRay analytic quadratic), both exported from
  `src/math/index.js`. Data-only, depend only on Vector3/Ray. Scratch-assert verification
  passed: axis-aligned + angled ray hits/misses, ray-starts-inside returns t=0, box-behind-ray
  miss, boundary-inclusive `contains`, `expandByPoint`/`union` grow bounds without mutating the
  original, sphere analytic hit/inside-exit/miss/tangent cases all matched hand-computed values.
  `memory/math.md` contract unchanged — implementation matches as shipped.
- Road `roads/PLAN-01-M3-quaternion.md` (Status: DONE + superseded by memory/math.md):
  built `src/math/Quaternion.js`, exported from `src/math/index.js`. fromAxisAngle/multiply
  (Hamilton product)/normalize/toMatrix4/slerp. Scratch-assert verification passed: consistency
  contract holds — `fromAxisAngle(axis,θ).toMatrix4()` matches `Matrix4.rotate(axis,θ)` exactly
  (tested on +Y axis and an oblique axis); multiply composes rotations (90°+90°=180° about same
  axis, mod double-cover sign); normalize yields unit length; slerp(a,b,0)=a, slerp(a,b,1)=b,
  and the midpoint is the correct shortest-arc half-angle rotation. `memory/math.md` contract
  unchanged — implementation matches as shipped.
- Road `roads/PLAN-01-M2-matrix4.md` (Status: DONE + superseded by memory/math.md):
  built `src/math/Matrix4.js`, exported from `src/math/index.js`. Column-major length-16
  array per the storage decision; identity/translate/scale/rotate(axis,θ)/lookAt/perspective
  static factories; multiply/inverse/transformPoint(w=1, perspective-divides)/transformDir(w=0)
  instance methods. Right-handed, -Z forward confirmed (rotate +Y 90° sends +X→-Z; lookAt from
  +Z puts origin at -Z in view space). Scratch-assert verification passed: identity is
  multiplicative identity, multiply associative on a sample triple, transformPoint/transformDir
  vs translation, inverse(M)*M≈I, near/far plane → NDC z=∓1 under perspective.
  `memory/math.md` contract unchanged — implementation matches as shipped.
- Road `roads/PLAN-01-M1-vectors-ray.md` (Status: DONE + superseded by memory/math.md):
  built `src/math/Vector2.js`, `src/math/Vector3.js`, `src/math/Ray.js`, `src/math/index.js`.
  Vector2 (add/sub/scale/dot/length/normalize); Vector3 (add/sub/scale/dot/cross/length/
  lengthSq/normalize/lerp/reflect); Ray (origin, dir, at(t)). All immutable, return new
  instances. Interim scratch-assert verification passed (cross right-handedness, normalize
  unit length, lerp endpoints, reflect off axis-aligned normal, Ray.at(t)=origin+dir*t).
  `memory/math.md` contract unchanged — implementation matches as shipped.
- Phase A skeleton generated for Mirror Forge (AKRS Full):
  - Router — `akrs/ROUTER.md`
  - 10 Plans with phases — `akrs/plans/PLAN-01 … PLAN-10`
  - Memory index — `akrs/memory/` (architecture, conventions, + one contract per domain)
  - Kernel — `akrs/KERNEL.md`
  - Platform adapters — `AGENTS.md` (canonical) + `CLAUDE.md`, `GEMINI.md`, `.cursor/rules`, `.github/copilot-instructions.md`
  - This `STATE.md` (initial save-point)
- Source of Truth confirmed: `docs/data.md` (requirements) + `docs/akrs/framework/` (framework, build-time only).
- Phase B: generated PLAN-01 Tasks + Roads (M1–M4) in `akrs/tasks/` + `akrs/roads/`; recorded Matrix4 storage + quaternion-consistency decisions in `memory/math.md`.

## Next
- PLAN-02 done. Next up per the plan index: PLAN-03 (materials & shading) — Mode 3 (Leader
  generates Task + Road on demand) or dev-directed Mode 0/1 work.

## Open questions
- **Coordinate convention** — assume right-handed, +Y up, camera looks −Z? (owner: `memory/conventions.md`; assumption, confirm)
- **World units** — assume meters? (assumption, confirm)
- **Unit-test framework** — `data.md` requires unit tests but names none. Options: zero-dep in-browser harness / Vitest (dev-only dep). Decide before PLAN-10.
- **Build tooling** — assume none (serve ES modules directly via a static dev server, no bundler)? (assumption, confirm)
- **Save storage** — assume browser `localStorage` with a versioned JSON schema? (owner: `memory/gameplay.md`; assumption, confirm)
- **Framework removal** — `02-Generation §7` says strip `docs/akrs/framework/` from a shipped project. Kept here intentionally (it is this repo's versioned source and your confirmed Source of Truth). Confirm keep vs. move-before-ship.
