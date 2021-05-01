import Phaser from 'phaser';
import { CONST, CURRENT_ACTION } from '../constants';
import { Core } from '../components/core';
import { Turret } from '../components/turret';
import Player from '../components/player';
import { Virus } from '../components/virus';
import { walk, onCompleteHandler } from '../components/walk';
import { generatePathMap, nextDir } from '../components/pathfinding';

// For debugging the cursor position
// let mousePos = { x: 0, y: 0 };

let bgm;

const TILE = CONST.T_SIZE;
const possibles = [{x: 9, y: -2}, {x: 20, y: -2}, {x: 41, y: 13}, {x: 27, y: 31}, {x: 10, y: 31}, {x: -2, y: 14}];


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

    this.walk = walk.bind(this);
    this.onCompleteHandler = onCompleteHandler.bind(this);
  }

  preload(){
    // Load config data from JSON
    const request = new XMLHttpRequest();
    request.open('GET', 'json/enemies.json', false);
    request.send(null);
    this.eData = JSON.parse(request.responseText);

    // Testing setting background sound, 
    // Source:  https://www.fesliyanstudios.com/royalty-free-music/download/a-bit-of-hope/565
    this.load.audio('bgm', ['2020-03-22_-_A_Bit_Of_Hope_-_David_Fesliyan.mp3']);
    this.load.audio('explosion', ['sound/sfx/Explosion.mp3']);
    this.load.spritesheet(this.eData[3].name, this.eData[3].source, { frameWidth: this.eData[3].width, frameHeight: this.eData[3].height, endFrame: 4 });

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

    // Set up core for the player to protect
    this.core = new Core(this, 19 * TILE, 11 * TILE);

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

    // Enemy stuff
    this.explosion = this.sound.add('explosion', { loop: false, volume: 0.25 });

    // Add walking animation for sprite
    let enemyAnims = { 
      key: 'walking', 
      frames: this.anims.generateFrameNumbers(this.eData[3].name, { start: 0, end: 3, first: 3 }),
      frameRate: 8,
      repeat: -1
    };
    this.anims.create(enemyAnims);
    // this.viruses = [];
    // // create viruses and have them do their path
    // for(let i = 0; i < 4; i++) {
    //   this.viruses.push(new Virus({scene: this, x: this.game.config.width - 10, y: this.game.config.height + 50}));
    //   this.viruses[i].play('walking');
    //   // delay each virus walk start
    //   this.timer = this.time.delayedCall(i * 5000, walk, [this.viruses[i]], this);
    // }


    this.testCritters = [];
    for (let i = 0; i < 10; i++) {
      let choice = Math.floor(Math.random() * 6);
      let newOne = new Virus({scene: this, x: possibles[choice].x * TILE + TILE / 2, y: possibles[choice].y * TILE + TILE / 2});
      newOne.delay = Math.floor(Math.random() * 10 * 60); // Number of frames to delay movement
      newOne.moveX = 0;
      newOne.moveY = 0;
      newOne.moveVal = -1;
      newOne.dirVector = {x: 0, y: 0};
      newOne.play('walking');
      this.testCritters.push(newOne);
    }
    // end of enemy stuff

    // After enemies are set up, create second layer that will render above everything else
    this.tilemap.createLayer('above2', tileset);
    this.collidemap = this.tilemap.createLayer('collide', tileset);
    this.collidemap.setVisible(false);



    // when event triggered, print GAME OVER on screen
    this.scene.get(CONST.SCENES.LEVEL).events.on('onCompleteHandler', () => {
      this.input.setDefaultCursor('url(images/ui/cursors/default.png), pointer');
      this.scene.start(CONST.SCENES.DEATH);
      this.scene.stop(CONST.SCENES.LEVEL);
      this.scene.stop(CONST.SCENES.BUILD_MENU);
      bgm.stop();
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

    this.pathmap = generatePathMap(20, 11, this.collidemap);
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

    // Test critter logic
    if (this.pathmap) {
      this.testCritters.forEach(critter => {
        if (critter.delay > 0) {
          critter.delay--;
        }
        else {
          // Move it!
          if (critter.moveVal <= 0) {
            // Figure out direction to move in
            if (Math.floor(critter.x / TILE) == 20 && Math.floor(critter.y / TILE) == 11) {
              /*let choice = Math.floor(Math.random() * 6);
              critter.x = possibles[choice].x * TILE + TILE / 2;
              critter.y = possibles[choice].y * TILE + TILE / 2;
              critter.delay = Math.floor(Math.random() * 10 * 60); // Number of frames to delay movement
              critter.moveX = 0;
              critter.moveY = 0;
              critter.moveVal = -1;
              critter.dirVector = {x: 0, y: 0};*/
              critter.destroy();
              this.explosion.play();
            }

            critter.dirVector = nextDir(Math.floor(critter.x / TILE), Math.floor(critter.y / TILE), this.pathmap);
            critter.moveVal = TILE;
          }
  
          critter.x += critter.dirVector.x;
          critter.y += critter.dirVector.y;
          critter.moveVal--;
        }
      });
    }

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
