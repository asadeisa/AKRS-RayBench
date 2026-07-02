# TASK — settings
Plan / Phase: PLAN-08 (UI Shell) / U3

## Objective
A settings panel in `src/ui/` — **FOV, AA samples, reflection depth, mouse sensitivity, resolution**
(+ an **adaptive-resolution** toggle) — that applies to the live runtime targets and **persists** via
the PLAN-07 save's opaque `settings` blob. Enables user control over the render budgets owned by
[[conventions]].

## Constraints
- Vanilla JS ES module + CSS in `src/ui/`; DOM overlay; reachable from both main and pause menus (U1).
- **UI reads/writes budgets at runtime but does not own their defaults** — initial values come from
  [[conventions]] (`samples`, `maxDepth`, gamma), [[camera-input]] (fov, sensitivity). Apply targets
  that **exist today**: FOV → `camera.setFov`; AA → `renderer.samples`; depth → `renderer.maxDepth`;
  sensitivity/invert-Y → `controls`; resolution → renderer buffer size.
- **Persist** through `save`'s **opaque `settings` field** only ([[gameplay]] owns the save envelope;
  UI owns the `settings` shape). Load persisted settings on boot / continue and apply them.
- **Adaptive-resolution / early-termination** depend on **PLAN-09** (not built): code the toggle to the
  PLAN-09 budget hook and **persist it, but leave it inert** until PLAN-09 lands — do NOT implement the
  perf algorithm here. (This is why U3 is partially blocked on PLAN-09.)

## References (read, do not duplicate)
- `memory/ui.md` (settings surface; UI owns the settings blob, not the budget defaults)
- `memory/conventions.md` (render budgets: `samples`, `maxDepth`, gamma — the defaults UI exposes)
- `memory/camera-input.md` (`camera.setFov`; `Controls` mouse sensitivity / invert-Y)
- `memory/gameplay.md` (save `settings` blob is opaque + UI-owned) · `memory/rendering.md` (renderer params)
- `plans/PLAN-08-ui-shell.md` → U3

## Expected output
- `src/ui/Settings.js`; edit `src/ui/App.js` / `src/main.js` (hold refs + apply/load), `src/ui/index.js`, `src/ui/ui.css`.
- Road: `roads/PLAN-08/U3-settings.md`.
