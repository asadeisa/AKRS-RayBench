import { Vector3 } from './Vector3.js';

// Axis-aligned bounding box. Boundary-inclusive. Data only — no scene-graph imports.
export class AABB {
  constructor(min, max) {
    this.min = min;
    this.max = max;
  }

  contains(point) {
    return (
      point.x >= this.min.x && point.x <= this.max.x &&
      point.y >= this.min.y && point.y <= this.max.y &&
      point.z >= this.min.z && point.z <= this.max.z
    );
  }

  expandByPoint(point) {
    return new AABB(
      new Vector3(
        Math.min(this.min.x, point.x),
        Math.min(this.min.y, point.y),
        Math.min(this.min.z, point.z)
      ),
      new Vector3(
        Math.max(this.max.x, point.x),
        Math.max(this.max.y, point.y),
        Math.max(this.max.z, point.z)
      )
    );
  }

  union(other) {
    return new AABB(
      new Vector3(
        Math.min(this.min.x, other.min.x),
        Math.min(this.min.y, other.min.y),
        Math.min(this.min.z, other.min.z)
      ),
      new Vector3(
        Math.max(this.max.x, other.max.x),
        Math.max(this.max.y, other.max.y),
        Math.max(this.max.z, other.max.z)
      )
    );
  }

  // Slab test. Returns the entry t, or null on a miss / box behind the ray.
  // A ray starting inside the box returns t=0.
  intersectRay(ray) {
    let tMin = -Infinity;
    let tMax = Infinity;

    for (const axis of ['x', 'y', 'z']) {
      const origin = ray.origin[axis];
      const dir = ray.dir[axis];
      const min = this.min[axis];
      const max = this.max[axis];

      if (dir === 0) {
        if (origin < min || origin > max) return null;
        continue;
      }

      let t1 = (min - origin) / dir;
      let t2 = (max - origin) / dir;
      if (t1 > t2) {
        [t1, t2] = [t2, t1];
      }
      tMin = Math.max(tMin, t1);
      tMax = Math.min(tMax, t2);
      if (tMin > tMax) return null;
    }

    if (tMax < 0) return null;
    return tMin < 0 ? 0 : tMin;
  }
}
