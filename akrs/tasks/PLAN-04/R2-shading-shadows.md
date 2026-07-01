# TASK — closest-hit shading + lights + hard shadows
Plan / Phase: PLAN-04 (Ray Tracer) / R2

## Objective
Turn primary rays into a lit image: add `traceRay(ray, scene, lights) → Vector3` — closest hit via
`scene.intersect`, then `hit.material.shade(hit, ray, scene, lights)` for the color; a miss returns
the background. Wire the Renderer's pixel loop to `traceRay`. Result: a lit, shadowed scene (no
reflections yet — hard shadows already live inside `material.shade()`).

## Constraints
- Extend R1; add `src/render/trace.js`. No new material/geometry logic.
- `scene.intersect(ray) → Hit | null` and `material.shade(hit, ray, scene, lights) → Vector3` already
  exist (PLAN-02 / PLAN-03) — call them; do NOT reimplement shadows here (shade() owns them).
- `lights` = the scene's world-space point-light descriptors `{ position, color, intensity }` (`memory/geometry.md`).
- Colors stay linear `Vector3`; the single clamp+gamma happens only at `writeColor` (no double gamma).
- No reflection recursion (R3), no anti-aliasing (R4).

## References (read, do not duplicate)
- `memory/rendering.md` (pipeline; contracts: scene.intersect + material.shade)
- `memory/materials.md` (`shade()` signature + that it owns per-light hard shadows)
- `memory/geometry.md` (Scene.intersect + light descriptor shape)
- `plans/PLAN-04-ray-tracer.md` → R2

## Expected output
- New: `src/render/trace.js` (`traceRay(ray, scene, lights)`); edit `src/render/Renderer.js` (use traceRay per pixel); export from `src/render/index.js`.
- Road: `roads/PLAN-04/R2-shading-shadows.md`.
