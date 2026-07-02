// Public entry contract for src/perf/ — memory/performance.md owns the details.
// Cross-cuts render + engine (memory/architecture.md); imports nothing itself — every
// consumer (Scene, Renderer, DebugOverlay, boot) is duck-typed / injected, never the reverse.
//   BVH               — new BVH(scene) builds a median-split tree over scene.objectBounds();
//                        intersect(ray, tMin, tMax) -> same closest Hit as the linear scan
//                        (output-identical); inject via Scene.setAccelerator(bvh).
//   AdaptiveController — { enabled, targetMs, minScale, maxScale, currentScale };
//                        update(frameMs) -> scale (steps down/up around targetMs, clamped;
//                        enabled=false forces scale 1).
//   ProgressiveRefiner — { startScale, maxScale, step }; reset()/advance() step a render
//                        scale from startScale toward maxScale across still frames.
//   FrameBudget        — { targetMs, window, smoothedMs }; sample(ms) feeds a fixed-size
//                        sliding-window moving average of render-only ms.
export { BVH } from './BVH.js';
export { AdaptiveController } from './AdaptiveController.js';
export { ProgressiveRefiner } from './progressive.js';
export { FrameBudget } from './FrameBudget.js';
