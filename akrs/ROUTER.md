# ROUTER — Mirror Forge
Routes only. No explanations, no implementation. Match the prompt's domain to a row, open the
**Plan** (what to build / which milestone) and read the listed **Memory** first. Roads are
generated on demand (Mode 3). Paths are relative to `akrs/`.

## Domain routes
| If the prompt is about… | Plan | Memory (read first) |
|---|---|---|
| vectors, matrices, quaternions, rays, transforms, math | `plans/PLAN-01-math-core.md` | `memory/math.md`, `memory/conventions.md` |
| spheres / planes / boxes / triangles, meshes, scene graph, ray-intersection, AABBs | `plans/PLAN-02-geometry-scene.md` | `memory/geometry.md`, `memory/math.md` |
| materials, diffuse / mirror / metallic / emissive, roughness, reflectivity, shading model | `plans/PLAN-03-materials-shading.md` | `memory/materials.md`, `memory/rendering.md` |
| ray tracing, primary rays, reflections, point lights, hard shadows, AA, gamma, ray-depth, framebuffer | `plans/PLAN-04-ray-tracer.md` | `memory/rendering.md`, `memory/geometry.md`, `memory/materials.md` |
| camera, first-person, WASD, mouse look, FOV, near / far clipping | `plans/PLAN-05-camera-input.md` | `memory/camera-input.md`, `memory/math.md` |
| entity system, scene / input / asset manager, game loop, collision, event system | `plans/PLAN-06-engine-runtime.md` | `memory/engine.md` |
| puzzles, rooms, switches, doors, collectibles, win condition, restart, save / load | `plans/PLAN-07-gameplay.md` | `memory/gameplay.md`, `memory/engine.md` |
| main / pause menu, FPS counter, debug overlay, settings | `plans/PLAN-08-ui-shell.md` | `memory/ui.md`, `memory/engine.md` |
| performance, progressive render, adaptive resolution, early ray termination, BVH / acceleration, frame timing | `plans/PLAN-09-performance.md` | `memory/performance.md`, `memory/rendering.md` |
| tests, documentation, refactor, build, code quality | `plans/PLAN-10-quality.md` | `memory/testing.md`, `memory/architecture.md` |

## Cross-cutting / where things live
| Need | Go to |
|---|---|
| Module dependency map + canonical `src/` layout | `memory/architecture.md` |
| Project-wide conventions (axes, units, color/gamma, budgets, code style) | `memory/conventions.md` |
| Save-point / resume / open questions | `STATE.md` |
| Requirements (Source of Truth) | `../docs/data.md` |
| Active execution contract(s) | `roads/` (generated on demand) |
| Plan & phase index | `plans/README.md` |
