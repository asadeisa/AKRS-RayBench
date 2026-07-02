const LEAF_SIZE = 4;

// Median-split BVH over per-object world AABBs (memory/performance.md —
// Assumption (Med): median split, not SAH). Built once per scene build (room
// swap), not per frame — never rebuilt inside the render loop. Returns the
// same closest Hit the linear scan would; this is purely a traversal
// optimization, not a visual change.
export class BVH {
  constructor(scene) {
    const entries = scene.objectBounds();
    this.root = entries.length ? buildNode(entries) : null;
  }

  intersect(ray, tMin = 1e-4, tMax = Infinity) {
    if (!this.root) return null;
    return intersectNode(this.root, ray, tMin, tMax);
  }
}

function boundsOf(entries) {
  let union = entries[0].worldAABB;
  for (let i = 1; i < entries.length; i++) union = union.union(entries[i].worldAABB);
  return union;
}

function centroid(aabb, axis) {
  return (aabb.min[axis] + aabb.max[axis]) / 2;
}

function buildNode(entries) {
  const bounds = boundsOf(entries);

  if (entries.length <= LEAF_SIZE) {
    return { bounds, entries, left: null, right: null };
  }

  const extent = {
    x: bounds.max.x - bounds.min.x,
    y: bounds.max.y - bounds.min.y,
    z: bounds.max.z - bounds.min.z,
  };
  const axis = extent.x >= extent.y && extent.x >= extent.z ? 'x' : extent.y >= extent.z ? 'y' : 'z';

  const sorted = entries.slice().sort((a, b) => centroid(a.worldAABB, axis) - centroid(b.worldAABB, axis));
  const mid = Math.floor(sorted.length / 2);

  return {
    bounds,
    entries: null,
    left: buildNode(sorted.slice(0, mid)),
    right: buildNode(sorted.slice(mid)),
  };
}

function intersectNode(node, ray, tMin, tMax) {
  const entryT = node.bounds.intersectRay(ray);
  if (entryT === null || entryT > tMax) return null;

  if (node.entries) {
    let closest = null;
    let closestT = tMax;
    for (const { object } of node.entries) {
      const hit = object.geometry.intersect(ray, tMin, closestT);
      if (hit) {
        closest = hit;
        closestT = hit.t;
      }
    }
    return closest;
  }

  const leftHit = intersectNode(node.left, ray, tMin, tMax);
  const narrowedTMax = leftHit ? leftHit.t : tMax;
  const rightHit = intersectNode(node.right, ray, tMin, narrowedTMax);
  return rightHit || leftHit;
}
