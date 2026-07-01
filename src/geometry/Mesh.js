import { AABB } from '../math/index.js';

// Collection of triangles + own AABB. Linear nearest-hit scan across
// triangles; acceleration structure (BVH) is PLAN-09, not here.
export class Mesh {
  constructor(triangles, material) {
    this.triangles = triangles;
    this.material = material;
    this.bounds = Mesh.computeBounds(triangles);
  }

  static computeBounds(triangles) {
    if (triangles.length === 0) return null;
    let bounds = new AABB(triangles[0].v0, triangles[0].v0);
    for (const tri of triangles) {
      bounds = bounds.expandByPoint(tri.v0);
      bounds = bounds.expandByPoint(tri.v1);
      bounds = bounds.expandByPoint(tri.v2);
    }
    return bounds;
  }

  intersect(ray, tMin, tMax) {
    if (this.triangles.length === 0) return null;
    if (this.bounds && this.bounds.intersectRay(ray) === null) return null;

    let closest = null;
    let closestT = tMax;
    for (const tri of this.triangles) {
      const hit = tri.intersect(ray, tMin, closestT);
      if (hit !== null) {
        closest = hit;
        closestT = hit.t;
      }
    }
    return closest;
  }
}
