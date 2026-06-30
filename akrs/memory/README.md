# Memory index — Mirror Forge
Memory holds **reusable** knowledge only: ownership, decisions, and references — never
implementation or tutorials. Single-use knowledge stays in its Task/Road. One owner per
concept; everything else references it.

| File | Owns (single source of truth for…) |
|---|---|
| `architecture.md` | module dependency map + canonical `src/` layout |
| `conventions.md` | axes, units, color/gamma, render budgets, code style |
| `math.md` | math type contracts (Vector2/3, Matrix4, Quaternion, Ray, bounds) |
| `geometry.md` | primitive + mesh + scene-graph + intersection contract |
| `materials.md` | material model + shading parameters |
| `rendering.md` | ray-tracing pipeline stages + render parameters |
| `camera-input.md` | first-person camera + input contract |
| `engine.md` | entity system, managers, game loop, events, collision |
| `gameplay.md` | rooms, interactables, puzzle rules, save format |
| `ui.md` | menus, overlays, settings surfaces |
| `performance.md` | acceleration structure + progressive/adaptive techniques |
| `testing.md` | test strategy + harness |

Legend used in these files: **Decided** (fixed by `docs/data.md`) · **Assumption (High/Med/Low)**
(sensible default, may be overridden) · **Unknown** (open — tracked in `../STATE.md`).
