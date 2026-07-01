import { createHit } from './Hit.js';

export class Plane {
  constructor(point, normal, material) {
    this.point = point;
    this.normal = normal;
    this.material = material;
  }

  intersect(ray, tMin, tMax) {
    const denom = ray.dir.dot(this.normal);
    if (Math.abs(denom) < 1e-8) return null; // parallel

    const t = this.point.sub(ray.origin).dot(this.normal) / denom;
    if (t < tMin || t > tMax) return null;

    const point = ray.at(t);
    // Double-sided: the stored normal is returned as-is, whichever face was hit.
    return createHit(t, point, this.normal, this.material, this);
  }
}
