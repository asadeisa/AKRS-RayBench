import { Material } from './Material.js';
import { shadeOpaque, reflectRay } from './shading.js';

export class Metallic extends Material {
  constructor(albedo, reflectivity, roughness) {
    super('metallic', { roughness, reflectivity });
    this.albedo = albedo;
  }

  shade(hit, ray, scene, lights) {
    return shadeOpaque(this.albedo, hit, ray, scene, lights, this.roughness);
  }

  reflect(hit, ray) {
    return { ray: reflectRay(hit, ray), weight: this.albedo.scale(this.reflectivity) };
  }
}
