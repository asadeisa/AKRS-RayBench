// Reflecting line-of-sight trace (memory/gameplay.md — Decided PLAN-07/P3).
// Reuses scene.intersect + material.reflect + the maxDepth cap — never
// reimplements intersection/reflection (mirrors src/render/trace.js's
// traceRay recursion pattern, but reports hits instead of shading a color).
export function traceBeam(ray, scene, maxDepth = 4) {
  const hits = [];
  let currentRay = ray;
  let depth = 0;

  while (depth <= maxDepth) {
    const hit = scene.intersect(currentRay);
    if (!hit) return { hits, terminal: null };
    hits.push(hit);

    if (depth === maxDepth) return { hits, terminal: hit };

    const reflection = hit.material.reflect(hit, currentRay);
    if (!reflection) return { hits, terminal: hit };

    currentRay = reflection.ray;
    depth += 1;
  }

  return { hits, terminal: hits[hits.length - 1] ?? null };
}
