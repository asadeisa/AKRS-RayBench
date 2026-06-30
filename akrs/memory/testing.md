# Memory — Testing & Quality
Owns: the test strategy and harness. Truth lives in `tests/`. Cross-cuts every module;
references [[architecture]] for module boundaries.

## Strategy (from data.md "unit tests", "production-quality code")
- **Unit-test the deterministic core first**: [[math]] (vectors/matrices/quaternions/ray),
  [[geometry]] intersections, [[materials]] reflection vectors. These have exact expected values → highest ROI.
- **Snapshot/regression** for the renderer: trace a fixed tiny scene, compare a hash or a few sampled pixels against a golden — guards the pipeline without a full image diff. — **Assumption (Med)**.
- **Smoke checks** for engine/gameplay: loop ticks, event bus fires, save round-trips.

## Harness — **Unknown** (open in STATE)
- Option A: zero-dependency in-browser/Node test runner (honors "no libraries" strictly).
- Option B: Vitest as a **dev-only** dependency (runtime ships no libraries; tests may use one).
- Decide before PLAN-10 lands; record the choice here as **Decided** once confirmed.

## Quality bar
- Modular architecture per [[architecture]] (no upward deps, one owner per concept).
- Public contracts documented at the module entry; conventions per [[conventions]].

Related: [[architecture]] · [[math]] · [[geometry]] · [[rendering]]
