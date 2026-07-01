import { SWITCH_TOGGLED, DOOR_OPENED, DOOR_CLOSED } from './events.js';

// Subscribes to a linked switch's SWITCH_TOGGLED event; opens/closes and
// contributes an AABB collider while closed (memory/gameplay.md — Decided
// PLAN-07/P2). `bounds` is an AABB ([[math]]) used both as the door's
// collider and (via the caller's collider-assembly step) removed once open.
export class Door {
  constructor({ id, bounds, bus, linkedSwitch, open = false }) {
    this.id = id;
    this.bounds = bounds;
    this._bus = bus;
    this.linkedSwitch = linkedSwitch;
    this.open = open;

    this._onSwitchToggled = (payload) => {
      if (payload.id !== this.linkedSwitch) return;
      this.setOpen(payload.on);
    };
    bus.on(SWITCH_TOGGLED, this._onSwitchToggled);
  }

  setOpen(open) {
    if (this.open === open) return;
    this.open = open;
    this._bus.emit(open ? DOOR_OPENED : DOOR_CLOSED, { id: this.id });
  }

  // Collider contributed to the world collider list while closed; null once open.
  collider() {
    return this.open ? null : this.bounds;
  }

  dispose() {
    this._bus.off(SWITCH_TOGGLED, this._onSwitchToggled);
  }
}
