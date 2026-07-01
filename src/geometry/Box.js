import { Vector3 } from '../math/index.js';
import { createHit } from './Hit.js';

// Axis-aligned box. Slab test tracks which face (min or max, per axis) produced
// the near/far crossing so the correct face normal can be returned.
export class Box {
  constructor(min, max, material) {
    this.min = min;
    this.max = max;
    this.material = material;
  }

  intersect(ray, tMin, tMax) {
    let tNear = -Infinity;
    let tFar = Infinity;
    let nearAxis = null;
    let nearSign = 0;
    let farAxis = null;
    let farSign = 0;

    for (const axis of ['x', 'y', 'z']) {
      const origin = ray.origin[axis];
      const dir = ray.dir[axis];
      const lo = this.min[axis];
      const hi = this.max[axis];

      if (dir === 0) {
        if (origin < lo || origin > hi) return null;
        continue;
      }

      let t1 = (lo - origin) / dir;
      let t2 = (hi - origin) / dir;
      let sign1 = -1; // min face -> outward normal points toward -axis
      let sign2 = 1; // max face -> outward normal points toward +axis
      if (t1 > t2) {
        [t1, t2] = [t2, t1];
        [sign1, sign2] = [sign2, sign1];
      }

      if (t1 > tNear) {
        tNear = t1;
        nearAxis = axis;
        nearSign = sign1;
      }
      if (t2 < tFar) {
        tFar = t2;
        farAxis = axis;
        farSign = sign2;
      }

      if (tNear > tFar) return null;
    }

    // Ray starting inside the box: the entry face is behind tMin, so fall
    // forward to the exit face (mirrors Sphere's inside-origin behavior).
    let t;
    let axisHit;
    let signHit;
    if (nearAxis !== null && tNear >= tMin && tNear <= tMax) {
      t = tNear;
      axisHit = nearAxis;
      signHit = nearSign;
    } else if (farAxis !== null && tFar >= tMin && tFar <= tMax) {
      t = tFar;
      axisHit = farAxis;
      signHit = farSign;
    } else {
      return null;
    }

    const point = ray.at(t);
    const normal = new Vector3(
      axisHit === 'x' ? signHit : 0,
      axisHit === 'y' ? signHit : 0,
      axisHit === 'z' ? signHit : 0
    );
    return createHit(t, point, normal, this.material, this);
  }
}
