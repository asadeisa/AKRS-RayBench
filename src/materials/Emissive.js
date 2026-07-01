import { Material } from './Material.js';

export class Emissive extends Material {
  constructor(emission, intensity) {
    super('emissive');
    this.emission = emission;
    this.intensity = intensity;
  }

  shade(hit, ray, scene, lights) {
    return this.emission.scale(this.intensity);
  }
}
