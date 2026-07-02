import { Vector3, Ray } from '../math/index.js';

// Epsilon offset along the normal for shadow-ray origins, avoiding
// self-shadow acne (memory/rendering.md — Decided).
export const SHADOW_EPSILON = 1e-4;

// Component-wise color product (Vector3 as r,g,b, 0..1 linear). Deliberately
// local here rather than a Vector3 method — closed PLAN-01 math is out of
// scope (memory/materials.md — Decided).
export function mulColor(a, b) {
  return new Vector3(a.x * b.x, a.y * b.y, a.z * b.z);
}

// Ambient coefficient is a render budget owned by conventions.md and not yet
// fixed there (memory/materials.md — open). Read it from the scene if
// present; 0 is the neutral fallback, not an invented value.
function ambientCoefficient(scene) {
  return scene?.ambient ?? 0;
}

function lambertDiffuse(normal, lightDir) {
  return Math.max(0, normal.dot(lightDir));
}

// Roughness (0 = mirror-smooth, 1 = fully rough) maps to a Blinn-Phong
// shininess exponent: tight highlight at low roughness, broad/absent at high.
function shininessFromRoughness(roughness) {
  return Math.max(1, (1 - roughness) * 128);
}

function blinnPhongSpecular(normal, viewDir, lightDir, shininess) {
  const halfVec = viewDir.add(lightDir).normalize();
  return Math.pow(Math.max(0, normal.dot(halfVec)), shininess);
}

// One hard shadow ray per point light, epsilon-offset along the normal.
// Returns true if the light is occluded before reaching it.
function isOccluded(scene, point, normal, light) {
  const origin = point.add(normal.scale(SHADOW_EPSILON));
  const toLight = light.position.sub(origin);
  const distance = toLight.length();
  const shadowRay = new Ray(origin, toLight.normalize());
  return scene.intersect(shadowRay, SHADOW_EPSILON, distance - SHADOW_EPSILON) !== null;
}

// Shared Lambert + Blinn-Phong local lighting for opaque materials
// (Diffuse, Metallic): ambient (tinted by albedo) + per-light diffuse +
// specular, skipping lights occluded by a hard shadow ray.
export function shadeOpaque(albedo, hit, ray, scene, lights, roughness) {
  const ambient = mulColor(albedo, new Vector3(1, 1, 1).scale(ambientCoefficient(scene)));
  const shininess = shininessFromRoughness(roughness);
  const viewDir = ray.dir.scale(-1).normalize();

  let color = ambient;
  for (const light of lights) {
    if (isOccluded(scene, hit.point, hit.normal, light)) continue;

    const toLight = light.position.sub(hit.point);
    const distanceSq = Math.max(toLight.dot(toLight), 1e-4);
    const lightDir = toLight.normalize();
    const diffuse = lambertDiffuse(hit.normal, lightDir);
    const specular = blinnPhongSpecular(hit.normal, viewDir, lightDir, shininess);
    // Inverse-square falloff: a point light's intensity is radiant power, so it
    // must attenuate with distance^2 (memory/materials.md). Without it the
    // intensity-18 room light saturates every lit surface to pure white.
    const lightColor = light.color.scale(light.intensity / distanceSq);

    color = color.add(mulColor(albedo, lightColor).scale(diffuse));
    color = color.add(lightColor.scale(specular));
  }
  return color;
}

// Ambient-only contribution (no albedo to tint it) — used by the Material
// base default and Mirror, whose look comes from reflection (S3).
export function shadeAmbientOnly(scene) {
  const a = ambientCoefficient(scene);
  return new Vector3(a, a, a);
}

// Perfect-mirror reflection ray: direction reflected about the surface
// normal (unit), origin epsilon-offset along the normal to avoid self-hit —
// same epsilon as the shadow-ray decision (memory/rendering.md). Roughness
// jitter is deferred to PLAN-09 (memory/materials.md).
export function reflectRay(hit, ray) {
  const origin = hit.point.add(hit.normal.scale(SHADOW_EPSILON));
  const direction = ray.dir.reflect(hit.normal).normalize();
  return new Ray(origin, direction);
}
