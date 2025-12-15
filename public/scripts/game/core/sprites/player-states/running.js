import PlayerState from './player-state.js';

export default class Running extends PlayerState {
  constructor(name, index, player) {
    super(name, index, player);

    this.inputResponse.set('none', { nextStateName: 'standing' });
    this.inputResponse.set('left', {
      nextStateName: 'running',
      vx: -this.player.maxVelocity.x,
      vy: 0,
    });
    this.inputResponse.set('up', { nextStateName: 'jumping' });
    this.inputResponse.set('right', {
      nextStateName: 'running',
      vx: this.player.maxVelocity.x,
      vy: 0,
    });

    this.blockResponse.set('none', 'falling');
    this.blockResponse.set('left', 'falling');
    this.blockResponse.set('right', 'falling');
    this.blockResponse.set('bottom', 'running');
  }
}
