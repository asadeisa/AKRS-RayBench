import { createHit } from './Hit.js';

const EPSILON = 1e-8;

export class Triangle {
  constructor(v0, v1, v2, material) {
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.material = material;
  }

  // Moller-Trumbore.
  intersect(ray, tMin, tMax) {
    const edge1 = this.v1.sub(this.v0);
    const edge2 = this.v2.sub(this.v0);
    const pvec = ray.dir.cross(edge2);
    const det = edge1.dot(pvec);
    if (Math.abs(det) < EPSILON) return null; // parallel / degenerate

    const invDet = 1 / det;
    const tvec = ray.origin.sub(this.v0);
    const u = tvec.dot(pvec) * invDet;
    if (u < 0 || u > 1) return null;

    const qvec = tvec.cross(edge1);
    const v = ray.dir.dot(qvec) * invDet;
    if (v < 0 || u + v > 1) return null;

    const t = edge2.dot(qvec) * invDet;
    if (t < tMin || t > tMax) return null;

    const point = ray.at(t);
    const normal = edge1.cross(edge2).normalize();
    return createHit(t, point, normal, this.material, this);
  }
}
