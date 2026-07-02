# TASK — modularity & docs pass
Plan / Phase: PLAN-10 (Quality, Testing & Docs) / Q3

## Objective
Finalize production quality: verify the [[architecture]] dependency rules actually hold in `src/`
(no upward imports), document each module's public entry contract, and confirm [[conventions]] code
style across the tree. This is the close-out pass after all major plans have landed.

## Constraints
- **Verify, don't redesign.** Statically check imports against the `memory/architecture.md`
  dependency order (`math → geometry/materials/camera/engine → render → gameplay → ui`; `perf`/tests
  cross-cut). Any real upward import is a **Mode 4** finding — report it, do not silently "fix" it by
  moving code; raise it as an Open question for the Leader.
- **Add an import-lint regression** (extends the Q1/Q2 harness): a `tests/*.test.js` that scans each
  `src/<module>/**` file's `import` statements and asserts none points upward per the architecture
  graph. Data-driven from the documented order — no new dependency.
- **Docs = entry contracts only.** Document the public surface at each module's `index.js` barrel (or
  a short `src/<module>/README.md`): exported symbols + their one-line contract. Point back to the
  owning `memory/*.md`; **do not duplicate** implementation detail or re-explain algorithms.
- Apply [[conventions]] naming/style only where it's actually violated; no gratuitous churn or
  reformatting. Do NOT change behavior — this pass must leave the Q1+Q2 suites green and unchanged.

## References (read, do not duplicate)
- `memory/architecture.md` (dependency order + `src/` layout + no-upward-import rule) — **read first**
- `memory/conventions.md` (code style: naming, ES modules, no runtime libs)
- `memory/testing.md` (this is the quality-bar close-out), `plans/PLAN-10-quality.md` → Q3
- Each `src/<module>/index.js` barrel (the surfaces you document)

## Expected output
- `tests/architecture.test.js` (create — import-direction lint); module entry-contract docs at each
  `src/*/index.js` / `src/*/README.md` (create/edit, docs only); minimal style fixes only where
  a [[conventions]] rule is broken. Q1+Q2 suites still green.
- Road: `roads/PLAN-10/Q3-modularity-docs.md`.
