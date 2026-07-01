# ROAD — closest-hit shading + lights + hard shadows
Status: DONE + superseded by memory/rendering.md
Task: add traceRay(ray, scene, lights) → color (closest hit → material.shade); wire the Renderer to it.
Plan / Phase: PLAN-04 / R2   (needs R1; hard shadows already ship inside material.shade())

## Context to load (read order)
1. `../../memory/rendering.md` (pipeline; contracts: scene.intersect + material.shade)
2. `../../memory/materials.md` (`shade(hit, ray, scene, lights)` owns per-light hard shadows)
3. `../../memory/geometry.md` (`Scene.intersect(ray) → Hit | null`; light descriptor `{ position, color, intensity }`)
4. `../../plans/PLAN-04-ray-tracer.md` → R2
5. `src/render/Renderer.js`, `src/geometry/Scene.js`, `src/materials/index.js`

## Expected files (change scope)
- `src/render/trace.js`    — create (`traceRay(ray, scene, lights)`: `scene.intersect` → `hit.material.shade(...)`; miss → background)
- `src/render/Renderer.js` — edit (pixel loop calls `traceRay` instead of flat background)
- `src/render/index.js`    — edit (export `traceRay`)
- (nothing outside `src/render/`; do not touch `src/geometry/` or `src/materials/`)

## Boundaries
- Do: closest hit via `scene.intersect`; color via `hit.material.shade(hit, ray, scene, lights)`; miss → background.
- Do: pass through the scene's world-space `lights` list to `shade`.
- Do NOT: reimplement shadow rays (shade owns them), add reflection recursion (R3), or AA (R4).
- Do NOT: apply clamp/gamma inside `traceRay` — colors stay linear until `writeColor`.

## Acceptance
- A one-sphere, one-light scene renders a lit disc over the background; a second occluding object
  darkens the shadowed region (shadow behavior inherited from `shade`, verified end-to-end here).
- A ray that hits nothing yields exactly the background color.
- Interim scratch-assert check on a tiny scene (sample a lit pixel vs a background pixel); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/rendering.md` or refresh Expected files.
