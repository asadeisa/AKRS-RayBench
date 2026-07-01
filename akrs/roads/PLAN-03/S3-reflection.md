# ROAD — reflection contribution
Status: DONE + superseded by memory/materials.md
Task: add reflect(hit, ray) → { ray, weight } | null to Mirror + Metallic (Diffuse/Emissive → null).
Plan / Phase: PLAN-03 / S3   (needs S2)

## Context to load (read order)
1. `../../memory/materials.md` (reflect contract + weight shape + roughness deferral)
2. `../../memory/rendering.md` (tracer owns recursion/depth-limit; epsilon offset)
3. `../../memory/math.md` (`Vector3.reflect`, `Ray`)
4. `../../plans/PLAN-03-materials-shading.md` → S3
5. `src/materials/` S1/S2 files (what you are extending)

## Expected files (change scope)
- `src/materials/Material.js`  — edit (base `reflect()` → `null`; Diffuse/Emissive inherit)
- `src/materials/Mirror.js`    — edit (perfect reflection; weight = white × reflectivity)
- `src/materials/Metallic.js`  — edit (perfect reflection; weight = albedo × reflectivity)
- (nothing outside `src/materials/`; do not modify `src/math/` or `src/geometry/`)

## Boundaries
- Do: direction = `ray.dir.reflect(hit.normal)` normalized; origin epsilon-offset along the normal.
- Do: return `{ ray: Ray, weight: Vector3 }`; Mirror weight `Vector3(1,1,1).scale(reflectivity)`,
  Metallic weight `albedo.scale(reflectivity)`.
- Do NOT: recurse, apply a depth limit, accumulate color, or trace the reflection ray — PLAN-04 owns that.
- Do NOT: implement roughness jitter (deferred to PLAN-09); start perfect-mirror.

## Acceptance
- Mirror/Metallic return a unit-direction reflection ray whose direction matches the hand-computed
  reflection about the surface normal, origin offset off the surface.
- Metallic weight equals `albedo × reflectivity`; Mirror weight equals `reflectivity` (grey).
- Diffuse and Emissive return `null`.
- Interim scratch-assert check (hand-computed reflection direction + weights); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md` (Done/Next/timestamp); set this Road `DONE + superseded by memory/materials.md`
or refresh Expected files. **PLAN-03 complete when S1–S3 land** — hand back to Leader for PLAN-04.
