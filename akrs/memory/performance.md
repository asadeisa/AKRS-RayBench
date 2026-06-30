# Memory — Performance & Acceleration
Owns: the acceleration structure and the progressive/adaptive rendering techniques. Truth lives
in `src/perf/` (+ hooks inside `src/render/`). Cross-cuts [[rendering]] + [[engine]]; structural
changes here are Mode 4.

## Techniques (from data.md)
- **Object acceleration structure** — BVH over per-object AABBs ([[geometry]]); scene.intersect uses it instead of a linear scan. — **Decided** (data.md "object acceleration structure"); BVH is the **Assumption (Med)** choice.
- **Early ray termination** — stop when remaining reflection weight is negligible or depth limit hit ([[conventions]]).
- **Progressive rendering** — render coarse → refine across frames so the loop stays responsive. — **Decided**.
- **Adaptive resolution** — drop internal render resolution under frame-time pressure, upscale to canvas. — **Decided**.
- **Frame timing** — measure per-frame ms; feed FPS counter + adaptive controller ([[engine]], [[ui]]).

## Contract
- The acceleration structure rebuilds when the active scene changes (room swap), not per frame. — **Assumption (Med)**.
- Performance must not change visual contracts owned by [[rendering]]/[[materials]] — only how fast they are reached.

## Decisions / open
- WebWorker tiling for parallel CPU tracing: **Unknown / future** — only if single-thread misses budget; would be a Mode 4 decision.

Related: [[rendering]] · [[geometry]] · [[engine]] · [[conventions]] · [[ui]]
