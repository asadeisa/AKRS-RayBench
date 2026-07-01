// Room descriptor: a registered Scene + player spawn + transition volumes to
// other rooms (memory/gameplay.md — Decided PLAN-07/P1). Data only; RoomManager
// owns registration/swapping.
export class Room {
  constructor({ key, scene, spawn, transitions = [] } = {}) {
    this.key = key;
    this.scene = scene;
    this.spawn = spawn; // { position: Vector3, yaw: number }
    this.transitions = transitions; // [{ volume, toRoom, toSpawn }]
  }
}
