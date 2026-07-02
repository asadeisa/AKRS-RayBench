# ROAD — menus & boot (the "it runs" milestone)
Status: DONE + superseded by memory/ui.md
Task: boot the game in a browser (index.html + main.js) + main/pause menus + MENU↔PLAYING↔PAUSED.
Plan / Phase: PLAN-08 / U1   (deps PLAN-06/E1, PLAN-07/P4 — both landed)

## Context to load (read order)
1. `../../memory/ui.md` (surfaces; DOM/CSS overlay; state transitions; pointer-lock release on pause)
2. `../../memory/engine.md` (`Loop({ update, render })` + timing; `InputManager(target)` + pointer lock)
3. `../../memory/rendering.md` (`Renderer.render(camera, scene) → { width, height, data }` — boot blits it)
4. `../../memory/gameplay.md` (RoomManager/Puzzle/interactables + `worldColliders`; `save.load()` = continue; `restart()`)
5. `../../memory/architecture.md` (`index.html` + `src/main.js` = boot; `src/ui/` = PLAN-08)
6. `../../plans/PLAN-08-ui-shell.md` → U1
7. `src/engine/index.js`, `src/camera/index.js`, `src/render/index.js`, `src/game/index.js` (the APIs you assemble)

## Expected files (change scope)
- `index.html`          — create (canvas `#view` + an overlay root `#ui` + `<script type="module" src="src/main.js">`)
- `src/main.js`         — create (**boot**: build Camera, `Controls`, `InputManager(canvas)`, `Renderer`,
  the game (RoomManager + interactables + Puzzle); assemble `Loop`: `update(dt)` = `poll()` → `Controls.update`
  → `Collision.resolve(oldPos, move, radius, worldColliders(active, doors))` → `RoomManager.update` +
  interactables + `Puzzle`; `render()` = `Renderer.render(camera, activeScene)` → `ctx.putImageData`;
  instantiate `App` and show the main menu)
- `src/ui/App.js`       — create (state machine MENU/PLAYING/PAUSED; `Loop.start()/stop()`; request pointer
  lock on play; on `pointerlockchange` exit while PLAYING → PAUSED; new/continue/restart/quit actions)
- `src/ui/MainMenu.js` — create (New Game / Continue [enabled iff `save.load()` returns a save] / Settings)
- `src/ui/PauseMenu.js`— create (Resume / Restart / Settings / Quit to menu)
- `src/ui/ui.css`      — create (overlay layout/styling)
- `src/ui/index.js`    — create (barrel)
- (do not modify engine/render/game/camera internals — assemble their public APIs only)

## Boundaries
- Do: DOM/CSS overlays over the canvas; blit the DOM-free renderer buffer with `putImageData`; drive
  `Loop.start/stop` from the state machine; release pointer lock on pause; wire Continue → `save.load()`,
  Restart → `restart()`.
- Do NOT: draw UI into the ray-traced framebuffer; add gameplay input here (engine `InputManager` owns
  it — UI only listens for its own chrome: menu clicks + `pointerlockchange`); build FPS/debug (U2) or
  the settings panel (U3 — the Settings button may route to a placeholder).

## Acceptance
- Loading `index.html` shows the main menu. **New Game** boots into PLAYING: the loop runs, the canvas
  shows a ray-traced frame, pointer is locked, WASD + mouse look move the camera, walls stop the player.
- Esc (pointer-lock exit) → PAUSED with the pause menu + pointer lock released; **Resume** → PLAYING;
  **Restart** resets the level; **Quit** → main menu with the loop stopped; **Continue** is enabled only
  when a save exists and resumes it.
- **First DOM phase — verify live in a browser** (load the page; menu → play → pause → resume → quit);
  formal automated tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md` — note the game now **boots and runs in a browser**; set this Road `DONE +
superseded by memory/ui.md` or refresh Expected files; keep `../../memory/ui.md` in agreement. **U1 unblocks U2 + U3.**
