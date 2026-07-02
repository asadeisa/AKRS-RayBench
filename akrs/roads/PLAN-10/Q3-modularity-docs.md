# ROAD — modularity & docs pass
Status: DONE + superseded by memory/testing.md
Task: Enforce architecture import rules (import-lint test), document module entry contracts, apply conventions style.
Plan / Phase: PLAN-10 / Q3   (deps Q1+Q2; close-out after all major plans land)

## Context to load (read order)
1. `../../memory/architecture.md` (dependency order + `src/` layout + **no upward import** rule) — read first
2. `../../memory/conventions.md` (naming, ES modules, no runtime libs)
3. `../../memory/testing.md` (quality-bar close-out) · `../../plans/PLAN-10-quality.md` → Q3
4. `tests/harness.js` (Q1 — extend); each `src/*/index.js` barrel (the surfaces you document + lint)

## Expected files (change scope)
- `tests/architecture.test.js` — create (data-driven from the architecture graph: scan each
  `src/<module>/**.js` `import` path; assert none imports a **higher** module per the order; `perf`
  and `tests` are cross-cutting exceptions)
- `src/*/index.js` **or** `src/*/README.md` — create/edit (**docs only**: list exported symbols + a
  one-line contract each; link back to the owning `memory/*.md`; no algorithm re-explanation)
- Minimal `src/` style fixes — edit **only** where a `conventions` rule is actually violated (naming/casing)
- (no behavior changes; Q1+Q2 suites must stay green and unmodified in intent)

## Boundaries
- Do: treat this as a **verification + documentation** pass; drive the lint from the documented
  dependency order; keep docs at the entry-contract altitude (point to Memory for depth).
- Do NOT: refactor module boundaries, "fix" an upward import by relocating code, or reformat for taste.
  A genuine upward import or a needed boundary change is **Mode 4** — record it in `../STATE.md` →
  Open questions and stop; the Leader owns that call, not the Worker.

## Acceptance
- `node tests/run.js` (now incl. `architecture.test.js`) exits 0 — no upward imports across `src/`.
- Every `src/<module>` exposes a documented public entry contract (exported symbols + one-liners)
  pointing to its `memory/*.md`; any conventions violation found is either fixed (style-only) or, if
  it implies a design change, logged as an Open question.

## Close-out (when it lands)
Update `../../STATE.md` (Done; **PLAN-10 complete → all plans done**; timestamp+author); set this Road
`DONE + superseded by memory/testing.md`; confirm `../../memory/testing.md` + `../../memory/architecture.md`
reflect the shipped lint + docs. This closes the last plan — reconcile every Road/Memory as final.
