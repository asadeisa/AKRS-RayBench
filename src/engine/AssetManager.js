export class AssetManager {
  constructor() {
    this._cache = new Map();
  }

  async load(key, url) {
    if (this._cache.has(key)) return this._cache.get(key);
    const response = await fetch(url);
    const data = await response.json();
    this._cache.set(key, data);
    return data;
  }

  get(key) {
    return this._cache.get(key);
  }
}
