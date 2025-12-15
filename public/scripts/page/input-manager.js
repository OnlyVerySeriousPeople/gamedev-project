export default class InputManager {
  constructor(ee) {
    this.ee = ee;
    this.inputs = [];
  }

  onCreate() {
    this.setKeyListeners();
  }

  setKeyListeners() {
    window.addEventListener('keydown', (action) => {
      this.onKeyDown(action.code);
    });
    window.addEventListener('keyup', (action) => {
      this.onKeyUp(action.code);
    });
  }

  onKeyDown() {}

  onKeyUp() {}
}
