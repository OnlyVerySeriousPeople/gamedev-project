import BackgroundLayer from './background-layer.js';

export default class DynamicLayer extends BackgroundLayer {
  constructor(data) {
    super(data);
    this.speed = data.speed;
  }

  update() {
    this.box.pos.x -= this.speed;
  }
}
