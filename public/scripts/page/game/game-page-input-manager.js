import GameEventManager from '../../game/game-event-manager.js';
import InputManager from '../input-manager.js';

export default class GamePageInputManager extends InputManager {
  constructor(ee) {
    super(ee);
    this.gameEM = GameEventManager.getInstance();
    this.codeMappings = new Map([
      ['left', ['ArrowLeft', 'KeyA']],
      ['up', ['ArrowUp', 'KeyW', 'Space']],
      ['right', ['ArrowRight', 'KeyD']],
      ['down', ['ArrowDown', 'KeyS', 'ShiftLeft', 'ShiftRight']],
    ]);
    this.onCreate();
  }

  onKeyDown(keyCode) {
    const input = this.mapKeyCode(keyCode);
    if (input && !this.inputs.includes(input)) {
      this.inputs.push(input);
    }
    this.gameEM.emitEvent('inputAdded', this.inputs);
  }

  onKeyUp(keyCode) {
    const input = this.mapKeyCode(keyCode);
    if (input) {
      this.inputs.splice(this.inputs.indexOf(input), 1);
    }
    this.gameEM.emitEvent('inputRemoved', this.inputs);
  }

  mapKeyCode(keyCode) {
    for (const [name, codes] of this.codeMappings) {
      if (codes.includes(keyCode)) return name;
    }
    return undefined;
  }
}
