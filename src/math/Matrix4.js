import { Vector3 } from './Vector3.js';

// Column-major, length-16 array. Column j occupies m[4j .. 4j+3] (rows 0..3).
// Right-handed, +Y up, -Z forward (memory/conventions.md). transformPoint uses w=1,
// transformDir uses w=0 (memory/math.md).
export class Matrix4 {
  constructor(m) {
    this.m = m ? m.slice() : Matrix4.identity().m;
  }

  static identity() {
    return new Matrix4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]);
  }

  static translate(v) {
    return new Matrix4([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      v.x, v.y, v.z, 1,
    ]);
  }

  static scale(v) {
    return new Matrix4([
      v.x, 0, 0, 0,
      0, v.y, 0, 0,
      0, 0, v.z, 0,
      0, 0, 0, 1,
    ]);
  }

  // Axis-angle rotation; axis must be normalized, theta in radians.
  static rotate(axis, theta) {
    const { x, y, z } = axis;
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    const t = 1 - c;
    return new Matrix4([
      t * x * x + c, t * x * y + s * z, t * x * z - s * y, 0,
      t * x * y - s * z, t * y * y + c, t * y * z + s * x, 0,
      t * x * z + s * y, t * y * z - s * x, t * z * z + c, 0,
      0, 0, 0, 1,
    ]);
  }

  // View matrix: world -> camera space, camera looks down its local -Z.
  static lookAt(eye, target, up) {
    const zAxis = eye.sub(target).normalize();
    const xAxis = up.cross(zAxis).normalize();
    const yAxis = zAxis.cross(xAxis);
    return new Matrix4([
      xAxis.x, yAxis.x, zAxis.x, 0,
      xAxis.y, yAxis.y, zAxis.y, 0,
      xAxis.z, yAxis.z, zAxis.z, 0,
      -xAxis.dot(eye), -yAxis.dot(eye), -zAxis.dot(eye), 1,
    ]);
  }

  // Right-handed perspective projection; near/far planes map to NDC z = -1/1.
  static perspective(fovY, aspect, near, far) {
    const f = 1 / Math.tan(fovY / 2);
    const nf = 1 / (near - far);
    return new Matrix4([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0,
    ]);
  }

  // this * other
  multiply(other) {
    const a = this.m, b = other.m;
    const out = new Array(16);
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[k * 4 + row] * b[col * 4 + k];
        }
        out[col * 4 + row] = sum;
      }
    }
    return new Matrix4(out);
  }

  inverse() {
    const a = this.m;
    const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;

    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (det === 0) {
      throw new Error('Matrix4.inverse: matrix is not invertible');
    }
    det = 1 / det;

    return new Matrix4([
      (a11 * b11 - a12 * b10 + a13 * b09) * det,
      (a02 * b10 - a01 * b11 - a03 * b09) * det,
      (a31 * b05 - a32 * b04 + a33 * b03) * det,
      (a22 * b04 - a21 * b05 - a23 * b03) * det,

      (a12 * b08 - a10 * b11 - a13 * b07) * det,
      (a00 * b11 - a02 * b08 + a03 * b07) * det,
      (a32 * b02 - a30 * b05 - a33 * b01) * det,
      (a20 * b05 - a22 * b02 + a23 * b01) * det,

      (a10 * b10 - a11 * b08 + a13 * b06) * det,
      (a01 * b08 - a00 * b10 - a03 * b06) * det,
      (a30 * b04 - a31 * b02 + a33 * b00) * det,
      (a21 * b02 - a20 * b04 - a23 * b00) * det,

      (a11 * b07 - a10 * b09 - a12 * b06) * det,
      (a00 * b09 - a01 * b07 + a02 * b06) * det,
      (a31 * b01 - a30 * b03 - a32 * b00) * det,
      (a20 * b03 - a21 * b01 + a22 * b00) * det,
    ]);
  }

  // Transforms a point (w=1); divides by w when the result is not affine.
  transformPoint(v) {
    const m = this.m;
    const x = m[0] * v.x + m[4] * v.y + m[8] * v.z + m[12];
    const y = m[1] * v.x + m[5] * v.y + m[9] * v.z + m[13];
    const z = m[2] * v.x + m[6] * v.y + m[10] * v.z + m[14];
    const w = m[3] * v.x + m[7] * v.y + m[11] * v.z + m[15];
    if (w !== 0 && w !== 1) {
      return new Vector3(x / w, y / w, z / w);
    }
    return new Vector3(x, y, z);
  }

  // Transforms a direction (w=0); translation is ignored.
  transformDir(v) {
    const m = this.m;
    return new Vector3(
      m[0] * v.x + m[4] * v.y + m[8] * v.z,
      m[1] * v.x + m[5] * v.y + m[9] * v.z,
      m[2] * v.x + m[6] * v.y + m[10] * v.z
    );
  }
}
