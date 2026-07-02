import { test, assert, assertClose, assertEqual } from './harness.js';
import { Vector3, Ray } from '../src/math/index.js';
import { Node, Scene, Sphere, Plane } from '../src/geometry/index.js';
import { Diffuse, Mirror } from '../src/materials/index.js';
import { Renderer } from '../src/render/index.js';
import { Camera } from '../src/camera/index.js';
import { traceRay } from '../src/render/trace.js';
import { BVH, AdaptiveController, FrameBudget } from '../src/perf/index.js';

// --- BVH vs linear-scan equality (memory/performance.md: output-identical) ---

function buildMultiSphereScene() {
  const centers = [
    [0, 0, 0], [3, 0, 0], [-3, 0, 0], [0, 3, 0], [0, -3, 0],
    [0, 0, 3], [0, 0, -3], [2, 2, 2], [-2, -2, -2], [4, -1, 2],
  ];
  const root = new Node();
  for (const [x, y, z] of centers) {
    root.add(new Node({ geometry: new Sphere(new Vector3(x, y, z), 0.8, new Diffuse(new Vector3(1, 1, 1))) }));
  }
  return new Scene(root).build();
}

// A fixed, deterministic grid of rays (no Math.random) covering hits and misses.
function fixedRays() {
  const rays = [];
  for (let ox = -6; ox <= 6; ox += 3) {
    for (let oy = -6; oy <= 6; oy += 3) {
      const origin = new Vector3(ox, oy, 10);
      for (const dir of [
        new Vector3(0, 0, -1),
        new Vector3(0.1, 0, -1).normalize(),
        new Vector3(0, 0.1, -1).normalize(),
        new Vector3(1, 1, -1).normalize(),
      ]) {
        rays.push(new Ray(origin, dir));
      }
    }
  }
  return rays;
}

test('BVH.intersect matches Scene\'s linear scan over a fixed grid of rays', () => {
  const scene = buildMultiSphereScene();
  const bvh = new BVH(scene);

  for (const ray of fixedRays()) {
    const linearHit = scene.intersect(ray);
    scene.setAccelerator(bvh);
    const bvhHit = scene.intersect(ray);
    scene.setAccelerator(null);

    if (linearHit === null) {
      assert(bvhHit === null, `expected both to miss for ray ${JSON.stringify(ray)}`);
    } else {
      assert(bvhHit !== null, 'BVH missed a ray the linear scan hit');
      assertClose(bvhHit.t, linearHit.t, 1e-9, 'BVH t differs from linear scan t');
      assertEqual(bvhHit.object, linearHit.object, 'BVH hit a different object than the linear scan');
    }
  }
});

test('BVH.intersect matches the linear scan for a ray starting inside a sphere', () => {
  const scene = buildMultiSphereScene();
  const bvh = new BVH(scene);
  const ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 1));

  const linearHit = scene.intersect(ray);
  scene.setAccelerator(bvh);
  const bvhHit = scene.intersect(ray);

  assert(linearHit !== null && bvhHit !== null);
  assertClose(bvhHit.t, linearHit.t, 1e-9);
});

test('Scene.setAccelerator(null) restores the linear scan result exactly', () => {
  const scene = buildMultiSphereScene();
  const bvh = new BVH(scene);
  const ray = new Ray(new Vector3(0, 0, 10), new Vector3(0, 0, -1));

  const before = scene.intersect(ray);
  scene.setAccelerator(bvh);
  scene.intersect(ray);
  scene.setAccelerator(null);
  const after = scene.intersect(ray);

  assertClose(after.t, before.t, 1e-9);
  assertEqual(after.object, before.object);
});

// --- Early ray termination (EARLY_TERM_EPS) ---

function facingMirrorScene(reflectivity) {
  const material = new Mirror(reflectivity);
  const root = new Node();
  root.add(new Node({ geometry: new Plane(new Vector3(0, 0, -1), new Vector3(0, 0, 1), material) }));
  root.add(new Node({ geometry: new Plane(new Vector3(0, 0, 1), new Vector3(0, 0, -1), material) }));
  const scene = new Scene(root).build();
  scene.ambient = 0.2;
  return scene;
}

test('Early termination: a weak reflector barely changes between shallow and deep recursion', () => {
  const scene = facingMirrorScene(0.02);
  const ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 1));
  const background = new Vector3(0, 0, 0);

  const shallow = traceRay(ray, scene, [], background, 0, 2);
  const deep = traceRay(ray, scene, [], background, 0, 20);

  assertClose(shallow.x, deep.x, 0.01, 'weak reflector: shallow/deep diverged beyond the early-term epsilon');
  assertClose(shallow.y, deep.y, 0.01);
  assertClose(shallow.z, deep.z, 0.01);
});

test('Early termination: a strong mirror pair still accumulates meaningfully deeper', () => {
  const scene = facingMirrorScene(0.95);
  const ray = new Ray(new Vector3(0, 0, 0), new Vector3(0, 0, 1));
  const background = new Vector3(0, 0, 0);

  const shallow = traceRay(ray, scene, [], background, 0, 3);
  const deep = traceRay(ray, scene, [], background, 0, 20);

  assert(deep.x > shallow.x + 0.05, 'expected meaningfully more accumulated color at higher maxDepth for a strong reflector');
});

// --- Renderer.setScale (adaptive-resolution seam) ---

function fixedCameraAndScene() {
  const root = new Node();
  root.add(new Node({ geometry: new Sphere(new Vector3(0, 0, 0), 1, new Diffuse(new Vector3(0, 1, 0))) }));
  root.add(new Node({ position: new Vector3(2, 2, 2), light: { color: new Vector3(1, 1, 1), intensity: 15 } }));
  const scene = new Scene(root).build();
  scene.ambient = 0.1;
  const camera = new Camera({ position: new Vector3(0, 0, 5), fov: Math.PI / 3 });
  return { scene, camera };
}

test('Renderer.setScale(1) is byte-identical to a renderer never touched by setScale', () => {
  const { scene, camera } = fixedCameraAndScene();

  const untouched = new Renderer({ width: 6, height: 4, samples: 1, maxDepth: 1 });
  const bufferA = untouched.render(camera, scene);

  const scaled = new Renderer({ width: 6, height: 4, samples: 1, maxDepth: 1 });
  scaled.setScale(1);
  const bufferB = scaled.render(camera, scene);

  assertEqual(bufferA.width, bufferB.width);
  assertEqual(bufferA.height, bufferB.height);
  for (let i = 0; i < bufferA.data.length; i++) {
    assertEqual(bufferA.data[i], bufferB.data[i]);
  }
});

test('Renderer.setScale(0.5) halves the internal buffer size', () => {
  const renderer = new Renderer({ width: 10, height: 8, samples: 1 });
  renderer.setScale(0.5);
  assertEqual(renderer.width, 5);
  assertEqual(renderer.height, 4);
  renderer.setScale(1);
  assertEqual(renderer.width, 10);
  assertEqual(renderer.height, 8);
});

// --- AdaptiveController ---

test('AdaptiveController lowers scale over budget, raises it under budget, and clamps', () => {
  const controller = new AdaptiveController({ enabled: true, targetMs: 33, minScale: 0.5, maxScale: 1, step: 0.1 });

  controller.update(60); // over budget
  assertClose(controller.currentScale, 0.9, 1e-9);
  controller.update(60);
  assertClose(controller.currentScale, 0.8, 1e-9);

  for (let i = 0; i < 20; i++) controller.update(60);
  assertClose(controller.currentScale, 0.5, 1e-9, 'expected clamping at minScale');

  for (let i = 0; i < 20; i++) controller.update(5); // under budget
  assertClose(controller.currentScale, 1, 1e-9, 'expected clamping at maxScale');
});

test('AdaptiveController.enabled = false forces scale 1 regardless of prior state', () => {
  const controller = new AdaptiveController({ enabled: true, targetMs: 33 });
  controller.update(60);
  controller.update(60);
  assert(controller.currentScale < 1);

  controller.enabled = false;
  const scale = controller.update(60);
  assertEqual(scale, 1);
  assertEqual(controller.currentScale, 1);
});

// --- FrameBudget ---

test('FrameBudget.sample() computes a sliding-window moving average', () => {
  const budget = new FrameBudget({ targetMs: 33, window: 4 });
  assertClose(budget.sample(10), 10);
  assertClose(budget.sample(20), 15);
  assertClose(budget.sample(30), 20);
  assertClose(budget.sample(40), 25);
  // Window is full (4); the 5th sample evicts the oldest (10).
  assertClose(budget.sample(50), (20 + 30 + 40 + 50) / 4);
});

test('FrameBudget: a single spike moves the average by roughly 1/window, not to the spike', () => {
  const window = 10;
  const budget = new FrameBudget({ targetMs: 33, window });
  for (let i = 0; i < window; i++) budget.sample(10);
  assertClose(budget.smoothedMs, 10, 1e-9);

  const spiked = budget.sample(1000);
  const expectedShift = (1000 - 10) / window;
  assertClose(spiked, 10 + expectedShift, 1e-9);
  assert(spiked < 1000, 'a single spike should not jolt the average to the spike value');
});
