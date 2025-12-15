import DynamicLayer from './dynamic-layer.js';
import ParallaxLayer from './parallax-layer.js';

export default class Background {
  constructor(levelData, imgMetadata) {
    this.layers = levelData.bgLayers.map((layerIndex) => {
      const layerData = imgMetadata.bgLayers[layerIndex];
      const Layer = layerData.speed !== undefined ? DynamicLayer : ParallaxLayer;
      return new Layer(layerData);
    });
  }

  update(playerPosX) {
    for (const layer of this.layers) {
      if (layer instanceof DynamicLayer) layer.update();
      else layer.update(playerPosX);
    }
  }

  draw(gamePosX) {
    for (const layer of this.layers) layer.draw(gamePosX);
  }
}
