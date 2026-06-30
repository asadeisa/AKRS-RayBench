# PLAN-03 — Materials & Shading
**Capability:** how surfaces look and whether they reflect.
**Depends on:** PLAN-01.   **Consumed by:** PLAN-04.
**Memory:** [[materials]], [[rendering]].   **Source:** `docs/data.md` → Materials, Rendering (shading).

## Phases
### S1 — Material model
- Objective: Diffuse, Mirror, Metallic, Emissive with roughness + reflectivity params (`memory/materials.md`).
- Outputs: material types attachable to geometry.
- Depends on: PLAN-01/M1.

### S2 — Local shading
- Objective: Lambert diffuse + specular highlight + ambient term via `shade(hit, ray, scene, lights)`.
- Outputs: correct shaded color for a single hit under point lights.
- Depends on: S1.

### S3 — Reflection contribution
- Objective: `reflect?()` returning reflection ray + weight for mirror/metallic (tracer owns recursion).
- Outputs: the material→tracer contract for recursive reflections.
- Depends on: S2.

**Done when:** reflection vectors + shaded colors match expected values in unit tests ([[testing]]).
