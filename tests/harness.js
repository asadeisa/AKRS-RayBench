// Zero-dependency test harness (memory/testing.md — Decided). No libraries,
// no bundler: `run.js` imports every `*.test.js`, each calls `test()` at
// import time, then `run()` executes them all and reports pass/fail.

const tests = [];

export function test(name, fn) {
  tests.push({ name, fn });
}

export function assert(condition, message = 'assertion failed') {
  if (!condition) throw new Error(message);
}

export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message ?? `expected ${expected}, got ${actual}`);
  }
}

export function assertClose(actual, expected, eps = 1e-9, message) {
  if (Math.abs(actual - expected) > eps) {
    throw new Error(message ?? `expected ${expected} within ${eps}, got ${actual}`);
  }
}

export function assertThrows(fn, message = 'expected function to throw') {
  let threw = false;
  try {
    fn();
  } catch {
    threw = true;
  }
  if (!threw) throw new Error(message);
}

export function run() {
  let passed = 0;
  let failed = 0;
  for (const { name, fn } of tests) {
    try {
      fn();
      passed++;
      console.log(`  ok   ${name}`);
    } catch (err) {
      failed++;
      console.log(`  FAIL ${name}`);
      console.log(`       ${err.message}`);
    }
  }
  console.log(`\n${passed} passed, ${failed} failed, ${tests.length} total`);
  return failed;
}
