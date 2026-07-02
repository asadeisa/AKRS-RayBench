import { run } from './harness.js';

import './math.test.js';
import './geometry.test.js';
import './materials.test.js';
import './render.test.js';
import './perf.test.js';
import './engine.test.js';
import './gameplay.test.js';
import './architecture.test.js';

const fails = run();
process.exit(fails ? 1 : 0);
