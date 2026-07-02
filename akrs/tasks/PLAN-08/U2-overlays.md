# TASK — overlays (FPS + debug)
Plan / Phase: PLAN-08 (UI Shell) / U2

## Objective
Live diagnostics over the running game in `src/ui/`: an **FPS counter** (reads the game-loop timing)
and a **toggleable debug overlay** (camera pose, scene/object counts, render stats), toggled by a hotkey.

## Constraints
- Vanilla JS ES modules + CSS in `src/ui/`; DOM overlay only. **Read-only** — overlays observe engine/
  render/game state, never mutate it.
- FPS counter reads the `Loop` **timing snapshot** `{ dt, elapsed, frame, fps }` ([[engine]]).
- Debug overlay reads: camera pose (position, yaw, pitch, fov), active-scene object count
  (`Scene.objectBounds().length` / renderables), and render config (resolution, `samples`, `maxDepth`,
  last frame ms). Toggled by a **UI hotkey** (e.g. `F3`) — a UI DOM listener, not gameplay input.
- Only visible while PLAYING; hidden in menus. No settings (U3).

## References (read, do not duplicate)
- `memory/ui.md` (FPS counter + debug overlay surfaces; hotkey toggle)
- `memory/engine.md` (`Loop` timing snapshot; UI chrome hotkeys vs engine input)
- `memory/rendering.md` (renderer params: resolution, `samples`, `maxDepth`)
- `plans/PLAN-08-ui-shell.md` → U2

## Expected output
- `src/ui/FpsCounter.js`, `src/ui/DebugOverlay.js`; edit `src/ui/App.js`, `src/ui/index.js`, `src/ui/ui.css` (+ `index.html` overlay container if needed).
- Road: `roads/PLAN-08/U2-overlays.md`.
