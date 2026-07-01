import { COLLECTIBLE_PICKED } from './events.js';

// Proximity auto-pick interactable (memory/gameplay.md — Decided PLAN-07/P2):
// emits COLLECTIBLE_PICKED once when the player enters range, then marks
// itself picked (the caller removes it from the active list/render scene).
export class Collectible {
  constructor({ id, position, radius = 1, bus }) {
    this.id = id;
    this.position = position;
    this.radius = radius;
    this._bus = bus;
    this.picked = false;
  }

  update(playerPos) {
    if (this.picked) return;
    const inRange = playerPos.sub(this.position).lengthSq() <= this.radius * this.radius;
    if (!inRange) return;
    this.picked = true;
    this._bus.emit(COLLECTIBLE_PICKED, { id: this.id });
  }
}
