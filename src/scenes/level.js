import Phaser from 'phaser';
import { CONST, CURRENT_ACTION } from '../constants';
import { Core } from '../components/core';
import { Turret } from '../components/turret';
import Player from '../components/player';

// For debugging the cursor position
// let mousePos = { x: 0, y: 0 };

let bgm;

const TILE = CONST.T_SIZE;

const nearestTile = (num) => {
  return (TILE * Math.floor(num / TILE));
}

const nearestIndex = (num) => {
  return (Math.floor(num / TILE));
}

export class Level extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.LEVEL
    });
  }

  preload(){
    // Testing setting background sound, 
    // Source:  https://www.fesliyanstudios.com/royalty-free-music/download/a-bit-of-hope/565
    this.load.audio('bgm', ['2020-03-22_-_A_Bit_Of_Hope_-_David_Fesliyan.mp3']);
    this.load.audio('explosion', ['sound/sfx/Explosion.mp3']);
    this.load.spritesheet('enemy1', 'images/virus_v1.png', { frameWidth: 50, frameHeight: 50, endFrame: 4 });

    // Map & tiles
    this.load.image('tiles', 'images/level1.png');
    this.load.tilemapTiledJSON('maps/level1');

    // Valid build location sprite (drawn on tilemap)
    this.load.image('build-ready', 'images/valid-build.png');

    // Load core for the player to protect (TODO - change to spritesheet)
    this.load.image('core', 'images/player-sprites/core.png');
    // this.load.image('firewall', 'images/player-sprites/firewall.png');
    this.load.spritesheet('firewall', 'images/player-sprites/firewall.png', { frameWidth: 16, frameHeight: 24 });

    // Set up keyboard handler
    this.keyUp = this.input.keyboard.addKey('W');
    this.keyDown = this.input.keyboard.addKey('S');
    this.keyLeft = this.input.keyboard.addKey('A');
    this.keyRight = this.input.keyboard.addKey('D');
    this.keyAltUp = this.input.keyboard.addKey('Up');
    this.keyAltDown = this.input.keyboard.addKey('Down');
    this.keyAltLeft = this.input.keyboard.addKey('Left');
    this.keyAltRight = this.input.keyboard.addKey('Right');
  }

  create(){
    // Star BGM
    bgm = this.sound.add('bgm', { loop: true, volume: 0.25 });
    bgm.play();

    // Map and tiles setup
    this.tilemap = this.make.tilemap({ key: 'maps/level1' });
    let tileset = this.tilemap.addTilesetImage('level1_tiles', 'tiles');
    this.tilemap.createLayer('base', tileset);
    this.tilemap.createLayer('above1', tileset);

    // Cursor
    this.input.setDefaultCursor('url(images/ui/cursors/default.png), pointer');

    // Valid build location (drawn on tilemap)
    this.buildReady = this.add.sprite(0, 0, 'build-ready').setOrigin(0,0);
    this.scene.launch(CONST.SCENES.ENEMY); 

    // Set up core for the player to protect
    this.core = new Core(this, 12 * TILE, 10 * TILE);

    this.turrets = [];
    this.turretMap = new Array(this.tilemap.width * this.tilemap.height).fill(null);

    // Add or remove a turret upon click
    this.input.on('pointerup', (pointer) => {
      let mapInd = (nearestIndex(pointer.worldY) * this.tilemap.width + nearestIndex(pointer.worldX));

      if (Player.action == CURRENT_ACTION.BUILD) {
        if (this.turretMap[mapInd] == null) {
          let newTurret = new Turret(
            this,
            nearestTile(pointer.worldX) + TILE / 2,
            nearestTile(pointer.worldY),
            'firewall'
          );
  
          this.turrets.push(newTurret);
  
          this.turretMap[mapInd] = newTurret;
        }
        else {
          console.log('occupied - can\'t build');
        }
      }
      else if (Player.action == CURRENT_ACTION.DEMOLISH) {
        if (this.turretMap[mapInd] == null) {
          console.log('unoccupied space - nothing to delete');
        }
        else {
          let toDelete = this.turretMap[mapInd]; // Get object ref
          let turretsArrInd = this.turrets.indexOf(toDelete);

          // Clean up and destroy it
          toDelete.dismantle();
          toDelete.destroy();

          // Remove all references to it.
          this.turrets.splice(turretsArrInd, 1);
          console.log(this.turrets.length);
          this.turretMap[mapInd] = null;
        }
      }
      else {
        console.log('No action selected');
      }
    });

    // Enemy stuff, on separate scene for now.
    this.scene.run(CONST.SCENES.ENEMY);

    // when event triggered, print GAME OVER on screen
    this.scene.get(CONST.SCENES.ENEMY).events.on('onCompleteHandler', () => {
      this.scene.start(CONST.SCENES.DEATH); // Thanx Kirsten
    });

    // Set up camera
    this.physics.world.bounds.width = this.tilemap.widthInPixels;
    this.physics.world.bounds.height = this.tilemap.heightInPixels;
    this.cameras.main.setBounds(
      0,
      0,
      this.tilemap.widthInPixels,
      this.tilemap.heightInPixels
    );

    // Launch Build Menu UI
    this.scene.launch(CONST.SCENES.BUILD_MENU); 
  }

  update(){
    // Update buildable area indicator
    this.input.activePointer.updateWorldPoint(this.cameras.main);
    this.buildReady.x = (TILE * Math.floor(this.input.activePointer.worldX / TILE));
    this.buildReady.y = (TILE * Math.floor(this.input.activePointer.worldY / TILE));

    // Debugging - Prints the cursor position. Will be useful later
    // if (mousePos.x != this.input.x && mousePos.y != this.input.y) {
    //   mousePos.x = this.input.x
    //   mousePos.y = this.input.y;

    //   // this.input.pointer.updateWorldPoint(this.cameras.main);
    //   this.input.activePointer.updateWorldPoint(this.cameras.main);

    //   console.log(`x: ${mousePos.x}, y: ${mousePos.y}`)
    //   console.log(`x: ${this.input.activePointer.worldX}, y: ${this.input.activePointer.worldY}`)
    // }


    // Turret logic
    this.turrets.forEach(turret => {
      turret.update();
    });

    // Keyboard camera controls
    if (this.keyDown.isDown || this.keyAltDown.isDown) {
      this.cameras.main.scrollY += 5;
    }
    if (this.keyUp.isDown || this.keyAltUp.isDown) {
      this.cameras.main.scrollY -= 5;
    }
    if (this.keyRight.isDown || this.keyAltRight.isDown) {
      this.cameras.main.scrollX += 5;
    }
    if (this.keyLeft.isDown || this.keyAltLeft.isDown) {
      this.cameras.main.scrollX -= 5;
    }
  }
}
