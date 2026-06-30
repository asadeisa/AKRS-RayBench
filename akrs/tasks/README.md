# Tasks index — Mirror Forge
A **Task** = one executable objective ("what to build"), small enough that a Worker completes it
without redesigning architecture. Each Task has **exactly one Road** ("what to read/change").
Tasks are generated on demand (Mode 3). References, never duplicated knowledge.

## PLAN-01 — Math Core (generated; M1 active, M2–M4 queued)
| Task | Phase | Road | Status |
|---|---|---|---|
| [vectors-ray](PLAN-01-M1-vectors-ray.md) | M1 | `../roads/PLAN-01-M1-vectors-ray.md` | ACTIVE (current) |
| [matrix4](PLAN-01-M2-matrix4.md) | M2 | `../roads/PLAN-01-M2-matrix4.md` | ACTIVE (queued, needs M1) |
| [quaternion](PLAN-01-M3-quaternion.md) | M3 | `../roads/PLAN-01-M3-quaternion.md` | ACTIVE (queued, needs M2) |
| [bounds](PLAN-01-M4-bounds.md) | M4 | `../roads/PLAN-01-M4-bounds.md` | ACTIVE (queued, needs M1) |

Execution order: M1 → M2 → M3, with M4 anytime after M1. Close out each Road when its work
lands (see `../roads/README.md`).
