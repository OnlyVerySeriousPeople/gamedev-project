import Sprite from './sprite.js';

export default class Thorns extends Sprite {
  constructor(imgMetadata) {
    super(imgMetadata);
    this.lives = Infinity;
    this.damage = 1;
  }
}
