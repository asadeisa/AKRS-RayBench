# TASK — image quality (AA, ambient, clamp, gamma)
Plan / Phase: PLAN-04 (Ray Tracer) / R4

## Objective
Finish the image path: anti-aliasing via N jittered sub-pixel samples averaged per pixel, a wired
ambient term, and the single clamp→gamma→×255 write-out (no double gamma). Result: clean,
gamma-correct output.

## Constraints
- Edit the Renderer's pixel loop to take N jittered sub-samples per pixel, average the **linear**
  `Vector3` colors, then call `writeColor` **once** per pixel (clamp+gamma stay only at write-out).
- Sample count + gamma (2.2) are render budgets owned by `conventions`; read them as injected params — do NOT redefine.
- Ambient: ensure the scene/render config supplies the ambient value `material.shade()` reads
  (`scene.ambient`). If the numeric default is still Unknown, surface it in `STATE.md` → Open
  questions — do not invent a value.
- Confirm no double gamma anywhere (writeColor is the sole gamma site).
- Roughness/glossy jitter stays out of scope (deferred to PLAN-09).

## References (read, do not duplicate)
- `memory/rendering.md` (AA in pipeline; single clamp+gamma at write-out)
- `memory/conventions.md` (AA supersampling; gamma 2.2; ambient/budget ownership)
- `memory/materials.md` (shade reads `scene.ambient`)
- `plans/PLAN-04-ray-tracer.md` → R4

## Expected output
- Edit: `src/render/Renderer.js` (AA sample loop + average); ensure ambient wired via scene/config.
- Road: `roads/PLAN-04/R4-image-quality.md`.
