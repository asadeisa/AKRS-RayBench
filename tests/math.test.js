import { test, assertClose } from './harness.js';
import { Vector2, Vector3, Ray, Matrix4, Quaternion } from '../src/math/index.js';

function assertVec3Close(actual, expected, eps = 1e-9) {
  assertClose(actual.x, expected.x, eps, `x: expected ${expected.x}, got ${actual.x}`);
  assertClose(actual.y, expected.y, eps, `y: expected ${expected.y}, got ${actual.y}`);
  assertClose(actual.z, expected.z, eps, `z: expected ${expected.z}, got ${actual.z}`);
}

function assertMat4Close(actual, expected, eps = 1e-9) {
  for (let i = 0; i < 16; i++) {
    assertClose(actual.m[i], expected.m[i], eps, `m[${i}]: expected ${expected.m[i]}, got ${actual.m[i]}`);
  }
}

// --- Vector2 ---

test('Vector2 add/sub/scale/dot', () => {
  const a = new Vector2(1, 2);
  const b = new Vector2(3, 4);
  const sum = a.add(b);
  assertClose(sum.x, 4);
  assertClose(sum.y, 6);
  const diff = b.sub(a);
  assertClose(diff.x, 2);
  assertClose(diff.y, 2);
  const scaled = a.scale(2);
  assertClose(scaled.x, 2);
  assertClose(scaled.y, 4);
  assertClose(a.dot(b), 1 * 3 + 2 * 4);
});

test('Vector2 length/normalize', () => {
  const v = new Vector2(3, 4);
  assertClose(v.length(), 5);
  const n = v.normalize();
  assertClose(n.length(), 1, 1e-12);
  assertClose(n.x, 0.6);
  assertClose(n.y, 0.8);
});

// --- Vector3 ---

test('Vector3 add/sub/scale/dot', () => {
  const a = new Vector3(1, 2, 3);
  const b = new Vector3(4, 5, 6);
  assertVec3Close(a.add(b), new Vector3(5, 7, 9));
  assertVec3Close(b.sub(a), new Vector3(3, 3, 3));
  assertVec3Close(a.scale(2), new Vector3(2, 4, 6));
  assertClose(a.dot(b), 1 * 4 + 2 * 5 + 3 * 6);
});

test('Vector3 cross is right-handed (x cross y = z)', () => {
  const x = new Vector3(1, 0, 0);
  const y = new Vector3(0, 1, 0);
  assertVec3Close(x.cross(y), new Vector3(0, 0, 1));
});

test('Vector3 length/normalize', () => {
  const v = new Vector3(3, 4, 0);
  assertClose(v.length(), 5);
  const n = v.normalize();
  assertClose(n.length(), 1, 1e-12);
});

test('Vector3 lerp endpoints and midpoint', () => {
  const a = new Vector3(0, 0, 0);
  const b = new Vector3(10, 20, 30);
  assertVec3Close(a.lerp(b, 0), a);
  assertVec3Close(a.lerp(b, 1), b);
  assertVec3Close(a.lerp(b, 0.5), new Vector3(5, 10, 15));
});

test('Vector3 reflect off axis-aligned normal', () => {
  const incident = new Vector3(1, -1, 0);
  const normal = new Vector3(0, 1, 0);
  assertVec3Close(incident.reflect(normal), new Vector3(1, 1, 0));
});

// --- Ray ---

test('Ray.at(t) = origin + dir*t', () => {
  const ray = new Ray(new Vector3(1, 2, 3), new Vector3(0, 0, -1));
  assertVec3Close(ray.at(5), new Vector3(1, 2, -2));
  assertVec3Close(ray.at(0), new Vector3(1, 2, 3));
});

// --- Matrix4 ---

test('Matrix4.identity is the multiplicative identity', () => {
  const t = Matrix4.translate(new Vector3(1, 2, 3));
  assertMat4Close(Matrix4.identity().multiply(t), t);
  assertMat4Close(t.multiply(Matrix4.identity()), t);
});

test('Matrix4.rotate +Y 90deg sends +X to -Z (right-handed, -Z forward)', () => {
  const rot = Matrix4.rotate(new Vector3(0, 1, 0), Math.PI / 2);
  const result = rot.transformDir(new Vector3(1, 0, 0));
  assertVec3Close(result, new Vector3(0, 0, -1), 1e-9);
});

test('Matrix4.translate.transformPoint moves a point', () => {
  const t = Matrix4.translate(new Vector3(1, 2, 3));
  assertVec3Close(t.transformPoint(new Vector3(0, 0, 0)), new Vector3(1, 2, 3));
});

test('Matrix4.translate.transformDir ignores translation', () => {
  const t = Matrix4.translate(new Vector3(1, 2, 3));
  assertVec3Close(t.transformDir(new Vector3(5, 6, 7)), new Vector3(5, 6, 7));
});

test('Matrix4.inverse(M) * M ~= identity', () => {
  const m = Matrix4.translate(new Vector3(1, -2, 3)).multiply(
    Matrix4.rotate(new Vector3(0, 1, 0), 0.7)
  );
  const product = m.inverse().multiply(m);
  assertMat4Close(product, Matrix4.identity(), 1e-9);
});

test('Matrix4.lookAt: eye at +Z looking at origin puts the target at -Z in view space', () => {
  const eye = new Vector3(0, 0, 5);
  const view = Matrix4.lookAt(eye, new Vector3(0, 0, 0), new Vector3(0, 1, 0));
  assertVec3Close(view.transformPoint(new Vector3(0, 0, 0)), new Vector3(0, 0, -5), 1e-9);
  assertVec3Close(view.transformPoint(eye), new Vector3(0, 0, 0), 1e-9);
});

test('Matrix4.perspective maps near/far planes to NDC z = -1/1', () => {
  const near = 1;
  const far = 10;
  const proj = Matrix4.perspective(Math.PI / 2, 1, near, far);

  // transformPoint perspective-divides by w for us; a point on the near/far
  // plane (x=y=0, camera-space z=-near/-far) must land at NDC z=-1/1.
  assertClose(proj.transformPoint(new Vector3(0, 0, -near)).z, -1, 1e-9);
  assertClose(proj.transformPoint(new Vector3(0, 0, -far)).z, 1, 1e-9);
});

// --- Quaternion ---

test('Quaternion.fromAxisAngle().toMatrix4() agrees with Matrix4.rotate()', () => {
  const axis = new Vector3(0, 1, 0);
  const theta = Math.PI / 2;
  const fromQuat = Quaternion.fromAxisAngle(axis, theta).toMatrix4();
  const fromMatrix = Matrix4.rotate(axis, theta);
  assertMat4Close(fromQuat, fromMatrix, 1e-9);
});

test('Quaternion.fromAxisAngle() on an oblique axis also agrees with Matrix4.rotate()', () => {
  const axis = new Vector3(1, 1, 0).normalize();
  const theta = 1.234;
  const fromQuat = Quaternion.fromAxisAngle(axis, theta).toMatrix4();
  const fromMatrix = Matrix4.rotate(axis, theta);
  assertMat4Close(fromQuat, fromMatrix, 1e-9);
});

test('Quaternion.multiply composes rotations (90deg + 90deg = 180deg about the same axis)', () => {
  const axis = new Vector3(0, 1, 0);
  const q90 = Quaternion.fromAxisAngle(axis, Math.PI / 2);
  const composed = q90.multiply(q90).toMatrix4();
  const expected = Matrix4.rotate(axis, Math.PI);
  assertMat4Close(composed, expected, 1e-9);
});

test('Quaternion.normalize yields unit length', () => {
  const q = new Quaternion(1, 2, 3, 4).normalize();
  assertClose(q.length(), 1, 1e-12);
});

test('Quaternion.slerp endpoints', () => {
  const a = new Quaternion(0, 0, 0, 1);
  const b = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
  assertMat4Close(a.slerp(b, 0).toMatrix4(), a.toMatrix4(), 1e-9);
  assertMat4Close(a.slerp(b, 1).toMatrix4(), b.toMatrix4(), 1e-9);
});

test('Quaternion.slerp midpoint is the correct shortest-arc half-angle rotation', () => {
  const a = new Quaternion(0, 0, 0, 1);
  const b = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 2);
  const mid = a.slerp(b, 0.5);
  const expected = Quaternion.fromAxisAngle(new Vector3(0, 1, 0), Math.PI / 4);
  assertMat4Close(mid.toMatrix4(), expected.toMatrix4(), 1e-9);
});
