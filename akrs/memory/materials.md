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
- `shade(hit, ray, scene, lights)` → local color (diffuse Lambert + specular highlight + ambient).
- `reflect?(hit, ray)` → optional reflection ray + weight (mirror/metallic). The tracer owns the
  recursion + depth limit; the material owns the **direction + weight**.
- Lighting model: **Lambert diffuse + Blinn-Phong-style specular + constant ambient**. — **Assumption (Med)** (data.md lists diffuse/specular/ambient, not the exact model).

## Decisions / open
- Roughness model: jittered reflection direction (glossy) vs ignored-for-now: **Assumption** start perfect-mirror, add roughness jitter under PLAN-09.
- No refraction/transmission (not in data.md).

Related: [[rendering]] · [[geometry]] · [[conventions]]
