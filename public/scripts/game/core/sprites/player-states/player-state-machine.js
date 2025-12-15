const STATES = {
  standing: (await import('./standing.js')).default,
  running: (await import('./running.js')).default,
  jumping: (await import('./jumping.js')).default,
  falling: (await import('./falling.js')).default,
  damageGetting: (await import('./damage-getting.js')).default,
};

export default class PlayerStateMachine {
  constructor(player) {
    this.player = player;
    this.states = new Map(
      Object.keys(STATES).map((name) => {
        const index = player.frame.states.findIndex((state) => state.name === name);
        return [name, new STATES[name](name, index, player)];
      }),
    );
    this.currentState = this.states.get('standing');
  }

  setState(stateName) {
    if (stateName === this.currentState.name) return;

    this.currentState = this.states.get(stateName);
    this.currentState.setFrame();
    this.currentState.changeOnce();
  }

  update(tile, inputs) {
    this.currentState.handleBlockCollision(tile);
    this.currentState.handleEnemyCollision(tile);
    this.currentState.handleInteractItemCollision(tile);
    this.currentState.handleInputs(inputs);
    this.currentState.changeConstantly();
  }
}
