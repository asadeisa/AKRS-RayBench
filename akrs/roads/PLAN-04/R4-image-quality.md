# ROAD — image quality (AA, ambient, clamp, gamma)
Status: DONE + superseded by memory/rendering.md
Task: N jittered sub-samples per pixel averaged in linear space + wired ambient + single clamp→gamma write-out.
Plan / Phase: PLAN-04 / R4   (needs R3 — completes PLAN-04)

## Context to load (read order)
1. `../../memory/rendering.md` (AA in pipeline; single clamp+gamma at write-out; no double gamma)
2. `../../memory/conventions.md` (AA supersampling; gamma 2.2; ambient/budget ownership)
3. `../../memory/materials.md` (`shade` reads `scene.ambient`)
4. `../../plans/PLAN-04-ray-tracer.md` → R4
5. `src/render/Renderer.js`, `src/render/writeColor.js`, `src/render/trace.js`

## Expected files (change scope)
- `src/render/Renderer.js`   — edit (pixel loop: N jittered sub-pixel offsets → `camera.rayFor` per
  sample → average the linear `Vector3` colors → one `writeColor` per pixel; sample count injected)
- (optional) `src/render/writeColor.js` — edit only if gamma needs to be an injected param
- (nothing outside `src/render/`)

## Boundaries
- Do: jitter sub-pixel sample positions; average colors in **linear** space before the single write-out.
- Do: ensure the scene/render config supplies `scene.ambient` for `shade`; if its numeric default is
  Unknown, surface it in `../../STATE.md` → Open questions — do not invent a value.
- Do NOT: apply gamma per-sample or twice; `writeColor` stays the sole clamp+gamma site.
- Do NOT: add glossy/roughness jitter (deferred to PLAN-09) or adaptive sampling (PLAN-09).

## Acceptance
- With samples=1 output matches R3; with samples>1 a high-contrast edge (object vs background) shows
  averaged intermediate values (visibly anti-aliased), not a hard stair-step.
- A known mid-gray linear color still round-trips through gamma exactly once (no double-gamma regression).
- Interim scratch-assert check (edge-pixel averaging + single-gamma round-trip); formal tests deferred to PLAN-10.

## Close-out (when it lands)
Update `../../STATE.md`; set this Road `DONE + superseded by memory/rendering.md`. **PLAN-04 complete
when R1–R4 land** — a reference scene renders correct reflections + shadows. Hand back to Leader.
