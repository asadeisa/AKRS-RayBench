// Shared Hit shape: { t, point, normal, material, object }. Every primitive's
// intersect() returns one of these (or null). `material` and `object` are opaque
// here — shading logic belongs to PLAN-03.
export function createHit(t, point, normal, material, object) {
  return { t, point, normal, material, object };
}
