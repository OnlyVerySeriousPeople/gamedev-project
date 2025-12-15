import EventEmitter from '../utils/event-emitter.js';

export default class GameEventManager extends EventEmitter {
  static getInstance() {
    if (!GameEventManager.instance) {
      GameEventManager.instance = new GameEventManager();
    }
    return GameEventManager.instance;
  }
}
