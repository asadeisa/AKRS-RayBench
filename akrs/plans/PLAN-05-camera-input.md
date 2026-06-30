# PLAN-05 — Camera & Input
**Capability:** the player's eye and controls.
**Depends on:** PLAN-01; input events from PLAN-06 (input manager).
**Memory:** [[camera-input]], [[math]].   **Source:** `docs/data.md` → Camera.

## Phases
### C1 — First-person camera
- Objective: position + yaw/pitch basis, FOV, near/far; `rayFor()`, `viewMatrix()`, `projectionMatrix()`.
- Outputs: the camera the tracer queries for primary rays (unblocks PLAN-04/R1).
- Depends on: PLAN-01/M2, M3.

### C2 — Controls
- Objective: WASD movement (yaw-relative, XZ plane) + mouse look via Pointer Lock; runtime FOV adjust.
- Outputs: navigable first-person view; pitch clamped.
- Depends on: C1, PLAN-06/E3 (input manager).

**Done when:** the player can move and look freely; movement defers collision to [[engine]].
