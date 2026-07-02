# TASK — test harness + core unit tests
Plan / Phase: PLAN-10 (Quality, Testing & Docs) / Q1

## Objective
Stand up the **zero-dependency** test harness (Decided, `memory/testing.md`) and unit-test the
deterministic core — the modules with exact expected values, highest ROI: [[math]] (vectors,
matrices, quaternions, ray), [[geometry]] intersections (primitives + Mesh + `Scene.intersect`),
and [[materials]] reflection vectors. Produce a green suite runnable with one command.

## Constraints
- **No libraries** (runtime or tests). Harness = a small hand-written `tests/harness.js`
  (`assert*` helpers + `test(name, fn)` + `run()` + pass/fail summary) and `tests/run.js` (imports
  every `*.test.js`, runs, exits non-zero on any failure). ES modules, same style as `src/`.
- `node tests/run.js` is the entry. No `package.json`/`node_modules`, no bundler ([[conventions]]).
- Assert against **hand-computed exact values** with a tolerance for floats (e.g. `assertClose`,
  epsilon ~1e-9) — mirror the values already proven in the scratch-assert passes recorded in STATE,
  do not invent new contracts.
- Tests **import the real `src/` modules** unchanged. Do NOT modify `src/` to make it testable; if a
  module genuinely can't be imported under `node`, stop and flag it (Open question) — do not redesign.
- Cover the deterministic core only here; renderer/gameplay regression is Q2, docs/modularity is Q3.

## References (read, do not duplicate)
- `memory/testing.md` (harness Decided; strategy: deterministic core first) — **read first**
- `memory/math.md`, `memory/geometry.md`, `memory/materials.md` (the contracts under test)
- `memory/architecture.md` (`tests/` location + no upward-import rule), `memory/conventions.md`
- `plans/PLAN-10-quality.md` → Q1

## Expected output
- `tests/harness.js`, `tests/run.js` (create); `tests/math.test.js`, `tests/geometry.test.js`,
  `tests/materials.test.js` (create). Green under `node tests/run.js`.
- Road: `roads/PLAN-10/Q1-core-unit-tests.md`.
