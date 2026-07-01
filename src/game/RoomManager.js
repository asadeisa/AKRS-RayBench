// Builds/registers rooms with the engine SceneManager (opaque scene handles)
// and drives room entry/transitions (memory/gameplay.md — Decided PLAN-07/P1).
// Transition volumes are [[math]] AABB/BoundingSphere — both expose
// `contains(point)`, tested duck-typed here.
export class RoomManager {
  constructor(sceneManager) {
    this._sceneManager = sceneManager;
    this._rooms = new Map();
    this._activeRoom = null;
  }

  register(room) {
    this._rooms.set(room.key, room);
    this._sceneManager.register(room.key, room.scene);
  }

  getRoom(key) {
    return this._rooms.get(key) ?? null;
  }

  get activeRoom() {
    return this._activeRoom;
  }

  // Sets the active scene + returns the target spawn { position, yaw } for
  // the caller (game/boot layer) to place the player/camera.
  enter(key) {
    const room = this._rooms.get(key);
    if (!room) {
      throw new Error(`RoomManager: no room registered under "${key}"`);
    }
    this._sceneManager.setActive(key);
    this._activeRoom = room;
    return room.spawn;
  }

  // Checks the active room's transition volumes against the player position;
  // if the player is inside one, swaps to the target room/spawn and returns
  // the new spawn. Returns null when no transition fires.
  update(playerPos) {
    if (!this._activeRoom) return null;
    for (const transition of this._activeRoom.transitions) {
      if (transition.volume.contains(playerPos)) {
        return this.enter(transition.toRoom) ?? transition.toSpawn;
      }
    }
    return null;
  }
}
