# ROAD — controls (WASD + mouse look)
Status: DONE + superseded by memory/camera-input.md
Note: coded to the PLAN-06/E3 input-manager interface (not yet built) — real DOM/engine wiring
lands with E3; verified here with a synthetic input state per this Road's own acceptance criteria.
Task: drive the Camera from polled input — WASD (yaw-relative, XZ) + mouse look (pitch clamp) + FOV adjust.
Plan / Phase: PLAN-05 / C2   (needs C1 + PLAN-06/E3)

## Context to load (read order)
1. `../../memory/camera-input.md` (controls contract; collision deferred to engine)
2. `../../memory/engine.md` (input manager = normalized state polled by camera; engine owns raw events)
3. `../../memory/conventions.md` (axes, radians)
4. `../../plans/PLAN-05-camera-input.md` → C2
5. `src/camera/Camera.js` (the API you mutate)

## Expected files (change scope)
- `src/camera/Controls.js` — create (`update(camera, input, dt)`: WASD → yaw-relative XZ move;
  mouse delta → yaw/pitch with pitch clamp; FOV adjust key/scroll → `camera` FOV setter)
- `src/camera/index.js`    — edit (export Controls)
- (nothing outside `src/camera/`; do not add DOM listeners — that is the engine input manager)

## Boundaries
- Do: read a **normalized input state** (keys down, mouse delta, pointer-lock active) polled from the
  engine input manager; move on the **XZ plane** relative to yaw; clamp pitch to ±~89°.
- Do: apply mouse sensitivity + invert-Y from settings (defaults TBD — surface in STATE if Unknown).
- Do NOT: attach `keydown`/`mousemove`/pointer-lock listeners (engine owns them).
- Do NOT: resolve movement collision (engine owns it) or touch the renderer.

## Acceptance
- Given a fake input state: pressing W moves the camera along its yaw-forward on XZ (Y unchanged);
  a mouse delta yaws/pitches the camera; pitch saturates at the ±~89° clamp; FOV input changes FOV.
- Interim scratch-assert check with a synthetic input state (no DOM); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/camera-input.md` or refresh
Expected files. **PLAN-05 complete when C1–C2 land** (C2 also needs PLAN-06/E3).
