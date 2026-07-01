import { Matrix4 } from './Matrix4.js';

// Unit quaternion for rotations: x,y,z (vector part) + w (scalar part).
// toMatrix4() agrees with Matrix4.rotate(axis,theta) for the same rotation (memory/math.md).
export class Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  // axis must be normalized; theta in radians.
  static fromAxisAngle(axis, theta) {
    const half = theta / 2;
    const s = Math.sin(half);
    return new Quaternion(axis.x * s, axis.y * s, axis.z * s, Math.cos(half));
  }

  // Hamilton product: this * other (apply other's rotation first, then this).
  multiply(other) {
    const { x: x1, y: y1, z: z1, w: w1 } = this;
    const { x: x2, y: y2, z: z2, w: w2 } = other;
    return new Quaternion(
      w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2,
      w1 * y2 - x1 * z2 + y1 * w2 + z1 * x2,
      w1 * z2 + x1 * y2 - y1 * x2 + z1 * w2,
      w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2
    );
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
  }

  normalize() {
    const len = this.length();
    return new Quaternion(this.x / len, this.y / len, this.z / len, this.w / len);
  }

  toMatrix4() {
    const { x, y, z, w } = this;
    return new Matrix4([
      1 - 2 * (y * y + z * z), 2 * (x * y + w * z), 2 * (x * z - w * y), 0,
      2 * (x * y - w * z), 1 - 2 * (x * x + z * z), 2 * (y * z + w * x), 0,
      2 * (x * z + w * y), 2 * (y * z - w * x), 1 - 2 * (x * x + y * y), 0,
      0, 0, 0, 1,
    ]);
  }

  // Shortest-arc spherical interpolation; falls back to normalized lerp when nearly parallel.
  slerp(other, t) {
    let { x: bx, y: by, z: bz, w: bw } = other;
    let dot = this.x * bx + this.y * by + this.z * bz + this.w * bw;

    if (dot < 0) {
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
      dot = -dot;
    }

    const DOT_THRESHOLD = 0.9995;
    if (dot > DOT_THRESHOLD) {
      return new Quaternion(
        this.x + (bx - this.x) * t,
        this.y + (by - this.y) * t,
        this.z + (bz - this.z) * t,
        this.w + (bw - this.w) * t
      ).normalize();
    }

    const theta0 = Math.acos(dot);
    const theta = theta0 * t;
    const sinTheta0 = Math.sin(theta0);
    const sinTheta = Math.sin(theta);
    const s0 = Math.cos(theta) - (dot * sinTheta) / sinTheta0;
    const s1 = sinTheta / sinTheta0;

    return new Quaternion(
      this.x * s0 + bx * s1,
      this.y * s0 + by * s1,
      this.z * s0 + bz * s1,
      this.w * s0 + bw * s1
    );
  }
}
