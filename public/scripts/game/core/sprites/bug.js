import Sprite from './sprite.js';

export default class Bug extends Sprite {
  constructor(imgMetadata) {
    super(imgMetadata);
    this.states = Object.fromEntries(this.frame.states.map((state, i) => [state.name, i]));

    this.maxVelocity.x = 6;
    this.maxVelocity.y = 24;
    this.velocity.x = this.maxVelocity.x;
    this.velocity.y = -this.maxVelocity.y;

    this.turnAroundFlag = true;
    this.fallFlag = true;

    this.standDelay = 200;
    this.standTimer = 0;

    this.lives = 1;
    this.damage = 2;
  }

  setState(stateName) {
    this.currentFrame.state = this.states[stateName];
    this.currentFrame.index = 0;
  }

  update(delay, tile) {
    this.velocity.y += this.gravity;

    this.box.pos.x += this.velocity.x;
    this.box.pos.y += this.velocity.y;

    if (this.fallFlag && this.velocity.y > this.gravity) {
      this.setState('falling');
      this.fallFlag = false;
    } else if (this.detectCollisions(tile.enemyObjs).sides.includes('bottom')) {
      if (this.standTimer === 0) {
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.setState('standing');
      } else if (this.standTimer > this.standDelay) {
        this.velocity.x = this.maxVelocity.x * (this.currentFrame.mirror ? -1 : 1);
        this.velocity.y = -this.maxVelocity.y;
        this.setState('jumping');

        this.fallFlag = true;
        this.turnAroundFlag = true;
      } else if (this.turnAroundFlag && this.standTimer > this.standDelay / 2) {
        this.currentFrame.mirror = !this.currentFrame.mirror;
        this.turnAroundFlag = false;
      }

      this.standTimer = this.standTimer <= this.standDelay ? this.standTimer + delay : 0;
    }

    this.updateFrame(delay);
  }
}
