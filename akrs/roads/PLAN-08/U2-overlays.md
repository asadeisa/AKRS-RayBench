# ROAD — overlays (FPS + debug)
Status: DONE + superseded by memory/ui.md
Task: FPS counter (reads Loop timing) + toggleable debug overlay (camera/scene/render stats).
Plan / Phase: PLAN-08 / U2   (needs U1)

## Context to load (read order)
1. `../../memory/ui.md` (FPS counter + debug overlay surfaces; hotkey toggle)
2. `../../memory/engine.md` (`Loop` timing snapshot `{ dt, elapsed, frame, fps }`; UI hotkeys vs engine input)
3. `../../memory/rendering.md` (renderer params: resolution, `samples`, `maxDepth`)
4. `../../plans/PLAN-08-ui-shell.md` → U2
5. `src/ui/index.js`, `src/ui/App.js` (mount points from U1)

## Expected files (change scope)
- `src/ui/FpsCounter.js`  — create (reads `loop.timing` — `fps`/`dt` — into a DOM element; throttled update)
- `src/ui/DebugOverlay.js`— create (toggled panel: camera position/yaw/pitch/fov, active-scene object
  count, render resolution/`samples`/`maxDepth`, last frame ms; reads live, mutates nothing)
- `src/ui/App.js`         — edit (mount overlays; per-frame update hook; `F3` hotkey toggles debug)
- `src/ui/index.js`       — edit (export overlays)
- `src/ui/ui.css`         — edit (overlay styles) · `index.html` — edit only if a container is needed
- (nothing outside `src/ui/`; do not modify engine/render/game)

## Boundaries
- Do: read the loop timing + camera + active scene + renderer config each frame (or throttled) and
  display them; toggle the debug overlay with a UI DOM hotkey.
- Do NOT: mutate any engine/render/game state (overlays are read-only); add gameplay input; show
  overlays in menus (PLAYING only).

## Acceptance
- FPS counter shows a live, updating value while PLAYING and reflects load (drops if the frame slows).
- The `F3` hotkey shows/hides the debug overlay with current camera pose, scene object count, and render
  resolution/`samples`/`maxDepth`.
- Verify live in a browser; formal automated tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/ui.md` or refresh Expected files;
keep `../../memory/ui.md` in agreement. **U2 done; U3 (settings) is next.**
