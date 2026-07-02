// Public entry contract for src/geometry/ — memory/geometry.md owns the details.
// Depends on math only.
//   createHit — factory for the shared Hit shape { t, point, normal, material, object }.
//   Sphere / Plane / Box / Triangle — intersect(ray, tMin, tMax) -> Hit | null.
//   Mesh      — triangle collection + own AABB; delegates intersect to its triangles.
//   Node      — transform-hierarchy node (position/rotation/scale, children, optional
//               geometry/material/light); cached worldMatrix; worldBounds().
//   Scene     — flattens a Node graph into renderables + lights; intersect(ray) -> closest
//               Hit | null (delegates to an injected accelerator if setAccelerator() was
//               called — memory/performance.md); objectBounds()/bounds() for the BVH hook.
export { createHit } from './Hit.js';
export { Sphere } from './Sphere.js';
export { Plane } from './Plane.js';
export { Box } from './Box.js';
export { Triangle } from './Triangle.js';
export { Mesh } from './Mesh.js';
export { Node } from './Node.js';
export { Scene } from './Scene.js';
