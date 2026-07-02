# Memory — UI Shell
Owns: the UI surfaces, the app **state machine**, and the browser **boot** assembly. Truth lives in
`src/ui/` (+ root `index.html`, `src/main.js`). HTML/CSS overlays on top of the canvas; consumes
[[engine]] (loop/state/timing), [[gameplay]] (save/restart), [[rendering]] (blit + budgets),
[[camera-input]] (FOV/sensitivity settings).

## Surfaces (from data.md)
- **Main menu** — new game / continue (if save exists) / settings.
- **Pause menu** — resume / restart / settings / quit to menu; releases pointer lock.
- **FPS counter** — reads frame timing from the game loop ([[engine]]) / renderer ([[performance]]).
- **Debug overlay** — ray stats, camera pose, scene/object counts; toggled by a hotkey.
- **Settings** — resolution / adaptive-resolution toggle, FOV, AA & reflection-depth quality, mouse sensitivity. Writes through to [[conventions]] budgets at runtime + persists via [[gameplay]] save.

## Contracts / decisions (PLAN-08 Phase H)
- **Boot ownership (U1)** — `index.html` (canvas + overlay root + module entry) + `src/main.js`
  assemble Camera + `Controls` + `InputManager(canvas)` + `Renderer` + `src/game/` into the engine
  `Loop`: `update(dt)` = `poll()` → `Controls.update` → `Collision.resolve(…, worldColliders)` →
  `RoomManager.update` + interactables + `Puzzle`; `render()` = `Renderer.render(camera, activeScene)`
  → `ctx.putImageData` (the renderer stays DOM-free, [[rendering]]). — **Decided (PLAN-08/U1)**.
- **App state machine (U1)** — `src/ui/App.js` owns MENU ↔ PLAYING ↔ PAUSED; starts/stops `Loop`,
  requests pointer lock on play. **Pause = pointer-lock exit while PLAYING** (`pointerlockchange`);
  pausing releases pointer lock. Continue = `save.load()`; Restart = game `restart()` ([[gameplay]]). — **Decided (PLAN-08/U1)**.
- **Input ownership split** — the engine `InputManager` owns **gameplay** input (WASD/mouse/interact,
  polled). **UI owns its own chrome DOM listeners** — menu clicks, `pointerlockchange` (pause), and the
  debug hotkey (`F3`) — event-driven, never polled by the engine. — **Decided (PLAN-08/U1–U2)**.
- **Overlays are read-only (U2)** — FPS counter reads the `Loop` timing snapshot `{ dt, elapsed, frame,
  fps }`; the debug overlay reads camera pose + active-scene object count + renderer config
  (resolution/`samples`/`maxDepth`). They observe, never mutate. PLAYING only. — **Decided (PLAN-08/U2)**.
- **Settings blob (U3)** — UI **owns the shape** `{ resolutionScale, adaptive, fov, samples, maxDepth,
  mouseSensitivity, invertY }`, persisted **opaquely** in the [[gameplay]] save `settings` field. Applied
  to live targets: `camera.setFov`, `renderer.samples`, `renderer.maxDepth`, `controls`
  (sensitivity/invert-Y), renderer buffer size. UI reads/writes budgets at runtime but does **not** own
  their defaults ([[conventions]] / [[camera-input]] do). — **Decided (PLAN-08/U3)**.

## Decisions / open
- UI is DOM/CSS overlay, not drawn into the ray-traced framebuffer (keeps the tracer pure). — **Assumption (High)**.
- **Adaptive-resolution is now live (U3, landed)** — see Landed below. No longer inert.

## Landed (PLAN-08, U1–U2)
- **U1 — boot + menus.** `index.html` (canvas `#view` 480x270 + overlay roots `#ui`/`#hud` + module
  entry) and `src/main.js`: builds one concrete level (a single room — floor/walls/ceiling `Box`
  colliders, a point light, a `Switch`-linked movable `Mirror` `Plane` with two normals — one
  parallel to the emitter beam ("off", never hit) and one that reflects it 90° onto a receiver
  `Box` ("on") — per the mechanic fixed in [[gameplay]]/PLAN-07/P3, numeric layout decided here);
  assembles `Camera` + `Controls` + `InputManager(canvas)` + `Renderer` + `RoomManager`/`Switch`/
  `Puzzle` into one `Loop`: `update(dt)` = `poll()` → `Controls.update` → `Collision.resolve` (player
  radius **0.4 m** — Assumption, answers the open question) using `worldColliders(activeScene, doors)`
  → `RoomManager.update` + switch proximity; `render()` = `Renderer.render(camera, activeScene)` →
  `ctx.putImageData`. `src/ui/App.js` owns the MENU/PLAYING/PAUSED state machine exactly as decided
  (pointer-lock exit while PLAYING → PAUSED + releases the lock; New Game/Continue/Restart call
  boot-supplied hooks — `restart()`/`load()` — then start the loop + request pointer lock; Quit stops
  the loop, releases the lock, and **saves a snapshot** so Continue has something to resume — the one
  addition beyond the Road's literal ask, needed to make "Continue enabled iff a save exists"
  observable at all). `src/ui/MainMenu.js` / `PauseMenu.js` are plain DOM components (`mount`/`unmount`
  into `#ui`); Continue is disabled via `hasSave()` re-checked on every mount.
- **U2 — overlays.** `src/ui/FpsCounter.js` (reads `loop.timing.fps`, DOM text throttled to 4/s) and
  `src/ui/DebugOverlay.js` (camera pose, `scene.renderables.length`, renderer `width/height/samples/
  maxDepth`, last-frame ms — read-only, mounted into `#hud`, `<pre>` toggled by `.hidden`). `App`
  mounts/unmounts both alongside PLAYING (never in menus), calls `onFrame(dt)` — invoked from
  `main.js`'s `update(dt)`, since `App` itself sits outside the `Loop`'s update/render pair — and
  toggles the debug overlay on a document-level `F3` keydown, gated to `state === 'PLAYING'`.
- U1/U2 were originally verified by static syntax check only; **live browser verification landed
  together with U3's pass** (below) — both are now confirmed working in an actual browser.

## Landed (PLAN-08, U3)
- **U3 — settings.** `src/ui/Settings.js`: a DOM panel reading its **initial** values straight off the
  live `camera`/`renderer`/`controls`/`adaptiveController` refs it's constructed with (UI does not own
  the defaults — [[conventions]]/[[camera-input]] do). Every control applies to its live target
  immediately on change (FOV → `camera.setFov`, AA → `renderer.samples`, depth → `renderer.maxDepth`,
  sensitivity/invert-Y → `controls`, resolution → `renderer.setScale` when adaptive is off) and then
  calls `onPersist(blob)`. `resolutionScale` is tracked in the panel itself (not derived from
  `renderer.width/baseWidth`, since that ratio is live-driven by the controller while adaptive is on).
  **Worker-level decision (Road left it open):** the manual resolution slider and
  `AdaptiveController`'s `[minScale, maxScale]` band are kept **independent** — an earlier attempt to
  map the slider onto `adaptiveController.maxScale` was caught live in Playwright: when the slider
  equaled the controller's default `minScale` (0.5), the band collapsed to a single point and adaptive
  silently stopped adapting. The slider now only calls `renderer.setScale()` directly while adaptive is
  off (and is disabled in the DOM while adaptive is on); `AdaptiveController` always scales within its
  own default `[0.5, 1]` band. `src/ui/App.js` gained `settings` (optional constructor param) +
  `_openSettings(returnMenu)`/`closeSettings()` — Settings is reachable from both Main and Pause menus,
  returning to whichever one opened it. `src/main.js`: holds all the live refs; `persistSettings(blob)`
  saves the full save envelope with the settings blob attached (replacing the old `settings: null` on
  Quit); `applySettings(blob)` applies a persisted blob to every live target + re-syncs the panel,
  called on boot (before the first frame) and again on Continue; a new `blit(frame)` draws the
  (possibly sub-canvas-size) render buffer onto an offscreen canvas and `drawImage`-upscales it to fill
  the visible canvas with `imageSmoothingEnabled = false` (needed once adaptive can actually shrink the
  buffer — F2/F3 built the pieces but never called `renderer.setScale` with a live value; U3 is the
  first to do so). `render()` now always calls `adaptiveController.update(smoothedMs)` and additionally
  calls `renderer.setScale(adaptiveController.currentScale)` whenever `enabled`.
  **Live-verified with Playwright** (`/run`-equivalent, served over a local static HTTP server since
  ES modules need one — no bundler, per [[conventions]]): main menu → Settings (reads live defaults:
  FOV 60°, samples 4, maxDepth 4, sensitivity 0.0022, resolution 1.00, adaptive off) → changed AA
  samples/invert-Y/resolution, each confirmed applied (localStorage save inspected directly) and
  visible in the `F3` debug overlay's `resolution: WxH` readout; New Game → PLAYING renders correctly
  (canvas pixel sample confirmed non-background coverage matching the internal-buffer-to-canvas
  upscale, no blit gaps); Settings reachable from the Pause menu too, returning to Pause on close;
  enabling adaptive disabled the manual slider and let the controller drive `resolution:` down to its
  own floor under a sustained over-budget synthetic render load; disabling adaptive instantly restored
  the manual resolution; Quit → simulated relaunch (full page reload) → Continue restored and reapplied
  every setting (confirmed via the debug overlay). **One test-environment-only issue observed and not
  a regression:** `input.requestPointerLock()` throws in this headless/automated context ("root
  document ... not valid for pointer lock"); pause/resume flows were exercised by dispatching a
  synthetic `pointerlockchange` event instead, since `App`'s pause logic only reads
  `document.pointerLockElement`, not the lock call's success. **Also observed, out of U3's scope:** the
  PLAN-07 reference level's initial camera view is very bright (near the ceiling light) — pre-existing
  level content never live-verified before this pass; flagged in STATE.md, not fixed here.

Related: [[engine]] · [[gameplay]] · [[rendering]] · [[performance]] · [[camera-input]] · [[conventions]] · [[architecture]]
