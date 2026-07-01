import { Vector3 } from '../math/index.js';

// Flattens a Node graph into the renderable list + light list the ray-tracer
// consumes. Rebuild after any transform change (root.markDirty() cascades,
// but the flat lists themselves are not incrementally updated).
export class Scene {
  constructor(root) {
    this.root = root;
    this.renderables = [];
    this.lights = [];
  }

  build() {
    this.renderables = [];
    this.lights = [];
    this._visit(this.root);
    return this;
  }

  _visit(node) {
    if (node.geometry) {
      this.renderables.push(node);
    }
    if (node.light) {
      this.lights.push({
        position: node.worldMatrix.transformPoint(new Vector3(0, 0, 0)),
        color: node.light.color,
        intensity: node.light.intensity,
      });
    }
    for (const child of node.children) {
      this._visit(child);
    }
  }

  // Closest-hit scan across every renderable's geometry — the tracer's
  // primary-ray query and materials.shade()'s shadow-ray query both go
  // through here. No acceleration structure yet (PLAN-09 hook is
  // objectBounds()/bounds() below); this is a linear scan.
  intersect(ray, tMin = 1e-4, tMax = Infinity) {
    let closest = null;
    let closestT = tMax;
    for (const node of this.renderables) {
      const hit = node.geometry.intersect(ray, tMin, closestT);
      if (hit) {
        closest = hit;
        closestT = hit.t;
      }
    }
    return closest;
  }

  // Stable per-object world-AABB accessor — the hook PLAN-09's BVH builds on.
  // Renderables with no finite local bounds (e.g. an infinite Plane) are
  // omitted: a BVH has nothing spatial to index them by.
  objectBounds() {
    const entries = [];
    for (const object of this.renderables) {
      const worldAABB = object.worldBounds();
      if (worldAABB) entries.push({ object, worldAABB });
    }
    return entries;
  }

  // Scene-level AABB: union of every renderable's world AABB. Null if no
  // renderable has finite bounds.
  bounds() {
    let union = null;
    for (const { worldAABB } of this.objectBounds()) {
      union = union ? union.union(worldAABB) : worldAABB;
    }
    return union;
  }
}
