import { Vector3 } from '../math/index.js';
import { mulColor } from '../materials/shading.js';

// Reflection-weight cutoff below which further recursion is skipped as a
// negligible contribution — output-identical within epsilon
// (memory/performance.md — early ray termination). Assumption (Med): ~1/255
// in linear terms, promotable to a conventions.md budget if it needs one
// canonical owner.
export const EARLY_TERM_EPS = 1 / 255;

// Closest-hit -> local shade; miss -> background. Colors stay linear (no
// clamp/gamma here — writeColor owns that). Shadow rays live inside
// material.shade() (memory/materials.md); this function does not reimplement
// them.
// Reflection: the material owns direction + weight (`material.reflect()`);
// the tracer owns recursion + the depth limit (memory/materials.md,
// memory/rendering.md). `maxDepth` is an injected render budget (default
// mirrors conventions.md's default of 4) — at/over the cap, only the local
// color is returned. `weight` tracks the accumulated reflection weight along
// this ray path (starts at 1,1,1) purely to decide early termination; it
// does not change how a contribution is combined into `color`.
export function traceRay(ray, scene, lights, background, depth = 0, maxDepth = 4, weight = new Vector3(1, 1, 1)) {
  const hit = scene.intersect(ray);
  if (!hit) return background;

  let color = hit.material.shade(hit, ray, scene, lights);

  if (depth < maxDepth) {
    const reflection = hit.material.reflect(hit, ray);
    if (reflection) {
      const nextWeight = mulColor(weight, reflection.weight);
      const maxComponent = Math.max(nextWeight.x, nextWeight.y, nextWeight.z);
      if (maxComponent >= EARLY_TERM_EPS) {
        const reflectedColor = traceRay(reflection.ray, scene, lights, background, depth + 1, maxDepth, nextWeight);
        color = color.add(mulColor(reflection.weight, reflectedColor));
      }
    }
  }

  return color;
}
