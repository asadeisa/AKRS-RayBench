import { createHit } from './Hit.js';

export class Sphere {
  constructor(center, radius, material) {
    this.center = center;
    this.radius = radius;
    this.material = material;
  }

  intersect(ray, tMin, tMax) {
    const oc = ray.origin.sub(this.center);
    const a = ray.dir.dot(ray.dir);
    const b = 2 * oc.dot(ray.dir);
    const c = oc.dot(oc) - this.radius * this.radius;
    const disc = b * b - 4 * a * c;
    if (disc < 0) return null;

    const sqrtDisc = Math.sqrt(disc);
    const t1 = (-b - sqrtDisc) / (2 * a);
    const t2 = (-b + sqrtDisc) / (2 * a);

    // Nearest root first; falls through to the far root so a ray starting
    // inside the sphere still returns its forward (exit) hit.
    let t;
    if (t1 >= tMin && t1 <= tMax) {
      t = t1;
    } else if (t2 >= tMin && t2 <= tMax) {
      t = t2;
    } else {
      return null;
    }

    const point = ray.at(t);
    const normal = point.sub(this.center).scale(1 / this.radius);
    return createHit(t, point, normal, this.material, this);
  }
}
