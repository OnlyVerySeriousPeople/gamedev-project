import AppPage from '../app-page.js';

export default class MenuPage extends AppPage {
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
    this.ee.onEvent('pageOpen', () => {
      this.sm.playTrack('page-soundtrack');
    });
  }

  setButtonListeners() {
    const { ee } = this;
    const playBtn = document.getElementById('play-button');
    playBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', playBtn);
      ee.emitEvent('pageClose');
      ee.emitEvent('newPage', playBtn.getAttribute('data-href'));
    });
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
  }
}
