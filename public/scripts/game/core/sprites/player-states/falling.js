import PlayerState from './player-state.js';

export default class Falling extends PlayerState {
  constructor(name, index, player) {
    super(name, index, player);

    this.inputResponse.set('none', {
      nextStateName: 'falling',
      vx: 0,
      vy: 'current',
    });
    this.inputResponse.set('left', {
      nextStateName: 'falling',
      vx: -this.player.maxVelocity.x,
      vy: 'current',
    });
    this.inputResponse.set('right', {
      nextStateName: 'falling',
      vx: this.player.maxVelocity.x,
      vy: 'current',
    });

    this.blockResponse.set('bottom', 'standing');
  }
}
