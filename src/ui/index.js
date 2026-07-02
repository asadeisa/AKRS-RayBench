// Public entry contract for src/ui/ — memory/ui.md owns the details.
// Highest-level module; consumes gameplay/engine/render/camera via injected refs from boot
// (src/main.js), not static imports.
//   App          — MENU/PLAYING/PAUSED state machine; wires menus, pause, and Settings.
//   MainMenu, PauseMenu — plain DOM menu components.
//   Settings     — live-editable render/control settings panel (FOV, AA samples, reflection
//                  depth, mouse sensitivity, invert-Y, resolution scale, adaptive toggle);
//                  applies to live camera/renderer/controls/adaptiveController refs, persists
//                  via an injected onPersist.
//   FpsCounter   — throttled readout of Loop.timing.fps.
//   DebugOverlay — read-only camera/scene/renderer (+ optional frameBudget) panel, F3-toggled.
export { App } from './App.js';
export { MainMenu } from './MainMenu.js';
export { PauseMenu } from './PauseMenu.js';
export { Settings } from './Settings.js';
export { FpsCounter } from './FpsCounter.js';
export { DebugOverlay } from './DebugOverlay.js';
