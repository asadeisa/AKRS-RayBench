# ROAD — material model
Status: DONE + superseded by memory/materials.md
Task: implement Diffuse / Mirror / Metallic / Emissive material types (data only) per memory/materials.md.
Plan / Phase: PLAN-03 / S1   (PLAN-01 math landed; PLAN-02 geometry landed)

## Context to load (read order)
1. `../../memory/materials.md` (material table + shared params; shade/reflect contract you will NOT build yet)
2. `../../memory/conventions.md` (color = linear 0..1; no dedicated Color type → use Vector3)
3. `../../memory/math.md` (Vector3 as the color container)
4. `../../plans/PLAN-03-materials-shading.md` → S1
5. `src/math/index.js` (named export: Vector3)
6. `src/geometry/Hit.js` (the opaque `material` ref your types attach to)

## Expected files (change scope)
- `src/materials/Material.js`  — create (base: `type` tag + shared `roughness`, `reflectivity`)
- `src/materials/Diffuse.js`   — create (`albedo`: Vector3)
- `src/materials/Mirror.js`    — create (`reflectivity`)
- `src/materials/Metallic.js`  — create (`albedo`, `reflectivity`, `roughness`)
- `src/materials/Emissive.js`  — create (`emission`: Vector3, `intensity`)
- `src/materials/index.js`     — create (barrel)
- (nothing outside `src/materials/`; do not modify `src/math/` or `src/geometry/`)

## Boundaries
- Do: plain constructors storing params; `Vector3` for `albedo`/`emission`, 0..1 linear.
- Do: a small base carrying `type` + shared `roughness`/`reflectivity` so the tracer reads them uniformly.
- Do NOT: implement `shade()` (S2), `reflect?()` (S3), the tracer, recursion, or any lighting.
- Do NOT: add a component-wise color multiply to `Vector3` — closed PLAN-01 math is out of scope.

## Acceptance
- Each type instantiable with its params; the `type` tag distinguishes them.
- A material attaches to a Sphere via its `material` field and reads back through a Hit unchanged.
- Barrel re-exports all four types + the base.
- Interim scratch-assert check: construct one of each, assert params + `type` tags; formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md` (Done/Next/timestamp); set this Road `DONE + superseded by memory/materials.md`
or refresh Expected files; keep `../../memory/materials.md` in agreement.
