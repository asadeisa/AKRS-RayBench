import { Vector3, Matrix4, Ray } from '../math/index.js';

const WORLD_UP = new Vector3(0, 1, 0);

// First-person camera: position + yaw/pitch (radians) -> forward/right/up basis.
// Right-handed, +Y up, -Z forward at yaw=pitch=0 (memory/conventions.md).
// FOV is vertical, in radians; rayFor and projectionMatrix share that meaning
// (memory/camera-input.md).
export class Camera {
  constructor({
    position = new Vector3(0, 0, 0),
    yaw = 0,
    pitch = 0,
    fov = Math.PI / 3,
    near = 0.1,
    far = 1000,
  } = {}) {
    this.position = position;
    this.yaw = yaw;
    this.pitch = pitch;
    this.fov = fov;
    this.near = near;
    this.far = far;
  }

  setFov(fov) {
    this.fov = fov;
  }

  // Orthonormal basis derived from yaw (about +Y) then pitch (about local right).
  basis() {
    const cp = Math.cos(this.pitch);
    const forward = new Vector3(
      -Math.sin(this.yaw) * cp,
      Math.sin(this.pitch),
      -Math.cos(this.yaw) * cp
    );
    const right = forward.cross(WORLD_UP).normalize();
    const up = right.cross(forward);
    return { forward, right, up };
  }

  // Ray through the pixel center (px+0.5, py+0.5), spread by vertical FOV + aspect.
  rayFor(px, py, width, height) {
    const { forward, right, up } = this.basis();
    const aspect = width / height;
    const halfHeight = Math.tan(this.fov / 2);
    const halfWidth = halfHeight * aspect;

    const ndcX = ((px + 0.5) / width * 2 - 1) * halfWidth;
    const ndcY = (1 - (py + 0.5) / height * 2) * halfHeight;

    const dir = forward.add(right.scale(ndcX)).add(up.scale(ndcY)).normalize();
    return new Ray(this.position, dir);
  }

  viewMatrix() {
    const { forward } = this.basis();
    const target = this.position.add(forward);
    return Matrix4.lookAt(this.position, target, WORLD_UP);
  }

  projectionMatrix(aspect) {
    return Matrix4.perspective(this.fov, aspect, this.near, this.far);
  }
}
