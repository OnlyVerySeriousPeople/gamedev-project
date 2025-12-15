import Game from '../../game/core/game.js';
import GameEventManager from '../../game/game-event-manager.js';
import AppPage from '../app-page.js';

import GamePageDrawManager from './game-page-draw-manager.js';
import GamePageInputManager from './game-page-input-manager.js';
import GamePageSoundManager from './game-page-sound-manager.js';
import TimeUtils from '../../utils/time-utils.js';

export default class GamePage extends AppPage {
  async init() {
    const queryStringParams = new URLSearchParams(window.location.search);
    this.levelIndex = Number(queryStringParams.get('level'));

    const [levelData, imgMetadata] = await Promise.all([
      fetch(`../../../levels/level-${this.levelIndex}.json`).then((r) => r.json()),
      fetch('../../../assets/images/metadata.json').then((r) => r.json()),
    ]);
    this.soundtrack = levelData.soundtrack;

    const [sounds, images] = await Promise.all([
      GamePageSoundManager.loadSounds([
        'button-click',
        'game-over',
        'game-win',
        'jump',
        'kick',
        'lost-life',
        'pause',
        'pick-star',
        this.soundtrack,
      ]),
      GamePageDrawManager.loadImages([
        imgMetadata.player.name,
        ...imgMetadata.enemies.map((enemy) => enemy.name),
        ...imgMetadata.enemyVisibleObjs.map((obj) => obj.name),
        ...imgMetadata.enemyInvisibleObjs.map((obj) => obj.name),
        ...imgMetadata.blocks.map((block) => block.name),
        ...levelData.bgLayers.map((layerIndex) => imgMetadata.bgLayers[layerIndex].name),
      ]),
    ]);

    this.canvas = document.getElementById('game-canvas');
    this.canvas.width = 1280;
    this.canvas.height = 640;
    this.ctx = this.canvas.getContext('2d');

    this.sm = new GamePageSoundManager(sounds, this.ee);
    this.dm = new GamePageDrawManager(this.ctx, images, this.ee);
    this.im = new GamePageInputManager(this.ee);

    this.gameEM = GameEventManager.getInstance();
    this.game = new Game(this.canvas.width, this.canvas.height, levelData, imgMetadata);

    this.gameUpdateInterval = 10;
    this.animationID = null;
    this.updateTimer = 0;
    this.previousTimeStamp = 0;
    this.onOpen(levelData.soundtrack);
    this.gameEM.emitEvent('gameStart');
    this.animate(0);
  }

  setStartSoundsState() {
    super.setStartSoundsState();
    document.getElementById('toggle-sounds').checked = this.sm.isSoundsOn;
  }

  setStartMusicState() {
    super.setStartMusicState();
    document.getElementById('toggle-music').checked = this.sm.isMusicOn;
  }

  setEventListeners() {
    super.setEventListeners();
    const { ee } = this;
    ee.onEvent('gamePause', () => {
      this.sm.playSound('pause');
      this.game.state = 'gamePause';
      cancelAnimationFrame(this.animationID);
      document.getElementById('game-pause-dialog').style.display = 'block';
    });
    ee.onEvent('gameResume', () => {
      this.sm.playSound('pause');
      this.game.state = 'gameInProgress';
      this.game.previousUpdateTime = new Date().getTime();
      this.animate(this.previousTimeStamp);
      document.getElementById('game-pause-dialog').style.display = 'none';
    });
    ee.onEvent('gameRetry', () => {
      setTimeout(() => location.reload(), this.sm.newPageDelay);
    });
    this.gameEM.onEvent('gameStart', () => {
      this.sm.playTrack(this.soundtrack);
    });
    this.gameEM.onEvent('updateTime', (time) => {
      document.getElementById('game-time').textContent = TimeUtils.format(time);
    });
    this.gameEM.onEvent('updatePlayerLives', (lives) => {
      const segments = document.querySelectorAll('#player-lives .hp-segment');
      segments.forEach((seg, index) => {
        if (index < lives) {
          seg.classList.remove('is-empty');
        } else {
          seg.classList.add('is-empty');
        }
      });
    });
    this.gameEM.onEvent('gameWin', (starsNumber) => {
      this.sm.pause(this.soundtrack);
      this.sm.playSound('game-win');
      document.getElementById('game-time').style.display = 'none';
      document.getElementById('game-win-dialog').style.display = 'block';

      const completedLevels = JSON.parse(sessionStorage.getItem('completedLevels')) ?? {};
      completedLevels[this.levelIndex] = starsNumber;
      sessionStorage.setItem('completedLevels', JSON.stringify(completedLevels));
    });
    this.gameEM.onEvent('gameOver', () => {
      this.sm.pause(this.soundtrack);
      this.sm.playSound('game-over');
      document.getElementById('game-over-dialog').style.display = 'block';
    });
  }

  setButtonListeners() {
    super.setButtonListeners();
    const { ee } = this;
    const soundsSwitch = document.getElementById('toggle-sounds');
    soundsSwitch.addEventListener('click', () => {
      ee.emitEvent('btnClick', soundsSwitch);
      ee.emitEvent('toggleSounds');
    });
    const musicSwitch = document.getElementById('toggle-music');
    musicSwitch.addEventListener('click', () => {
      ee.emitEvent('btnClick', musicSwitch);
      ee.emitEvent('toggleMusic');
    });
    const gamePauseBtn = document.getElementById('game-pause-button');
    gamePauseBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', gamePauseBtn);
      ee.emitEvent('gamePause');
    });
    const pauseBackBtn = document.getElementById('pause-back-button');
    pauseBackBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', pauseBackBtn);
      ee.emitEvent('gameResume');
    });
    const pauseRetryBtn = document.getElementById('pause-retry-button');
    pauseRetryBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', pauseRetryBtn);
      ee.emitEvent('gameRetry');
    });
    const gameOverRetryBtn = document.getElementById('game-over-retry-button');
    gameOverRetryBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', gameOverRetryBtn);
      ee.emitEvent('gameRetry');
    });
    for (const id of ['pause-exit-button', 'game-win-exit-button', 'game-over-exit-button']) {
      const btn = document.getElementById(id);
      btn.addEventListener('click', () => {
        ee.emitEvent('btnClick', btn);
        ee.emitEvent('pageClose');
        ee.emitEvent('newPage', btn.getAttribute('data-href'));
      });
    }
  }

  animate(timeStamp) {
    const { game } = this;
    if (!this.animationID) game.draw();
    const delay = timeStamp - this.previousTimeStamp;
    this.previousTimeStamp = timeStamp;
    if (this.updateTimer > this.gameUpdateInterval) {
      this.updateTimer = 0;
      this.ctx.clearRect(game.box.pos.x, game.box.pos.y, game.box.width, game.box.height);
      game.update(delay);
      this.ctx.translate(game.camera.move, 0);
      game.draw();
    } else {
      this.updateTimer += delay;
    }
    if (game.state === 'gameInProgress') {
      this.animationID = requestAnimationFrame((timestamp) => this.animate(timestamp));
    }
  }
}
