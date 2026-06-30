# Plans index — Mirror Forge
A **Plan** = one business capability ("which capability?"). A **Phase** = a milestone inside a
plan ("which milestone?"). Plans/Phases carry objectives, outputs, and dependencies — **never**
implementation. Tasks and Roads are generated on demand (Mode 3), one Road per Task.

| Plan | Capability | Depends on |
|---|---|---|
| [PLAN-01](PLAN-01-math-core.md) | Math core (vectors, matrices, quaternion, ray, bounds) | — |
| [PLAN-02](PLAN-02-geometry-scene.md) | Geometry primitives, mesh, scene graph, intersection | 01 |
| [PLAN-03](PLAN-03-materials-shading.md) | Materials + local shading model | 01 |
| [PLAN-04](PLAN-04-ray-tracer.md) | CPU ray tracer pipeline | 01, 02, 03, 05 |
| [PLAN-05](PLAN-05-camera-input.md) | First-person camera + controls | 01, 06 (input) |
| [PLAN-06](PLAN-06-engine-runtime.md) | Engine runtime (loop, entities, managers, events, collision) | 01 |
| [PLAN-07](PLAN-07-gameplay.md) | Gameplay, rooms, reflective puzzles, save | 02, 04, 05, 06 |
| [PLAN-08](PLAN-08-ui-shell.md) | UI shell (menus, overlays, settings) | 06 |
| [PLAN-09](PLAN-09-performance.md) | Performance & acceleration | 04, 06 |
| [PLAN-10](PLAN-10-quality.md) | Quality, testing & docs | all |

**Recommended build order:** 01 → 06 → 02 → 03 → 05 → 04 → 09 → 07 → 08 → 10
(foundations and the loop first; the tracer once geometry+materials+camera exist; perf before
heavy gameplay; quality threaded throughout, not just at the end).
