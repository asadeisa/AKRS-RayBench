# PLAN-09 — Performance & Acceleration
**Capability:** make the CPU tracer fast enough to be interactive — without changing visuals.
**Depends on:** PLAN-04, PLAN-06; consumes AABBs from PLAN-02.
**Memory:** [[performance]], [[rendering]].   **Source:** `docs/data.md` → Performance.

## Phases
### F1 — Acceleration structure
- Objective: BVH over per-object AABBs; `scene.intersect` uses it; early ray termination on low weight/depth.
- Outputs: sub-linear hit queries; same pixels, fewer tests.
- Depends on: PLAN-02/G4, PLAN-04/R2.

### F2 — Progressive + adaptive rendering
- Objective: coarse→refine across frames; drop internal resolution under frame-time pressure, upscale to canvas.
- Outputs: responsive loop even on heavy scenes.
- Depends on: F1, PLAN-06/E1.

### F3 — Frame timing & budgets
- Objective: per-frame ms measurement feeding the adaptive controller + FPS/debug overlay.
- Outputs: a stable target frame budget; quality scales to hit it.
- Depends on: F2.

**Done when:** the reference scene holds an interactive frame rate with identical output to the un-accelerated path (regression-checked, [[testing]]).
