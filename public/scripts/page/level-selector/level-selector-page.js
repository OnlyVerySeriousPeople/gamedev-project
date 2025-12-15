import AppPage from '../app-page.js';

const LEVELS_NUMBER = 2;

export default class LevelSelectorPage extends AppPage {
  setEventListeners() {
    super.setEventListeners();
    this.ee.onEvent('pageOpen', () => {
      this.sm.playTrack('page-soundtrack');
    });
  }

  setButtonListeners() {
    const { ee } = this;
    const homeBtn = document.getElementById('home-button');
    homeBtn.addEventListener('click', () => {
      ee.emitEvent('btnClick', homeBtn);
      ee.emitEvent('newPage', homeBtn.getAttribute('data-href'));
      ee.emitEvent('pageClose');
    });

    let completedLevels;
    try {
      completedLevels = JSON.parse(sessionStorage.getItem('completedLevels'));
    } catch {}

    for (let i = 1; i <= LEVELS_NUMBER; i++) {
      const starsNumber = i === 1 ? 3 : (completedLevels?.[i - 1] ?? 0);
      const isLevelLocked = starsNumber < 3;

      const levelBtn = document.getElementById(`level${i}-button`);
      if (isLevelLocked) {
        levelBtn.classList.add('locked');
      }

      levelBtn.addEventListener('click', () => {
        ee.emitEvent('btnClick', levelBtn);
        if (isLevelLocked) {
          window.alert('First, complete the previous level by collecting three stars');
        } else {
          ee.emitEvent('newPage', levelBtn.getAttribute('data-href'));
          ee.emitEvent('pageClose');
        }
      });
    }
  }
}
