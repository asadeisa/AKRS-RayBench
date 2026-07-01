# ROAD — scene-graph
Status: DONE + superseded by memory/geometry.md
Task: implement Node hierarchy + Scene (renderables + lights) per memory/geometry.md.
Plan / Phase: PLAN-02 / G3   (needs G2 landed)

## Context to load (read order)
1. `../memory/geometry.md` (Node, world-matrix cache/dirty-flag, Scene, light descriptor)
2. `../memory/math.md` (Matrix4, Quaternion, AABB)
3. `../plans/PLAN-02-geometry-scene.md` → G3
4. `src/geometry/index.js` (primitives + Mesh + Hit), `src/math/index.js`

## Expected files (change scope)
- `src/geometry/Node.js`   — create (position/rotation/scale → local Matrix4; children; cached worldMatrix + dirty flag; optional geometry + material)
- `src/geometry/Scene.js`  — create (build flat renderable list from the graph; `lights` array; per-object world AABB)
- `src/geometry/index.js`  — edit (add Node, Scene exports)
- (nothing outside `src/geometry/`)

## Boundaries
- Do: parent→child world matrix = parentWorld × local; dirty-flag invalidates subtree; Scene flattens renderables + collects lights; each renderable exposes a world-space AABB (transform local AABB).
- Do NOT: build the scene-AABB union / BVH hook (that is G4) beyond per-object AABB; no room-swapping (that is engine PLAN-06); no shading/render.

## Acceptance
- Nested transforms compose correctly (child world = parent × local); moving a parent moves children.
- Dirty-flag: world matrix recomputed only after a transform change, cached otherwise.
- `Scene` yields the flat renderable list + lights; each renderable returns a correct world AABB.
- Interim scratch-assert check on a 2–3 node hierarchy.

## Close-out (when it lands)
Update `../STATE.md`; set this Road `DONE + superseded by memory/geometry.md` or refresh Expected files; keep `memory/geometry.md` in agreement.
