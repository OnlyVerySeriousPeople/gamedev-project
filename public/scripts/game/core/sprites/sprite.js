import GameEventManager from '../../game-event-manager.js';

export default class Sprite {
  constructor(imgMetadata) {
    this.em = GameEventManager.getInstance();

    const { name, fps, states, ...rest } = imgMetadata;
    this.name = name;
    this.frame = { interval: 1000 / fps, states, ...rest };
    this.currentFrame = { state: 0, index: 0, mirror: false, timer: 0 };
    const { width, height } = states[this.currentFrame.state].frames[0];
    this.box = { width, height, pos: { x: 0, y: 0 } };

    this.velocity = { x: 0, y: 0 };
    this.maxVelocity = { x: 0, y: 0 };
    this.gravity = 1.5;
    this.lives = 1;
    this.damage = 0;
  }

  isNearMapStart() {
    const currentPosX = this.box.pos.x + this.velocity.x;
    return currentPosX <= 0;
  }

  isNearMapEnd(levelLength) {
    const currentPosX = this.box.pos.x + this.box.width + this.velocity.x;
    return currentPosX >= levelLength;
  }

  isOnMapTop() {
    return this.box.pos.y + this.box.width > 0;
  }

  isUnderMapBottom(tileHeight) {
    return this.box.pos.y > tileHeight;
  }

  detectCollisionSide(obj) {
    let collisionSide = 'none';

    const left = this.box.pos.x;
    const right = left + this.box.width;
    const top = this.box.pos.y;
    const bottom = top + this.box.height;

    const objLeft = obj.pos.x;
    const objRight = objLeft + obj.width;
    const objTop = obj.pos.y;
    const objBottom = objTop + obj.height;

    const isCollisionX = left <= objRight && right >= objLeft;
    const isCollisionY = top <= objBottom && bottom >= objTop;
    if (isCollisionX && isCollisionY) {
      let sideX, sideY, collisionSizeX, collisionSizeY;
      if (left === Math.min(left, objLeft)) {
        sideX = 'right';
        collisionSizeX = right - objLeft;
      } else {
        sideX = 'left';
        collisionSizeX = objRight - left;
      }
      if (top === Math.min(top, objTop)) {
        sideY = 'bottom';
        collisionSizeY = bottom - objTop;
      } else {
        sideY = 'top';
        collisionSizeY = objBottom - top;
      }
      collisionSide = collisionSizeX >= collisionSizeY ? sideY : sideX;
    }
    return collisionSide;
  }

  detectCollisions(objs) {
    const collisions = {
      sides: [],
      objects: [],
    };
    if (objs.length !== 0) {
      const collisionHandling = {
        left: { axis: 'x', newPos: objs[0].box.width },
        right: { axis: 'x', newPos: -this.box.width },
        top: { axis: 'y', newPos: objs[0].box.height },
        bottom: { axis: 'y', newPos: -this.box.height },
      };
      for (const obj of objs) {
        const side = this.detectCollisionSide(obj.box);
        if (side !== 'none') {
          collisions.sides.push(side);
          collisions.objects.push(obj);
          this.box.pos[collisionHandling[side].axis] =
            obj.box.pos[collisionHandling[side].axis] + collisionHandling[side].newPos;
          if (!(side === 'bottom' && this.velocity.y < 0)) {
            this.velocity[collisionHandling[side].axis] = 0;
          }
        }
      }
    }
    if (collisions.sides.length === 0) collisions.sides.push('none');

    return collisions;
  }

  interact(_collisionSide, _player) {}

  updateFrame(delay) {
    if (this.velocity.x !== 0) this.currentFrame.mirror = this.velocity.x < 0;

    this.currentFrame.timer += delay;
    if (this.currentFrame.timer <= this.frame.interval) return;

    this.currentFrame.timer = 0;

    const { frames } = this.frame.states[this.currentFrame.state];
    this.currentFrame.index = (this.currentFrame.index + 1) % frames.length;

    const { width, height } = frames[this.currentFrame.index];
    this.box.pos.y += this.box.height - height;
    this.box.width = width;
    this.box.height = height;
  }

  update(delay) {
    this.updateFrame(delay);
  }

  draw() {
    const {
      frame: { width, height },
      currentFrame: { state, index, mirror },
      box,
    } = this;
    const sBox = {
      x: index * width,
      y: state * height,
      width,
      height,
    };
    const dBox = {
      x: box.pos.x + (mirror ? box.width - width : 0),
      y: box.pos.y + box.height - height,
      width,
      height,
    };

    this.em.emitEvent(mirror ? 'drawMirroredObject' : 'drawObject', this.name, sBox, dBox);
  }
}
