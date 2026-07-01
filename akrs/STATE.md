# STATE
Updated: 2026-07-01T00:00Z by claude-code (Worker / Sonnet 5)

## Active
- **PLAN-03 (Materials & Shading) complete** (S1–S3 landed). Handing back to Leader for PLAN-04
  (ray tracer), which consumes the `shade()`/`reflect()` contract shipped here.

## Done
- Road `roads/PLAN-03/S3-reflection.md` (Status: DONE + superseded by memory/materials.md): added
  `reflect(hit, ray) → { ray: Ray, weight: Vector3 } | null` to the material types. `Material`
  base default returns `null` (`Diffuse`/`Emissive` inherit it unchanged — no edits needed to
  those two files); `Mirror`/`Metallic` override it with perfect reflection (`ray.dir.reflect
  (hit.normal)`, normalized, origin epsilon-offset along the normal via the same epsilon as the
  shadow-ray decision). Weight: `Mirror` = `Vector3(1,1,1).scale(reflectivity)` (grey),
  `Metallic` = `albedo.scale(reflectivity)` (tinted). Roughness jitter deferred to PLAN-09 per
  `memory/materials.md`. New `src/materials/shading.js` export: `reflectRay(hit, ray)` (shared
  direction+origin logic for both types). No recursion/depth-limit/accumulation — PLAN-04 owns
  that. Scratch-assert verification passed: hand-computed reflection direction for a straight-on
  ray matched for both Mirror and Metallic, both returned unit-length directions with origins
  offset along the normal, Mirror weight equaled grey `reflectivity`, Metallic weight equaled
  `albedo × reflectivity` component-wise, and Diffuse/Emissive both returned `null`.
  `memory/materials.md` contract unchanged — implementation matches as shipped.
- Road `roads/PLAN-03/S2-local-shading.md` (Status: DONE + superseded by memory/materials.md):
  added `shade(hit, ray, scene, lights) → Vector3` to the S1 types — `Material` base default is
  ambient-only (`Mirror` inherits it unchanged, per spec: its look comes from S3 reflection);
  `Diffuse`/`Metallic` = Lambert diffuse + Blinn-Phong specular (shininess derived from
  `roughness`) + ambient tinted by albedo, with one hard shadow ray per point light
  (epsilon-offset along the normal, skips occluded lights); `Emissive` returns
  `emission.scale(intensity)`, ignoring scene/lights. New `src/materials/shading.js`: `mulColor`
  (component-wise, not a Vector3 method — PLAN-01 math stays closed), `shadeOpaque` (shared
  diffuse+specular+ambient+shadow logic for Diffuse/Metallic), `shadeAmbientOnly`,
  `SHADOW_EPSILON`. **Scope exception (user-approved):** `memory/rendering.md`/`memory/geometry.md`
  documented `Scene.intersect(ray) → Hit | null` as a contract the tracer relies on, but no
  PLAN-02 Road had built it. Added it to `src/geometry/Scene.js` (linear closest-hit scan over
  `renderables`) since S2's shadow rays need it — outside this Road's original `src/materials/`
  scope, confirmed with the user first. Recorded in `memory/geometry.md`. Scratch-assert
  verification passed: a front-lit diffuse sphere (light on the same side as the hit normal)
  shaded above the hand-computed `ambient·albedo + albedo·NdotL` floor; the same light occluded by
  a second sphere placed directly between hit point and light contributed exactly 0 (color equals
  ambient·albedo only); `Emissive.shade()` returned `emission × intensity` independent of
  scene/lights; `Mirror.shade()` returned ambient-only regardless of lights present; `Metallic`
  showed the same lit-vs-occluded contrast using its own albedo. `memory/materials.md` updated:
  ambient read as `scene.ambient` scalar (0 fallback, not invented) — still open pending
  `conventions.md`'s fixed default; shininess-from-roughness formula recorded as an assumption.
- Road `roads/PLAN-03/S1-material-model.md` (Status: DONE + superseded by memory/materials.md):
  built `src/materials/Material.js` (base: `type` tag + shared `roughness`/`reflectivity`,
  defaulted to 0), `Diffuse.js` (`albedo`: Vector3), `Mirror.js` (`reflectivity`), `Metallic.js`
  (`albedo`, `reflectivity`, `roughness`), `Emissive.js` (`emission`: Vector3, `intensity`), and
  `src/materials/index.js` barrel — data only, no `shade()`/`reflect?()`. Scratch-assert
  verification passed: each type instantiates with correct `type` tag + params, all four are
  `instanceof Material`, and a `Diffuse` material attached to a `Sphere` reads back unchanged
  through `sphere.material`. `memory/materials.md` contract unchanged — implementation matches
  as shipped.
- Phase C (Leader): generated PLAN-03 Tasks + Roads (S1 material model, S2 local shading, S3
  reflection) in the new per-plan **subfolders** `akrs/tasks/PLAN-03/` + `akrs/roads/PLAN-03/`.
  Recorded three PLAN-03 decisions in Memory: color container = `Vector3` (0..1 linear, no Color
  type) with a materials-local `mulColor` helper instead of extending closed PLAN-01 math
  (`memory/materials.md`); `shade()` owns per-light hard-shadow occlusion and `reflect?()` returns
  `{ ray, weight: Vector3 } | null` (`memory/materials.md`); reconciled the pipeline so shadows
  live inside `materials.shade()` while the tracer owns recursion/AA/gamma (`memory/rendering.md`).
  Updated `tasks/README.md` + `roads/README.md` to document the folder layout.
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
- **PLAN-03 done.** Leader to assign PLAN-04 (ray tracer): consumes `materials.shade()`/`reflect()`
  and the new `Scene.intersect()` (added as a scope exception during S2 — see Done log).

## Open questions
- **Coordinate convention** — assume right-handed, +Y up, camera looks −Z? (owner: `memory/conventions.md`; assumption, confirm)
- **World units** — assume meters? (assumption, confirm)
- **Unit-test framework** — `data.md` requires unit tests but names none. Options: zero-dep in-browser harness / Vitest (dev-only dep). Decide before PLAN-10.
- **Build tooling** — assume none (serve ES modules directly via a static dev server, no bundler)? (assumption, confirm)
- **Save storage** — assume browser `localStorage` with a versioned JSON schema? (owner: `memory/gameplay.md`; assumption, confirm)
- **Framework removal** — `02-Generation §7` says strip `docs/akrs/framework/` from a shipped project. Kept here intentionally (it is this repo's versioned source and your confirmed Source of Truth). Confirm keep vs. move-before-ship.
