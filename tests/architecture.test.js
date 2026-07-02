import { test, assert, assertEqual } from './harness.js';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Data-driven from memory/architecture.md's dependency order (low -> high):
// math -> geometry/materials/camera/engine -> render -> game -> ui.
// `perf` cross-cuts render + engine (memory/performance.md) and is exempt
// from the strict order, per this Road's boundary.
const ORDER = ['math', 'geometry', 'materials', 'camera', 'engine', 'render', 'game', 'ui'];
const CROSS_CUTTING = ['perf'];

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC = join(__dirname, '..', 'src');

function listJsFiles(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJsFiles(full));
    else if (entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

// Cross-module import specifiers only (`../<module>/...`); same-module
// relative imports (`./...`) are not dependency edges between modules.
function crossModuleImports(file) {
  const text = readFileSync(file, 'utf8');
  const matches = [...text.matchAll(/from\s+['"](\.\.\/[^'"]+)['"]/g)];
  return matches.map((m) => m[1].split('/')[1]);
}

// The rule under test: a module may only import a strictly-lower module in
// ORDER, or a cross-cutting one (perf). Anything else is an upward import.
function isUpwardImport(moduleName, targetModule) {
  if (CROSS_CUTTING.includes(targetModule)) return false;
  const moduleIndex = ORDER.indexOf(moduleName);
  const targetIndex = ORDER.indexOf(targetModule);
  if (moduleIndex === -1 || targetIndex === -1) return false; // unknown module, not this lint's concern
  return targetIndex >= moduleIndex;
}

test('isUpwardImport: detects a genuine upward import (unit check of the rule itself)', () => {
  assert(isUpwardImport('math', 'geometry'), 'math importing geometry should be flagged as upward');
  assert(isUpwardImport('geometry', 'render'), 'geometry importing render should be flagged as upward');
  assert(isUpwardImport('game', 'ui'), 'game importing ui should be flagged as upward');
});

test('isUpwardImport: allows downward imports and the perf cross-cutting exception', () => {
  assert(!isUpwardImport('geometry', 'math'), 'geometry importing math is downward, allowed');
  assert(!isUpwardImport('ui', 'game'), 'ui importing game is downward, allowed');
  assert(!isUpwardImport('render', 'perf'), 'perf is cross-cutting, exempt from the order');
  assert(!isUpwardImport('engine', 'perf'), 'perf is cross-cutting, exempt from the order');
});

test('src/: no module imports upward against the architecture dependency order', () => {
  const violations = [];

  for (const moduleName of [...ORDER, ...CROSS_CUTTING]) {
    const moduleDir = join(SRC, moduleName);
    if (!existsSync(moduleDir)) continue;

    for (const file of listJsFiles(moduleDir)) {
      for (const targetModule of crossModuleImports(file)) {
        if (CROSS_CUTTING.includes(moduleName)) continue; // perf/tests are exempt, per the Road
        if (isUpwardImport(moduleName, targetModule)) {
          violations.push(`${file}: "${moduleName}" imports "${targetModule}" (upward)`);
        }
      }
    }
  }

  assertEqual(violations.join('\n'), '', `found ${violations.length} upward import(s):\n${violations.join('\n')}`);
});
