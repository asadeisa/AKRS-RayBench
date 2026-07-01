// Versioned localStorage persistence (memory/gameplay.md — Decided PLAN-07/P4;
// memory/conventions.md: localStorage + versioned JSON). `save`/`load`/`clear`
// own the raw key; `snapshot`/`restart` translate to/from the live gameplay
// objects built in P1–P3 (RoomManager, Switch, Door, Collectible).
export const SAVE_KEY = 'mirror-forge:save';
export const SAVE_VERSION = 1;

// Shape: { version, currentRoom, collected[], switches{}, doors{}, settings }.
// `settings` is carried opaquely — [[ui]] (PLAN-08) owns its contents.
export function save(state) {
  const payload = { version: SAVE_VERSION, ...state };
  localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
}

// Returns the saved state, or null on no save / a version mismatch / corrupt
// JSON — never throws.
export function load() {
  let raw;
  try {
    raw = localStorage.getItem(SAVE_KEY);
  } catch {
    return null;
  }
  if (raw == null) return null;

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!parsed || parsed.version !== SAVE_VERSION) return null;

  const { version, ...state } = parsed;
  return state;
}

export function clear() {
  localStorage.removeItem(SAVE_KEY);
}

// Builds a serializable snapshot of the current progress from the live
// gameplay objects. `settings` is passed through opaquely (caller-supplied).
export function snapshot({ roomManager, collectibles = [], switches = [], doors = [], settings = null }) {
  return {
    currentRoom: roomManager.activeRoom?.key ?? null,
    collected: collectibles.filter((c) => c.picked).map((c) => c.id),
    switches: Object.fromEntries(switches.map((s) => [s.id, s.on])),
    doors: Object.fromEntries(doors.map((d) => [d.id, d.open])),
    settings,
  };
}

// Resets the current room/level to initial: reopens `initialRoom`, un-picks
// every collectible, and drives switches/doors back to their initial
// on/off / open/closed state (memory/gameplay.md — restart resets to
// initial). No new mechanics — reuses each object's own state fields.
export function restart({ initialRoom, roomManager, collectibles = [], switches = [], doors = [] }) {
  for (const collectible of collectibles) collectible.picked = false;
  for (const sw of switches) sw.on = false;
  for (const door of doors) door.setOpen(false);
  return roomManager.enter(initialRoom);
}
