import { test, assert, assertClose, assertEqual } from './harness.js';
import { Loop } from '../src/engine/Loop.js';
import { EventBus } from '../src/engine/EventBus.js';

// --- Loop: stubbed rAF/performance.now, no wall clock ---

function withStubbedClock(fn) {
  const originalRAF = globalThis.requestAnimationFrame;
  const originalCAF = globalThis.cancelAnimationFrame;
  const originalPerf = globalThis.performance;

  let rafCallback = null;
  let rafCalls = 0;
  let cafCalls = 0;
  let now = 0;

  globalThis.requestAnimationFrame = (fn2) => {
    rafCallback = fn2;
    rafCalls++;
    return rafCalls;
  };
  globalThis.cancelAnimationFrame = () => {
    cafCalls++;
  };
  Object.defineProperty(globalThis, 'performance', {
    value: { now: () => now },
    configurable: true,
    writable: true,
  });

  try {
    fn({
      tick: (newNow) => {
        now = newNow;
        const cb = rafCallback;
        rafCallback = null;
        cb(now);
      },
      setNow: (newNow) => {
        now = newNow;
      },
      cafCalls: () => cafCalls,
    });
  } finally {
    globalThis.requestAnimationFrame = originalRAF;
    globalThis.cancelAnimationFrame = originalCAF;
    Object.defineProperty(globalThis, 'performance', {
      value: originalPerf,
      configurable: true,
      writable: true,
    });
  }
}

test('Loop: dt is clamped on a simulated multi-second stall', () => {
  withStubbedClock((clock) => {
    const order = [];
    const loop = new Loop({
      update: (dt) => order.push(['update', dt]),
      render: () => order.push(['render']),
    });

    loop.start(); // captures the rAF callback at now=0
    clock.tick(5000); // simulate a 5s stall

    assertEqual(order.length, 2);
    assertEqual(order[0][0], 'update');
    assertClose(order[0][1], 0.1, 1e-9, 'dt should clamp to the 0.1s spiral-of-death guard');
    assertEqual(order[1][0], 'render');
    assertClose(loop.timing.dt, 0.1, 1e-9);
    assertEqual(loop.timing.frame, 1);
  });
});

test('Loop: update() runs before render() on every tick, and timing accumulates', () => {
  withStubbedClock((clock) => {
    const order = [];
    const loop = new Loop({
      update: () => order.push('update'),
      render: () => order.push('render'),
    });

    loop.start();
    clock.tick(16); // ~16ms frame
    clock.tick(32); // another ~16ms frame

    assertEqual(order.join(','), 'update,render,update,render');
    assertEqual(loop.timing.frame, 2);
    assertClose(loop.timing.dt, 0.016, 1e-9);
    assertClose(loop.timing.elapsed, 0.032, 1e-9);
  });
});

test('Loop.stop() cancels the pending animation frame and halts future ticks', () => {
  withStubbedClock((clock) => {
    const loop = new Loop({ update: () => {}, render: () => {} });
    loop.start();
    loop.stop();
    assertEqual(clock.cafCalls(), 1);
    assertEqual(loop.timing.frame, 0, 'no tick should have run after stop()');
  });
});

// --- EventBus ---

test('EventBus: emit fires every handler registered for the type', () => {
  const bus = new EventBus();
  const calls = [];
  bus.on('foo', (payload) => calls.push(['a', payload]));
  bus.on('foo', (payload) => calls.push(['b', payload]));

  bus.emit('foo', 42);

  assertEqual(calls.length, 2);
  assertEqual(calls[0][0], 'a');
  assertEqual(calls[0][1], 42);
  assertEqual(calls[1][0], 'b');
});

test('EventBus: off() removes exactly the given handler', () => {
  const bus = new EventBus();
  const calls = [];
  const handlerA = () => calls.push('a');
  const handlerB = () => calls.push('b');
  bus.on('foo', handlerA);
  bus.on('foo', handlerB);

  bus.off('foo', handlerA);
  bus.emit('foo');

  assertEqual(calls.join(','), 'b');
});

test('EventBus: emitting an unknown type is a no-op', () => {
  const bus = new EventBus();
  bus.emit('never-registered', { anything: true });
  assert(true, 'emit on an unknown type must not throw');
});
