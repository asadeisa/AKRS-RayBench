# TASK — game loop & timing
Plan / Phase: PLAN-06 (Engine Runtime) / E1

## Objective
Build the frame heartbeat in `src/engine/`: a `requestAnimationFrame` loop that separates
`update(dt)` from `render()` and exposes a per-frame **timing** snapshot (`dt`, `elapsed`, `frame`,
`fps`) for the FPS counter ([[ui]]) and adaptive render ([[performance]]).

## Constraints
- Vanilla JS ES module in `src/engine/`; **import only `src/math/`** (`memory/architecture.md`) — no
  geometry / camera / render import.
- `new Loop({ update, render })`; `start()` / `stop()`. Per frame: compute dt, call `update(dt)` then
  `render()`, refresh timing.
- **Variable dt, clamped** to a max (spiral-of-death guard on tab-switch / stall).
- Timing exposed as a readable snapshot object; no DOM/canvas writes, no FPS *rendering* (that is [[ui]]).

## References (read, do not duplicate)
- `memory/engine.md` (game-loop contract, timing snapshot, dt-clamp decision)
- `memory/architecture.md` (engine imports only math)
- `memory/conventions.md` (ES modules, naming, code style)
- `plans/PLAN-06-engine-runtime.md` → E1

## Expected output
- `src/engine/Loop.js` (rAF loop + timing snapshot), `src/engine/index.js` (barrel — create).
- Road: `roads/PLAN-06/E1-game-loop.md`.
