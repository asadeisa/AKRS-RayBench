# ROAD — test harness + core unit tests
Status: DONE + superseded by memory/testing.md
Task: Zero-dep harness + unit tests for the deterministic core (math, geometry intersections, materials reflection).
Plan / Phase: PLAN-10 / Q1   (deps PLAN-01 landed; harness Decided 2026-07-02)

## Context to load (read order)
1. `../../memory/testing.md` (harness **Decided**: zero-dep `tests/` runner; deterministic-core-first strategy)
2. `../../memory/math.md`, `../../memory/geometry.md`, `../../memory/materials.md` (the exact contracts under test)
3. `../../memory/architecture.md` (`tests/` lives at repo root; no upward imports) · `../../memory/conventions.md`
4. `../../plans/PLAN-10-quality.md` → Q1
5. `src/math/index.js`, `src/geometry/index.js`, `src/materials/index.js` (the real modules you import)

## Expected files (change scope)
- `tests/harness.js`         — create (`assert`, `assertEqual`, `assertClose(a,b,eps=1e-9)`,
  `assertThrows`; `test(name, fn)` registers; `run()` executes all, prints per-test + summary, returns
  a fail count)
- `tests/run.js`             — create (imports every `*.test.js`, calls `run()`, `process.exit(fails ? 1 : 0)`)
- `tests/math.test.js`       — create (Vector2/3, Ray, Matrix4, Quaternion — hand-computed values)
- `tests/geometry.test.js`   — create (Sphere/Plane/Box/Triangle/Mesh `intersect`, `Scene.intersect` closest-hit)
- `tests/materials.test.js`  — create (reflection direction + weight for Mirror/Metallic; Diffuse/Emissive `reflect()===null`)
- (nothing under `src/` — tests import the real modules unchanged)

## Boundaries
- Do: assert the **same exact values** already proven in the M1–M4 / G1–G4 / S1–S3 scratch-assert
  passes (see STATE → Done); use `assertClose` for floats; keep every test deterministic.
- Do NOT: modify any `src/` module to make it testable, add any dependency/`package.json`/bundler,
  or write renderer/gameplay/engine tests (those are Q2). If a `src/` module cannot be imported under
  `node` as-is, STOP and record it in `../STATE.md` → Open questions — do not redesign it.

## Acceptance
- `node tests/run.js` runs all three suites, prints a summary, and **exits 0** (all green).
- Each core module has ≥1 test per public contract (intersections, reflection vectors, matrix/quaternion
  identities) matching hand-computed values; a deliberately wrong expected value makes the run exit 1
  (harness actually fails, not just logs).

## Close-out (when it lands)
Update `../../STATE.md` (Done / Next: Q2; timestamp+author); set this Road
`DONE + superseded by memory/testing.md` or refresh Expected files; keep `../../memory/testing.md`
in agreement (record the shipped harness API + `tests/` layout). **Q1 unblocks Q2.**
