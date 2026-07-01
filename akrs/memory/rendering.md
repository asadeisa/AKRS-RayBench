# Memory — Rendering (Ray Tracer)
Owns: the ray-tracing pipeline stages and render parameters. Truth lives in `src/render/`.
Consumes [[geometry]], [[materials]], [[camera-input]], [[math]]; tuned by [[performance]].

## Pipeline stages (fixed order)
```
camera → primary ray (per pixel, + AA sub-samples)
  → closest hit (scene.intersect)
  → local shade (diffuse + specular + ambient + hard shadow ray per light)   [materials.shade()]
  → reflection ray if mirror/metallic (tracer recurses, depth-limited; material supplies ray+weight)
  → accumulate → clamp → gamma → write ImageData (RGBA8)
```
- Hard shadows live **inside** `materials.shade()` (it receives `scene`); the tracer owns the
  primary/reflection rays, recursion + depth limit, AA, clamp, and gamma. — **Decided (PLAN-03)**.

## Parameters (owners)
- Max reflection depth, AA sampling, gamma, ambient, color clamp → owned by [[conventions]] (render budgets). Renderer reads them; does not redefine them.
- Background / sky color: constant. — **Assumption (Med)**.
- Shadow ray epsilon offset along the normal to avoid self-shadow acne. — **Decided** (standard).

## Contracts the tracer relies on
- Scene exposes `intersect(ray) → Hit | null` ([[geometry]]).
- Material exposes `shade()` + optional `reflect?()` ([[materials]]).
- Camera exposes `rayFor(px, py, width, height) → Ray` ([[camera-input]]).
- Output sink = Canvas 2D `ImageData` ([[conventions]]).

## Decisions / open
- Color accumulation in linear float; single clamp+gamma at write-out (no double gamma).
- Tone mapping beyond clamp: **out of scope** unless data.md "quality" demands it later.

Related: [[geometry]] · [[materials]] · [[camera-input]] · [[performance]] · [[conventions]]
