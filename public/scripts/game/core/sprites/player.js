import PlayerStateMachine from './player-states/player-state-machine.js';
import Sprite from './sprite.js';

export default class Player extends Sprite {
  constructor(data) {
    super(data);
    this.box.pos.x = 0;
    this.box.pos.y = 200;
    this.maxVelocity.x = 5;
    this.maxVelocity.y = 20;
    this.stateMachine = new PlayerStateMachine(this);
    this.lives = 5;
    this.damage = 1;
    this.stars = 0;
  }

  updateFrame(delay) {
    super.updateFrame(delay);

    if (this.stateMachine.currentState.name === 'damageGetting')
      this.currentFrame.mirror = !this.currentFrame.mirror;
  }

  update(delay, tile, levelLength, inputs) {
    this.tile = tile;
    this.velocity.y += this.gravity;

    if (this.isUnderMapBottom(tile.box.height)) this.lives = 0;

    const limitValue = (value, maxValue) => {
      return Math.sign(value) * Math.min(Math.abs(value), maxValue);
    };
    this.velocity.x = limitValue(this.velocity.x, this.maxVelocity.x);
    this.velocity.y = limitValue(this.velocity.y, this.maxVelocity.y);

    if (this.isNearMapStart()) this.box.pos.x = 0;
    else if (this.isNearMapEnd(levelLength)) this.box.pos.x = levelLength - this.box.width;
    else this.box.pos.x += this.velocity.x;

    this.box.pos.y += this.velocity.y;

    this.stateMachine.update(tile, inputs);
    this.updateFrame(delay);
  }
}
