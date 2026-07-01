let nextId = 1;

export class Entity {
  constructor() {
    this.id = nextId++;
    this._components = new Map();
  }

  add(name, data) {
    this._components.set(name, data);
    return this;
  }

  get(name) {
    return this._components.get(name);
  }

  has(name) {
    return this._components.has(name);
  }

  remove(name) {
    return this._components.delete(name);
  }
}
