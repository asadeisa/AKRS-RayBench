// Public entry contract for src/math/ — memory/math.md owns the details.
// Foundation module: depends on nothing else in src/.
//   Vector2       — x,y: add/sub/scale/dot/length/normalize.
//   Vector3       — x,y,z: add/sub/scale/dot/cross/length/normalize/lerp/reflect(n).
//   Ray           — origin,dir: at(t) -> point.
//   Matrix4       — 4x4 column-major: identity/translate/scale/rotate/lookAt/perspective
//                   (statics), multiply/inverse/transformPoint/transformDir (instance).
//   Quaternion    — fromAxisAngle/multiply/normalize/toMatrix4/slerp.
//   AABB          — min,max: contains/expandByPoint/union/intersectRay.
//   BoundingSphere— center,radius: contains/intersectRay.
export { Vector2 } from './Vector2.js';
export { Vector3 } from './Vector3.js';
export { Ray } from './Ray.js';
export { Matrix4 } from './Matrix4.js';
export { Quaternion } from './Quaternion.js';
export { AABB } from './AABB.js';
export { BoundingSphere } from './BoundingSphere.js';
