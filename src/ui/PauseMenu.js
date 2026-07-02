// Pause menu surface (memory/ui.md): Resume / Restart / Settings / Quit to
// menu. A plain DOM component App mounts/unmounts into #ui.
export class PauseMenu {
  constructor({ onResume, onRestart, onSettings, onQuit }) {
    this.el = document.createElement('div');
    this.el.className = 'menu pause-menu';
    this.el.innerHTML = `
      <h2>Paused</h2>
      <button type="button" data-action="resume">Resume</button>
      <button type="button" data-action="restart">Restart</button>
      <button type="button" data-action="settings">Settings</button>
      <button type="button" data-action="quit">Quit to Menu</button>
    `;

    this.el.querySelector('[data-action="resume"]').addEventListener('click', onResume);
    this.el.querySelector('[data-action="restart"]').addEventListener('click', onRestart);
    this.el.querySelector('[data-action="settings"]').addEventListener('click', onSettings);
    this.el.querySelector('[data-action="quit"]').addEventListener('click', onQuit);
  }

  mount(root) {
    root.appendChild(this.el);
  }

  unmount() {
    this.el.remove();
  }
}
