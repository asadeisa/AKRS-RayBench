import { test, assert, assertEqual } from './harness.js';
import { Vector3 } from '../src/math/index.js';
import { Node, Scene, Sphere } from '../src/geometry/index.js';
import { Diffuse } from '../src/materials/index.js';
import { Camera } from '../src/camera/index.js';
import { Renderer } from '../src/render/index.js';

// A committed golden hash for a fixed tiny scene through the real pipeline.
// Deterministic: `samples: 1` uses the fixed center-jitter path (no
// Math.random), fixed camera, fixed geometry/material/light.
const GOLDEN_HASH = 2005490554;

// Simple hand-written FNV-1a hash over the RGBA byte buffer — no libraries.
function hashBuffer(data) {
  let h = 2166136261;
  for (let i = 0; i < data.length; i++) {
    h ^= data[i];
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildFixedScene() {
  const root = new Node();
  root.add(new Node({ geometry: new Sphere(new Vector3(0, 0, 0), 1, new Diffuse(new Vector3(1, 0, 0))) }));
  root.add(new Node({
    position: new Vector3(2, 2, 2),
    light: { color: new Vector3(1, 1, 1), intensity: 20 },
  }));
  const scene = new Scene(root).build();
  scene.ambient = 0.1;
  return scene;
}

function renderFixedScene() {
  const scene = buildFixedScene();
  const camera = new Camera({ position: new Vector3(0, 0, 5), fov: Math.PI / 3 });
  const renderer = new Renderer({ width: 8, height: 6, samples: 1, maxDepth: 2 });
  return renderer.render(camera, scene);
}

test('Renderer pixel-hash regression: fixed scene matches the committed golden hash', () => {
  const buffer = renderFixedScene();
  assertEqual(hashBuffer(buffer.data), GOLDEN_HASH, 'renderer output changed — tracer regression');
});

test('Renderer pixel-hash regression: a lit pixel differs from a background pixel, alpha is 255 throughout', () => {
  const buffer = renderFixedScene();
  const { width, data } = buffer;
  const centerIndex = (3 * width + 4) * 4;
  const cornerIndex = 0;

  assert(
    data[centerIndex] !== data[cornerIndex] ||
      data[centerIndex + 1] !== data[cornerIndex + 1] ||
      data[centerIndex + 2] !== data[cornerIndex + 2],
    'expected the lit center pixel to differ from the background corner pixel'
  );

  for (let i = 3; i < data.length; i += 4) {
    assertEqual(data[i], 255, `alpha at byte ${i} should be 255`);
  }
});

test('Renderer determinism: two renders of the same fixed scene are byte-identical', () => {
  const a = renderFixedScene();
  const b = renderFixedScene();
  assertEqual(a.data.length, b.data.length);
  for (let i = 0; i < a.data.length; i++) {
    assertEqual(a.data[i], b.data[i], `byte ${i} differs between two renders of the same fixed scene`);
  }
});
