# Memory — Engine Runtime
Owns: entity system, managers, game loop, event system, collision. Truth lives in `src/engine/`.
Consumes [[math]]; consumed by [[gameplay]], [[camera-input]], [[ui]].

## Contracts (from data.md)
- **Game loop** — `requestAnimationFrame`-driven; separates update(dt) from render. Frame timing exposed for [[performance]] + FPS counter ([[ui]]). — **Decided**/Assumption.
- **Entity system** — entities own components/state; systems iterate entities. — **Decided** (data.md "entity system"). Full ECS vs lightweight entity+components: **Assumption (Med)** start lightweight.
- **Scene manager** — owns active [[geometry]] scene graph + room swapping ([[gameplay]]).
- **Input manager** — normalizes keyboard/mouse/pointer-lock into an input state polled by camera + gameplay. Owns the raw event listeners; [[camera-input]] consumes the normalized state.
- **Asset manager** — loads/caches scene + level data (and any textures/meshes). Format **Unknown** (see STATE) — likely JSON level descriptors. **Assumption (Low)**.
- **Event system** — pub/sub bus for decoupled gameplay signals (switch toggled, door opened, level won).
- **Collision detection** — player-vs-world for movement; AABB / sphere casts reusing [[math]] bounds. No external physics engine (data.md). Resolution = slide along surfaces. **Assumption (Med)**.

## Decisions / open
- Determinism: fixed-step update vs variable dt — **Assumption (Med)** variable dt with clamp; revisit if physics jitter appears.

Related: [[gameplay]] · [[camera-input]] · [[ui]] · [[performance]] · [[math]]
