import { shadeAmbientOnly } from './shading.js';

// Base material: `type` tag + shared params the tracer reads uniformly across
// all material types (roughness, reflectivity). reflect?() is not defined
// here — that lands in PLAN-03 S3.
export class Material {
  constructor(type, { roughness = 0, reflectivity = 0 } = {}) {
    this.type = type;
    this.roughness = roughness;
    this.reflectivity = reflectivity;
  }

  // Default local shading: ambient only. Types with an albedo to light
  // (Diffuse, Metallic) and Emissive override this.
  shade(hit, ray, scene, lights) {
    return shadeAmbientOnly(scene);
  }

  // Default: no reflection contribution. Mirror/Metallic override this;
  // Diffuse/Emissive inherit null.
  reflect(hit, ray) {
    return null;
  }
}
