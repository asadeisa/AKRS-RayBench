# Memory — Testing & Quality
Owns: the test strategy and harness. Truth lives in `tests/`. Cross-cuts every module;
references [[architecture]] for module boundaries.

## Strategy (from data.md "unit tests", "production-quality code")
- **Unit-test the deterministic core first**: [[math]] (vectors/matrices/quaternions/ray),
  [[geometry]] intersections, [[materials]] reflection vectors. These have exact expected values → highest ROI.
- **Snapshot/regression** for the renderer: trace a fixed tiny scene, compare a hash or a few sampled pixels against a golden — guards the pipeline without a full image diff. — **Assumption (Med)**.
- **Smoke checks** for engine/gameplay: loop ticks, event bus fires, save round-trips.

## Harness — **Decided** (2026-07-02): zero-dependency Node/browser runner
- A tiny hand-written harness in `tests/` (`harness.js` = assert helpers + `test()`/`run()` +
  a pass/fail summary; `run.js` = entry that runs every `*.test.js` and exits non-zero on failure).
  Chosen over Vitest to honor the strict "no libraries" rule (runtime **and** tests ship zero deps)
  and to match every prior verification pass (scratch-asserts + `node --check`).
- Runner: `node tests/run.js` (ES modules, same as `src/`). No `package.json`/`node_modules`, no
  bundler — consistent with [[conventions]] (serve ES modules directly).
- Rejected: Vitest (dev-only dep) — would introduce `package.json` + a dev-tooling assumption the
  project has deliberately avoided.

## Quality bar
- Modular architecture per [[architecture]] (no upward deps, one owner per concept).
- Public contracts documented at the module entry; conventions per [[conventions]].

## Landed (Q1 — core unit tests)
- Shipped exactly the harness API decided above: `tests/harness.js` (`test(name, fn)`, `assert`,
  `assertEqual`, `assertClose(a, b, eps=1e-9)`, `assertThrows`, `run()` → prints per-test pass/fail +
  a summary, returns a fail count). `tests/run.js` imports every `*.test.js`, calls `run()`,
  `process.exit(fails ? 1 : 0)`.
- `tests/math.test.js` (21 tests: Vector2, Vector3, Ray, Matrix4, Quaternion — hand-computed values
  matching the M1–M4 scratch-assert passes, e.g. `rotate(+Y,90°)` sends `+X→−Z`, `lookAt` puts a
  same-axis target at `(0,0,-5)` in view space, `perspective` near/far → NDC z = −1/1 via
  `transformPoint`'s built-in divide, quaternion↔matrix agreement, slerp midpoint = half-angle).
- `tests/geometry.test.js` (14 tests: Sphere/Plane/Box/Triangle/Mesh `intersect` incl. inside-origin
  fall-through and nearest-hit selection, `Scene.intersect` closest-hit across two `Node`s built via
  `Scene.build()`). Confirms `Scene.intersect`/renderable geometry does **not** apply `Node`'s world
  transform to the ray — geometry is intersected in whatever space it was constructed in (consistent
  with the PLAN-07 mirror-orientation decision in `memory/gameplay.md`).
- `tests/materials.test.js` (8 tests: Mirror/Metallic `reflect()` direction + weight, Diffuse/Emissive
  `reflect() === null`, Emissive `shade()` ignores scene/lights, Mirror's inherited ambient-only
  `shade()`).
- `node tests/run.js` → 43/43 green, exits 0; verified a deliberately wrong expected value makes a
  test fail and the run exit 1 (harness actually gates, not just logs) before reverting the change.
- Tests import the real `src/` modules unchanged — no `src/` edits were needed to make anything
  testable. **PLAN-10/Q1 complete — unblocks Q2.**

## Landed (Q2 — renderer & gameplay regression)
- `tests/render.test.js`: a fixed tiny scene (one red `Diffuse` sphere + one point light, `Camera`
  at a fixed position, `Renderer` at 8×6, `samples: 1` for the deterministic center-jitter path) run
  through the real `Renderer.render(camera, scene)`; hashed with a hand-written FNV-1a over the
  `Uint8ClampedArray` and asserted against a committed `GOLDEN_HASH` constant. Also asserts the lit
  center pixel differs from the background corner pixel, alpha is 255 throughout, and two renders of
  the same fixed scene are byte-identical. Verified (then reverted) that corrupting `GOLDEN_HASH`
  fails the suite and exits 1 — the hash is a real guard, not a decorative constant.
- `tests/perf.test.js`: **BVH-vs-linear equality** — a 10-sphere scene, a fixed deterministic grid of
  rays (no `Math.random`) compared through `scene.intersect` with `BVH` set vs. unset (same `t` +
  same hit object), plus an inside-a-sphere ray and a `setAccelerator(null)` round-trip. **Early
  termination** — a two-facing-`Mirror`-`Plane` fixture: a weak reflector (0.02) barely differs
  between `maxDepth=2` and `maxDepth=20` (within a 0.01 tolerance); a strong mirror pair (0.95) still
  accumulates meaningfully more color at `maxDepth=20` than `maxDepth=3` — both now **automated**,
  no longer only scratch-asserted. **Scale/adaptive math** — `Renderer.setScale(1)` byte-identical to
  an untouched renderer, `setScale(0.5)` halves `width`/`height`; `AdaptiveController` step-down/up +
  clamp behavior and the `enabled=false` override; `FrameBudget`'s sliding-window average (explicit
  window-eviction case + the "single spike shifts by ~1/window" case).
- `tests/engine.test.js`: `Loop` exercised via a stubbed `requestAnimationFrame`/`cancelAnimationFrame`/
  `performance.now()` (no wall clock) — a simulated 5s stall clamps `dt` to 0.1s, `update()` always
  precedes `render()` on a tick with `timing` accumulating correctly across two ticks, `stop()` calls
  `cancelAnimationFrame` and prevents further ticks. `EventBus`: multi-handler `emit`, `off()` removes
  only the targeted handler, emitting an unregistered type is a no-op.
- `tests/gameplay.test.js`: `save`/`load` round-trip through a stubbed in-memory `localStorage` (no
  DOM); `load()` returns `null` (not a throw) with no save, corrupt JSON, or a version mismatch;
  `clear()` removes the save; `restart()` un-picks collectibles, resets switches off and doors closed,
  and calls `roomManager.enter(initialRoom)` via a stub room manager.
- `tests/run.js` extended to import all four new suites alongside Q1's three. `node tests/run.js` →
  **69/69 green, exits 0**. No `src/` files were touched — Q2 builds guards only, per its boundary; no
  new bugs surfaced beyond the already-recorded blown-out reference level (STATE → Open questions).
  **PLAN-10/Q2 complete — unblocks Q3.**

## Landed (Q3 — modularity & docs pass, close-out)
- `tests/architecture.test.js`: a data-driven import-direction lint (scans every `src/<module>/**.js`
  file's cross-module `import`/re-export specifiers against the [[architecture]] dependency order;
  `perf` is the documented cross-cutting exception). **Zero upward imports found** — every module
  already honored the graph via injected/duck-typed refs (no code changes needed). Includes a small
  unit check of the `isUpwardImport` rule itself (both a synthetic violation and a synthetic
  allowed case), plus the real full-tree scan.
- Every `src/*/index.js` barrel now carries a header doc: exported symbols + one-line contracts,
  pointing back to its owning `memory/*.md` (docs-only edits, no export/behavior changes).
- Conventions style pass: scanned for `var` usage and non-SCREAMING_SNAKE top-level constants —
  **no violations found**; the tree was already consistent (PascalCase types, camelCase members,
  SCREAMING_SNAKE budgets like `DT_MAX`, `EARLY_TERM_EPS`, `SAVE_KEY`/`SAVE_VERSION`). No style edits
  were needed.
- `node tests/run.js` → **72/72 green, exits 0** (68 prior + 3 architecture-lint tests + no change to
  Q1/Q2 suites — extended, not rewritten). **PLAN-10/Q3 complete — PLAN-10 (Quality, Testing & Docs)
  is now complete, closing out the last plan.**

Related: [[architecture]] · [[math]] · [[geometry]] · [[rendering]]
