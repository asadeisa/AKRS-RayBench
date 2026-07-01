# TASK — local shading
Plan / Phase: PLAN-03 (Materials & Shading) / S2

## Objective
Add local shading to the S1 material types: `shade(hit, ray, scene, lights) → Vector3` (linear
color) — **Lambert diffuse + Blinn-Phong specular + constant ambient**, with one **hard shadow
ray per point light** (per `memory/materials.md` / `memory/rendering.md`).

## Constraints
- Extend the S1 types (edit them; add `shade`). No new material types.
- Lighting model: Lambert diffuse + Blinn-Phong specular + constant ambient — **Assumption (Med)** (`memory/materials.md`).
- `shade()` owns per-light occlusion: cast one shadow ray per point light via `scene.intersect`,
  **epsilon-offset along the normal** (`memory/rendering.md` — Decided); skip occluded lights.
  The tracer (PLAN-04) owns reflection recursion, AA, and gamma — NOT shadows.
- Color modulation (albedo × light) is **component-wise**: use a local `mulColor` helper in
  `src/materials/shading.js`. Do NOT extend `Vector3` (closed PLAN-01 math is out of scope).
- Per type: `Diffuse`/`Metallic` = albedo diffuse + specular; `Emissive.shade()` = its emission;
  `Mirror.shade()` = ambient only (its look comes from reflection in S3).
- Ambient coefficient: read from a scene/config value (default owned by `conventions`). If the
  numeric default is Unknown, surface it in `STATE.md` → Open questions — do not invent one.

## References (read, do not duplicate)
- `memory/materials.md` (shade contract + lighting model)
- `memory/rendering.md` (pipeline placement; shade owns shadows, tracer owns recursion)
- `memory/conventions.md` (linear color; ambient/budget ownership)
- `plans/PLAN-03-materials-shading.md` → S2

## Expected output
- Edit: `src/materials/Material.js`, `Diffuse.js`, `Mirror.js`, `Metallic.js`, `Emissive.js` (add `shade()`).
- New: `src/materials/shading.js` (shared Lambert + Blinn-Phong + `mulColor` helpers).
- Road: `roads/PLAN-03/S2-local-shading.md`.
