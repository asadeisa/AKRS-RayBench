import { Vector3 } from '../math/index.js';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function closestPointOnAABB(point, aabb) {
  return new Vector3(
    clamp(point.x, aabb.min.x, aabb.max.x),
    clamp(point.y, aabb.min.y, aabb.max.y),
    clamp(point.z, aabb.min.z, aabb.max.z)
  );
}

// Sphere center is inside (or on) the box: push out along the axis of least
// penetration rather than by a (degenerate, zero-length) surface normal.
function penetrationNormal(pos, aabb) {
  const penMinX = pos.x - aabb.min.x;
  const penMaxX = aabb.max.x - pos.x;
  const penMinY = pos.y - aabb.min.y;
  const penMaxY = aabb.max.y - pos.y;
  const penMinZ = pos.z - aabb.min.z;
  const penMaxZ = aabb.max.z - pos.z;

  const penX = Math.min(penMinX, penMaxX);
  const penY = Math.min(penMinY, penMaxY);
  const penZ = Math.min(penMinZ, penMaxZ);
  const minPen = Math.min(penX, penY, penZ);

  if (minPen === penX) return { normal: new Vector3(penMinX < penMaxX ? -1 : 1, 0, 0), depth: penX };
  if (minPen === penY) return { normal: new Vector3(0, penMinY < penMaxY ? -1 : 1, 0), depth: penY };
  return { normal: new Vector3(0, 0, penMinZ < penMaxZ ? -1 : 1), depth: penZ };
}

// Player-vs-world movement: sphere proxy against a list of world AABB
// colliders (memory/engine.md). Attempts the full desired move, then for each
// penetrating collider pushes the sphere out along the contact normal only —
// this naturally stops head-on motion at the surface while leaving any
// tangential component of the move untouched (slide), without a separate
// move-projection pass.
export function resolve(position, desiredMove, radius, colliders) {
  let pos = position.add(desiredMove);
  const radiusSq = radius * radius;

  for (const aabb of colliders) {
    const closest = closestPointOnAABB(pos, aabb);
    const diff = pos.sub(closest);
    const distSq = diff.lengthSq();
    if (distSq >= radiusSq) continue;

    const dist = Math.sqrt(distSq);
    let normal;
    let penetration;
    if (dist > 1e-8) {
      normal = diff.scale(1 / dist);
      penetration = radius - dist;
    } else {
      const p = penetrationNormal(pos, aabb);
      normal = p.normal;
      penetration = p.depth + radius;
    }

    pos = pos.add(normal.scale(penetration));
  }

  return pos;
}
