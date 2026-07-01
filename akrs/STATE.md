# STATE
Updated: 2026-07-02T13:00Z by claude-code (Worker / Sonnet 5)

## Active
- **PLAN-07 (Gameplay & Puzzles) is complete** — P1 → P2 → P3 → P4 all executed and landed (see
  Done). `src/game/` now wires engine + geometry + camera + materials into the first playable slice:
  rooms → interactables/collision → the reflective puzzle → restart/save.
- PLAN-01 … PLAN-07 are all complete (math, geometry, materials, ray tracer, camera+input, engine,
  gameplay). **No live browser boot yet** — `Loop` + `Renderer.render(camera, scene)` +
  `InputManager` + `src/game/` have not been assembled into `src/main.js`; that is PLAN-08 (UI/boot).

## Done
- **PLAN-07 (Gameplay & Puzzles, P1–P4) executed** (Worker pass, in order per `STATE.md` → Next).
  Built `src/game/`: `Room.js` + `RoomManager.js` (opaque `SceneManager` registration, `enter(key)`/
  `update(playerPos)` transition-volume swap); `events.js` (gameplay-owned event names) +
  `Switch.js`/`Door.js`/`Collectible.js` (proximity + `interact`-edge switch, linked-switch door with
  an AABB collider while closed, proximity auto-pick collectible) + `worldColliders(scene, doors)`
  (collider-list assembly for `Collision.resolve`); additive `interact` field on
  `InputManager.poll()` (`KeyE`, edge-detected, poll-and-clear — every prior field unchanged);
  `beam.js` (`traceBeam` — reflecting ray march reusing `scene.intersect` + `material.reflect` +
  `maxDepth`, no reimplementation) + `Puzzle.js` (switch-toggled mirror-**normal** swap — see the
  Worker-level decision below — re-traces and emits `LEVEL_WON` once); `save.js` (`save`/`load`/
  `clear`, versioned `mirror-forge:save`, plus `snapshot()`/`restart()` bridging to the live P1–P3
  objects). Full detail + scratch-assert results recorded in `memory/gameplay.md` → "Landed".
  **Worker-level decision** (the Road left "two orientations" unspecified): a movable mirror's
  orientation is realized by swapping the mirror's own geometry `normal` in place (a `Plane`), not by
  `Node.setRotation` — geometry `intersect()` tests the world-space ray directly against its own
  stored fields; `Node` transforms only feed `worldBounds()` (collision), never ray intersection, so
  rotating the wrapping `Node` would not have changed the reflected direction. Recorded in
  `memory/gameplay.md` → Decisions. All four Roads verified via scratch-assert (no DOM/localStorage —
  synthetic positions/input, a stubbed `localStorage`); set all four Roads
  `DONE + superseded by memory/gameplay.md`. **PLAN-07 (Gameplay & Puzzles) now complete** — unblocks
  PLAN-08 (UI), including the main-menu "continue" (`load()`) and the boot assembly step.
- Phase G (Leader): generated PLAN-07 Tasks + Roads (P1 rooms & navigation, P2 interactables +
  collision wiring, P3 reflective puzzle + win, P4 persistence) in `akrs/tasks/PLAN-07/` +
  `akrs/roads/PLAN-07/`. Recorded PLAN-07 decisions in `memory/gameplay.md`: `src/game/` is the
  integration/injection layer (imports engine + geometry + camera + render + math); `Room` descriptor
  `{ key, scene, spawn, transitions }` + `RoomManager` registering opaque scenes with `SceneManager`
  and swapping on transition-volume entry; **gameplay-owned event names** in `src/game/events.js`
  (`SWITCH_TOGGLED`, `DOOR_OPENED/CLOSED`, `COLLECTIBLE_PICKED`, `ROOM_ENTERED`, `LEVEL_WON`,
  `GAME_RESTARTED`); interaction = **proximity + `interact`** (an additive `interact` edge added to
  the engine `InputManager.poll()` in P2 — `Controls` unaffected, recorded in `memory/camera-input.md`
  + `memory/engine.md`); collision wired from `Scene.objectBounds()` + closed-door AABBs through
  `Collision.resolve`; a `beam.js` reflecting ray-march **reusing** `scene.intersect` + `material.reflect`
  + the `maxDepth` cap (no reimplementation); save = versioned `localStorage` `mirror-forge:save`
  `{ version, currentRoom, collected[], switches{}, doors{}, settings }` with `restart()` reset.
  Execution order P1 → P2 → P3 → P4; P1 ready now. The concrete P3 rule lives in
  `roads/PLAN-07/P3-reflective-puzzle.md`. Marked PLAN-06 complete + added the PLAN-07 table in
  `tasks/README.md`; refreshed `roads/README.md`. Flagged the puzzle-mechanic + save-schema confirms
  in Open questions.
- Roads `roads/PLAN-06/E1-game-loop.md`, `E2-entity-system.md`, `E3-managers.md`,
- Roads `roads/PLAN-06/E1-game-loop.md`, `E2-entity-system.md`, `E3-managers.md`,
  `E4-events-collision.md` (Status: DONE + superseded by `memory/engine.md`) — Worker pass, executed
  in order per `STATE.md` → Next. Built `src/engine/`: `Loop.js` (rAF loop, dt clamped to 0.1s,
  `update(dt)` → `render()` → timing snapshot `{ dt, elapsed, frame, fps }`); `Entity.js` + `World.js`
  (lightweight entity + component-bag, `create/remove/query/each`); `SceneManager.js` (opaque scene
  registry by key); `InputManager.js` (owns raw DOM listeners + Pointer Lock on an injected target;
  `poll()` returns the exact `{ forward, backward, left, right, mouseDeltaX, mouseDeltaY,
  pointerLocked, fovDelta }` snapshot pinned in `memory/camera-input.md`, poll-and-clear deltas);
  `AssetManager.js` (async JSON cache, `load`/`get`); `EventBus.js` (sync `on/off/emit`);
  `Collision.js` (`resolve(position, desiredMove, radius, colliders) → newPosition` — sphere-vs-AABB
  positional correction: attempt the full move, then push out along the contact normal by the
  penetration depth per colliding AABB, which stops head-on motion at the surface while leaving
  tangential motion untouched, i.e. slide). `src/engine/index.js` barrel exports all eight symbols.
  Scratch-assert verification passed for all four Roads: Loop (stubbed rAF/`performance.now` — dt
  clamp on a simulated 5s stall, update→render call order, timing snapshot advancing); Entity/World
  (unique ids, add/get/has/remove round-trip, query/each membership, entity removal); managers
  (SceneManager swap; AssetManager second `load()` for the same key does not refetch; InputManager
  with a stubbed `EventTarget` — held-key state, mouse deltas ignored until pointer-locked then
  accumulating and clearing on `poll()`, wheel → `fovDelta` accumulate+clear); **end-to-end check**:
  `InputManager.poll()` fed directly into the existing `Controls.update(camera, input, dt)`
  (PLAN-05/C2) moved the camera forward on a simulated W keypress — confirms the real-input loop is
  closed; EventBus (`on`/`off`/`emit` to multiple handlers, unknown-type no-op); Collision.resolve
  (hand-computed head-on stop exactly at the box surface with no penetration, free-space move
  unaffected, a glancing case preserving the tangential component while still not penetrating).
  `memory/engine.md` updated with a "Landed" section recording the shipped shapes.
  **PLAN-06 (Engine Runtime) now complete** — unblocks PLAN-07 (Gameplay), which is next per the
  dependency graph in `memory/architecture.md`.
- Phase F (Leader): generated PLAN-06 Tasks + Roads (E1 game loop & timing, E2 entity system, E3
  managers [scene / input / asset], E4 events & collision) in `akrs/tasks/PLAN-06/` +
  `akrs/roads/PLAN-06/`. Recorded PLAN-06 decisions in `memory/engine.md`: `src/engine/` imports
  **only** `src/math/` (scenes / assets / colliders arrive as injected / duck-typed refs — no
  geometry import; DOM allowed only in the input manager); `Loop({ update, render })` with variable
  dt **clamped** + a timing snapshot `{ dt, elapsed, frame, fps }`; **lightweight** entity +
  component-bag `World` (not full ECS); `InputManager.poll()` returns the exact
  `{ forward, backward, left, right, mouseDeltaX, mouseDeltaY, pointerLocked, fovDelta }` snapshot
  pinned in `memory/camera-input.md` (poll-and-clear deltas); `SceneManager` holds opaque scene
  handles by key; `AssetManager` = thin async JSON cache (level schema owned by gameplay); `EventBus`
  synchronous `on / off / emit`; collision = **sphere-vs-AABB slide** reusing PLAN-01/M4 bounds, with
  colliders fed from `Scene.objectBounds()` (PLAN-02/G4). Execution order E1 → E2 → E3 → E4; E1 ready
  now. Flagged the collision-proxy + asset-format assumptions in Open questions. Marked PLAN-04 /
  PLAN-05 complete and added the PLAN-06 table in `tasks/README.md`; refreshed `roads/README.md`.
- Road `roads/PLAN-05/C2-controls.md` (Status: DONE + superseded by memory/camera-input.md): built
  `src/camera/Controls.js` — `update(camera, input, dt)` reads a normalized, polled input snapshot
  (no DOM/pointer-lock listeners; the engine input manager owns raw events). Mouse look (yaw/pitch
  from `mouseDeltaX/Y`, only while `input.pointerLocked`) is gated separately from WASD movement
  (yaw-relative on the XZ plane via a **flat** forward/right basis computed from yaw alone, so
  pitch never tilts movement and Y is untouched); pitch clamped to ±89°; FOV adjust via
  `input.fovDelta` clamped to `[fovMin, fovMax]`, applied through `camera.setFov()`. Defaults:
  `moveSpeed = 5` m/s, `mouseSensitivity = 0.0022` rad/px, `invertY = false`, `pitchLimit = 89°`,
  `fovMin/fovMax = 20°/100°` — all constructor overrides pending real settings wiring ([[ui]]).
  Edited `src/camera/index.js` to export `Controls`. **PLAN-06/E3 (input manager) does not exist
  yet** — `Controls` was built directly against the normalized-input contract described in
  `memory/camera-input.md` (a design decision recorded there now, since no exact field shape
  existed before this Road); E3 must conform to it or renegotiate. Scratch-assert verification
  passed with a synthetic input state (no DOM): W moves along yaw-forward on the XZ plane with Y
  unchanged, both at yaw=0 and after a 90° yaw turn (yaw-relative, not world-relative); D strafes
  along yaw-right; movement stays flat even while pitched; a mouse delta yaws+pitches the camera
  only when `pointerLocked` is true (no-op otherwise); extreme mouse deltas saturate pitch at
  exactly +89°/−89°; `fovDelta` adjusts FOV by the delta and clamps at `fovMax`. `memory/
  camera-input.md` updated with the input contract, pitch-clamp, and yaw-relative-movement
  decisions. **PLAN-05 (C1+C2) now complete** per each Road's own acceptance criteria.
- Road `roads/PLAN-04/R4-image-quality.md` (Status: DONE + superseded by memory/rendering.md):
  edited `src/render/Renderer.js` — pixel loop now takes an injected `samples` param (default 4);
  for each sample, jitters the sub-pixel position (`px + jitterX - 0.5, py + jitterY - 0.5` fed to
  `camera.rayFor`, uniform random in `[0,1)`; `samples === 1` uses a fixed center jitter of 0.5 for
  determinism) and averages the resulting linear colors before a single `writeColor` call per
  pixel — clamp+gamma still applied exactly once, never per-sample. No changes to
  `writeColor.js` (gamma already injected). Scratch-assert verification passed: `samples: 1`
  reproduced the exact byte output of a plain, un-jittered `traceRay` call (matches R3); a
  fake-camera/fake-scene edge case (hit iff the jittered sample landed right-of-center) with
  `samples: 64` produced a gamma-encoded byte strictly between 0 and 255 (neither pure background
  nor pure foreground — anti-aliased, not a hard stair-step); a flat mid-gray background rendered
  through the sample-averaging path still round-tripped through gamma exactly once (matches the
  un-averaged single-gamma byte). `memory/rendering.md` updated: R4 landed, **PLAN-04 complete**.
  Recorded the AA default (`samples = 4`) as an assumption in `memory/conventions.md` alongside the
  existing `maxDepth = 4` default; surfaced the still-unset ambient-coefficient numeric default in
  `STATE.md` → Open questions (shade() already falls back to 0, not an invented value).
- Road `roads/PLAN-04/R3-reflections.md` (Status: DONE + superseded by memory/rendering.md):
  extended `src/render/trace.js`'s `traceRay` to `traceRay(ray, scene, lights, background, depth =
  0, maxDepth = 4)` — after local shade, calls `hit.material.reflect(hit, ray)`; if it returns
  `{ ray, weight }`, recurses on the reflection ray at `depth + 1` and accumulates `local +
  mulColor(weight, reflectedColor)` (imported `mulColor` from `materials/shading.js`, not
  reimplemented), stopping once `depth >= maxDepth` (returns local color only at the cap). Edited
  `Renderer.js` to inject `maxDepth` (default 4) and pass it through. No edits to
  `src/materials/` or `src/geometry/` — the material still owns direction/weight, the tracer
  still owns recursion + the depth cap. Scratch-assert verification passed: a mirror sphere
  reflecting a lit red diffuse sphere showed a red-dominant, above-ambient color; a metallic
  sphere reflecting an emissive white sphere showed a reflection tinted exactly proportional to
  its albedo (G/R and B/R ratios matched albedo ratios to 1e-6); a purely diffuse scene's
  `traceRay` output matched its bare `material.shade()` call exactly (no spurious reflection
  term, since `Diffuse.reflect()` inherits the base `null`); two facing mirror planes
  ping-ponging a normal-incidence ray returned exactly the local ambient color at `maxDepth = 0`,
  and terminated cleanly (no throw, finite result, strictly more accumulated color than the
  depth-0 case) at `maxDepth = 100` — confirming the cap prevents unbounded recursion.
  `memory/rendering.md` updated: R3 landed.
- Road `roads/PLAN-04/R2-shading-shadows.md` (Status: DONE + superseded by memory/rendering.md):
  added `src/render/trace.js` exporting `traceRay(ray, scene, lights, background)` — closest hit
  via `scene.intersect`, color via `hit.material.shade(hit, ray, scene, lights)` (which already
  owns per-light hard shadows per `memory/materials.md`), miss → `background`; stays linear, no
  clamp/gamma. Edited `Renderer.render(camera)` → `render(camera, scene)` so the pixel loop calls
  `traceRay` per pixel instead of writing a flat background (signature change was necessary — R1
  had no `scene`/`lights` to pass; nothing outside `src/render/` touched). `src/render/index.js`
  now also exports `traceRay`. Scratch-assert verification passed: a one-sphere-one-light scene —
  a ray through the sphere returned a shaded (non-background, albedo-tinted) color; a ray past the
  sphere returned exactly `background`; adding a second occluding sphere directly between the hit
  point and the light darkened that same pixel (still above 0 from ambient, not pure black) versus
  the unoccluded case; an end-to-end `Renderer.render(camera, scene)` call showed a visibly
  different center pixel (lit disc) vs. corner pixel (background), alpha = 255 throughout.
  `memory/rendering.md` updated: R2 marked landed.
- Road `roads/PLAN-04/R1-primary-rays.md` (Status: DONE + superseded by memory/rendering.md): built
  `src/render/Renderer.js` (`{ width, height, background, gamma }` constructor params injected,
  defaults mirroring `conventions`; `render(camera)` loops every pixel, casts `camera.rayFor(px,
  py, width, height)`, currently writes the constant background — no closest-hit/shading/
  reflections yet, R2–R3 own that; returns a DOM-free `{ width, height, data: Uint8ClampedArray }`
  buffer for the boot layer to blit) and `src/render/writeColor.js` (linear `Vector3` →
  clamp[0,1] → gamma 2.2 → ×255 → RGBA8 write at a byte index, alpha = 255, single write-out — no
  double gamma), plus `src/render/index.js` barrel. Scratch-assert verification passed (fake
  camera returning a fixed `Ray`): buffer is `Uint8ClampedArray` of length `W*H*4`; every pixel
  equals the gamma-encoded background byte (mid-gray linear 0.5 round-trips to
  `round(0.5^(1/2.2)*255)`, not raw `0.5*255` — confirms no double/missing gamma); alpha = 255
  everywhere. `memory/rendering.md` updated: R1 marked landed (was blocked on PLAN-05/C1, now
  built against the landed `rayFor` contract). **Proves the camera→pixel path.**
- Road `roads/PLAN-05/C1-camera.md` (Status: DONE + superseded by memory/camera-input.md): built
  `src/camera/Camera.js` (position, yaw/pitch (radians), fov/near/far; `basis()` derives
  forward/right/up from yaw/pitch — yaw about +Y, pitch about local right, forward = −Z at
  yaw=pitch=0; `rayFor(px,py,width,height)` casts through the pixel center, spread by vertical
  FOV + aspect, rotated by the basis, normalized, origin = position; `viewMatrix()` via
  `Matrix4.lookAt(position, position+forward, worldUp)`; `projectionMatrix(aspect)` via
  `Matrix4.perspective(fov, aspect, near, far)`; `setFov()` runtime setter) and `src/camera/index.js`
  barrel. No controls/input, no DOM events — C2 owns that. Scratch-assert verification passed:
  center-pixel ray ≈ (0,0,−1) and unit length; all four corner rays unit length and symmetric
  (left/right and top/bottom mirrored, correct sign per quadrant); yawing 90° about +Y rotates
  `basis().forward` from −Z to −X exactly; `projectionMatrix` maps `z=−near`→NDC −1 and
  `z=−far`→NDC +1. `memory/camera-input.md` contract unchanged — implementation matches as shipped.
  **Unblocks PLAN-04/R1.**
- Phase E (Leader): generated PLAN-05 Tasks + Roads (C1 first-person camera, C2 controls) in
  `akrs/tasks/PLAN-05/` + `akrs/roads/PLAN-05/`. Recorded the camera FOV decision in
  `memory/camera-input.md` (FOV = vertical, aspect = width/height; `rayFor` through pixel center,
  shared FOV meaning with `projectionMatrix`). C1 is buildable now; C2 blocked on PLAN-06/E3.
- Phase D (Leader): generated PLAN-04 Tasks + Roads (R1 primary rays, R2 shading+shadows, R3
  reflections, R4 image quality) in per-plan subfolders. Recorded PLAN-04 decisions in
  `memory/rendering.md`: `traceRay(ray, scene, lights, depth)` entry + reflection accumulation
  (`local + mulColor(weight, recurse)`), DOM-free Renderer writing an ImageData buffer (boot blits
  it), render params injected (owned by conventions), AA = jittered sub-samples averaged in linear
  space. Flagged R1's camera prerequisite. Marked PLAN-02/03 complete in `tasks/README.md`.
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
- **PLAN-07 is done. Start PLAN-08 (UI)** (Leader planning pass first — no PLAN-08 Tasks/Roads exist
  yet): main-menu "continue" reads `save.load()`; settings own the opaque `settings` blob persisted
  by `snapshot()`/`save()`; FPS counter reads `Loop`'s `timing` snapshot.
- The **live browser boot** (assemble `Loop` + `Renderer.render(camera, scene)` + `InputManager` +
  `src/game/` `RoomManager`/`Puzzle`/etc. into `src/main.js`, wired to a real `<canvas>`) is still
  unbuilt — likely folded into PLAN-08 or its own step; confirm with the user which Plan owns it.
- Note: PLAN-07 modules are verified via scratch-assert (synthetic input/positions, stubbed
  `localStorage`), the project's established pattern — no DOM/browser needed. Formal automated tests
  are deferred to PLAN-10 across the whole project.
- Still-open confirms (don't block PLAN-08 planning): the player collision radius (caller-supplied to
  `Collision.resolve`, gameplay never picked a concrete default), the level-JSON schema (`AssetManager`
  is format-agnostic), and the ambient-coefficient default (PLAN-04, needed before a reference scene
  ships). See Open questions.

## Open questions
- **Coordinate convention** — assume right-handed, +Y up, camera looks −Z? (owner: `memory/conventions.md`; assumption, confirm)
- **World units** — assume meters? (assumption, confirm)
- **Unit-test framework** — `data.md` requires unit tests but names none. Options: zero-dep in-browser harness / Vitest (dev-only dep). Decide before PLAN-10.
- **Build tooling** — assume none (serve ES modules directly via a static dev server, no bundler)? (assumption, confirm)
- **Save storage** — assume browser `localStorage` with a versioned JSON schema? (owner: `memory/gameplay.md`; assumption, confirm)
- **Framework removal** — `02-Generation §7` says strip `docs/akrs/framework/` from a shipped project. Kept here intentionally (it is this repo's versioned source and your confirmed Source of Truth). Confirm keep vs. move-before-ship.
- **Ambient coefficient numeric default** — `materials.shade()` reads `scene.ambient`, falling
  back to 0 (neutral) when unset; no scene currently sets a non-zero default. (owner:
  `memory/conventions.md`; confirm the intended default before a reference scene ships.)
- **Player collision proxy** — E4 shipped `Collision.resolve` with a **caller-supplied radius** (no
  engine default). Confirm the gameplay player radius (~0.3 m sphere) when P2 wires collision. (owner:
  `memory/gameplay.md`; assumption, confirm during P2)
- **Asset / level file format** — assume **JSON** level descriptors, with the schema owned by
  [[gameplay]] (PLAN-07)? `AssetManager` is format-agnostic (async cache); only the schema is
  deferred. (owner: `memory/engine.md` → [[gameplay]]; assumption, confirm)
- **Reflective puzzle mechanic (P3)** — landed as assumed: a switch-toggled movable mirror routes a
  reflecting beam onto a receiver → `LEVEL_WON` (`src/game/beam.js` + `Puzzle.js`, reusing
  `scene.intersect` + `material.reflect` + `maxDepth`). Confirm the *numeric layout* of a real level
  (emitter/mirror/receiver placement) is still Unknown — only the mechanic is settled.
- **`interact` input edge** — landed: `InputManager.poll()` returns an additive `interact` field
  (`KeyE`, edge-detected, poll-and-clear); `Controls` + existing fields unchanged. Recorded in
  `memory/camera-input.md` + `memory/engine.md`.
- **Mirror-orientation implementation** — `Puzzle` swaps the mirror's own geometry `normal` in place
  (not a `Node` rotation, since geometry `intersect()` ignores `Node` transforms). A Worker-level
  choice the Road left open; confirm it's the intended long-term approach before PLAN-09 (BVH) or any
  future Node-transform-aware intersection change lands, since that would change this contract.
