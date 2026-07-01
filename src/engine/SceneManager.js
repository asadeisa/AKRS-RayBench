export class SceneManager {
  constructor() {
    this._scenes = new Map();
    this._activeKey = null;
  }

  register(key, scene) {
    this._scenes.set(key, scene);
  }

  setActive(key) {
    if (!this._scenes.has(key)) {
      throw new Error(`SceneManager: no scene registered under "${key}"`);
    }
    this._activeKey = key;
  }

  getActive() {
    return this._activeKey === null ? null : this._scenes.get(this._activeKey);
  }
}
