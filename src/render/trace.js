import { mulColor } from '../materials/shading.js';

// Closest-hit -> local shade; miss -> background. Colors stay linear (no
// clamp/gamma here — writeColor owns that). Shadow rays live inside
// material.shade() (memory/materials.md); this function does not reimplement
// them.
// Reflection: the material owns direction + weight (`material.reflect()`);
// the tracer owns recursion + the depth limit (memory/materials.md,
// memory/rendering.md). `maxDepth` is an injected render budget (default
// mirrors conventions.md's default of 4) — at/over the cap, only the local
// color is returned.
export function traceRay(ray, scene, lights, background, depth = 0, maxDepth = 4) {
  const hit = scene.intersect(ray);
  if (!hit) return background;

  let color = hit.material.shade(hit, ray, scene, lights);

  if (depth < maxDepth) {
    const reflection = hit.material.reflect(hit, ray);
    if (reflection) {
      const reflectedColor = traceRay(reflection.ray, scene, lights, background, depth + 1, maxDepth);
      color = color.add(mulColor(reflection.weight, reflectedColor));
    }
  }

  return color;
}
