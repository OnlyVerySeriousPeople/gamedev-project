import Sprite from './sprite.js';

export default class Star extends Sprite {
  interact(_, player) {
    player.stars++;
    this.lives = 0;
    this.em.emitEvent('playSound', 'pick-star');
  }
}
