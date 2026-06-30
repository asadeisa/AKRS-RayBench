# PLAN-06 — Engine Runtime
**Capability:** the runtime that ties systems together and advances the world each frame.
**Depends on:** PLAN-01.
**Memory:** [[engine]], [[math]].   **Source:** `docs/data.md` → Engine.

## Phases
### E1 — Game loop & timing
- Objective: rAF loop separating `update(dt)` from `render()`; expose per-frame timing.
- Outputs: the heartbeat consumed by FPS counter + adaptive render.
- Depends on: —.

### E2 — Entity system
- Objective: lightweight entities + components/state; systems iterate entities.
- Outputs: containers for player, interactables, lights.
- Depends on: E1.

### E3 — Managers
- Objective: scene manager (active room), input manager (normalized input state), asset manager (level/scene data).
- Outputs: unblocks camera controls (PLAN-05/C2) + room swapping (PLAN-07).
- Depends on: E2.

### E4 — Events & collision
- Objective: pub/sub event bus + player-vs-world collision (AABB/sphere, slide resolution; no physics lib).
- Outputs: decoupled gameplay signals + walkable worlds.
- Depends on: E3, PLAN-01/M4.

**Done when:** the loop ticks, input flows, rooms can be set, events fire, the player can't walk through walls.
