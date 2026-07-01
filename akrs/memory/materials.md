# Memory — Materials & Shading
Owns: the material model and shading parameters. Truth lives in `src/materials/`. Consumes
[[math]]; consumed by [[rendering]] (the tracer asks a material how to shade + whether to spawn
a reflection ray).

## Material model (from data.md)
| Type | Key params | Reflection behavior |
|---|---|---|
| **Diffuse** | albedo (color) | none (local shading only) |
| **Mirror** | reflectivity | perfect reflection ray |
| **Metallic** | albedo, reflectivity, roughness | reflection tinted by albedo; roughness perturbs |
| **Emissive** | emission (color, intensity) | acts as a light contributor; no incoming shading needed |
- Shared configurable params: **roughness**, **reflectivity** (data.md).

## Shading contract (what the tracer calls)
- `shade(hit, ray, scene, lights)` → local color `Vector3` (diffuse Lambert + specular highlight +
  ambient). **shade() owns per-light hard-shadow occlusion** — that is why it receives `scene`: it
  casts one epsilon-offset shadow ray per point light via `scene.intersect` and skips occluded
  lights. The tracer owns reflection recursion, AA, and gamma — not shadows. — **Decided (PLAN-03)**.
- `reflect?(hit, ray)` → `{ ray: Ray, weight: Vector3 } | null` for mirror/metallic (`null` for
  diffuse/emissive). The tracer owns the recursion + depth limit; the material owns the
  **direction + weight**. Weight is a color tint: Mirror = white × reflectivity, Metallic =
  albedo × reflectivity.
- Lighting model: **Lambert diffuse + Blinn-Phong-style specular + constant ambient**. — **Assumption (Med)** (data.md lists diffuse/specular/ambient, not the exact model).

## Decisions / open
- **Color container = `Vector3`** (r,g,b as x,y,z), 0..1 linear — no dedicated Color type. — **Decided (PLAN-03)**.
- Component-wise color products use a local `mulColor` helper in `src/materials/shading.js`;
  `Vector3` (closed PLAN-01) is **not** extended. Promote to a Vector3 method only via a Mode-4 math change. — **Decided (PLAN-03)**.
- Roughness model: jittered reflection direction (glossy) vs ignored-for-now: **Assumption** start perfect-mirror, add roughness jitter under PLAN-09.
- Ambient numeric default is a render budget owned by [[conventions]] (not yet a fixed value) —
  shade() reads it as `scene.ambient` (a scalar coefficient tinted by albedo where applicable;
  falls back to 0, not an invented default, if unset); **open**, confirm before PLAN-04.
- Blinn-Phong shininess exponent is derived from `roughness` (`(1 - roughness) * 128`, floor 1) —
  **Assumption (Med)**, no exact formula in data.md.
- No refraction/transmission (not in data.md).

Related: [[rendering]] · [[geometry]] · [[conventions]]
