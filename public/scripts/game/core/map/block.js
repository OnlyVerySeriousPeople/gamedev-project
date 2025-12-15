import GameEventManager from '../../game-event-manager.js';

export default class Block {
  constructor(data) {
    this.em = GameEventManager.getInstance();
    this.name = data.name;
    this.state = 0;
    this.box = {
      pos: { x: 0, y: 0 },
      width: data.width,
      height: data.height,
    };
  }

  draw() {
    const { name, state, box } = this;
    const sBox = {
      x: state * box.width,
      y: 0,
      width: box.width,
      height: box.height,
    };
    const dBox = {
      x: box.pos.x,
      y: box.pos.y,
      width: box.width,
      height: box.height,
    };
    this.em.emitEvent('drawObject', name, sBox, dBox);
  }
}
