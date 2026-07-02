# STATE
Updated: 2026-07-02T00:30Z by claude-code (Worker)

## Active
- **All 10 plans are now complete.** PLAN-10/Q3 (the last Road of the last plan) landed — see Done
  below. There is no further Active work queued; the next step is a Leader pass (Mode 4/close-out)
  if new scope is opened, or resolving the remaining non-blocking Open questions below.
- **Phase J (Leader): PLAN-10 Tasks + Roads generated** — the last plan. `tasks/PLAN-10/` +
  `roads/PLAN-10/` held Q1 (zero-dep harness + core unit tests: math/geometry/materials), Q2
  (renderer pixel-hash regression + BVH-vs-linear/early-term/scale checks + engine/save smoke), Q3
  (import-direction lint + module entry-contract docs + conventions style) — **all three now DONE**.
  Harness **Decided** (zero-dep Node/browser runner, `node tests/run.js`, no deps/bundler) — recorded
  in `memory/testing.md`, resolving the STATE open question. Indexes refreshed (`tasks/README.md`,
  `roads/README.md`).
- **PLAN-01 … PLAN-09 are all complete. PLAN-08 (U1–U3) is now fully live-verified in a browser** —
  Playwright, served over a local static HTTP server (no bundler, per `memory/conventions.md`):
  menu → New Game → PLAYING (renders, `F3` overlay) → pause (reachable from both menus) → Settings
  (every control applies live + persists) → resolution/adaptive changes actually resize the render
  buffer with a correct canvas upscale (no gaps) → Quit → relaunch → Continue restores every setting.
  **Only unstarted Plan: PLAN-10** (regression/testing).
- **One pre-existing issue surfaced during this pass, not fixed (out of U3's scope):** the PLAN-07
  reference level's initial camera view is very bright/blown-out (camera starts near the ceiling
  point light, intensity 18, ambient 0) — never live-verified before now. See Open questions.

## Done
- **PLAN-10/Q3 (modularity & docs pass) executed — PLAN-10 complete, all 10 plans done** (Worker
  pass, per `STATE.md` → Next: Q3). Built `tests/architecture.test.js`: a data-driven import-direction
  lint over the `memory/architecture.md` dependency order (`math → geometry/materials/camera/engine →
  render → game → ui`; `perf` cross-cutting/exempt) — scans every `src/<module>/**.js` file's
  cross-module `import`/re-export specifiers via `node:fs`/`node:path` (no new dependency) and asserts
  none points upward; includes a small unit check of the `isUpwardImport` rule itself (synthetic
  violation + synthetic allowed case) alongside the real full-tree scan. **Zero upward imports found**
  — every module already honored the graph via injected/duck-typed refs (`game`/`ui`/`perf` never
  statically import what they consume), so **no `src/` boundary changes were needed**. Added an
  entry-contract header doc (exported symbols + one-line contracts, pointing to the owning
  `memory/*.md`) to all nine `src/*/index.js` barrels (`math`, `geometry`, `materials`, `camera`,
  `engine`, `render`, `game`, `ui`, `perf`) — docs-only, no export/behavior changes. Scanned for
  `var` usage and non-`SCREAMING_SNAKE` top-level constants per `memory/conventions.md`: **no
  violations found**, tree was already consistent — no style edits made. `tests/run.js` extended to
  import the new suite (Q1+Q2 suites untouched). `node tests/run.js` → **72/72 green, exits 0**.
  `memory/testing.md` + `memory/architecture.md` updated with "Landed"/"Verified" sections. Set
  `roads/PLAN-10/Q3-modularity-docs.md` `DONE + superseded by memory/testing.md`.
  **PLAN-10 (Q1+Q2+Q3) is now complete — this closes the last plan; all 10 plans (PLAN-01 … PLAN-10)
  are done.**
- **PLAN-10/Q2 (renderer & gameplay regression) executed** (Worker pass, per `STATE.md` → Next: Q2).
  Built `tests/render.test.js` (fixed tiny scene — one red `Diffuse` sphere + one point light,
  `samples: 1` — through the real `Renderer.render(camera, scene)`; hand-written FNV-1a hash of the
  RGBA buffer asserted against a committed `GOLDEN_HASH`; lit-vs-background pixel contrast; alpha 255
  throughout; byte-identical repeat render). `tests/perf.test.js`: **BVH-vs-linear equality**
  automated (10-sphere scene, fixed deterministic ray grid, `t` + hit-object identity compared with
  `BVH` set vs. unset, plus inside-sphere + `setAccelerator(null)` round-trip cases); **early
  termination** automated (two-facing-`Mirror`-`Plane` fixture — weak reflectivity 0.02 barely
  changes `maxDepth 2→20`, strong 0.95 keeps accumulating meaningfully); `Renderer.setScale`
  byte-identical/halving checks; `AdaptiveController` step/clamp/`enabled=false` checks;
  `FrameBudget` sliding-window average checks. `tests/engine.test.js`: `Loop` via a stubbed
  `requestAnimationFrame`/`performance.now()` (dt clamp on a simulated 5s stall, update-before-render
  ordering, `stop()` cancels); `EventBus` on/off/emit. `tests/gameplay.test.js`: `save`/`load`
  round-trip + null-not-throw (no save / corrupt JSON / version mismatch) through a stubbed in-memory
  `localStorage`; `clear()`; `restart()` reset via stub gameplay objects. Extended `tests/run.js` to
  import all four. **No `src/` changes** — Q2 builds guards only, per its own boundary; no new bug
  surfaced beyond the already-recorded blown-out reference level. Verified (then reverted) that
  corrupting `GOLDEN_HASH` fails the suite and exits 1, confirming the pixel-hash test is a real
  guard. `node tests/run.js` → **69/69 green, exits 0**. `memory/testing.md` updated with a "Landed"
  (Q2) section. Set `roads/PLAN-10/Q2-regression.md` `DONE + superseded by memory/testing.md`.
  **PLAN-10/Q2 now complete — unblocks Q3.**
- **PLAN-10/Q1 (test harness + core unit tests) executed** (Worker pass, per `STATE.md` → Next:
  Q1 ready now). Built `tests/harness.js` (`test`/`assert`/`assertEqual`/`assertClose`/`assertThrows`/
  `run()`, zero-dep, ES modules) + `tests/run.js` (imports every `*.test.js`, `process.exit(fails ? 1
  : 0)`). Built `tests/math.test.js` (Vector2/Vector3/Ray/Matrix4/Quaternion, 21 tests),
  `tests/geometry.test.js` (Sphere/Plane/Box/Triangle/Mesh/Scene.intersect, 14 tests),
  `tests/materials.test.js` (Mirror/Metallic reflect, Diffuse/Emissive reflect()===null, Emissive/
  Mirror shade(), 8 tests) — all asserting hand-computed values matching the M1–M4/G1–G4/S1–S3
  scratch-assert passes already recorded above, no new contracts invented. Tests import the real
  `src/` modules unchanged; no `src/` edits were needed. `node tests/run.js` → **43/43 green, exits
  0**; verified (then reverted) that a deliberately wrong expected value fails a test and makes the
  run exit 1, confirming the harness actually gates. `memory/testing.md` updated with a "Landed"
  section recording the shipped harness API + suite counts. Set
  `roads/PLAN-10/Q1-core-unit-tests.md` `DONE + superseded by memory/testing.md`.
  **PLAN-10/Q1 now complete — unblocks Q2.**
- **PLAN-08/U3 (settings) executed and live-verified with Playwright** (Worker pass). Built
  `src/ui/Settings.js` (FOV/AA-samples/reflection-depth/mouse-sensitivity/invert-Y/resolution-scale +
  an adaptive-resolution toggle; reads initial values off live `camera`/`renderer`/`controls`/
  `adaptiveController` refs; every control applies to its live target immediately and persists via
  `onPersist`). Edited `src/ui/App.js` (`settings` param, `_openSettings`/`closeSettings` — reachable
  from both Main and Pause menus, returns to whichever opened it) and `src/ui/index.js` (export
  `Settings`); `src/ui/ui.css` (panel styles). Wired `src/main.js`: `persistSettings`/`applySettings`
  (boot + Continue apply a loaded blob to every live target and re-sync the panel); a new `blit(frame)`
  draws the render buffer onto an offscreen canvas and upscales it onto the visible canvas
  (`imageSmoothingEnabled = false`) — needed once adaptive can actually shrink the internal buffer;
  `render()` now calls `renderer.setScale(adaptiveController.currentScale)` whenever
  `adaptiveController.enabled` — **the first code to apply a non-1 scale to pixels** (F2/F3 built the
  seam but never called it). **Worker-level decision (Road left it open, caught live in Playwright):**
  the manual resolution slider and `AdaptiveController`'s `[minScale, maxScale]` band are kept fully
  independent — an initial design mapped the slider onto `adaptiveController.maxScale`, which collapsed
  the band to a single point whenever the slider equaled the controller's default `minScale` (0.5),
  silently disabling adaptation; fixed by leaving the controller's band at its own F2 defaults and only
  using the slider for the manual (`adaptive: false`) case. Full detail in `memory/ui.md` → Landed (U3).
  **Live-verified with Playwright** (served over a local static HTTP server — no bundler): every
  setting control applies live and persists (inspected `localStorage` directly); `F3` debug overlay's
  `resolution: WxH` confirmed exact buffer resizing for manual scale changes and for the adaptive
  controller settling at its floor under sustained synthetic load; disabling adaptive instantly
  restored the manual scale; canvas pixel sampling confirmed the upscale blit fills the canvas with no
  gaps; a full Quit → simulated relaunch (page reload) → Continue cycle restored every setting exactly.
  Pause/resume were exercised by dispatching a synthetic `pointerlockchange` event, since
  `input.requestPointerLock()` throws in this headless test environment (`App`'s pause logic only reads
  `document.pointerLockElement`, so this is a valid substitute, not a code change). **PLAN-08 (U1–U3)
  now fully complete and live-verified — the only remaining Plan is PLAN-10.**
- **PLAN-09/F3 (frame timing & budgets) executed** (Worker pass, per `STATE.md` → Next: F1 → F2 → F3 —
  **PLAN-09 now complete**). Built `src/perf/FrameBudget.js` (`{ targetMs, window, smoothedMs }`,
  defaults `targetMs=33`/`window=10`; `sample(ms)` = fixed-size sliding-window moving average).
  Exported it from `src/perf/index.js`. Wired boot (`src/main.js`): module-level `frameBudget` +
  `adaptiveController` instances; `render()` now times `renderer.render()` with `performance.now()`
  (render-only ms, not `Loop.dt`), feeds it through `frameBudget.sample()`, then
  `adaptiveController.update(smoothedMs)` — computed live every frame but **nothing calls
  `renderer.setScale()` with it**, so zero pixels change regardless of controller state (kept
  `enabled=false` by default). Added an optional, backward-compatible `frameBudget` param to
  `src/ui/DebugOverlay.js` (read-only add: an extra `render: <ms> ms (target <targetMs>)` line,
  distinct from the existing Loop-dt `frame:` line). Scratch-assert verification passed (7 checks): a
  single spike moved the smoothed value by ~1/window (not to the spike); smoothed ms tracked sustained
  rising/falling synthetic render times; a sustained 60ms run (over the 33ms target) pushed a fed
  `AdaptiveController` down toward `minScale`, a sustained 5ms run afterward recovered it; `targetMs`
  is runtime-mutable. `memory/performance.md` + `memory/ui.md` + `roads/README.md` updated.
  **PLAN-09 (F1 + F2 + F3) now complete — unblocks PLAN-08/U3.**
- **PLAN-09/F2 (progressive + adaptive rendering) executed** (Worker pass, per `STATE.md` → Next: F1 →
  F2 → F3). Built `src/perf/AdaptiveController.js` (`{ enabled, targetMs, minScale, maxScale,
  currentScale, step }`; `update(frameMs)` steps `currentScale` down/up around `targetMs`, clamped;
  `enabled=false` forces `currentScale=1`) and `src/perf/progressive.js` (`ProgressiveRefiner` —
  `reset()`/`advance()` stepping a scale from `startScale` to `maxScale`, kept simple per the Road's
  Assumption). Edited `src/render/Renderer.js` (`baseWidth`/`baseHeight` stored at construction;
  `setScale(scale)` recomputes `width/height = round(base × scale)`; `render()` itself untouched, so
  `setScale(1)` is byte-identical). Edited `src/perf/index.js` to export both new classes.
  **Deliberately did not touch `src/main.js`** — the Road's boundaries reserve the canvas upscale/blit
  and the actual `controller.update` → `renderer.setScale` wiring for PLAN-08/U3; F2 only builds the
  seam. Scratch-assert verification passed (14 checks): controller scale-down/up/clamp behavior,
  `enabled=false` override, `Renderer.setScale(1)` byte-identical render vs. no-scale, `setScale(0.5)`
  correctly halves + `setScale(1)` restores the base buffer size, `ProgressiveRefiner` default/reset/
  advance/clamp. `memory/performance.md` + `memory/ui.md` updated. **PLAN-09/F2 now complete —
  unblocks F3; U3 can wire the seam for real once F3 lands.**
- **PLAN-09/F1 (BVH + early ray termination) executed** (Worker pass, per `STATE.md` → Next: F1 → F2 →
  F3). Built `src/perf/BVH.js` (median-split tree over `scene.objectBounds()`, `LEAF_SIZE = 4`,
  `intersect(ray, tMin, tMax)` prunes via `AABB.intersectRay`, leaf-tests each object's own
  `intersect`, narrows `tMax` — same closest `Hit` as the linear scan) + `src/perf/index.js` barrel.
  Edited `src/geometry/Scene.js` (additive `setAccelerator(accel)`; `intersect` delegates to the
  duck-typed accelerator when set, else the unchanged linear scan — no perf import). Edited
  `src/render/trace.js` (`traceRay` gained a `weight` param tracking accumulated reflection weight;
  skips recursing into a reflection once `mulColor(weight, reflection.weight)`'s max component drops
  below `EARLY_TERM_EPS = 1/255`, exported from `trace.js`; depth cap and local-shade math unchanged).
  Scratch-assert verification passed: BVH matched the linear scan's closest `Hit` over 500 random rays
  + inside-sphere + all-miss cases; `setAccelerator(bvh)` → `setAccelerator(null)` round-tripped to the
  identical linear result; a weak reflector (0.02) matched within `EARLY_TERM_EPS` between `maxDepth=2`
  and `maxDepth=20`; a strong mirror pair (0.95) showed a meaningfully larger accumulated color at
  `maxDepth=20` vs `maxDepth=3` — early termination isn't over-aggressive. `memory/performance.md`
  updated with a "Landed" section. **PLAN-09/F1 now complete — unblocks F2.**
- Phase I (Leader): generated PLAN-09 Tasks + Roads (F1 BVH + early ray termination, F2 progressive +
  adaptive rendering, F3 frame timing & budgets) in `akrs/tasks/PLAN-09/` + `akrs/roads/PLAN-09/` —
  **the work that unblocks PLAN-08/U3**. Recorded PLAN-09 decisions in `memory/performance.md`: a
  `src/perf/BVH.js` over `scene.objectBounds()` behind an additive, duck-typed `Scene.setAccelerator`
  seam (`scene.intersect` delegates when set, else linear scan; **output-identical**; rebuilt on scene
  change, not per frame; geometry never imports perf); **early ray termination** in `traceRay` when the
  remaining reflection weight < `EARLY_TERM_EPS` (a [[conventions]] budget; output-identical within
  epsilon; depth cap kept); an **`AdaptiveController`** `{ enabled, targetMs, minScale, maxScale,
  currentScale }` (`update(frameMs) → scale`; `enabled=false` ⇒ scale 1 = byte-identical) — **the U3
  seam** (toggle binds `enabled`; resolution setting binds `targetMs`/`minScale`), independent of the
  BVH; progressive coarse→refine (simple); a `src/perf/FrameBudget.js` measuring **render-only ms**,
  smoothed, with a `targetMs` budget (~33 ms) feeding the controller. Execution order F1 → F2 → F3;
  F1 ready now. Added the PLAN-09 table in `tasks/README.md`; refreshed `roads/README.md`. Flagged the
  BVH split, `EARLY_TERM_EPS`, and target-budget assumptions in Open questions.
- **PLAN-08/U1 (menus & boot) + U2 (overlays) executed** (Worker pass, in order per `STATE.md` →
  Next). Built the boot: `index.html` (canvas `#view` + overlay roots `#ui`/`#hud`) + `src/main.js`,

## Done
- **PLAN-08/U1 (menus & boot) + U2 (overlays) executed** (Worker pass, in order per `STATE.md` →
  Next). Built the boot: `index.html` (canvas `#view` + overlay roots `#ui`/`#hud`) + `src/main.js`,
  which constructs one concrete level (single room; switch-toggled mirror routes an emitter beam onto
  a receiver, per the mechanic [[gameplay]]/PLAN-07/P3 fixed but left the numeric layout Unknown) and
  assembles `Camera`/`Controls`/`InputManager(canvas)`/`Renderer`/`RoomManager`/`Switch`/`Puzzle` into
  one engine `Loop`. Built `src/ui/App.js` (MENU/PLAYING/PAUSED state machine; pause = pointer-lock
  exit + release), `MainMenu.js`/`PauseMenu.js` (plain DOM components), `FpsCounter.js` (throttled
  `loop.timing.fps` readout) and `DebugOverlay.js` (camera/scene/renderer read-only panel, `F3`
  toggle, PLAYING-only). **Worker-level decisions** (Road left them open): player collision radius
  = **0.4 m** (answers the STATE open question); Quit-to-menu now **saves a snapshot** (needed so
  "Continue enabled iff a save exists" is ever true — not spelled out by the Road but required to
  satisfy its own acceptance criterion). Full detail in `memory/ui.md` → Landed. **Verification is
  currently syntax-only** (`node --check`, no DOM/browser) — live-browser verification via `/run` is
  still owed before U3.
- Phase H (Leader): generated PLAN-08 Tasks + Roads (U1 menus & boot, U2 overlays, U3 settings) in
  `akrs/tasks/PLAN-08/` + `akrs/roads/PLAN-08/`. Recorded PLAN-08 decisions in `memory/ui.md`: U1 owns
  the browser **boot** (`index.html` + `src/main.js` assemble camera/controls/`InputManager(canvas)`/
  renderer/`src/game/` into the engine `Loop`; `render()` blits the DOM-free renderer buffer via
  `putImageData`); an `App` **state machine** MENU↔PLAYING↔PAUSED (pause = pointer-lock exit, releases
  the lock; Continue = `save.load()`, Restart = `restart()`); an **input-ownership split** (engine
  `InputManager` = gameplay input; UI owns its own chrome listeners — menu clicks, `pointerlockchange`,
  the `F3` debug hotkey); read-only overlays (FPS reads `Loop.timing`; debug reads camera/scene/renderer);
  a UI-owned **settings blob** `{ resolutionScale, adaptive, fov, samples, maxDepth, mouseSensitivity,
  invertY }` persisted opaquely in the gameplay save, applied to live targets (`camera.setFov`,
  `renderer.samples/maxDepth`, `controls`, buffer size) — UI overrides budgets at runtime but does not
  own their defaults (conventions/camera do). **U3's adaptive toggle is coded to a PLAN-09 hook and
  persisted inert** until PLAN-09 lands. Execution order U1 → U2 → U3; U1 ready now. Marked PLAN-07
  complete + added the PLAN-08 table in `tasks/README.md`; refreshed `roads/README.md`. Flagged the
  U3↔PLAN-09 ordering + boot ownership in Open questions.
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
- **No queued Worker work.** All 10 plans (PLAN-01 … PLAN-10) are complete; `node tests/run.js` is
  green (72/72) and gates math/geometry/materials, renderer pixel-hash + BVH/early-term/scale
  regression, engine/save smoke, and the import-direction architecture lint. Remaining items are the
  non-blocking Open questions below (mostly numeric-default confirmations) — a Leader call, not a
  Worker task, unless the user opens new scope.
- Harness question is **Decided** (zero-dep runner). The formal regression suite (BVH-vs-linear
  equality, early-term epsilon, scale math, save round-trip) that was only scratch-asserted + one
  manual Playwright pass is now automated in `tests/perf.test.js`/`tests/gameplay.test.js` (Q2).
- **Investigate the reference level's blown-out initial view** (surfaced during U3's live-verify pass,
  not fixed): the camera starts near a `intensity: 18` point light with `scene.ambient` unset (0
  fallback) — worth confirming whether this is the intended look or a level-tuning gap. Not blocking;
  gameplay (switch → mirror → `LEVEL_WON`) was not re-verified visually in this pass, only settings/UI
  plumbing was.
- Still-open, non-blocking: player collision radius, level-JSON schema, ambient default (see below).

## Open questions
- **Coordinate convention** — assume right-handed, +Y up, camera looks −Z? (owner: `memory/conventions.md`; assumption, confirm)
- **World units** — assume meters? (assumption, confirm)
- **Unit-test framework** — RESOLVED (2026-07-02): **zero-dep Node/browser harness** (`node tests/run.js`,
  no deps/bundler), honoring the strict no-libraries rule. Recorded **Decided** in `memory/testing.md`.
- **Build tooling** — assume none (serve ES modules directly via a static dev server, no bundler)? (assumption, confirm)
- **Save storage** — assume browser `localStorage` with a versioned JSON schema? (owner: `memory/gameplay.md`; assumption, confirm)
- **Framework removal** — `02-Generation §7` says strip `docs/akrs/framework/` from a shipped project. Kept here intentionally (it is this repo's versioned source and your confirmed Source of Truth). Confirm keep vs. move-before-ship.
- **Ambient coefficient numeric default** — `materials.shade()` reads `scene.ambient`, falling
  back to 0 (neutral) when unset; no scene currently sets a non-zero default. (owner:
  `memory/conventions.md`; confirm the intended default before a reference scene ships.) **Likely
  related to a finding from live-verifying U3**: the PLAN-07 reference level's initial camera view
  renders very bright/blown-out (camera starts close to an `intensity: 18` point light, ambient=0) —
  first time this level was seen in an actual browser. May just need `scene.ambient` set, spawn moved
  further from the light, or the light's intensity tuned down; needs a look, not diagnosed further here.
- **Player collision proxy** — E4 shipped `Collision.resolve` with a **caller-supplied radius** (no
  engine default). Confirm the gameplay player radius (~0.3 m sphere) when P2 wires collision. (owner:
  `memory/gameplay.md`; assumption, confirm during P2)
- **Asset / level file format** — assume **JSON** level descriptors, with the schema owned by
  [[gameplay]] (PLAN-07)? `AssetManager` is format-agnostic (async cache); only the schema is
  deferred. (owner: `memory/engine.md` → [[gameplay]]; assumption, confirm)
- **BVH split strategy (F1)** — assume **median split** over `objectBounds()` (vs SAH)? Simpler, and
  output is identical either way — only build/traversal cost differs. (owner: `memory/performance.md`; assumption, confirm)
- **`EARLY_TERM_EPS` (F1)** — the reflection-weight cutoff for early termination. Assume a small value
  (e.g. ~1/255 in linear terms); output-identical within epsilon. Promote to a [[conventions]] budget
  if it needs one canonical owner. (owner: `memory/performance.md`; assumption, confirm)
- **Target frame budget (F3)** — assume **~33 ms (30 fps)** as the adaptive controller's `targetMs`
  default? User-tunable via U3's resolution/quality setting. (owner: `memory/performance.md`; assumption, confirm)
- **Reflective puzzle mechanic (P3)** — landed as assumed: a switch-toggled movable mirror routes a
  reflecting beam onto a receiver → `LEVEL_WON` (`src/game/beam.js` + `Puzzle.js`, reusing
  `scene.intersect` + `material.reflect` + `maxDepth`). Confirm the *numeric layout* of a real level
  (emitter/mirror/receiver placement) is still Unknown — only the mechanic is settled.
- **`interact` input edge** — landed: `InputManager.poll()` returns an additive `interact` field
  (`KeyE`, edge-detected, poll-and-clear); `Controls` + existing fields unchanged. Recorded in
  `memory/camera-input.md` + `memory/engine.md`.
- **PLAN-08 boot ownership** — RESOLVED: `index.html` + `src/main.js` are owned by **PLAN-08/U1** (boot
  assembles `Loop` + renderer + input + `src/game/`). Answers the earlier "which Plan owns the boot".
- **U3 ↔ PLAN-09 ordering** — RESOLVED: PLAN-09 (F1–F3) was built first, so U3 wired the adaptive
  toggle live from the start — no inert seam was ever shipped.
- **Debug/pause hotkeys** — `F3` toggles the debug overlay (confirmed live). Pause = pointer-lock-exit
  could not be exercised via a genuine lock in the Playwright/headless environment
  (`requestPointerLock()` throws there — a test-environment limitation, not a code issue); verified
  instead by dispatching a synthetic `pointerlockchange` event, since `App`'s pause logic only reads
  `document.pointerLockElement`. Still worth a real-browser (non-headless) click-through at some point
  to confirm actual pointer lock acquisition end-to-end. (owner: `memory/ui.md`.)
- **Mirror-orientation implementation** — `Puzzle` swaps the mirror's own geometry `normal` in place
  (not a `Node` rotation, since geometry `intersect()` ignores `Node` transforms). A Worker-level
  choice the Road left open; confirm it's the intended long-term approach before PLAN-09 (BVH) or any
  future Node-transform-aware intersection change lands, since that would change this contract.
