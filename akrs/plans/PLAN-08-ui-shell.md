# PLAN-08 — UI Shell
**Capability:** menus, overlays, and settings around the game.
**Depends on:** PLAN-06; reads timing from PLAN-04/PLAN-09; save from PLAN-07.
**Memory:** [[ui]], [[engine]], [[gameplay]].   **Source:** `docs/data.md` → UI.

## Phases
### U1 — Menus
- Objective: main menu (new / continue / settings) + pause menu (resume / restart / settings / quit), DOM/CSS overlay.
- Outputs: game state transitions (menu ↔ playing ↔ paused); pointer-lock release on pause.
- Depends on: PLAN-06/E1, PLAN-07/P4 (continue).

### U2 — Overlays
- Objective: FPS counter + toggleable debug overlay (ray/scene/camera stats).
- Outputs: live diagnostics from frame timing ([[engine]], [[performance]]).
- Depends on: U1.

### U3 — Settings
- Objective: resolution / adaptive toggle, FOV, AA & reflection-depth quality, mouse sensitivity; persisted via save.
- Outputs: user control over the render budgets owned by [[conventions]].
- Depends on: U1, PLAN-09 (adaptive hooks).

**Done when:** menus drive game state, overlays read live stats, settings persist and take effect.
