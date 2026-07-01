# TASK — material model
Plan / Phase: PLAN-03 (Materials & Shading) / S1

## Objective
Implement the four material types — Diffuse, Mirror, Metallic, Emissive — in `src/materials/`,
each a plain data type carrying its parameters (per `memory/materials.md`), attachable to
geometry through the opaque `Hit.material` reference. **Data only** — no shading (S2) or
reflection (S3) logic.

## Constraints
- Vanilla JS ES module; no libraries. Import `Vector3` via `../math/index.js`.
- Color params (`albedo`, `emission`) are `Vector3`, channels **0..1 linear** (`memory/conventions.md`).
- Shared params **roughness** + **reflectivity** live on a small base so the tracer can read them uniformly.
- Constructors + params ONLY. Do NOT add `shade()` / `reflect?()` — S2 / S3 own those.

## References (read, do not duplicate)
- `memory/materials.md` (material table + shared params)
- `memory/conventions.md` (color = linear 0..1; no dedicated Color type)
- `memory/math.md` (Vector3)
- `plans/PLAN-03-materials-shading.md` → S1

## Expected output
- `src/materials/Material.js` (base: `type` tag + shared `roughness`, `reflectivity`),
  `Diffuse.js`, `Mirror.js`, `Metallic.js`, `Emissive.js`, `src/materials/index.js` (barrel).
- Road: `roads/PLAN-03/S1-material-model.md`.
