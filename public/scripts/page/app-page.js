import EventEmitter from '../utils/event-emitter.js';
import SoundManager from './sound-manager.js';

export default class AppPage {
  constructor() {
    this.ee = new EventEmitter();
  }

  async init() {
    const sounds = await SoundManager.loadSounds(['button-click', 'page-soundtrack']);
    this.sm = new SoundManager(sounds, this.ee);
    this.sm.onCreate();
    this.onOpen();
  }

  onOpen() {
    this.setEventListeners();
    this.setButtonListeners();

    this.ee.emitEvent('pageOpen');
  }

  setStartSoundsState() {
    const isSoundsOn = sessionStorage.getItem('isSoundsOn');
    if (isSoundsOn !== null) {
      if (isSoundsOn !== this.sm.isSoundsOn.toString()) {
        this.ee.emitEvent('toggleSounds');
      }
    }
  }

  setStartMusicState() {
    const isMusicOn = sessionStorage.getItem('isMusicOn');
    if (isMusicOn !== null) {
      if (isMusicOn !== this.sm.isMusicOn.toString()) {
        this.ee.emitEvent('toggleMusic');
      }
    }
  }

  setEventListeners() {
    const { ee } = this;
    ee.onEventFirst('pageOpen', () => {
      this.setStartSoundsState();
      this.setStartMusicState();
    });
    ee.onEvent('pageClose', () => {
      sessionStorage.setItem('isSoundsOn', this.sm.isSoundsOn.toString());
      sessionStorage.setItem('isMusicOn', this.sm.isMusicOn.toString());
    });
    ee.onEvent('newPage', (newPageHref) => {
      this.redirect(newPageHref);
    });
  }

  setButtonListeners() {}

  redirect(newPageHref) {
    setTimeout(() => {
      window.location.href = newPageHref;
    }, this.sm.newPageDelay);
  }
}
