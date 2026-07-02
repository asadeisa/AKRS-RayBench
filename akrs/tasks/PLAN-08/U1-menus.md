# TASK — menus & boot (the "it runs" milestone)
Plan / Phase: PLAN-08 (UI Shell) / U1

## Objective
Make Mirror Forge **actually run in a browser** and put menus around it. Create the entry
(`index.html`) + **boot assembly** (`src/main.js`) that wires camera + controls + input + renderer +
`src/game/` into the engine `Loop` and blits frames to the canvas; add a DOM/CSS **main menu**
(new / continue / settings) + **pause menu** (resume / restart / settings / quit to menu); and an app
**state machine** MENU ↔ PLAYING ↔ PAUSED that starts/stops the loop and requests/releases pointer lock.

## Constraints
- Vanilla JS ES modules + HTML/CSS in `src/ui/` (+ root `index.html`, `src/main.js`). UI is a **DOM/CSS
  overlay on top of the canvas** — never drawn into the ray-traced framebuffer (`memory/ui.md`).
- Boot wires existing public APIs only (no edits to engine/render/game/camera internals): `Loop({ update,
  render })` ([[engine]]), `Renderer.render(camera, scene) → { width, height, data }` blitted via
  `putImageData` ([[rendering]]), `InputManager(canvas)` + `poll()`, `Controls.update`, `Collision.resolve`
  + `worldColliders`, `RoomManager`, `Puzzle`, `save.load/restart` ([[gameplay]]).
- **Pause** = pointer-lock exit while PLAYING (`pointerlockchange`); pause **releases** pointer lock.
  UI owns its own chrome DOM listeners (menu buttons, pointerlockchange) — distinct from the engine
  input manager (gameplay input). **Continue** = `save.load()`; **Restart** = game `restart()` (PLAN-07).
- No FPS/debug overlay (U2), no settings panel (U3 — a Settings button that routes is enough).

## References (read, do not duplicate)
- `memory/ui.md` (surfaces; DOM overlay; state machine)
- `memory/engine.md` (`Loop({update,render})` + timing; `InputManager(target)`/pointer lock)
- `memory/rendering.md` (`Renderer.render(camera, scene) → { width, height, data }` — boot blits it)
- `memory/gameplay.md` (RoomManager/Puzzle/interactables; `save.load()` = continue; `restart()`)
- `memory/architecture.md` (`index.html` + `src/main.js` = boot; `src/ui/` = PLAN-08)
- `plans/PLAN-08-ui-shell.md` → U1

## Expected output
- `index.html`, `src/main.js`, `src/ui/App.js`, `src/ui/MainMenu.js`, `src/ui/PauseMenu.js`,
  `src/ui/ui.css`, `src/ui/index.js`.
- Road: `roads/PLAN-08/U1-menus.md`.
