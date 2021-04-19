import Phaser from 'phaser';
import { CONST } from '../constants';

// For debugging the cursor position
// let mousePos = { x: 0, y: 0 };

export class Level extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.LEVEL
    });
  }

  preload(){
    // Map & tiles
    this.load.image('tiles', 'images/level1.png');
    this.load.tilemapTiledJSON('maps/level1');

    // Valid build location sprite (drawn on tilemap)
    this.load.image('build-ready', 'images/valid-build.png');
  }

  create(){
    // Map and tiles setup
    this.tilemap = this.make.tilemap({ key: 'maps/level1' });
    let tileset = this.tilemap.addTilesetImage('level1_tiles', 'tiles');
    this.tilemap.createLayer('base', tileset);

    // Cursor
    this.input.setDefaultCursor('url(images/cursor.png), pointer');

    // Valid build location (drawn on tilemap)
    this.buildReady = this.add.sprite(0, 0, 'build-ready').setOrigin(0,0);
  }

  update(){
    // Update buildable area indicator
    this.buildReady.x = (16 * Math.floor(this.input.x / 16));
    this.buildReady.y = (16 * Math.floor(this.input.y / 16));

    // Debugging - Prints the cursor position. Will be useful later
    // if (mousePos.x != this.input.x && mousePos.y != this.input.y) {
    //   mousePos.x = this.input.x;
    //   mousePos.y = this.input.y;
    //   console.log(`x: ${mousePos.x}, y: ${mousePos.y}`)
    // }
  }
}