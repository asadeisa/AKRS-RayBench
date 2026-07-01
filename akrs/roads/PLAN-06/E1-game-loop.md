# ROAD — game loop & timing
Status: DONE + superseded by memory/engine.md
Task: rAF loop separating update(dt) from render(); expose a per-frame timing snapshot.
Plan / Phase: PLAN-06 / E1   (deps: none — the engine heartbeat; math is landed)

## Context to load (read order)
1. `../../memory/engine.md` (game-loop contract; timing snapshot `{ dt, elapsed, frame, fps }`; dt-clamp)
2. `../../memory/architecture.md` (engine imports only `src/math/`)
3. `../../memory/conventions.md` (ES modules, naming)
4. `../../plans/PLAN-06-engine-runtime.md` → E1

## Expected files (change scope)
- `src/engine/Loop.js`   — create (`new Loop({ update, render })`, `start()` / `stop()`; rAF tick:
  dt (clamped) → `update(dt)` → `render()` → refresh timing; expose the timing snapshot via a getter)
- `src/engine/index.js`  — create (barrel, export `Loop`)
- (nothing outside `src/engine/`; do not import geometry / camera / render; no DOM writes)

## Boundaries
- Do: drive frames with `requestAnimationFrame`; measure dt from timestamps; **clamp** dt to a max;
  expose `{ dt, elapsed, frame, fps }` for [[ui]] / [[performance]] to read.
- Do NOT: render the FPS counter (UI owns display), attach input listeners (E3), import geometry.

## Acceptance
- `start()` invokes `update(dt)` then `render()` each frame with a positive, clamped dt; `stop()` halts.
- A stall (large gap between frames) yields a dt clamped to the max, not the raw gap.
- The timing snapshot exposes dt / elapsed / frame / fps and advances across frames.
- Interim scratch-assert check (drive the tick with a stubbed rAF / now; assert dt clamp + update→render order); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/engine.md` or refresh Expected files;
keep `../../memory/engine.md` in agreement. **E1 unblocks E2.**
