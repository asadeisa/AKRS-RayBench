# PLAN-10 — Quality, Testing & Docs
**Capability:** keep the codebase correct, modular, and documented — production quality.
**Depends on:** all plans (cross-cutting; thread it throughout, not only at the end).
**Memory:** [[testing]], [[architecture]], [[conventions]].   **Source:** `docs/data.md` → Quality.

## Phases
### Q1 — Test harness + core unit tests
- Objective: choose the harness (see STATE open question), then unit-test [[math]], [[geometry]] intersections, [[materials]] reflection vectors.
- Outputs: a green deterministic-core suite (highest-ROI tests).
- Depends on: PLAN-01, and harness decision resolved.

### Q2 — Renderer & gameplay regression
- Objective: pixel-sample/hash regression for the tracer; smoke tests for loop, events, save round-trip.
- Outputs: guards against silent visual/logic breakage.
- Depends on: Q1, PLAN-04, PLAN-07.

### Q3 — Modularity & docs pass
- Objective: enforce the dependency rules in [[architecture]] (no upward imports), document module entry contracts, apply [[conventions]] code style.
- Outputs: production-quality, documented, modular codebase.
- Depends on: ongoing; finalize after major plans land.

**Done when:** core suite green, regressions in place, architecture rules hold, contracts documented.
