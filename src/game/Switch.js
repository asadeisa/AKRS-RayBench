import { SWITCH_TOGGLED } from './events.js';

// Proximity + `interact` interactable (memory/gameplay.md — Decided PLAN-07/P2):
// a switch in range fires once per `interact` edge and emits SWITCH_TOGGLED on
// the engine EventBus. `input` is the engine InputManager.poll() snapshot.
export class Switch {
  constructor({ id, position, radius = 1.5, bus, on = false }) {
    this.id = id;
    this.position = position;
    this.radius = radius;
    this._bus = bus;
    this.on = on;
  }

  update(playerPos, input) {
    if (!input.interact) return;
    const inRange = playerPos.sub(this.position).lengthSq() <= this.radius * this.radius;
    if (!inRange) return;
    this.on = !this.on;
    this._bus.emit(SWITCH_TOGGLED, { id: this.id, on: this.on });
  }
}
