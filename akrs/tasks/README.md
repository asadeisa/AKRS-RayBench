# Tasks index — Mirror Forge
A **Task** = one executable objective ("what to build"), small enough that a Worker completes it
without redesigning architecture. Each Task has **exactly one Road** ("what to read/change").
Tasks are generated on demand (Mode 3). References, never duplicated knowledge.

> **Layout:** PLAN-01/02 Tasks are flat (`tasks/PLAN-0x-…`). From **PLAN-03 onward** each plan's
> Tasks live in a per-plan **subfolder** (`tasks/PLAN-03/…`) for clarity; Roads mirror this
> (`roads/PLAN-03/…`).

## PLAN-01 — Math Core ✅ complete
| Task | Phase | Road | Status |
|---|---|---|---|
| [vectors-ray](PLAN-01-M1-vectors-ray.md) | M1 | `../roads/PLAN-01-M1-vectors-ray.md` | DONE + superseded by memory/math.md |
| [matrix4](PLAN-01-M2-matrix4.md) | M2 | `../roads/PLAN-01-M2-matrix4.md` | DONE + superseded by memory/math.md |
| [quaternion](PLAN-01-M3-quaternion.md) | M3 | `../roads/PLAN-01-M3-quaternion.md` | DONE + superseded by memory/math.md |
| [bounds](PLAN-01-M4-bounds.md) | M4 | `../roads/PLAN-01-M4-bounds.md` | DONE + superseded by memory/math.md |
Shipped: `src/math/` Vector2, Vector3, Ray, Matrix4, Quaternion, AABB, BoundingSphere.

## PLAN-02 — Geometry & Scene ✅ complete
| Task | Phase | Road | Status |
|---|---|---|---|
| [primitives](PLAN-02-G1-primitives.md) | G1 | `../roads/PLAN-02-G1-primitives.md` | DONE + superseded by memory/geometry.md |
| [mesh](PLAN-02-G2-mesh.md) | G2 | `../roads/PLAN-02-G2-mesh.md` | DONE + superseded by memory/geometry.md |
| [scene-graph](PLAN-02-G3-scene-graph.md) | G3 | `../roads/PLAN-02-G3-scene-graph.md` | DONE + superseded by memory/geometry.md |
| [bounds-wiring](PLAN-02-G4-bounds-wiring.md) | G4 | `../roads/PLAN-02-G4-bounds-wiring.md` | DONE + superseded by memory/geometry.md |
Shipped: `src/geometry/` primitives, Mesh, Node, Scene (incl. `Scene.intersect`).

## PLAN-03 — Materials & Shading ✅ complete — folder [PLAN-03/](PLAN-03/)
| Task | Phase | Road | Status |
|---|---|---|---|
| [material-model](PLAN-03/S1-material-model.md) | S1 | `../roads/PLAN-03/S1-material-model.md` | DONE + superseded by memory/materials.md |
| [local-shading](PLAN-03/S2-local-shading.md) | S2 | `../roads/PLAN-03/S2-local-shading.md` | DONE + superseded by memory/materials.md |
| [reflection](PLAN-03/S3-reflection.md) | S3 | `../roads/PLAN-03/S3-reflection.md` | DONE + superseded by memory/materials.md |
Shipped: `src/materials/` Diffuse/Mirror/Metallic/Emissive + `shade()`/`reflect()` + shading helpers.

## PLAN-04 — Ray Tracer ✅ complete — folder [PLAN-04/](PLAN-04/)
| Task | Phase | Road | Status |
|---|---|---|---|
| [primary-rays](PLAN-04/R1-primary-rays.md) | R1 | `../roads/PLAN-04/R1-primary-rays.md` | DONE + superseded by memory/rendering.md |
| [shading-shadows](PLAN-04/R2-shading-shadows.md) | R2 | `../roads/PLAN-04/R2-shading-shadows.md` | DONE + superseded by memory/rendering.md |
| [reflections](PLAN-04/R3-reflections.md) | R3 | `../roads/PLAN-04/R3-reflections.md` | DONE + superseded by memory/rendering.md |
| [image-quality](PLAN-04/R4-image-quality.md) | R4 | `../roads/PLAN-04/R4-image-quality.md` | DONE + superseded by memory/rendering.md |
Shipped: `src/render/` Renderer + `traceRay` (shadows, recursive reflections, gamma, jittered AA).

## PLAN-05 — Camera & Input ✅ complete — folder [PLAN-05/](PLAN-05/)
| Task | Phase | Road | Status |
|---|---|---|---|
| [camera](PLAN-05/C1-camera.md) | C1 | `../roads/PLAN-05/C1-camera.md` | DONE + superseded by memory/camera-input.md |
| [controls](PLAN-05/C2-controls.md) | C2 | `../roads/PLAN-05/C2-controls.md` | DONE + superseded by memory/camera-input.md |
Shipped: `src/camera/` Camera (`rayFor` / view / projection) + Controls (coded to PLAN-06/E3 input; real wiring lands with E3).

## PLAN-06 — Engine Runtime ✅ complete — folder [PLAN-06/](PLAN-06/)
| Task | Phase | Road | Status |
|---|---|---|---|
| [game-loop](PLAN-06/E1-game-loop.md) | E1 | `../roads/PLAN-06/E1-game-loop.md` | DONE + superseded by memory/engine.md |
| [entity-system](PLAN-06/E2-entity-system.md) | E2 | `../roads/PLAN-06/E2-entity-system.md` | DONE + superseded by memory/engine.md |
| [managers](PLAN-06/E3-managers.md) | E3 | `../roads/PLAN-06/E3-managers.md` | DONE + superseded by memory/engine.md |
| [events-collision](PLAN-06/E4-events-collision.md) | E4 | `../roads/PLAN-06/E4-events-collision.md` | DONE + superseded by memory/engine.md |
Shipped: `src/engine/` Loop, Entity/World, Scene/Input/Asset managers, EventBus, Collision. `InputManager` closes the PLAN-05/C2 Controls loop end-to-end.

## PLAN-07 — Gameplay & Puzzles ✅ complete — folder [PLAN-07/](PLAN-07/)
| Task | Phase | Road | Status |
|---|---|---|---|
| [rooms](PLAN-07/P1-rooms.md) | P1 | `../roads/PLAN-07/P1-rooms.md` | DONE + superseded by memory/gameplay.md |
| [interactables](PLAN-07/P2-interactables.md) | P2 | `../roads/PLAN-07/P2-interactables.md` | DONE + superseded by memory/gameplay.md |
| [reflective-puzzle](PLAN-07/P3-reflective-puzzle.md) | P3 | `../roads/PLAN-07/P3-reflective-puzzle.md` | DONE + superseded by memory/gameplay.md |
| [persistence](PLAN-07/P4-persistence.md) | P4 | `../roads/PLAN-07/P4-persistence.md` | DONE + superseded by memory/gameplay.md |
Execution order: P1 → P2 → P3 → P4 (all landed). Owner: `src/game/` → `memory/gameplay.md`.
Shipped: `src/game/` Room/RoomManager, events + Switch/Door/Collectible + `worldColliders`, an
additive `interact` edge on `InputManager.poll()`, `beam.js`/`Puzzle.js` (reflective puzzle,
`LEVEL_WON`), `save.js` (versioned `localStorage` save/load/clear + `snapshot`/`restart`).

## PLAN-08 — UI Shell ✅ complete (U1–U2 live-verified via U3's pass) — folder [PLAN-08/](PLAN-08/)
| Task | Phase | Road | Status |
|---|---|---|---|
| [menus](PLAN-08/U1-menus.md) | U1 | `../roads/PLAN-08/U1-menus.md` | DONE + superseded by memory/ui.md (live-verified) |
| [overlays](PLAN-08/U2-overlays.md) | U2 | `../roads/PLAN-08/U2-overlays.md` | DONE + superseded by memory/ui.md (live-verified) |
| [settings](PLAN-08/U3-settings.md) | U3 | `../roads/PLAN-08/U3-settings.md` | DONE + superseded by memory/ui.md |
Execution order: U1 → U2 → U3 (all landed). Owner: `src/ui/` (+ `index.html`, `src/main.js`) → `memory/ui.md`.
⭑ Shipped: boot, `App` state machine, Main/Pause menus, FPS + `F3` debug overlay, and now `Settings.js`
(FOV/AA/depth/sensitivity/invert-Y/resolution + a **live** adaptive-resolution toggle bound to
PLAN-09's `AdaptiveController`, persisted via the save's opaque `settings` field, applied on
boot/Continue) + a canvas upscale-on-blit for when the internal buffer is smaller than the canvas.
Live-verified end-to-end with Playwright (`/run`-equivalent): menu → New Game → PLAYING (renders,
F3 overlay) → pause → Settings (reachable from both menus) → every control applies live + persists →
resolution/adaptive changes resize the actual render buffer with no blit gaps → Quit → relaunch →
Continue restores and reapplies the saved settings.

## PLAN-09 — Performance & Acceleration ✅ complete — unblocks PLAN-08/U3 — folder [PLAN-09/](PLAN-09/)
| Task | Phase | Road | Status |
|---|---|---|---|
| [acceleration](PLAN-09/F1-acceleration.md) | F1 | `../roads/PLAN-09/F1-acceleration.md` | DONE + superseded by memory/performance.md |
| [adaptive](PLAN-09/F2-adaptive.md) | F2 | `../roads/PLAN-09/F2-adaptive.md` | DONE + superseded by memory/performance.md |
| [frame-budget](PLAN-09/F3-frame-budget.md) | F3 | `../roads/PLAN-09/F3-frame-budget.md` | DONE + superseded by memory/performance.md |
Execution order: F1 → F2 → F3 (all landed). Owner: `src/perf/` (+ hooks in `src/render/`, `src/geometry/Scene.js`, `src/main.js`) → `memory/performance.md`.
⭑ Shipped: `src/perf/` BVH + accelerator seam, `AdaptiveController` + `ProgressiveRefiner`, `FrameBudget`;
`Renderer.setScale`; early ray termination in `traceRay`; boot times render()-only ms into
`FrameBudget` → `AdaptiveController.update` (not yet applied to pixels — U3 wires that). **PLAN-09
now complete — unblocks PLAN-08/U3.**
