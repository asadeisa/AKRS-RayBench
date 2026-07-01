# ROAD — local shading
Status: DONE + superseded by memory/materials.md
Task: add shade(hit, ray, scene, lights) — Lambert + Blinn-Phong + ambient + hard shadows — to the S1 types.
Plan / Phase: PLAN-03 / S2   (needs S1)

## Context to load (read order)
1. `../../memory/materials.md` (shade contract + lighting model)
2. `../../memory/rendering.md` (pipeline placement; shade owns per-light shadows, tracer owns recursion)
3. `../../memory/conventions.md` (linear color; ambient/render-budget ownership)
4. `../../plans/PLAN-03-materials-shading.md` → S2
5. `src/materials/index.js` + the S1 material files (what you are extending)
6. `src/geometry/Scene.js` (`intersect(ray) → Hit | null` for shadow rays; light descriptor shape)

## Expected files (change scope)
- `src/materials/Material.js`  — edit (add `shade()` — base default: ambient-only)
- `src/materials/Diffuse.js`   — edit (Lambert diffuse + specular)
- `src/materials/Metallic.js`  — edit (albedo diffuse + specular)
- `src/materials/Mirror.js`    — edit (ambient only; look comes from S3 reflection)
- `src/materials/Emissive.js`  — edit (returns its emission)
- `src/materials/shading.js`   — create (shared Lambert + Blinn-Phong + `mulColor` helpers)
- (nothing outside `src/materials/`; do not modify `src/math/` or `src/geometry/`)
- **Scope exception (user-approved):** `src/geometry/Scene.js` — added `intersect(ray, tMin, tMax)`
  (linear closest-hit scan over `renderables`). `memory/rendering.md`/`memory/geometry.md`
  documented this as a contract the tracer relies on, but PLAN-02's Roads never built it — S2's
  shadow rays need it to exist. Confirmed with the user before touching geometry.

## Boundaries
- Do: iterate `lights`; per light cast ONE hard shadow ray via `scene.intersect`, **epsilon-offset
  along the normal**; skip occluded lights; add a constant ambient term.
- Do: component-wise color products via the local `mulColor` helper (NOT a Vector3 method).
- Do NOT: cast reflection rays or recurse (S3 supplies the ray; PLAN-04 owns recursion + depth + gamma).
- Do NOT: extend `Vector3`; do NOT redefine budgets — read ambient from scene/config, don't invent a value.

## Acceptance
- Front-lit diffuse surface: `shade` ≈ hand-computed `ambient + albedo·max(0, N·L)` (+ specular where N·H>0).
- A light occluded by another object contributes 0 (shadow ray hits before the light).
- `Emissive.shade()` returns its emission; `Mirror.shade()` returns ambient only.
- Interim scratch-assert check with a 1-light, 2-object scene (one lit, one shadowed); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md` (Done/Next/timestamp); set this Road `DONE + superseded by memory/materials.md`
or refresh Expected files; keep `../../memory/materials.md` + `../../memory/rendering.md` in agreement.
