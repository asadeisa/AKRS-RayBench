# Mirror Forge

A browser-based first-person puzzle game rendered entirely using a custom CPU ray tracer.

## Overview

Mirror Forge is an experimental exploration of real-time ray tracing in JavaScript, built from scratch without rendering libraries or game engines. The entire game—from 3D math to ray tracing to gameplay systems—is implemented in vanilla JavaScript using Canvas 2D for display.

## Features

- **Custom Ray Tracer**: CPU-based recursive ray tracing with reflections, shadows, and shading
- **Advanced Rendering**: Diffuse and specular lighting, ambient occlusion, gamma correction, anti-aliasing
- **3D Math**: Full linear algebra suite (Vector2/3, Matrix4, Quaternion, Bounding volumes)
- **Dynamic Geometry**: Spheres, planes, boxes, triangles, and mesh abstractions with scene graphs
- **Materials System**: Diffuse, mirror, metallic, and emissive materials with configurable properties
- **First-Person Gameplay**: WASD movement with mouse look, FOV adjustment, and near/far clipping
- **Puzzle Mechanics**: Reflective puzzles, interactive switches, doors, and collectibles
- **UI Suite**: Main menu, pause menu, FPS counter, debug overlay, and settings
- **Performance Optimizations**: Progressive rendering, adaptive resolution, early ray termination, and spatial acceleration

## Tech Stack

- HTML5
- CSS
- Vanilla JavaScript (ES modules)
- Canvas 2D API
- No rendering libraries
- No game engines
- No physics libraries

## Getting Started

### Prerequisites

A modern web browser with support for ES modules and Canvas 2D.

### Running the Game

1. Clone the repository
2. Open `index.html` in your web browser (or serve via a local HTTP server)
3. Use **WASD** to move and your **mouse** to look around
4. Solve the reflective puzzles to progress

### Development

The project is organized into modular systems:

- **`akrs/memory/`** – Design decisions and architectural documentation
- **`akrs/plans/`** – Implementation plans organized by subsystem
- **`akrs/roads/`** – Active work tasks and execution plans
- **`docs/data.md`** – Source of truth for project requirements
- **`docs/akrs/framework/`** – Build-time framework documentation (not loaded at runtime)

To contribute, review the active Road in `akrs/roads/` and follow the AKRS framework guidelines.

## Project Structure

```
mirror-test/
├── index.html              # Game entry point
├── src/                    # Source code (organized by subsystem)
├── docs/                   # Documentation
│   ├── data.md            # Requirements source of truth
│   └── akrs/              # AKRS framework (build-time only)
├── akrs/                  # AKRS runtime (memory, plans, roads, state)
│   ├── KERNEL.md          # Project kernel and execution rules
│   ├── ROUTER.md          # Route and reference guide
│   ├── STATE.md           # Current project state
│   ├── memory/            # Design decisions and ownership
│   ├── plans/             # Implementation phases and plans
│   ├── roads/             # Active work and tasks
│   └── tasks/             # Detailed task specifications
└── README.md              # This file
```

## Architecture

The game operates under the AKRS framework:

- **Road**: Active work with clear scope and expected outputs
- **Memory**: Design decisions, ownership, and architectural contracts
- **Router**: Routes and references between components
- **Repository**: Source files (only modified by active Roads)

Core systems:

- **Math Core**: Linear algebra, ray-geometry intersection
- **Geometry & Scene**: Spatial data structures, scene graph
- **Materials & Shading**: Material properties, lighting calculations
- **Ray Tracer**: Main rendering pipeline with recursive reflections
- **Camera & Input**: First-person controller with mouse/keyboard input
- **Engine Runtime**: Game loop, entity system, scene management
- **Gameplay**: Puzzle mechanics, interactions, save/load
- **UI**: Menus, overlays, and debugging displays
- **Performance**: Optimization strategies and profiling

## Building

The project uses build-time documentation in `docs/akrs/framework/`. The runtime never loads framework documentation—it operates on active Roads and architectural Memory.

To extend or debug:

1. Check the active Road in `akrs/roads/`
2. Review relevant Memory in `akrs/memory/` for design context
3. Trace the Router in `akrs/ROUTER.md` for component relationships
4. Execute only within the scope of the active Road

## Performance Notes

- Progressive rendering allows frame budgeting
- Adaptive resolution scales rendering quality based on performance
- Early ray termination prevents excessive recursion
- Spatial acceleration structures speed up ray-geometry intersection
- Frame timing is monitored and reported via the debug overlay

## Future Enhancements

See `akrs/plans/` for planned implementations:
- PLAN-01: Math core and ray-geometry intersection
- PLAN-02: Geometry and scene management
- PLAN-03: Materials and shading
- PLAN-04: Ray tracer pipeline
- PLAN-05: Camera and input handling
- PLAN-06: Engine runtime and game loop
- PLAN-07: Gameplay and puzzle mechanics
- PLAN-08: UI and menus
- PLAN-09: Performance optimization
- PLAN-10: Quality assurance and polish

## License

Proprietary. All rights reserved.

## Contact

For questions or contributions, review the AKRS framework in the KERNEL and consult the active Road before beginning work.
# weekly usage : 
-78%  - > .... plan 2 -done 81%  ,
-plan 2 -> worker usage : 9% with sonnet-5 , and about 1% weekly.
-plan 3 : leader  : 8% context window , 19% - 9% = 10% usage with opus4.8 Extra thinking , about 1% weekly usage .
   worker: all three tasks in same session : 101.9k/967k (11%) context window , sonnet-5 med, 
   26