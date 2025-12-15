import GameEventManager from '../game-event-manager.js';

import Background from './background/background.js';
import GameMap from './map/map.js';
import Player from './sprites/player.js';

export default class Game {
  constructor(width, height, levelData, imgMetadata) {
    this.timer = levelData.time;
    this.previousUpdateTime = new Date().getTime();
    this.state = 'gameInProgress';
    this.box = { pos: { x: 0, y: 0 }, width, height };
    this.em = GameEventManager.getInstance();
    this.inputs = [];
    this.background = new Background(levelData, imgMetadata);
    this.gameMap = new GameMap(levelData, imgMetadata);
    this.player = new Player(imgMetadata.player);
    this.playerHeart = imgMetadata.playerHeart;
    this.camera = { posX: 0, width: 1000, move: 0 };
    this.setInputListeners();
  }

  setInputListeners() {
    this.em.onEvent('inputAdded', (inputs) => {
      this.inputs = inputs;
    });
    this.em.onEvent('inputRemoved', (inputs) => {
      this.inputs = inputs;
    });
  }

  updateCamera() {
    const { player, gameMap } = this;
    this.camera.move = 0;
    const oldCameraPosX = this.camera.posX;
    this.camera.posX = Math.round(player.box.pos.x - (this.camera.width - player.box.width) * 0.5);

    const cameraLeftSide = this.camera.posX;
    const cameraRightSide = cameraLeftSide + this.camera.width;
    const gameBoxLeftSide = this.box.pos.x;
    const gameBoxRightSide = gameBoxLeftSide + this.box.width;

    const canPanLeft = cameraLeftSide > 0;
    const canPanRight = cameraRightSide < gameMap.levelLength;
    const needPanLeft = cameraLeftSide < gameBoxLeftSide;
    const needPanRight = cameraRightSide > gameBoxRightSide;

    if ((canPanLeft && needPanLeft) || (canPanRight && needPanRight)) {
      this.camera.move -= this.camera.posX - oldCameraPosX;
      this.box.pos.x -= this.camera.move;
    }
  }

  update(delay) {
    const currentTime = new Date().getTime();
    const time = currentTime - this.previousUpdateTime;
    this.timer -= time;
    this.previousUpdateTime = currentTime;

    const { gameMap, player } = this;
    this.player.update(delay, gameMap.currentTile, gameMap.levelLength, this.inputs);
    this.background.update(this.player.box.pos.x);
    this.gameMap.update(player, delay);
    this.updateCamera();

    if (player.lives <= 0 || this.timer <= 0) {
      player.lives = 0;
      this.state = 'gameOver';
      this.em.emitEvent('gameOver');
    } else if (player.lives === Infinity) {
      this.state = 'gameWin';
      this.em.emitEvent('gameWin', player.stars);
    }
  }

  draw() {
    this.background.draw(this.box.pos.x);
    this.gameMap.draw();
    this.player.draw();
    if (this.state !== 'gameWin') {
      const timeInSeconds = Math.round(this.timer);
      this.em.emitEvent('updateTime', timeInSeconds);

      this.em.emitEvent('updatePlayerLives', this.player.lives);
    }
  }
}
