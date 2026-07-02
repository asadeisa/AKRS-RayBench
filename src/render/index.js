// Public entry contract for src/render/ — memory/rendering.md owns the details.
// Depends on math, geometry, materials, camera.
//   Renderer  — DOM-free pixel loop; { width, height, background, gamma, maxDepth, samples }
//              constructor params; render(camera, scene) -> { width, height, data:
//              Uint8ClampedArray } (RGBA8); setScale(scale) resizes the internal buffer
//              (PLAN-09 adaptive-resolution seam — scale 1 is byte-identical).
//   writeColor — linear Vector3 -> clamp[0,1] -> gamma -> x255 -> RGBA8 write (single
//              clamp+gamma site).
//   traceRay  — traceRay(ray, scene, lights, background, depth, maxDepth, weight) -> Vector3
//              (linear color); closest hit -> material.shade(); reflection recursion via
//              material.reflect(), depth-capped, with early termination below
//              EARLY_TERM_EPS (memory/performance.md).
export { Renderer } from './Renderer.js';
export { writeColor } from './writeColor.js';
export { traceRay } from './trace.js';
