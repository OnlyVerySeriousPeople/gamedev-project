import GameEventManager from '../../game/game-event-manager.js';
import SoundManager from '../sound-manager.js';

export default class GamePageSoundManager extends SoundManager {
  constructor(sounds, ee) {
    super(sounds, ee);
    this.gameEM = GameEventManager.getInstance();
    this.onCreate();
  }

  setEventListeners() {
    super.setEventListeners();
    this.gameEM.onEvent('playSound', (soundName) => {
      this.playSound(soundName);
    });
  }
}
