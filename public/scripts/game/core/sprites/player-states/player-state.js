import GameEventManager from '../../../game-event-manager.js';

export default class PlayerState {
  constructor(name, index, player) {
    this.em = GameEventManager.getInstance();
    this.name = name;
    this.index = index;
    this.player = player;
    this.inputResponse = new Map();
    this.blockResponse = new Map();
    this.damageResponse = 'damageGetting';
  }

  setFrame() {
    this.player.currentFrame.state = this.index;
    this.player.currentFrame.index = 0;
  }

  playSound(name) {
    this.em.emitEvent('playSound', name);
  }

  handleInputs(inputs) {
    let response = this.inputResponse.get('none');
    for (const input of inputs) {
      if (this.inputResponse.has(input)) {
        response = this.inputResponse.get(input);
      }
    }
    const { player } = this;
    if (response.nextStateName !== this.name) {
      player.stateMachine.setState(response.nextStateName);
    } else {
      if (response.vx !== 'current') player.velocity.x = response.vx;
      if (response.vy !== 'current') player.velocity.y = response.vy;
    }
  }

  handleBlockCollision(tile) {
    const { player } = this;
    const collisions = player.detectCollisions(tile.blocks);
    for (const side of collisions.sides) {
      if (this.blockResponse.has(side)) {
        player.stateMachine.setState(this.blockResponse.get(side));
      }
    }
  }

  handleEnemyCollision(tile) {
    const { player } = this;
    const collisions = player.detectCollisions(tile.enemies);
    if (!collisions.sides.includes('none')) {
      let kickInertia = 0;
      let damageTaken = false;
      for (let i = 0; i < collisions.sides.length; i++) {
        if (collisions.sides[i] === 'bottom' && collisions.objects[i].lives !== Infinity) {
          this.playSound('kick');
          const enemy = collisions.objects[i];
          enemy.lives -= player.damage;
          if (!kickInertia) {
            kickInertia = player.maxVelocity.y * 0.5;
            player.velocity.y -= kickInertia;
          }
        } else {
          if (damageTaken) continue;
          damageTaken = true;

          player.lives -= collisions.objects[i].damage;
          player.velocity.x =
            player.maxVelocity.x *
            ({ left: 1, right: -1 }[collisions.sides[i]] ?? (player.velocity.x > 0 ? -1 : 1));
          if (!collisions.sides.includes('top')) player.velocity.y = -player.maxVelocity.y;
          player.stateMachine.setState(this.damageResponse);
        }
      }
    }
  }

  handleInteractItemCollision(tile) {
    const { player } = this;
    const collisions = player.detectCollisions(tile.interactObjs);
    if (!collisions.sides.includes('none')) {
      for (let i = 0; i < collisions.sides.length; i++) {
        collisions.objects[i].interact(collisions.sides[i], player);
      }
    }
  }

  changeOnce() {}

  changeConstantly() {}
}
