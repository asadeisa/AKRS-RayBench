import { Vector3 } from '../math/index.js';
import { Material } from './Material.js';
import { reflectRay } from './shading.js';

export class Mirror extends Material {
  constructor(reflectivity) {
    super('mirror', { reflectivity });
  }

  reflect(hit, ray) {
    return { ray: reflectRay(hit, ray), weight: new Vector3(1, 1, 1).scale(this.reflectivity) };
  }
}
