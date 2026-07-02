// Public entry contract for src/camera/ — memory/camera-input.md owns the details.
// Depends on math only.
//   Camera   — position/yaw/pitch/fov; rayFor(px,py,w,h) -> Ray through the pixel center;
//              viewMatrix()/projectionMatrix(aspect); setFov(fov).
//   Controls — update(camera, input, dt) applies a normalized, polled input snapshot
//              (WASD + mouse-look + FOV zoom) to a Camera; no DOM/pointer-lock listeners.
export { Camera } from './Camera.js';
export { Controls } from './Controls.js';
