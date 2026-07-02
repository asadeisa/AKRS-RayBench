// Public entry contract for src/engine/ — memory/engine.md owns the details.
// Depends on math only; scenes/colliders/assets arrive as injected/duck-typed refs.
//   Loop          — { update, render }; start()/stop(); rAF-driven, dt clamped to 0.1s;
//                   .timing getter { dt, elapsed, frame, fps }.
//   Entity, World — lightweight entity + component-bag (not full ECS); create/remove/query/each.
//   SceneManager  — opaque scene registry by key: register/setActive/getActive.
//   InputManager  — owns raw DOM listeners + Pointer Lock; poll() -> { forward, backward,
//                   left, right, mouseDeltaX, mouseDeltaY, pointerLocked, fovDelta, interact }
//                   (poll-and-clear deltas).
//   AssetManager  — thin async JSON cache: load(key,url) -> Promise, get(key).
//   EventBus      — synchronous on(type,fn)/off(type,fn)/emit(type,payload).
//   resolve       — resolve(position, desiredMove, radius, colliders) -> newPosition
//                   (sphere-vs-AABB positional correction, i.e. slide).
export { Loop } from './Loop.js';
export { Entity } from './Entity.js';
export { World } from './World.js';
export { SceneManager } from './SceneManager.js';
export { InputManager } from './InputManager.js';
export { AssetManager } from './AssetManager.js';
export { EventBus } from './EventBus.js';
export { resolve } from './Collision.js';
