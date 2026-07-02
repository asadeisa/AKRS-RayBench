// Public entry contract for src/materials/ — memory/materials.md owns the details.
// Depends on math only.
//   Material — base: type tag + roughness/reflectivity; shade() default ambient-only;
//              reflect() default null. Diffuse/Mirror/Metallic/Emissive override as needed.
//   Diffuse  — albedo; shade() = Lambert+specular+ambient+shadows; no reflection.
//   Mirror   — reflectivity; reflect() = perfect reflection, grey weight.
//   Metallic — albedo,reflectivity,roughness; shade() as Diffuse; reflect() tinted by albedo.
//   Emissive — emission,intensity; shade() = emission*intensity, ignores scene/lights.
// Every shade(hit, ray, scene, lights) -> Vector3 (linear color); every reflect(hit, ray) ->
// { ray, weight: Vector3 } | null.
export { Material } from './Material.js';
export { Diffuse } from './Diffuse.js';
export { Mirror } from './Mirror.js';
export { Metallic } from './Metallic.js';
export { Emissive } from './Emissive.js';
