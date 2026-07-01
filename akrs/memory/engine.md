# Memory — Engine Runtime
Owns: entity system, managers, game loop, event system, collision. Truth lives in `src/engine/`.
Consumes [[math]] **only** (per [[architecture]] — no static import of geometry / camera / render);
consumed by [[gameplay]], [[camera-input]], [[ui]].

## Architecture constraint (record)
- `src/engine/` imports **only** `src/math/`. Scenes, colliders, and assets arrive as **injected /
  duck-typed references** from the boot / gameplay layer — never a static `geometry` / `camera` /
  `render` import (that would violate the [[architecture]] dependency arrows). DOM globals
  (`window` / `document` / canvas) are allowed in the **input manager only**.

## Contracts (from data.md; shapes decided PLAN-06 Phase F)
- **Game loop** — `src/engine/Loop.js`. `requestAnimationFrame`-driven; `new Loop({ update, render })`,
  `start()` / `stop()`; each frame calls `update(dt)` then `render()`. Exposes a per-frame **timing**
  snapshot `{ dt, elapsed, frame, fps }` for [[performance]] + FPS counter ([[ui]]). Variable dt,
  **clamped** to a max (spiral-of-death guard). — **Decided (PLAN-06/E1)**; dt-clamp value = Assumption (Med).
- **Entity system** — `src/engine/Entity.js` + `World.js`. **Lightweight** entity + component bag
  (Map by name), not full ECS. `Entity`: `id`, `add / get / has / remove(name, data)`. `World`:
  `create()`, `remove(id)`, `each(name, fn)` / `query(name)`. Systems = plain functions iterating
  `World`. Components hold data + **opaque refs** (e.g. a renderable / light handle), never geometry
  imports. — **Decided (PLAN-06/E2)** (lightweight over full ECS = Assumption (Med)).
- **Scene manager** — `src/engine/SceneManager.js`. Registry of **opaque** scene handles by key —
  `register(key, scene)`, `setActive(key)`, `getActive()`. Holds the active [[geometry]] scene by
  reference; room **swapping** driven by [[gameplay]]. No geometry import.
- **Input manager** — `src/engine/InputManager.js`. **Owns the raw DOM listeners** (keydown / keyup,
  mousemove, wheel, pointerlockchange) on a target / canvas; requests Pointer Lock. Polled each frame:
  `poll() → { forward, backward, left, right, mouseDeltaX, mouseDeltaY, pointerLocked, fovDelta }` —
  the **exact snapshot** `Controls.update(camera, input, dt)` already consumes ([[camera-input]]).
  Mouse deltas + fovDelta accumulate between polls and **reset on read** (poll-and-clear). This is the
  contract pinned in [[camera-input]]; E3 conforms to it. — **Decided (PLAN-06/E3)**.
- **Asset manager** — `src/engine/AssetManager.js`. Thin async cache: `load(key, url) → Promise`,
  `get(key)`, cache Map. Level / scene payload = **JSON descriptors**; the level **schema** is owned by
  [[gameplay]] (PLAN-07), not here. — **Assumption (Low)**.
- **Event system** — `src/engine/EventBus.js`. Synchronous pub/sub: `on(type, fn)`, `off(type, fn)`,
  `emit(type, payload)`. Decoupled gameplay signals (switch toggled, door opened, level won); the bus
  is generic — gameplay owns the event names. — **Decided (PLAN-06/E4)**.
- **Collision detection** — `src/engine/Collision.js`. Player-vs-world for movement, **reusing [[math]]
  bounds** (`AABB` / `BoundingSphere`), no external physics. Player proxy = **sphere** (radius); world =
  a list of `AABB` **colliders** fed in by boot / gameplay from `Scene.objectBounds()` ([[geometry]],
  already built). `resolve(position, desiredMove, radius, colliders) → newPosition`; resolution =
  **slide** along surfaces (remove the into-surface component). — **Decided (PLAN-06/E4)**;
  sphere-vs-AABB + slide = Assumption (Med).

## Decisions / open
- Determinism: variable dt with clamp (not fixed-step). — **Assumption (Med)**; revisit if physics jitter appears.
- Input snapshot gets an **additive `interact` edge** (poll-and-clear) in PLAN-07/P2 for gameplay
  interactables — `poll()` grows by one field; existing fields + `Controls` unaffected. — **Decided
  (PLAN-07/P2), landed**: `KeyE`, edge-detected via `!e.repeat` in `InputManager._onKeyDown`.
- Player collision proxy = sphere vs world AABBs, slide resolution. — **Assumption (Med)**, confirm (STATE).
- Asset / level file format = JSON descriptor; schema owned by [[gameplay]]. — **Assumption (Low)**, confirm (STATE).

## Landed (PLAN-06, E1–E4 — all Roads DONE)
- `src/engine/Loop.js` — `Loop({ update, render })`; `start()`/`stop()`; rAF tick computes dt from
  `performance.now()` timestamps, **clamped to 0.1s max** (spiral-of-death guard), calls
  `update(dt)` then `render()`, then refreshes the `timing` getter `{ dt, elapsed, frame, fps }`.
- `src/engine/Entity.js` + `World.js` — lightweight entity (`id` + component `Map`,
  `add/get/has/remove`) and `World` (`create()/remove(id)/query(name)/each(name, fn)`), per the
  lightweight-over-ECS decision above.
- `src/engine/SceneManager.js` — opaque scene registry by key (`register/setActive/getActive`).
- `src/engine/InputManager.js` — owns raw DOM listeners (keydown/keyup, mousemove, wheel,
  pointerlockchange, click-to-lock) on an injected `target` (boot passes the canvas); `poll()`
  returns the exact `{ forward, backward, left, right, mouseDeltaX, mouseDeltaY, pointerLocked,
  fovDelta }` snapshot pinned in [[camera-input]], poll-and-clear on mouse/fov deltas. Verified
  end-to-end: `InputManager.poll()` fed directly into `Controls.update(camera, input, dt)` moves
  the camera — **closes the PLAN-05/C2 loop**, no more synthetic input needed.
- `src/engine/AssetManager.js` — thin async cache: `load(key, url)` fetches+caches JSON, `get(key)`
  reads the cache; second `load()` for the same key does not refetch.
- `src/engine/EventBus.js` — synchronous `on/off/emit`, multiple handlers per type, unknown-type
  emit is a no-op.
- `src/engine/Collision.js` — exports `resolve(position, desiredMove, radius, colliders) →
  newPosition`. Algorithm: attempt the full `desiredMove`, then for each `AABB` collider compute
  the closest point on the box to the attempted position; if the sphere penetrates (closest-point
  distance < radius), push the position out along the contact normal by the penetration depth only
  (a center-inside-box fallback picks the axis of least penetration). This single positional-
  correction pass **stops head-on motion exactly at the surface** and **preserves tangential
  motion untouched** (slide) without a separate move-projection step, since the correction only
  ever adds a component along the contact normal.
- `src/engine/index.js` barrel exports all of the above (`Loop`, `Entity`, `World`, `SceneManager`,
  `InputManager`, `AssetManager`, `EventBus`, `resolve`).
- **PLAN-06 (Engine Runtime) is now complete.** All four Roads (E1–E4) verified via scratch-assert
  (stubbed rAF/DOM/fetch, hand-computed collision geometry); no test framework wired yet (PLAN-10).

Related: [[gameplay]] · [[camera-input]] · [[ui]] · [[performance]] · [[math]] · [[architecture]] · [[geometry]]
