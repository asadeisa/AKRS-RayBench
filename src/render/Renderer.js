import { Vector3 } from '../math/index.js';
import { writeColor } from './writeColor.js';
import { traceRay } from './trace.js';

// R1: pixel loop -> camera.rayFor -> ImageData-shaped buffer.
// R2: each ray now goes through traceRay (closest hit -> material.shade; miss -> background).
// R3: traceRay recurses into mirror/metallic reflections up to `maxDepth`.
// R4: N jittered sub-pixel samples per pixel, averaged in linear space, one writeColor per pixel
// (single clamp+gamma site — memory/rendering.md, no double gamma).
// DOM-free: produces { width, height, data: Uint8ClampedArray }; boot (main.js) blits it.
export class Renderer {
  constructor({
    width,
    height,
    background = new Vector3(0, 0, 0),
    gamma = 2.2,
    maxDepth = 4,
    samples = 4,
  }) {
    this.baseWidth = width;
    this.baseHeight = height;
    this.width = width;
    this.height = height;
    this.background = background;
    this.gamma = gamma;
    this.maxDepth = maxDepth;
    this.samples = samples;
  }

  // F2 hook: settable internal buffer size, independent of the canvas size
  // boot upscales to (memory/performance.md — adaptive resolution). scale
  // 1 recomputes to exactly the constructor's width/height, so render()
  // output stays byte-identical when adaptive is off.
  setScale(scale) {
    this.width = Math.max(1, Math.round(this.baseWidth * scale));
    this.height = Math.max(1, Math.round(this.baseHeight * scale));
  }

  render(camera, scene) {
    const { width, height, samples } = this;
    const data = new Uint8ClampedArray(width * height * 4);

    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        let r = 0, g = 0, b = 0;

        for (let s = 0; s < samples; s++) {
          // Center sample when samples === 1 (deterministic, matches R3's un-jittered ray);
          // uniform random jitter within the pixel otherwise.
          const jitterX = samples === 1 ? 0.5 : Math.random();
          const jitterY = samples === 1 ? 0.5 : Math.random();
          const ray = camera.rayFor(px + jitterX - 0.5, py + jitterY - 0.5, width, height);
          const color = traceRay(ray, scene, scene.lights, this.background, 0, this.maxDepth);
          r += color.x;
          g += color.y;
          b += color.z;
        }

        const avg = new Vector3(r / samples, g / samples, b / samples);
        const index = (py * width + px) * 4;
        writeColor(data, index, avg, this.gamma);
      }
    }

    return { width, height, data };
  }
}
