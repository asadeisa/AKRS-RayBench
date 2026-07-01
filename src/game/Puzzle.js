import { traceBeam } from './beam.js';
import { SWITCH_TOGGLED, LEVEL_WON } from './events.js';

// Signature reflective puzzle (memory/gameplay.md — Decided PLAN-07/P3): a
// fixed emitter ray marches by reflection through the scene; a movable
// mirror has two orientations toggled by a P2 Switch via the EventBus. When
// the beam's terminal hit is the receiver, emits LEVEL_WON once.
//
// `mirror` is the mirror's own geometry object (e.g. a Plane) rather than its
// wrapping Node: geometry `intersect()` works in world space directly (Node
// transforms only feed `worldBounds()` for collision, per src/geometry/Node.js),
// so "orientation" here means the geometry's own `normal`, swapped in place.
export class Puzzle {
  constructor({ emitterRay, scene, receiver, mirror, orientations, linkedSwitch, bus, maxDepth = 4 }) {
    this.emitterRay = emitterRay;
    this.scene = scene;
    this.receiver = receiver;
    this.mirror = mirror;
    this.orientations = orientations; // [normalWhenOff, normalWhenOn]
    this.linkedSwitch = linkedSwitch;
    this._bus = bus;
    this.maxDepth = maxDepth;
    this.won = false;
    this.terminal = null;

    this._onSwitchToggled = (payload) => {
      if (payload.id !== this.linkedSwitch) return;
      this.mirror.normal = this.orientations[payload.on ? 1 : 0];
      this.retrace();
    };
    bus.on(SWITCH_TOGGLED, this._onSwitchToggled);
  }

  // Re-traces the beam against the current mirror orientation; emits
  // LEVEL_WON exactly once the first time the terminal hit is the receiver.
  retrace() {
    const { terminal } = traceBeam(this.emitterRay, this.scene, this.maxDepth);
    this.terminal = terminal;
    if (!this.won && terminal && terminal.object === this.receiver) {
      this.won = true;
      this._bus.emit(LEVEL_WON, {});
    }
    return terminal;
  }

  dispose() {
    this._bus.off(SWITCH_TOGGLED, this._onSwitchToggled);
  }
}
