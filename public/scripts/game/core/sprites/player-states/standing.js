import PlayerState from './player-state.js';

export default class Standing extends PlayerState {
  constructor(name, index, player) {
    super(name, index, player);

    this.inputResponse.set('none', {
      nextStateName: 'standing',
      vx: 0,
      vy: 0,
    });
    this.inputResponse.set('left', { nextStateName: 'running' });
    this.inputResponse.set('up', { nextStateName: 'jumping' });
    this.inputResponse.set('right', { nextStateName: 'running' });

    this.blockResponse.set('none', 'falling');
    this.blockResponse.set('left', 'falling');
    this.blockResponse.set('right', 'falling');
    this.blockResponse.set('bottom', 'standing');
  }
}
