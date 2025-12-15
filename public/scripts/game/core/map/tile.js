export default class Tile {
  constructor(width, height) {
    this.box = { pos: { x: 0, y: 0 }, width, height };
    this.blocks = [];
    this.enemies = [];
    this.enemyVisibleObjs = [];
    this.enemyInvisibleObjs = [];
    this.interactObjs = [];
    this.enemyObjs = [];
  }

  update(delay) {
    this.enemies = this.enemies.filter((enemy) => {
      enemy.update(delay, this);
      return enemy.lives > 0;
    });

    this.interactObjs = this.interactObjs.filter((interactObj) => {
      interactObj.update(delay, this);
      return interactObj.lives > 0;
    });
  }

  draw() {
    for (const block of this.blocks) block.draw();
    for (const enemy of this.enemies) enemy.draw();
    for (const interactItem of this.interactObjs) interactItem.draw();
  }
}
