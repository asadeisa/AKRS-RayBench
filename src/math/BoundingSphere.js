// Bounding sphere. Boundary-inclusive. Data only — no scene-graph imports.
export class BoundingSphere {
  constructor(center, radius) {
    this.center = center;
    this.radius = radius;
  }

  contains(point) {
    return point.sub(this.center).lengthSq() <= this.radius * this.radius;
  }

  // Analytic quadratic solution. Returns the nearest non-negative hit t, or null.
  intersectRay(ray) {
    const oc = ray.origin.sub(this.center);
    const a = ray.dir.dot(ray.dir);
    const b = 2 * oc.dot(ray.dir);
    const c = oc.dot(oc) - this.radius * this.radius;
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) return null;

    const sqrtDisc = Math.sqrt(discriminant);
    const t1 = (-b - sqrtDisc) / (2 * a);
    const t2 = (-b + sqrtDisc) / (2 * a);

    if (t1 >= 0) return t1;
    if (t2 >= 0) return t2;
    return null;
  }
}
