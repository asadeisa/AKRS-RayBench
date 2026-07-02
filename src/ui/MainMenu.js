// Main menu surface (memory/ui.md): New Game / Continue (enabled iff a save
// exists) / Settings. A plain DOM component App mounts/unmounts into #ui.
export class MainMenu {
  constructor({ hasSave, onNewGame, onContinue, onSettings }) {
    this.hasSave = hasSave;

    this.el = document.createElement('div');
    this.el.className = 'menu main-menu';
    this.el.innerHTML = `
      <h1>Mirror Forge</h1>
      <button type="button" data-action="new">New Game</button>
      <button type="button" data-action="continue">Continue</button>
      <button type="button" data-action="settings">Settings</button>
    `;

    this.el.querySelector('[data-action="new"]').addEventListener('click', onNewGame);
    this.continueBtn = this.el.querySelector('[data-action="continue"]');
    this.continueBtn.addEventListener('click', onContinue);
    this.el.querySelector('[data-action="settings"]').addEventListener('click', onSettings);
  }

  mount(root) {
    this.continueBtn.disabled = !this.hasSave();
    root.appendChild(this.el);
  }

  unmount() {
    this.el.remove();
  }
}
