import GameEventManager from '../../game/game-event-manager.js';
import DrawManager from '../draw-manager.js';

export default class GamePageDrawManager extends DrawManager {
  constructor(ctx, images, ee) {
    super(ctx, images, ee);
    this.gameEM = GameEventManager.getInstance();
    this.onCreate();
  }

  setEventListeners() {
    super.setEventListeners();
    this.gameEM.onEvent('drawObject', (name, sBox, dBox) => {
      this.drawImage(name, sBox, dBox);
    });
    this.gameEM.onEvent('drawMirroredObject', (name, sBox, dBox) => {
      this.drawMirroredImage(name, sBox, dBox);
    });
  }
}
