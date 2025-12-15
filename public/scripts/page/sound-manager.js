export default class SoundManager {
  constructor(sounds, ee) {
    this.newPageDelay = 500;
    this.sounds = sounds;
    this.isMusicOn = true;
    this.isSoundsOn = true;
    this.currentTrack = null;
    this.ee = ee;
  }

  static async loadSounds(soundNames) {
    return new Map(
      await Promise.all(
        soundNames.map(
          (name) =>
            new Promise((resolve, reject) => {
              const sound = new Audio(`assets/sounds/${name}.mp3`);
              sound.preload = 'auto';
              sound.oncanplaythrough = () => resolve([name, sound]);
              sound.onerror = reject;
            }),
        ),
      ),
    );
  }

  onCreate() {
    this.setEventListeners();
  }

  setEventListeners() {
    const { ee } = this;
    ee.onEvent('btnClick', () => {
      this.playSound('button-click');
    });
    ee.onEvent('toggleSounds', () => {
      this.isSoundsOn = !this.isSoundsOn;
    });
    ee.onEvent('toggleMusic', () => {
      this.isMusicOn = !this.isMusicOn;
      if (this.currentTrack) {
        this.currentTrack.volume = this.isMusicOn ? 1.0 : 0.0;
      }
    });
    ee.onEvent('pageClose', () => {
      this.pause(this.currentTrack);
    });
  }

  playSound(name) {
    const sound = this.sounds.get(name);
    if (sound && this.isSoundsOn) {
      sound.pause();
      sound.currentTime = 0;
      sound.play();
    }
  }

  playTrack(name) {
    const soundtrack = this.sounds.get(name);
    if (soundtrack) {
      this.currentTrack = soundtrack;
      soundtrack.volume = this.isMusicOn ? 1.0 : 0.0;
      soundtrack.loop = true;
      soundtrack.play();
    }
  }

  pause(name) {
    const audio = this.sounds.get(name);
    if (audio) {
      if (!audio.paused) audio.pause();
    }
  }
}
