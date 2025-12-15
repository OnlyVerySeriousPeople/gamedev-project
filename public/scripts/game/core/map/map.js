const SPRITES = {
  finish: (await import('../sprites/finish.js')).default,
  star: (await import('../sprites/star.js')).default,
  alien: (await import('../sprites/alien.js')).default,
  bug: (await import('../sprites/bug.js')).default,
  thorns: (await import('../sprites/thorns.js')).default,
};

import Block from './block.js';
import Tile from './tile.js';

const CELL_SIZE = 64;
const TILE_N_ROWS = 10;
const TILE_N_COLS = 20;
const TILE_WIDTH = TILE_N_COLS * CELL_SIZE;
const TILE_HEIGHT = TILE_N_ROWS * CELL_SIZE;

export default class GameMap {
  constructor(levelData, imgMetadata) {
    this.tilesNumber = 0;
    this.tiles = [];
    this.visibleTiles = [];
    this.currentTileIndex = 0;
    this.currentTile = null;
    this.levelLength = 0;
    this.decodeLevelArray(levelData.encodedLevel, imgMetadata);
  }

  decodeLevelArray(encodedLevel, imgMetadata) {
    const decoding = {
      emptyCell: 0,
      blocks: { min: 1000, max: 2000 },
      enemies: { min: 1, max: 300 },
      enemyVisibleObjs: { min: 301, max: 500 },
      enemyInvisibleObjs: { min: 501, max: 700 },
    };
    const objTypes = Object.keys(decoding).filter((key) => key !== 'emptyCell');

    const getObjFromEncoding = (objCode, tilePosX, row, col) => {
      const objTypeCode = Math.abs(objCode);
      for (const objType of objTypes) {
        const codeRange = decoding[objType];
        if (objTypeCode >= codeRange.min && objTypeCode <= codeRange.max) {
          let newObj, objIndex;
          if (objType === 'blocks') {
            objIndex = Math.floor((objTypeCode - decoding.blocks.min) / 10);
            const objState = objTypeCode % 10;
            newObj = new Block(imgMetadata[objType][objIndex]);
            newObj.state = objState;

            if (col === 0) {
              this.tiles[this.tilesNumber - 1]?.[objType].push(newObj);
            } else if (col === TILE_N_COLS) {
              this.tiles[this.tilesNumber + 1]?.[objType].push(newObj);
            }
          } else {
            objIndex = objTypeCode - decoding[objType].min;
            const objData = imgMetadata[objType][objIndex];
            newObj = new SPRITES[objData.name](objData, CELL_SIZE);
            if (objCode < 0) newObj.velocity.x = -newObj.velocity.x;
          }
          newObj.box.pos.x = tilePosX + col * CELL_SIZE;
          newObj.box.pos.y = (row + 1) * CELL_SIZE - newObj.box.height;
          this.tiles[this.tilesNumber][objType].push(newObj);
        }
      }
    };

    const handleTileCells = (tile, tilePosX) => {
      for (let i = 0; i < TILE_N_ROWS; i++) {
        for (let j = 0; j < TILE_N_COLS; j++) {
          getObjFromEncoding(tile[i][j], tilePosX, i, j);
        }
      }
    };

    const handleTiles = () => {
      for (const tile of encodedLevel) {
        const tilePosX = TILE_WIDTH * this.tilesNumber;
        this.tiles.push(new Tile(TILE_WIDTH, TILE_HEIGHT));
        this.tiles[this.tilesNumber].box.pos.x = tilePosX;
        handleTileCells(tile, tilePosX);
        const currentTile = this.tiles[this.tilesNumber];
        currentTile.interactObjs = currentTile.enemyVisibleObjs.concat(
          currentTile.enemyInvisibleObjs,
        );
        currentTile.enemyObjs = currentTile.blocks.concat(currentTile.enemyVisibleObjs);
        this.tilesNumber++;
      }
    };
    handleTiles();

    this.currentTile = this.tiles[this.currentTileIndex];
    this.visibleTiles.push(this.currentTile);
    if (this.tilesNumber > 1) this.visibleTiles.push(this.tiles[this.currentTileIndex + 1]);
    this.levelLength = this.tilesNumber * TILE_WIDTH;
  }

  update(player, delay) {
    if (player.box.pos.x > (this.currentTileIndex + 1) * this.currentTile.box.width) {
      if (this.currentTileIndex > 0) {
        this.visibleTiles.shift();
      }
      this.currentTile = this.tiles[++this.currentTileIndex];
      if (this.currentTileIndex < this.tiles.length - 1) {
        this.visibleTiles.push(this.tiles[this.currentTileIndex + 1]);
      }
    } else if (player.box.pos.x < this.currentTileIndex * this.currentTile.box.width) {
      this.currentTile = this.tiles[--this.currentTileIndex];
      if (this.currentTileIndex > 0) {
        this.visibleTiles.unshift(this.tiles[this.currentTileIndex - 1]);
      }
      if (this.currentTileIndex < this.tiles.length - 2) {
        this.visibleTiles.pop();
      }
    }

    for (const tile of this.visibleTiles) tile.update(delay);
  }

  draw() {
    for (const tile of this.visibleTiles) tile.draw();
  }
}
