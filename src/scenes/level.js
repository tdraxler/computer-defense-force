import Phaser from 'phaser';
import { CONST } from '../constants';
import {FirstEnemy} from './enemy';
import {Core} from '../components/core';
import {Turret} from '../components/turret';

// For debugging the cursor position
// let mousePos = { x: 0, y: 0 };

const TILE = CONST.T_SIZE;

const nearestTile = (num) => {
  return (TILE * Math.floor(num / TILE));
}

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
    // this.load.image('firewall', 'images/player-sprites/firewall.png');
    this.load.spritesheet('firewall', 'images/player-sprites/firewall.png', { frameWidth: 16, frameHeight: 24 });
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
    this.core = new Core(this, 12 * TILE, 10 * TILE);

    this.turrets = [];

    // Add a turret upon click
    this.input.on('pointerup', (pointer) => {
      this.turrets.push(
        new Turret(
          this,
          nearestTile(pointer.worldX) + TILE / 2,
          nearestTile(pointer.worldY),
          'firewall'
        )
      );
    });
  }

  update(){
    // Update buildable area indicator
    this.buildReady.x = (TILE * Math.floor(this.input.x / TILE));
    this.buildReady.y = (TILE * Math.floor(this.input.y / TILE));

    // Debugging - Prints the cursor position. Will be useful later
    // if (mousePos.x != this.input.x && mousePos.y != this.input.y) {
    //   mousePos.x = this.input.x;
    //   mousePos.y = this.input.y;
    //   console.log(`x: ${mousePos.x}, y: ${mousePos.y}`)
    // }


    // Turret logic
    this.turrets.forEach(turret => {
      turret.update();
    });
  }
}
