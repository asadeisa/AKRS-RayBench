# ROAD — settings
Status: DONE + superseded by memory/ui.md
Task: settings panel (FOV, AA, depth, sensitivity, resolution, adaptive) applied live + persisted via save.
Plan / Phase: PLAN-08 / U3   (needs U1; adaptive hook needs PLAN-09)

## Context to load (read order)
1. `../../memory/ui.md` (settings surface; UI owns the settings blob, not the budget defaults)
2. `../../memory/conventions.md` (render budgets `samples`/`maxDepth`/gamma — the defaults UI exposes)
3. `../../memory/camera-input.md` (`camera.setFov`; `Controls` mouse sensitivity / invert-Y)
4. `../../memory/gameplay.md` (save `settings` blob is opaque + UI-owned) · `../../memory/rendering.md` (renderer params)
5. `../../plans/PLAN-08-ui-shell.md` → U3
6. `src/ui/index.js`, `src/ui/App.js` (U1), `src/game/index.js` (`save`)

## Expected files (change scope)
- `src/ui/Settings.js`  — create (panel; read initial values from conventions/live objects; on change,
  apply to the live target and persist; expose the UI-owned `settings` blob `{ resolutionScale, adaptive,
  fov, samples, maxDepth, mouseSensitivity, invertY }`)
- `src/ui/App.js` / `src/main.js` — edit (hold refs to `renderer`/`camera`/`controls`; apply settings on
  change; load + apply persisted settings on boot / continue)
- `src/ui/index.js`     — edit (export `Settings`) · `src/ui/ui.css` — edit (panel styles)
- (nothing outside `src/ui/`; persist only through `save`'s opaque `settings` field)

## Boundaries
- Do: apply the settings with **existing** live targets — FOV → `camera.setFov`, AA → `renderer.samples`,
  depth → `renderer.maxDepth`, sensitivity/invert-Y → `controls`, resolution → renderer buffer size.
- Do: persist the `settings` blob via `save` (opaque) and re-apply it on boot/continue.
- Do NOT: redefine budget **defaults** (conventions/camera own them — UI only overrides at runtime);
  implement adaptive-resolution / early-termination here (that is PLAN-09). Code the **adaptive** toggle
  to the PLAN-09 hook and **persist it inert** until PLAN-09 lands — leave a clear seam, surface it in STATE.

## Acceptance
- Changing FOV / `samples` / `maxDepth` / sensitivity updates the live render/controls immediately and
  visibly; a resolution change resizes the render buffer.
- Settings persist across reload: relaunch → Continue → the saved settings are restored and applied.
- The adaptive toggle persists but is inert (no-op) with a clear TODO/seam for PLAN-09.
- Verify live in a browser; formal automated tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md` — record which settings are live vs. the adaptive-toggle seam awaiting PLAN-09;
set this Road `DONE + superseded by memory/ui.md` (or `DONE (partial) — adaptive pending PLAN-09`) or
refresh Expected files; keep `../../memory/ui.md` in agreement. **U3 (mostly) completes PLAN-08.**
