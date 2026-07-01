import { Vector3, Matrix4, Quaternion, AABB } from '../math/index.js';

// Transform-hierarchy node. World matrix is cached and only recomputed when
// this node (or an ancestor) is marked dirty by a transform change.
export class Node {
  constructor({ position, rotation, scale, geometry, material, light } = {}) {
    this.position = position ?? new Vector3(0, 0, 0);
    this.rotation = rotation ?? new Quaternion();
    this.scale = scale ?? new Vector3(1, 1, 1);
    this.geometry = geometry ?? null;
    this.material = material ?? null;
    this.light = light ?? null;
    this.children = [];
    this.parent = null;
    this._dirty = true;
    this._worldMatrix = Matrix4.identity();
  }

  add(child) {
    child.parent = this;
    child.markDirty();
    this.children.push(child);
    return child;
  }

  // Invalidates this node's cached world matrix and cascades to descendants,
  // since a parent transform change moves every child's world position too.
  markDirty() {
    this._dirty = true;
    for (const child of this.children) child.markDirty();
  }

  setPosition(position) {
    this.position = position;
    this.markDirty();
  }

  setRotation(rotation) {
    this.rotation = rotation;
    this.markDirty();
  }

  setScale(scale) {
    this.scale = scale;
    this.markDirty();
  }

  localMatrix() {
    return Matrix4.translate(this.position)
      .multiply(this.rotation.toMatrix4())
      .multiply(Matrix4.scale(this.scale));
  }

  get worldMatrix() {
    if (this._dirty) {
      const local = this.localMatrix();
      this._worldMatrix = this.parent ? this.parent.worldMatrix.multiply(local) : local;
      this._dirty = false;
    }
    return this._worldMatrix;
  }

  // World-space AABB of this node's geometry, or null if the geometry
  // exposes no local bounds (e.g. an infinite Plane) or there is none.
  worldBounds() {
    const local = Node.localBounds(this.geometry);
    if (!local) return null;

    const world = this.worldMatrix;
    let bounds = null;
    for (const x of [local.min.x, local.max.x]) {
      for (const y of [local.min.y, local.max.y]) {
        for (const z of [local.min.z, local.max.z]) {
          const p = world.transformPoint(new Vector3(x, y, z));
          bounds = bounds ? bounds.expandByPoint(p) : new AABB(p, p);
        }
      }
    }
    return bounds;
  }

  // Duck-types the geometry's local-space bounds: Mesh exposes `.bounds`
  // directly, Box exposes `.min`/`.max`, Sphere exposes `.center`/`.radius`.
  // Plane (infinite) and unrecognized geometry have no finite bounds.
  static localBounds(geometry) {
    if (!geometry) return null;
    if (geometry.bounds instanceof AABB) return geometry.bounds;
    if (geometry.min instanceof Vector3 && geometry.max instanceof Vector3) {
      return new AABB(geometry.min, geometry.max);
    }
    if (geometry.center instanceof Vector3 && typeof geometry.radius === 'number') {
      const r = new Vector3(geometry.radius, geometry.radius, geometry.radius);
      return new AABB(geometry.center.sub(r), geometry.center.add(r));
    }
    return null;
  }
}
