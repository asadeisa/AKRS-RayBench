# PLAN-04 — Ray Tracer
**Capability:** the renderer — turn a scene + camera into pixels on the canvas.
**Depends on:** PLAN-01, PLAN-02, PLAN-03, PLAN-05 (camera rays).
**Memory:** [[rendering]], [[geometry]], [[materials]], [[conventions]].   **Source:** `docs/data.md` → Rendering.

## Phases
### R1 — Primary rays & framebuffer
- Objective: cast one ray per pixel via `camera.rayFor()`; write background to Canvas `ImageData`.
- Outputs: a visible cleared frame proving camera→pixel path.
- Depends on: PLAN-05/C1, PLAN-02/G3.

### R2 — Closest-hit shading + lights + hard shadows
- Objective: closest hit → local shade → one shadow ray per point light.
- Outputs: a lit, shadowed scene (no reflections yet).
- Depends on: R1, PLAN-03/S2.

### R3 — Recursive reflections + depth limit
- Objective: spawn reflection rays from mirror/metallic, recurse to the depth limit ([[conventions]]).
- Outputs: working mirrors (the game's core visual).
- Depends on: R2, PLAN-03/S3.

### R4 — Image quality
- Objective: anti-aliasing (jittered sub-samples), ambient term, clamp, gamma correction at write-out.
- Outputs: clean, gamma-correct output; no double-gamma.
- Depends on: R3.

**Done when:** a reference scene renders correct reflections + shadows; pixel-sample regression added ([[testing]]).
