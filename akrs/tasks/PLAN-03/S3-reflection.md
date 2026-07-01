# TASK — reflection contribution
Plan / Phase: PLAN-03 (Materials & Shading) / S3

## Objective
Add `reflect(hit, ray) → { ray: Ray, weight: Vector3 } | null` to the material types: Mirror and
Metallic return a reflection ray + weight; Diffuse and Emissive return `null`. The **material owns
direction + weight**; the tracer (PLAN-04) owns recursion + depth limit (`memory/materials.md`).

## Constraints
- Edit the S1/S2 types (add `reflect`). Base default returns `null` (Diffuse/Emissive inherit it).
- Direction: perfect reflection `ray.dir.reflect(hit.normal)` (normalized); roughness perturbation
  **deferred to PLAN-09** — start perfect-mirror (`memory/materials.md` decision).
- Reflection ray origin **epsilon-offset along the normal** (avoid self-hit) — consistent with the
  shadow-epsilon decision (`memory/rendering.md`).
- Weight is a `Vector3` tint: **Mirror** = `Vector3(1,1,1).scale(reflectivity)`;
  **Metallic** = `albedo.scale(reflectivity)` (albedo-tinted).
- Do NOT implement recursion, depth limit, accumulation, or the tracer — that is PLAN-04.

## References (read, do not duplicate)
- `memory/materials.md` (reflect contract + weight shape + roughness deferral)
- `memory/rendering.md` (tracer owns recursion/depth; epsilon offset)
- `memory/math.md` (Vector3.reflect, Ray)
- `plans/PLAN-03-materials-shading.md` → S3

## Expected output
- Edit: `src/materials/Material.js` (base `reflect()` → null), `Mirror.js`, `Metallic.js` (override).
- Road: `roads/PLAN-03/S3-reflection.md`.
