export { Room } from './Room.js';
export { RoomManager } from './RoomManager.js';
export * from './events.js';
export { Switch } from './Switch.js';
export { Door } from './Door.js';
export { Collectible } from './Collectible.js';
export { traceBeam } from './beam.js';
export { Puzzle } from './Puzzle.js';
export { save, load, clear, snapshot, restart, SAVE_KEY, SAVE_VERSION } from './save.js';

// World collider list for engine Collision.resolve: every world-object AABB
// from Scene.objectBounds() ([[geometry]]) plus each closed door's collider
// (memory/gameplay.md — Decided PLAN-07/P2; an opened door drops its collider).
export function worldColliders(scene, doors) {
  const colliders = scene.objectBounds().map((entry) => entry.worldAABB);
  for (const door of doors) {
    const aabb = door.collider();
    if (aabb) colliders.push(aabb);
  }
  return colliders;
}
