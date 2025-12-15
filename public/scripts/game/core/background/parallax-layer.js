import BackgroundLayer from './background-layer.js';

export default class ParallaxLayer extends BackgroundLayer {
  constructor(data) {
    super(data);
    this.speedModifier = data.speedModifier;
    this.previousPlayerPosX = 0;
  }

  update(playerPosX) {
    this.box.pos.x -= this.speedModifier * (playerPosX - this.previousPlayerPosX);
    this.previousPlayerPosX = playerPosX;
  }
}
