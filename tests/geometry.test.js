import { test, assert, assertClose } from './harness.js';
import { Vector3, Ray } from '../src/math/index.js';
import { Sphere, Plane, Box, Triangle, Mesh, Node, Scene } from '../src/geometry/index.js';
import { Diffuse } from '../src/materials/index.js';

function assertVec3Close(actual, expected, eps = 1e-9) {
  assertClose(actual.x, expected.x, eps, `x: expected ${expected.x}, got ${actual.x}`);
  assertClose(actual.y, expected.y, eps, `y: expected ${expected.y}, got ${actual.y}`);
  assertClose(actual.z, expected.z, eps, `z: expected ${expected.z}, got ${actual.z}`);
}

const TMIN = 1e-4;
const TMAX = Infinity;
const mat = new Diffuse(new Vector3(1, 0, 0));

// --- Sphere ---

test('Sphere: straight-on hit returns nearest point + outward normal', () => {
  const sphere = new Sphere(new Vector3(0, 0, 0), 1, mat);
  const ray = new Ray(new Vector3(0, 0, 5), new Vector3(0, 0, -1));
  const hit = sphere.intersect(ray, TMIN, TMAX);
  assert(hit !== null, 'expected a hit');
  assertClose(hit.t, 4);
  assertVec3Close(hit.point, new Vector3(0, 0, 1));
  assertVec3Close(hit.normal, new Vector3(0, 0, 1));
});

test('Sphere: tangent ray grazes at a single point', () => {
  const sphere = new Sphere(new Vector3(0, 0, 0), 1, mat);
  const ray = new Ray(new Vector3(1, 0, 5), new Vector3(0, 0, -1));
  const hit = sphere.intersect(ray, TMIN, TMAX);
  assert(hit !== null, 'expected a tangent hit');
  assertClose(hit.t, 5, 1e-6);
  assertVec3Close(hit.point, new Vector3(1, 0, 0), 1e-6);
});

test('Sphere: ray starting inside falls through to the exit hit', () => {
  const sphere = new Sphere(new Vector3(0, 0, 0), 1, mat);
  const ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 1));
  const hit = sphere.intersect(ray, TMIN, TMAX);
  assert(hit !== null, 'expected an exit hit');
  assertClose(hit.t, 1);
  assertVec3Close(hit.point, new Vector3(0, 0, 1));
  assertVec3Close(hit.normal, new Vector3(0, 0, 1));
});

test('Sphere: miss returns null', () => {
  const sphere = new Sphere(new Vector3(0, 0, 0), 1, mat);
  const ray = new Ray(new Vector3(5, 5, 5), new Vector3(0, 0, -1));
  assertEqualNull(sphere.intersect(ray, TMIN, TMAX));
});

function assertEqualNull(v) {
  assert(v === null, `expected null, got ${JSON.stringify(v)}`);
}

// --- Plane ---

test('Plane: double-sided, stored normal returned as-is from either side', () => {
  const plane = new Plane(new Vector3(0, 1, 0), new Vector3(0, 1, 0), mat);

  const fromBelow = plane.intersect(new Ray(new Vector3(0, -5, 0), new Vector3(0, 1, 0)), TMIN, TMAX);
  assert(fromBelow !== null);
  assertClose(fromBelow.t, 6);
  assertVec3Close(fromBelow.normal, new Vector3(0, 1, 0));

  const fromAbove = plane.intersect(new Ray(new Vector3(0, 5, 0), new Vector3(0, -1, 0)), TMIN, TMAX);
  assert(fromAbove !== null);
  assertClose(fromAbove.t, 4);
  assertVec3Close(fromAbove.normal, new Vector3(0, 1, 0));
});

test('Plane: parallel ray misses', () => {
  const plane = new Plane(new Vector3(0, 1, 0), new Vector3(0, 1, 0), mat);
  const ray = new Ray(new Vector3(0, 5, 0), new Vector3(1, 0, 0));
  assertEqualNull(plane.intersect(ray, TMIN, TMAX));
});

// --- Box ---

test('Box: entry hit returns the correct face normal', () => {
  const box = new Box(new Vector3(-1, -1, -1), new Vector3(1, 1, 1), mat);
  const ray = new Ray(new Vector3(5, 0, 0), new Vector3(-1, 0, 0));
  const hit = box.intersect(ray, TMIN, TMAX);
  assert(hit !== null);
  assertClose(hit.t, 4);
  assertVec3Close(hit.point, new Vector3(1, 0, 0));
  assertVec3Close(hit.normal, new Vector3(1, 0, 0));
});

test('Box: ray starting inside falls through to the exit face normal', () => {
  const box = new Box(new Vector3(-1, -1, -1), new Vector3(1, 1, 1), mat);
  const ray = new Ray(new Vector3(0, 0, 0), new Vector3(1, 0, 0));
  const hit = box.intersect(ray, TMIN, TMAX);
  assert(hit !== null);
  assertClose(hit.t, 1);
  assertVec3Close(hit.point, new Vector3(1, 0, 0));
  assertVec3Close(hit.normal, new Vector3(1, 0, 0));
});

test('Box: miss returns null', () => {
  const box = new Box(new Vector3(-1, -1, -1), new Vector3(1, 1, 1), mat);
  const ray = new Ray(new Vector3(5, 5, 5), new Vector3(0, 0, -1));
  assertEqualNull(box.intersect(ray, TMIN, TMAX));
});

// --- Triangle ---

test('Triangle: straight-on hit inside the triangle returns the face normal', () => {
  const tri = new Triangle(new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0), mat);
  const ray = new Ray(new Vector3(0.25, 0.25, 5), new Vector3(0, 0, -1));
  const hit = tri.intersect(ray, TMIN, TMAX);
  assert(hit !== null);
  assertClose(hit.t, 5);
  assertVec3Close(hit.point, new Vector3(0.25, 0.25, 0));
  assertVec3Close(hit.normal, new Vector3(0, 0, 1));
});

test('Triangle: ray outside the barycentric bounds misses', () => {
  const tri = new Triangle(new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0), mat);
  const ray = new Ray(new Vector3(2, 2, 5), new Vector3(0, 0, -1));
  assertEqualNull(tri.intersect(ray, TMIN, TMAX));
});

// --- Mesh ---

test('Mesh: returns the nearest triangle hit, not the first-encountered one', () => {
  const near = new Triangle(new Vector3(-1, -1, 0), new Vector3(1, -1, 0), new Vector3(0, 1, 0), mat);
  const far = new Triangle(new Vector3(-1, -1, 5), new Vector3(1, -1, 5), new Vector3(0, 1, 5), mat);
  // `far` is listed first on purpose, to prove the scan narrows to the closest
  // hit rather than returning whichever triangle it visits first.
  const mesh = new Mesh([far, near], mat);
  const ray = new Ray(new Vector3(0, 0, -10), new Vector3(0, 0, 1));
  const hit = mesh.intersect(ray, TMIN, TMAX);
  assert(hit !== null);
  assertClose(hit.t, 10);
  assertVec3Close(hit.point, new Vector3(0, 0, 0));
});

test('Mesh: empty mesh returns null', () => {
  const mesh = new Mesh([], mat);
  const ray = new Ray(new Vector3(0, 0, 10), new Vector3(0, 0, -1));
  assertEqualNull(mesh.intersect(ray, TMIN, TMAX));
});

// --- Scene ---

test('Scene.intersect: closest-hit scan picks the nearer of two overlapping renderables', () => {
  const near = new Node({ geometry: new Sphere(new Vector3(0, 0, 0), 1, mat) });
  const far = new Node({ geometry: new Sphere(new Vector3(0, 0, -5), 1, mat) });
  const root = new Node();
  root.add(near);
  root.add(far);
  const scene = new Scene(root).build();

  const ray = new Ray(new Vector3(0, 0, 10), new Vector3(0, 0, -1));
  const hit = scene.intersect(ray);
  assert(hit !== null);
  assertClose(hit.t, 9);
  assertVec3Close(hit.point, new Vector3(0, 0, 1));
});

test('Scene.intersect: a ray missing every renderable returns null', () => {
  const node = new Node({ geometry: new Sphere(new Vector3(0, 0, 0), 1, mat) });
  const root = new Node();
  root.add(node);
  const scene = new Scene(root).build();

  const ray = new Ray(new Vector3(5, 5, 5), new Vector3(0, 0, -1));
  assertEqualNull(scene.intersect(ray));
});
