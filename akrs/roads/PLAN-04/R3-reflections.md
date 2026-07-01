# ROAD — recursive reflections + depth limit
Status: DONE + superseded by memory/rendering.md
Task: extend traceRay with depth-limited mirror/metallic reflection recursion + weighted accumulation.
Plan / Phase: PLAN-04 / R3   (needs R2)

## Context to load (read order)
1. `../../memory/materials.md` (`reflect()` → `{ ray, weight: Vector3 } | null`; material owns dir+weight, tracer owns recursion)
2. `../../memory/rendering.md` (recursion/depth ownership; linear accumulation)
3. `../../memory/conventions.md` (max reflection depth budget, default 4)
4. `../../plans/PLAN-04-ray-tracer.md` → R3
5. `src/render/trace.js`, `src/materials/index.js`

## Expected files (change scope)
- `src/render/trace.js`    — edit (`traceRay(ray, scene, lights, depth = 0)`: after local shade,
  `hit.material.reflect(hit, ray)`; if non-null recurse on `reflect.ray` at `depth+1` and add
  `mulColor(reflect.weight, reflectedColor)`; stop at max depth)
- `src/render/Renderer.js` — edit only if the traceRay call site needs the new depth arg
- (nothing outside `src/render/`; do not edit `src/materials/` or `src/geometry/`)

## Boundaries
- Do: recurse only while `depth < maxDepth` (injected param, default from `conventions`); at the cap return local color only.
- Do: component-wise `weight × reflectedColor` via a color-multiply helper (reuse; do NOT extend `Vector3`).
- Do NOT: compute reflection direction/weight here (material owns it); change the shadow/shade path (R2).
- Do NOT: apply clamp/gamma (still deferred to `writeColor`).

## Acceptance
- A mirror facing a colored object shows that object's color in the reflection; increasing maxDepth
  deepens a mirror-facing-mirror recursion and the cap terminates it (no infinite recursion / stack overflow).
- A metallic surface tints its reflection by albedo (weight = albedo × reflectivity).
- A purely diffuse scene is unchanged vs R2 (reflect returns null → no reflection term).
- Interim scratch-assert check (mirror reflecting a known-color surface; depth-cap termination); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/rendering.md` or refresh Expected files.
