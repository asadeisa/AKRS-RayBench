# PLAN-07 — Gameplay & Puzzles
**Capability:** the actual game — rooms, interactables, reflective puzzles, progression.
**Depends on:** PLAN-02, PLAN-04, PLAN-05, PLAN-06.
**Memory:** [[gameplay]], [[engine]], [[rendering]].   **Source:** `docs/data.md` → Gameplay.

## Phases
### P1 — Rooms & navigation
- Objective: multiple rooms with doors; scene manager swaps the active room.
- Outputs: a small connected world to play in.
- Depends on: PLAN-06/E3, PLAN-02/G3.

### P2 — Interactables
- Objective: switches, doors, collectibles wired through the event bus.
- Outputs: cause→effect interactions (switch opens door, collectible counts).
- Depends on: P1, PLAN-06/E4.

### P3 — Reflective puzzle mechanics
- Objective: the signature mirror-based puzzle rule(s) + per-level win condition.
- Outputs: at least one solvable mirror puzzle; emits `level:won`.
- Depends on: P2, PLAN-04/R3 (real reflections). *Exact rule defined in each puzzle's Road.*

### P4 — Persistence
- Objective: restart (reset to initial) + save/load progress via the versioned `localStorage` schema ([[gameplay]]).
- Outputs: progress survives reload; main-menu "continue" works ([[ui]]).
- Depends on: P3.

**Done when:** a player can solve a mirror puzzle, win, restart, and resume after reload.
