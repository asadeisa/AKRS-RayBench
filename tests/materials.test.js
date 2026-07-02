import { test, assert, assertClose } from './harness.js';
import { Vector3, Ray } from '../src/math/index.js';
import { createHit } from '../src/geometry/index.js';
import { Diffuse, Mirror, Metallic, Emissive } from '../src/materials/index.js';

function assertVec3Close(actual, expected, eps = 1e-9) {
  assertClose(actual.x, expected.x, eps, `x: expected ${expected.x}, got ${actual.x}`);
  assertClose(actual.y, expected.y, eps, `y: expected ${expected.y}, got ${actual.y}`);
  assertClose(actual.z, expected.z, eps, `z: expected ${expected.z}, got ${actual.z}`);
}

// Straight-on ray hitting a flat surface: I=(0,0,-1), N=(0,0,1).
// Hand-computed reflect: I - 2*(I.N)*N = (0,0,-1) - 2*(-1)*(0,0,1) = (0,0,1).
const ray = new Ray(new Vector3(0, 0, 5), new Vector3(0, 0, -1));
const hit = createHit(5, new Vector3(0, 0, 0), new Vector3(0, 0, 1), null, null);

test('Mirror.reflect: perfect reflection direction + grey weight scaled by reflectivity', () => {
  const mirror = new Mirror(0.5);
  const result = mirror.reflect(hit, ray);
  assert(result !== null);
  assertVec3Close(result.ray.dir, new Vector3(0, 0, 1));
  assertVec3Close(result.weight, new Vector3(0.5, 0.5, 0.5));
});

test('Mirror.reflect: ray origin is offset along the normal (no self-hit)', () => {
  const mirror = new Mirror(1);
  const result = mirror.reflect(hit, ray);
  assert(result.ray.origin.z > hit.point.z, 'expected origin offset along +normal');
});

test('Metallic.reflect: reflection direction matches Mirror, weight tinted by albedo', () => {
  const albedo = new Vector3(0.2, 0.4, 0.6);
  const metallic = new Metallic(albedo, 0.8, 0.1);
  const result = metallic.reflect(hit, ray);
  assert(result !== null);
  assertVec3Close(result.ray.dir, new Vector3(0, 0, 1));
  assertVec3Close(result.weight, new Vector3(0.16, 0.32, 0.48));
});

test('Diffuse.reflect() is null (no reflection contribution)', () => {
  const diffuse = new Diffuse(new Vector3(1, 0, 0));
  assert(diffuse.reflect(hit, ray) === null);
});

test('Emissive.reflect() is null (no reflection contribution)', () => {
  const emissive = new Emissive(new Vector3(1, 1, 1), 2);
  assert(emissive.reflect(hit, ray) === null);
});

test('Emissive.shade() returns emission * intensity, ignoring scene/lights', () => {
  const emissive = new Emissive(new Vector3(0.5, 0.25, 0.1), 4);
  const color = emissive.shade(hit, ray, null, []);
  assertVec3Close(color, new Vector3(2, 1, 0.4));
});

test('Mirror.shade() (inherited default) is ambient-only', () => {
  const mirror = new Mirror(1);
  const scene = { ambient: 0.1, intersect: () => null };
  const color = mirror.shade(hit, ray, scene, []);
  assertVec3Close(color, new Vector3(0.1, 0.1, 0.1));
});
