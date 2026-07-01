import { Entity } from './Entity.js';

export class World {
  constructor() {
    this._entities = new Map();
  }

  create() {
    const entity = new Entity();
    this._entities.set(entity.id, entity);
    return entity;
  }

  remove(id) {
    return this._entities.delete(id);
  }

  query(name) {
    const result = [];
    for (const entity of this._entities.values()) {
      if (entity.has(name)) result.push(entity);
    }
    return result;
  }

  each(name, fn) {
    for (const entity of this._entities.values()) {
      if (entity.has(name)) fn(entity);
    }
  }
}
