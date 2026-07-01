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
- **Tracer entry:** `traceRay(ray, scene, lights, depth = 0) → Vector3` (linear). Closest hit via
  `scene.intersect` → `material.shade(...)`; miss → background. Reflection: if
  `material.reflect(hit, ray)` returns `{ ray, weight }`, accumulate `local + mulColor(weight,
  traceRay(reflect.ray, …, depth+1))`, stopping at max depth. — **Decided (PLAN-04)**.
- **Renderer is DOM-free:** writes an `ImageData`-shaped buffer `{ width, height, data:
  Uint8ClampedArray }`; the boot layer (main.js / PLAN-06) blits it to the canvas. — **Decided (PLAN-04)**.
- **Render params injected, not redefined:** `maxDepth`, `samples`, `gamma`, `background`,
  `ambient` are constructor/params on the renderer; canonical values owned by [[conventions]] and
  wired at boot. `render/` defaults only mirror conventions. — **Decided (PLAN-04)**.
- AA = N jittered sub-pixel samples averaged in linear space, then one `writeColor` per pixel.
- **R1 landed:** `src/render/Renderer.js` (pixel loop, DOM-free `{ width, height, data }` buffer,
  render params injected) + `src/render/writeColor.js` (clamp[0,1] → gamma → ×255 → RGBA8, single
  write-out) built against `camera.rayFor()` (PLAN-05/C1, now landed).
- **R2 landed:** `src/render/trace.js` exports `traceRay(ray, scene, lights, background)` —
  `scene.intersect` → `hit.material.shade(hit, ray, scene, lights)`; miss → `background`; stays
  linear (no clamp/gamma). `Renderer.render(camera, scene)` now takes the scene and calls
  `traceRay` per pixel instead of writing a flat background (signature change from R1's
  `render(camera)`, needed since `traceRay` requires `scene`/`lights`). Shadow rays are not
  reimplemented here — they live inside `material.shade()` per the existing contract.
- **R3 landed:** `traceRay(ray, scene, lights, background, depth = 0, maxDepth = 4)` — after local
  shade, `hit.material.reflect(hit, ray)`; if non-null, recurse on `reflect.ray` at `depth + 1` and
  accumulate `local + mulColor(reflect.weight, reflectedColor)` (`mulColor` reused from
  `materials/shading.js`), stopping at `maxDepth`. `Renderer` gained an injected `maxDepth` param
  (default 4, mirrors `conventions`) passed through to `traceRay`. Materials still own
  direction/weight; the tracer owns recursion + the depth cap only.
- **R4 landed:** `Renderer` takes N jittered sub-pixel samples per pixel (injected `samples` param,
  default 4), averages the linear colors, and calls `writeColor` once per pixel — the sole
  clamp+gamma site, applied exactly once regardless of sample count. `samples = 1` uses a
  deterministic center sample (no jitter), matching R3's un-jittered output exactly. PLAN-04
  (R1–R4) is now complete.

Related: [[geometry]] · [[materials]] · [[camera-input]] · [[performance]] · [[conventions]]
