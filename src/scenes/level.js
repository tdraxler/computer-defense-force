import Phaser from 'phaser';
import { CONST, CURRENT_ACTION } from '../constants';
import { Core } from '../components/core';
import { Turret } from '../components/turret';
import Player from '../components/player';
import { Virus } from '../components/virus';
import { walk, onCompleteHandler } from '../components/walk';
import { generatePathMap, nextDir } from '../components/pathfinding';
import { Explosion } from '../components/explosion';
import updateHpScore from '../components/hpscoreevent';

// For debugging the cursor position
// let mousePos = { x: 0, y: 0 };

let bgm;
const MIN_DELAY = 5;
const MAX_DELAY = 10 * 60;

const TILE = CONST.T_SIZE;
const BUILD_AREA_INDEX = 146;
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

  preload() {
    // Load config data from JSON
    const request = new XMLHttpRequest();
    request.open('GET', 'json/enemies.json', false);
    request.send(null);
    this.eData = JSON.parse(request.responseText);

    // Load level and core JSON files
    request.open('GET', 'json/levels.json', false);
    request.send(null);
    this.levelData = JSON.parse(request.responseText);

    request.open('GET', 'json/cores.json', false);
    request.send(null);
    this.coreData = JSON.parse(request.responseText);

    request.open('GET', 'json/projectiles.json', false);
    request.send(null);
    this.projectileData = JSON.parse(request.responseText);

    let lev = Player.level - 1; // Current level index
    console.log(lev);


    // Music: "A Bit of Hope", from FesliyanStudios.com
    // Background music via https://www.FesliyanStudios.com
    // Source:  https://www.fesliyanstudios.com/royalty-free-music/download/a-bit-of-hope/565
    this.load.audio('bgm', ['2020-03-22_-_A_Bit_Of_Hope_-_David_Fesliyan.mp3']);
    this.load.audio('explosion', ['sound/sfx/Explosion.mp3']);
    this.load.audio('build-turret', ['sound/sfx/make_turret.mp3']);
    this.load.audio('delete-turret', ['sound/sfx/delete_turret.wav']);
    this.load.audio('firewallSfx', ['sound/sfx/Laser_Shoot.mp3']);
    // Load enemy sprites
    this.load.spritesheet(this.eData[4].name, this.eData[4].source, { frameWidth: this.eData[4].width, frameHeight: this.eData[4].height, endFrame: 10 }); // Rootkit
    this.load.spritesheet(this.eData[3].name, this.eData[3].source, { frameWidth: this.eData[3].width, frameHeight: this.eData[3].height, endFrame: 4 }); // Virus
    this.load.spritesheet(this.eData[2].name, this.eData[2].source, { frameWidth: this.eData[2].width, frameHeight: this.eData[2].height, endFrame: 6}); // Trojan
    this.load.spritesheet(this.eData[1].name, this.eData[1].source, { frameWidth: this.eData[1].width, frameHeight: this.eData[1].height, endFrame: 4}); // Worm
    this.load.spritesheet(this.eData[0].name, this.eData[0].source, { frameWidth: this.eData[0].width, frameHeight: this.eData[0].height, endFrame:  8}); // Spyware

    // Map & tiles
    if (this.textures.exists('tiles')) { // Prevents warnings/errors upon reload
      this.textures.remove('tiles'); // Have to remove from cache or it won't change
    }
    this.load.image('tiles', this.levelData[lev].tileset);
    this.load.tilemapTiledJSON(this.levelData[lev].map);

    // Valid build location sprite (drawn on tilemap)
    this.load.spritesheet('build-ready', 'images/valid-build.png', { frameWidth: 16, frameHeight: 16 });

    // Load player structures/turrets
    this.load.image('core', 'images/player-sprites/core.png');
    this.load.image('hardened-core', 'images/player-sprites/hardened-core.png');
    this.load.spritesheet('firewall', 'images/player-sprites/firewall.png', { frameWidth: 16, frameHeight: 24 });
    this.load.spritesheet('virus-blaster', 'images/player-sprites/virus-blaster.png', { frameWidth: 16, frameHeight: 24 });
    this.load.spritesheet('rectifier', 'images/player-sprites/rectifier.png', { frameWidth: 16, frameHeight: 24 });
    this.load.spritesheet('psu', 'images/player-sprites/psu.png', { frameWidth: 16, frameHeight: 24 });

    //**************************
    this.load.spritesheet(this.projectileData[0].type, this.projectileData[0].source, {frameHeight: this.projectileData[0].height, frameWidth: this.projectileData[0].width});
    this.load.spritesheet(this.projectileData[1].type, this.projectileData[1].source, {frameHeight: this.projectileData[1].height, frameWidth: this.projectileData[1].width});
    this.load.spritesheet(this.projectileData[2].type, this.projectileData[2].source, {frameHeight: this.projectileData[2].height, frameWidth: this.projectileData[2].width});
    //**************************
    // Explosion
    this.load.spritesheet('explosion-frames', 'images/effects/explosion1.png', { frameWidth: 32, frameHeight: 32, endFrame: 27 });


    // Set up keyboard handler
    this.keyUp = this.input.keyboard.addKey('W');
    this.keyDown = this.input.keyboard.addKey('S');
    this.keyLeft = this.input.keyboard.addKey('A');
    this.keyRight = this.input.keyboard.addKey('D');
    this.keyAltUp = this.input.keyboard.addKey('Up');
    this.keyAltDown = this.input.keyboard.addKey('Down');
    this.keyAltLeft = this.input.keyboard.addKey('Left');
    this.keyAltRight = this.input.keyboard.addKey('Right');
    this.keyC = this.input.keyboard.addKey('M'); // For debug operations
    this.keyU = this.input.keyboard.addKey('U'); // To test the upgrade menu
  }

  create(){
    // Star BGM
    bgm = this.sound.add('bgm', { loop: true, volume: 0.25 });
    bgm.play();

    // SFX
    this.explosion = this.sound.add('explosion', { loop: false, volume: 0.25 });
    this.buildSfx = this.sound.add('build-turret', { loop: false, volume: 0.25 });
    this.delTurret = this.sound.add('delete-turret', { loop: false, volume: 0.25 });
    this.firewallSfx = this.sound.add('firewallSfx', { loop: false, volume: 0.25 });

    // Map and tiles setup
    this.tilemap = this.make.tilemap({ key: this.levelData[Player.level - 1].map });
    let tileset = this.tilemap.addTilesetImage(this.levelData[Player.level - 1].tiles, 'tiles');
    this.tilemap.createLayer('base', tileset);
    this.tilemap.createLayer('above1', tileset);

    // Cursor
    this.input.setDefaultCursor('url(images/ui/cursors/default.png), pointer');

    // Valid build location (drawn on tilemap)
    this.buildReady = this.add.sprite(0, 0, 'build-ready', 1).setOrigin(0,0);


    // Set up core for the player to protect
    let whichCore = Player.unlocked['hardened-core'] ? 1 : 0;
    this.core = new Core(this, this.levelData[Player.level - 1].core_x * TILE, this.levelData[Player.level - 1].core_y * TILE, this.coreData[whichCore]);
    Player.coreHP = this.core.hp;
    this.targetX = Math.floor(this.levelData[Player.level - 1].core_x);
    this.targetY = Math.floor(this.levelData[Player.level - 1].core_y);

    this.turrets = [];
    this.turretMap = new Array(this.tilemap.width * this.tilemap.height).fill(null);

    // Add or remove a turret upon click
    this.input.on('pointerup', (pointer) => {
      let mapInd = (nearestIndex(pointer.worldY) * this.tilemap.width + nearestIndex(pointer.worldX));
      let buildArea = this.collidemap.layer.data[Math.floor(this.input.activePointer.worldY / TILE)][Math.floor(this.input.activePointer.worldX / TILE)].index;

      if (Player.action == CURRENT_ACTION.BUILD && buildArea == BUILD_AREA_INDEX) {
        if (this.turretMap[mapInd] == null) {
          let newTurret = new Turret(
            this,
            nearestTile(pointer.worldX) + TILE / 2,
            nearestTile(pointer.worldY),
            Player.chosenTurret
          );

          this.turrets.push(newTurret);
          this.buildSfx.play();

          //sets turret to look at newest enemy on map, delete now works as well
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
          this.delTurret.play();
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
    this.waveCount = 0;
    // Add walking animation for enemy sprites
    this.addEnemyAnims();

    this.anims.create({
      key: 'explosion-anim',
      frameRate: 30,
      frames: this.anims.generateFrameNumbers('explosion-frames', { start: 14, end: 27 }),
      repeat: 0
    });

    // making bullet and enemy groups
    this.gBullets = this.physics.add.group();
    this.gEnemies = this.physics.add.group();


    //add collider between groups
    this.physics.add.overlap(this.gEnemies, this.gBullets, (enemy, bullet) => {
      enemy.hp -= bullet.damage;
      console.log(bullet)
      bullet.destroy();
    });



    this.levelEnemies = [];
    this.wave(this.waveCount);
    this.waveCount++; // update the wave count
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

    this.pathmap = generatePathMap(this.levelData[Player.level - 1].core_x, this.levelData[Player.level - 1].core_y, this.collidemap);




  }

  wave(waveCount) {
    const min = Player.level - 1; 
    const max = min + 3;
    for (let i = 0; i < waveCount + 2; i++) {
      let en = Math.floor(Math.random() * (max - min) + min); // choose any of the 5 possible enemies
      let choice = Math.floor(Math.random() * 6);
      let newOne = new Virus(
        {
          scene: this, 
          x: possibles[choice].x * TILE + TILE / 2, 
          y: possibles[choice].y * TILE + TILE / 2, 
          hp: this.eData[en].hp, 
          damage: this.eData[en].damage, 
          points: this.eData[en].points,
          hitX: this.eData[en].hitX,
          hitY: this.eData[en].hitY
        }
      );
      newOne.play(this.eneAnims[en]);
      // Number of frames to delay movement
      newOne.delay = Math.floor(Math.random() * MAX_DELAY) + MIN_DELAY;
      newOne.moveX = 0;
      newOne.moveY = 0;
      newOne.moveVal = -1;
      newOne.dirVector = {x: 0, y: 0};

      this.gEnemies.add(newOne);
      this.levelEnemies.push(newOne);
    }
  }

  addEnemyAnims() {
    // Add walking animation for enemy sprites
    const enemyAnims = [
      {
        key: 'spyware-mov',
        frames: this.anims.generateFrameNumbers(this.eData[0].name, { start: 0, end: 7, first: 7}),
        frameRate: 8,
        repeat: -1
      }, {
        key: 'worm-mov',
        frames: this.anims.generateFrameNumbers(this.eData[1].name, { start: 0, end: 3, first: 3 }),
        frameRate: 8,
        repeat: -1
      }, {
        key: 'trojan-mov',
        frames: this.anims.generateFrameNumbers(this.eData[2].name, { start: 0, end: 5, first: 5 }),
        frameRate: 8,
        repeat: -1
      }, {
        key: 'virus-mov', 
        frames: this.anims.generateFrameNumbers(this.eData[3].name, { start: 0, end: 3, first: 3 }),
        frameRate: 8,
        repeat: -1
      }, {
        key: 'rootkit-mov',
        frames: this.anims.generateFrameNumbers(this.eData[4].name, { start: 0, end: 9, first: 9}),
        frameRate: 8,
        repeat: -1
      }
    ]
    for(let i = 0; i < 5; i++) {
      this.anims.create(enemyAnims[i]);
    }
    this.eneAnims = ['spyware-mov', 'worm-mov', 'trojan-mov', 'virus-mov', 'rootkit-mov'];
  }

  update(){
    updateHpScore.emit('update-hp-score', this.core.hp, this.waveCount);
    // Update buildable area indicator
    this.input.activePointer.updateWorldPoint(this.cameras.main);

    // Change sprite index if cursor position is a valid area to build in.
    // let mapInd = this.collidemap.layer.data[Math.floor(this.input.activePointer.worldY / TILE)][Math.floor(this.input.activePointer.worldX / TILE)].index;
    let mapInd = this.collidemap.getTileAt(Math.floor(this.input.activePointer.worldX / TILE), Math.floor(this.input.activePointer.worldY / TILE));

    if (mapInd && mapInd.index == BUILD_AREA_INDEX) {  // 'B' (buildable) block
      this.buildReady.setFrame(0);
    }
    else {
      this.buildReady.setFrame(1);
    }
    this.buildReady.x = (TILE * Math.floor(this.input.activePointer.worldX / TILE));
    this.buildReady.y = (TILE * Math.floor(this.input.activePointer.worldY / TILE));


    // Test critter logic
    if (this.pathmap) {
      for (let [index, critter] of this.levelEnemies.entries()) {
        if(critter.hp <= 0){
          Player.score += critter.points;

          critter.destroy();
          this.explosion.play();
          this.levelEnemies.splice(index, 1);

          // Play explosion
          let newOne = new Explosion({scene: this, x: critter.x, y: critter.y, animKey: 'explosion-frames'});
          newOne.explode('explosion-anim'); // Automatically garbage collected after animation completion
        }
        if (critter.delay > 0) {
          critter.delay--;
        }
        else {
          // Check to see if Turret is in same tile as enemy, in which case delete both
          for (let [turretIndex, turret] of this.turrets.entries()) {
            if (Math.floor(turret.x / TILE) == Math.floor(critter.x / TILE) && Math.floor(turret.y / TILE) == Math.floor(critter.y / TILE)) {
              turret.hp -= critter.damage;
              if (turret.hp <= 0) {
                // Clean up and destroy it
                turret.dismantle();
                turret.destroy();

                // Remove all references to it.
                this.turrets.splice(turretIndex, 1);
                console.log(this.turrets.length);
                let mapInd = (nearestIndex(turret.y) * this.tilemap.width + nearestIndex(turret.x));
                this.turretMap[mapInd] = null;

                // Increase score
                Player.score += critter.points;

                // destroy enemy
                critter.destroy();
                this.explosion.play();
                this.levelEnemies.splice(index, 1);
                // Play explosion
                let newOne = new Explosion({scene: this, x: critter.x, y: critter.y, animKey: 'explosion-frames'});
                newOne.explode('explosion-anim'); // Automatically garbage collected after animation completion
                break;
              }
            }
          }

          // Move it!
          if (critter.moveVal <= 0) {
            // Figure out direction to move in

            if (Math.floor(critter.x / TILE) == this.targetX && Math.floor(critter.y / TILE) == this.targetY) {
              // cause damage and disappear
              this.core.hp -= critter.damage;
              critter.destroy();
              this.explosion.play();
              this.levelEnemies.splice(index, 1);

              // Play explosion
              let newOne = new Explosion({scene: this, x: critter.x, y: critter.y, animKey: 'explosion-frames'});
              newOne.explode('explosion-anim'); // Automatically garbage collected after animation completion
              break;
            }

            critter.dirVector = nextDir(Math.floor(critter.x / TILE), Math.floor(critter.y / TILE), this.pathmap);
            critter.moveVal = TILE;
          }
  
          critter.x += critter.dirVector.x;
          critter.y += critter.dirVector.y;
          critter.moveVal--;
        }
      }
    }

    // GAME OVER, YOU LOSE
    if (this.core.hp <= 0) {
      this.scene.start(CONST.SCENES.DEATH);
      bgm.stop();
      this.scene.stop(CONST.SCENES.LEVEL);
      this.scene.stop(CONST.SCENES.BUILD_MENU);
    } else if (this.core.hp > 0 && this.waveCount === 11) { // YOU WIN
      if (Player.level === 3) {
        this.scene.start(CONST.SCENES.VIC);
      } else {
        Player.levelUp();
        this.scene.start(CONST.SCENES.SHOP);
      }
      bgm.stop();
      this.scene.stop(CONST.SCENES.LEVEL);
      this.scene.stop(CONST.SCENES.BUILD_MENU);
    }

    // New wave
    if (this.levelEnemies.length === 0 && this.waveCount < 11) {
      this.wave(this.waveCount);
      this.waveCount++;
    }
    //Passes array of critters to Turrets to see when a critter is near a turret
    this.turrets.forEach(turret => {
      if(this.levelEnemies.length !== 0){
        let passArray = this.levelEnemies;
        turret.update(passArray);
      }
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
    if (this.keyC.isDown) { // Debug - restarts the scene
      console.log('Restart!');
      bgm.stop();
      Player.levelUp();
      this.scene.restart();
    }
    if (this.keyU.isDown) {
      console.log('Switching to upgrade menu');
      this.input.setDefaultCursor('url(images/ui/cursors/default.png), pointer');
      this.scene.start(CONST.SCENES.SHOP);
      this.scene.stop(CONST.SCENES.LEVEL);
      this.scene.stop(CONST.SCENES.BUILD_MENU);
      bgm.stop();
    }
  }
}
