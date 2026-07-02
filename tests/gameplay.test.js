import { test, assert, assertEqual } from './harness.js';
import { save, load, clear, SAVE_KEY, restart } from '../src/game/save.js';

// Stubbed, in-memory localStorage (no DOM) — deterministic, no real browser storage touched.
class MemoryStorage {
  constructor() {
    this._data = new Map();
  }
  getItem(key) {
    return this._data.has(key) ? this._data.get(key) : null;
  }
  setItem(key, value) {
    this._data.set(key, String(value));
  }
  removeItem(key) {
    this._data.delete(key);
  }
}

function withStubbedStorage(fn) {
  const original = globalThis.localStorage;
  const storage = new MemoryStorage();
  Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true, writable: true });
  try {
    fn(storage);
  } finally {
    Object.defineProperty(globalThis, 'localStorage', { value: original, configurable: true, writable: true });
  }
}

test('save/load: round-trips a snapshot through stubbed localStorage', () => {
  withStubbedStorage(() => {
    const state = {
      currentRoom: 'atrium',
      collected: ['gem1'],
      switches: { s1: true },
      doors: { d1: false },
      settings: { fov: 75 },
    };
    save(state);
    const loaded = load();
    assertEqual(loaded.currentRoom, 'atrium');
    assertEqual(loaded.collected.length, 1);
    assertEqual(loaded.collected[0], 'gem1');
    assertEqual(loaded.switches.s1, true);
    assertEqual(loaded.doors.d1, false);
    assertEqual(loaded.settings.fov, 75);
  });
});

test('load: returns null when no save exists', () => {
  withStubbedStorage(() => {
    assertEqual(load(), null);
  });
});

test('load: returns null (not a throw) on corrupt JSON', () => {
  withStubbedStorage((storage) => {
    storage.setItem(SAVE_KEY, '{not valid json');
    assertEqual(load(), null);
  });
});

test('load: returns null (not a throw) on a save-version mismatch', () => {
  withStubbedStorage((storage) => {
    storage.setItem(SAVE_KEY, JSON.stringify({ version: 999, currentRoom: 'x' }));
    assertEqual(load(), null);
  });
});

test('clear: removes the save so a subsequent load() returns null', () => {
  withStubbedStorage(() => {
    save({ currentRoom: 'atrium' });
    assert(load() !== null);
    clear();
    assertEqual(load(), null);
  });
});

test('restart: resets collectibles/switches/doors and re-enters the initial room', () => {
  const enterCalls = [];
  const roomManager = {
    enter: (key) => {
      enterCalls.push(key);
      return { position: 'spawn', yaw: 0 };
    },
  };
  const collectibles = [{ id: 'c1', picked: true }, { id: 'c2', picked: true }];
  const switches = [{ id: 's1', on: true }, { id: 's2', on: true }];
  const doors = [{ id: 'd1', open: true, setOpen(v) { this.open = v; } }];

  const spawn = restart({ initialRoom: 'start', roomManager, collectibles, switches, doors });

  assertEqual(collectibles[0].picked, false);
  assertEqual(collectibles[1].picked, false);
  assertEqual(switches[0].on, false);
  assertEqual(switches[1].on, false);
  assertEqual(doors[0].open, false);
  assertEqual(enterCalls.join(','), 'start');
  assertEqual(spawn.position, 'spawn');
});
