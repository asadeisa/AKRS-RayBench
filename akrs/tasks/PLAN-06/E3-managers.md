# TASK — managers (scene / input / asset)
Plan / Phase: PLAN-06 (Engine Runtime) / E3

## Objective
Three managers in `src/engine/`: **SceneManager** (active room by key), **InputManager** (normalized,
polled input state), **AssetManager** (level / scene data cache). **InputManager unblocks the
already-built `Controls` (PLAN-05/C2) and real camera controls.**

## Constraints
- Vanilla JS ES modules in `src/engine/`; **import only `src/math/`**. Scenes / assets are **opaque
  references** handed in — no geometry import. DOM globals allowed **only** in InputManager.
- **SceneManager:** registry of opaque scene handles by key — `register(key, scene)`, `setActive(key)`,
  `getActive()`. Holds the active scene by reference; room-swap **driven by gameplay** (PLAN-07).
- **InputManager:** owns the raw DOM listeners (keydown / keyup, mousemove, wheel, pointerlockchange)
  and the Pointer Lock request; `poll()` returns the **exact snapshot** `Controls` consumes —
  `{ forward, backward, left, right, mouseDeltaX, mouseDeltaY, pointerLocked, fovDelta }`
  (`memory/camera-input.md`). Mouse deltas + fovDelta **accumulate and reset on read** (poll-and-clear).
  This is the **only** place raw input events live (engine owns them).
- **AssetManager:** thin async cache — `load(key, url) → Promise`, `get(key)`; JSON payloads. Level
  **schema** is owned by gameplay (PLAN-07), not here.

## References (read, do not duplicate)
- `memory/engine.md` (manager contracts; engine owns raw events; opaque scene refs)
- `memory/camera-input.md` (the normalized input snapshot `Controls` already consumes — conform exactly)
- `memory/architecture.md` (engine imports only math; DOM allowed in InputManager)
- `plans/PLAN-06-engine-runtime.md` → E3

## Expected output
- `src/engine/SceneManager.js`, `src/engine/InputManager.js`, `src/engine/AssetManager.js`; edit `src/engine/index.js`.
- Road: `roads/PLAN-06/E3-managers.md`.
