import GameEventManager from '../../game-event-manager.js';

export default class BackgroundLayer {
  constructor(imgMetadata) {
    this.em = GameEventManager.getInstance();
    this.name = imgMetadata.name;
    this.box = {
      pos: { x: 0, y: 0 },
      width: imgMetadata.width,
      height: imgMetadata.height,
    };
  }

  draw(gamePosX) {
    const {
      box: { pos, width, height },
    } = this;

    pos.x += pos.x < -width ? width : pos.x > width ? -width : 0;
    const baseX = gamePosX + pos.x;

    const sBox = { x: 0, y: 0, width, height };

    [-width, 0, width].forEach((dx) => {
      this.em.emitEvent('drawObject', this.name, sBox, { x: baseX + dx, y: pos.y, width, height });
    });
  }
}
