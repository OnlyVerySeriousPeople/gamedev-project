import PlayerState from './player-state.js';

export default class DamageGetting extends PlayerState {
  constructor(name, index, player) {
    super(name, index, player);

    this.inputResponse.set('none', {
      nextStateName: 'damageGetting',
      vx: 'current',
      vy: 'current',
    });
  }

  handleBlockCollision(tile) {
    const { player } = this;
    const collisions = player.detectCollisions(tile.blocks);
    if (!collisions.sides.includes('none')) {
      player.stateMachine.setState('standing');
    }
  }

  changeOnce() {
    this.playSound('lost-life');
  }
}
