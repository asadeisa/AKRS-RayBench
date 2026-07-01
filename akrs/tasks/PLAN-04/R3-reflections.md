# TASK — recursive reflections + depth limit
Plan / Phase: PLAN-04 (Ray Tracer) / R3

## Objective
Add mirror/metallic reflections: extend `traceRay` to `traceRay(ray, scene, lights, depth)` — after
local shade, if `hit.material.reflect(hit, ray)` returns `{ ray, weight }`, recurse on the
reflection ray and accumulate `local + mulColor(weight, reflectedColor)`, stopping at the max
reflection depth. Result: working mirrors — the game's core visual.

## Constraints
- Edit `src/render/trace.js` only (plus its call site if the signature changes). No material/geometry edits.
- The **material owns direction + weight**; the **tracer owns recursion + depth limit** (`memory/materials.md`).
- Depth limit is a render budget owned by `conventions` (default 4); read it as an injected param — do NOT redefine it in `render/`.
- Weight is a `Vector3` tint → combine component-wise (reuse a color-multiply helper; do NOT extend `Vector3`).
- At/over max depth, stop recursing and return the local color only (no reflection term).
- No anti-aliasing yet (R4).

## References (read, do not duplicate)
- `memory/materials.md` (`reflect()` → `{ ray, weight: Vector3 } | null`; tracer owns recursion)
- `memory/rendering.md` (recursion/depth ownership; linear accumulation)
- `memory/conventions.md` (max reflection depth budget)
- `plans/PLAN-04-ray-tracer.md` → R3

## Expected output
- Edit: `src/render/trace.js` (depth-limited reflection recursion + accumulation); update the Renderer call if the signature changed.
- Road: `roads/PLAN-04/R3-reflections.md`.
