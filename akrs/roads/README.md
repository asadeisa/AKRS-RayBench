# Roads — generated on demand (Phase B / Mode 3)
No Roads exist yet. A Road is the **execution contract** for one Task and is created **only when
that work is requested** — never in advance. Exactly **one Road per Task**; the Leader chooses
it, the Worker follows it.

Naming: `roads/<PLAN>-<PHASE>-<slug>.md`, e.g. `roads/PLAN-01-M1-vector3-ray.md`.

## Road template (fill at generation time)
```markdown
# ROAD — <task slug>
Status: ACTIVE        # ACTIVE | DONE + superseded by <memory file>
Task: <one-line objective>
Plan / Phase: <PLAN-xx> / <phase id>

## Context to load (read order)
1. <memory file(s) to read first>
2. <plan/phase>
3. <existing source files, if any>

## Expected files (change scope)
- <path/to/file>  — <create | edit>
- … (nothing outside this list)

## Boundaries
- Do: <the exact scope>
- Do NOT: <explicitly out of scope; redesign; touch other modules>

## Acceptance
- <how we know it's done — tests/behavior>
```

## Close-out (mandatory when the work lands)
1. Update `../STATE.md` (Done / Next / timestamp+author / any new Open questions).
2. Reconcile this Road: set `Status: DONE + superseded by <memory>` **or** refresh *Expected files*.
3. Update the owning Memory if a reusable fact changed owner/location.
Keep Road and Memory in agreement — a stale `ACTIVE` Road is a drift defect.
