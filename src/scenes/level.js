import Phaser from 'phaser';
import { CONST } from '../constants';
import {FirstEnemy} from './enemy';
import {Core} from '../components/core';
import {Turret} from '../components/turret';

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

    // Load core for the player to protect (TODO - change to spritesheet)
    this.load.image('core', 'images/player-sprites/core.png');
    this.load.image('firewall', 'images/player-sprites/firewall.png');
  }

  create(){
    // Map and tiles setup
    this.tilemap = this.make.tilemap({ key: 'maps/level1' });
    let tileset = this.tilemap.addTilesetImage('level1_tiles', 'tiles');
    this.tilemap.createLayer('base', tileset);
    this.tilemap.createLayer('above1', tileset);

    // Cursor
    this.input.setDefaultCursor('url(images/cursor.png), pointer');

    // Valid build location (drawn on tilemap)
    this.buildReady = this.add.sprite(0, 0, 'build-ready').setOrigin(0,0);
    this.scene.launch(CONST.SCENES.ENEMY); 

    // Set up core for the player to protect
    this.core = new Core(this, 12 * 16, 10 * 16);

    this.turrets = [];

    this.input.on('pointerup', (pointer) => {
      console.log(pointer.worldX, pointer.worldY);
      this.turrets.push(new Turret(this, pointer.worldX, pointer.worldY, 'firewall'));
    });
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
