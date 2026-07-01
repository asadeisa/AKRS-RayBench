# ROAD — managers (scene / input / asset)
Status: DONE + superseded by memory/engine.md
Task: SceneManager (active room), InputManager (normalized polled input), AssetManager (data cache).
Plan / Phase: PLAN-06 / E3   (needs E2)

## Context to load (read order)
1. `../../memory/engine.md` (three manager contracts; engine owns raw events; opaque scene refs)
2. `../../memory/camera-input.md` (**the input snapshot `Controls` consumes — match field-for-field**)
3. `../../memory/architecture.md` (engine imports only math; DOM globals allowed in InputManager only)
4. `../../plans/PLAN-06-engine-runtime.md` → E3
5. `src/camera/Controls.js` (the consumer of `InputManager.poll()` — read to confirm the shape)
6. `src/engine/index.js` (barrel from E1 / E2)

## Expected files (change scope)
- `src/engine/SceneManager.js`  — create (`register(key, scene)`, `setActive(key)`, `getActive()`; opaque handles)
- `src/engine/InputManager.js`  — create (raw DOM listeners + Pointer Lock; `poll()` → the pinned snapshot; poll-and-clear deltas)
- `src/engine/AssetManager.js`  — create (`load(key, url)` async + cache, `get(key)`; JSON)
- `src/engine/index.js`         — edit (export the three managers)
- (nothing outside `src/engine/`; do not import geometry; do not resolve collision — E4)

## Boundaries
- Do: normalize keyboard / mouse / pointer-lock into `{ forward, backward, left, right, mouseDeltaX,
  mouseDeltaY, pointerLocked, fovDelta }`; accumulate deltas and reset them each `poll()`.
- Do: hold the active scene as an **opaque reference** set by key; keep AssetManager a thin async cache.
- Do NOT: bake key-bindings / sensitivity that belong to settings ([[ui]]) — read defaults, surface Unknowns in STATE.
- Do NOT: import geometry, mutate the camera (Controls does that), or resolve collision (E4).

## Acceptance
- `InputManager.poll()` returns the exact field shape in `memory/camera-input.md`; feeding it to
  `Controls.update(camera, poll(), dt)` moves / looks the camera (closes the PLAN-05/C2 loop end-to-end).
- Held keys report `true`; released keys `false`; mouse / fov deltas accumulate between polls and are
  zero immediately after a `poll()`; `pointerLocked` tracks pointerlockchange.
- `SceneManager.setActive(key)` / `getActive()` swap and return the registered opaque scene.
- `AssetManager.load` caches so a second `get(key)` needs no refetch.
- Interim scratch-assert check with a stubbed event target (dispatch synthetic key / mouse events, assert poll snapshot + clear); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md` — note this **unblocks PLAN-05/C2 `Controls`** (real input wiring); set this Road
`DONE + superseded by memory/engine.md` or refresh Expected files; keep `../../memory/engine.md` and
`../../memory/camera-input.md` in agreement. **E3 unblocks E4 + PLAN-07 room swapping.**
