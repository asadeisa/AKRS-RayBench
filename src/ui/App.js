import { MainMenu } from './MainMenu.js';
import { PauseMenu } from './PauseMenu.js';

// App state machine MENU <-> PLAYING <-> PAUSED (memory/ui.md — Decided
// PLAN-08/U1). Owns UI chrome only: starts/stops the engine Loop, requests/
// releases pointer lock, and mounts the menu DOM. Pause = pointer-lock exit
// while PLAYING (`pointerlockchange`), which also releases the lock. Gameplay
// reset/save logic itself is boot-owned (main.js) and reaches App only
// through the onNewGame/onContinue/onRestart/onQuit hooks.
export class App {
  constructor({ root, canvas, loop, input, hasSave, onNewGame, onContinue, onRestart, onQuit, hud, fpsCounter, debugOverlay, settings = null }) {
    this.root = root;
    this.canvas = canvas;
    this.loop = loop;
    this.input = input;
    this.hasSave = hasSave;
    this.onNewGame = onNewGame;
    this.onContinue = onContinue;
    this.onRestart = onRestart;
    this.onQuit = onQuit;
    this.hud = hud;
    this.fpsCounter = fpsCounter;
    this.debugOverlay = debugOverlay;
    this.settings = settings; // U3: pre-wired to live camera/renderer/controls/adaptiveController
    this.state = 'MENU';
    this._settingsReturnMenu = null;

    this.mainMenu = new MainMenu({
      hasSave: () => this.hasSave(),
      onNewGame: () => this._enterPlaying(this.onNewGame),
      onContinue: () => this._enterPlaying(this.onContinue),
      onSettings: () => this._openSettings(this.mainMenu),
    });
    this.pauseMenu = new PauseMenu({
      onResume: () => this._resume(),
      onRestart: () => this._enterPlaying(this.onRestart),
      onSettings: () => this._openSettings(this.pauseMenu),
      onQuit: () => this._quitToMenu(),
    });

    document.addEventListener('pointerlockchange', () => this._onPointerLockChange());
    document.addEventListener('keydown', (e) => this._onKeyDown(e));
    this.mainMenu.mount(this.root);
  }

  _enterPlaying(setup) {
    setup();
    this.pauseMenu.unmount();
    this.mainMenu.unmount();
    this.state = 'PLAYING';
    this.loop.start();
    this.input.requestPointerLock();
    this._mountHud();
  }

  _resume() {
    this.pauseMenu.unmount();
    this.state = 'PLAYING';
    this.loop.start();
    this.input.requestPointerLock();
    this._mountHud();
  }

  pause() {
    if (this.state !== 'PLAYING') return;
    this.state = 'PAUSED';
    this.loop.stop();
    this._unmountHud();
    this.pauseMenu.mount(this.root);
  }

  _quitToMenu() {
    this.pauseMenu.unmount();
    this.state = 'MENU';
    this.loop.stop();
    this._unmountHud();
    if (document.pointerLockElement) document.exitPointerLock();
    this.onQuit();
    this.mainMenu.mount(this.root);
  }

  // Settings is reachable from both menus (U1); remember which one to
  // restore on close, since both share the same #ui root.
  _openSettings(returnMenu) {
    if (!this.settings) return;
    this._settingsReturnMenu = returnMenu;
    returnMenu.unmount();
    this.settings.mount(this.root);
  }

  closeSettings() {
    if (!this.settings) return;
    this.settings.unmount();
    this._settingsReturnMenu?.mount(this.root);
    this._settingsReturnMenu = null;
  }

  _mountHud() {
    if (!this.hud) return;
    this.fpsCounter?.mount(this.hud);
    this.debugOverlay?.mount(this.hud);
  }

  _unmountHud() {
    this.fpsCounter?.unmount();
    this.debugOverlay?.unmount();
  }

  // Read-only overlays refresh once per frame, PLAYING only (memory/ui.md —
  // Decided PLAN-08/U2). Called from the boot's Loop.update, since App itself
  // isn't in the render path.
  onFrame(dt) {
    if (this.state !== 'PLAYING') return;
    this.fpsCounter?.update(dt);
    this.debugOverlay?.update();
  }

  _onKeyDown(e) {
    if (e.code === 'F3' && this.state === 'PLAYING') {
      e.preventDefault();
      this.debugOverlay?.toggle();
    }
  }

  _onPointerLockChange() {
    const locked = document.pointerLockElement === this.canvas;
    if (!locked && this.state === 'PLAYING') this.pause();
  }
}
