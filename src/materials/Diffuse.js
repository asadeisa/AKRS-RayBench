import { Material } from './Material.js';
import { shadeOpaque } from './shading.js';

export class Diffuse extends Material {
  constructor(albedo) {
    super('diffuse');
    this.albedo = albedo;
  }

  shade(hit, ray, scene, lights) {
    return shadeOpaque(this.albedo, hit, ray, scene, lights, this.roughness);
  }
}
