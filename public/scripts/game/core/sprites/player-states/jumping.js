import PlayerState from './player-state.js';

export default class Jumping extends PlayerState {
  constructor(name, index, player) {
    super(name, index, player);

    this.inputResponse.set('none', {
      nextStateName: 'jumping',
      vx: 0,
      vy: 'current',
    });
    this.inputResponse.set('left', {
      nextStateName: 'jumping',
      vx: -this.player.maxVelocity.x,
      vy: 'current',
    });
    this.inputResponse.set('right', {
      nextStateName: 'jumping',
      vx: this.player.maxVelocity.x,
      vy: 'current',
    });

    this.blockResponse.set('bottom', 'standing');
  }

  changeOnce() {
    this.playSound('jump');
    const { player } = this;
    const collisions = player.detectCollisions(player.tile.blocks);
    if (collisions.sides.includes('bottom')) {
      player.velocity.y -= player.maxVelocity.y;
    }
  }

  changeConstantly() {
    if (this.player.velocity.y > this.player.gravity) {
      this.player.stateMachine.setState('falling');
    }
  }
}
