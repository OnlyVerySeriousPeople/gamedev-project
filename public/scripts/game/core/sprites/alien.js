import Sprite from './sprite.js';

export default class Alien extends Sprite {
  constructor(imgMetadata) {
    super(imgMetadata);
    this.maxVelocity.x = 1.5;
    this.maxVelocity.y = 0;
    this.velocity.x = -this.maxVelocity.x;
    this.lives = 3;
    this.previousLivesValue = this.lives;
    this.damage = 1;
  }

  stateUpdate() {
    if (this.lives !== this.previousLivesValue && this.lives > 0) {
      this.velocity.x -= Math.sign(this.velocity.x) * this.maxVelocity.x * 0.25;

      this.currentFrame.state++;
      this.currentFrame.index = 0;

      this.previousLivesValue = this.lives;
    }
  }

  velocityUpdate(tile) {
    const { velocity } = this;
    velocity.y += this.gravity;
    const currentVX = velocity.x;
    velocity.x = currentVX;
    const collisions = this.detectCollisions(tile.enemyObjs);
    for (const side of collisions.sides) {
      if (side !== 'bottom') {
        velocity.x = -currentVX;
        return;
      }
    }

    const box = structuredClone(this.box);
    const bottomCheckBox = structuredClone(this.box);
    bottomCheckBox.pos.x += Math.sign(currentVX) * box.width;
    this.box = bottomCheckBox;
    const bottomCheck = this.detectCollisions(tile.enemyObjs);
    this.box = box;

    velocity.x = currentVX;
    if (!bottomCheck.sides.includes('bottom')) velocity.x = -currentVX;
  }

  update(delay, tile) {
    this.velocityUpdate(tile);
    this.box.pos.x += this.velocity.x;
    this.box.pos.y += this.velocity.y;

    this.stateUpdate();
    this.updateFrame(delay);
  }
}
