// Public entry contract for src/game/ — memory/gameplay.md owns the details.
// The integration/injection layer: may import engine + geometry + camera + render + math.
//   Room, RoomManager — { key, scene, spawn, transitions } descriptor + opaque SceneManager
//                        registration; enter(key)/update(playerPos) swap the active room.
//   events.js (re-exported *) — the one owner of gameplay event names (SWITCH_TOGGLED,
//                        DOOR_OPENED/CLOSED, COLLECTIBLE_PICKED, ROOM_ENTERED, LEVEL_WON,
//                        GAME_RESTARTED).
//   Switch, Door, Collectible — proximity + `interact`-edge interactables; emit the events above.
//   traceBeam         — traceBeam(ray, scene, maxDepth) -> { hits[], terminal }; reuses
//                        scene.intersect + material.reflect (no reimplementation).
//   Puzzle            — switch-toggled mirror routes traceBeam onto a receiver -> LEVEL_WON.
//   save/load/clear/snapshot/restart — versioned localStorage persistence
//                        (SAVE_KEY, SAVE_VERSION); load() never throws (null on any failure).
//   worldColliders(scene, doors) — assembles the AABB collider list for Collision.resolve.
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
