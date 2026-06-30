# Memory — Architecture (Dependency Memory)
Owns: the module dependency graph and the canonical source layout. Single source of truth for
"what depends on what" and "where a module lives". References only — no implementation.

## Dependency order (low → high; arrows = "depends on")
```
math ─┬─> geometry ─┐
      ├─> materials ─┼─> ray-tracer ─┐
      ├─> camera ────┘                ├─> gameplay ──> ui
      └─> engine ─────────────────────┘
                  performance  ⟂ (cross-cuts ray-tracer + engine)
                  quality      ⟂ (cross-cuts every module)
```
- `math` depends on nothing (foundation). Build it first.
- `ray-tracer` consumes `geometry` + `materials` + `camera`.
- `gameplay` consumes `engine` + `geometry` + `camera` + `ray-tracer`.
- `performance` and `quality` are cross-cutting (Mode 4 territory when structural).

## Canonical `src/` layout — **Assumption (Med)**, confirm before first Road lands
```
index.html          # canvas + module entry
src/
  math/             # PLAN-01  → memory/math.md
  geometry/         # PLAN-02  → memory/geometry.md
  materials/        # PLAN-03  → memory/materials.md
  render/           # PLAN-04  → memory/rendering.md
  camera/           # PLAN-05  → memory/camera-input.md
  engine/           # PLAN-06  → memory/engine.md
  game/             # PLAN-07  → memory/gameplay.md
  ui/               # PLAN-08  → memory/ui.md
  perf/             # PLAN-09  → memory/performance.md
  main.js           # boot: assemble engine + scene + renderer + loop
tests/              # PLAN-10  → memory/testing.md
```

## Rules of record
- No module may import "upward" against the arrows above. A new upward dependency is a Mode 4
  (architecture) decision, not a Worker decision.
- Module boundaries = ES module files exporting plain classes/functions. No globals.

Related: [[conventions]] · [[math]] · [[rendering]] · [[engine]] · [[testing]]
