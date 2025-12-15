import Sprite from './sprite.js';

export default class Finish extends Sprite {
  interact(_, player) {
    player.lives = Infinity;
  }
}
