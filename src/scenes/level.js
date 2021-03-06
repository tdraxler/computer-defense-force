import Phaser from 'phaser';
import { buildPreview, setUpBuildSystem } from '../components/buildPreview';
import { CONST, MAP_CONSTANTS } from '../constants';
import { Core } from '../components/core';
import { Explosion } from '../components/explosion';
import { generatePathMap, nextDir } from '../components/pathfinding';
import Player from '../components/player';
import { setUpTextPopups, handleTextPopups } from '../components/textPopup';
import { Virus } from '../components/virus';
import { walk, onCompleteHandler } from '../components/walk';
import updateHpScore from '../components/hpscoreevent';

// For debugging the cursor position
// let mousePos = { x: 0, y: 0 };

let bgm;
const MIN_DELAY = 5;
const MAX_DELAY = 10 * 60;
let Differentials = [4, 10, 12, 0.65]

const TILE = MAP_CONSTANTS.T_SIZE;

const possibles = [{x: 9, y: -2}, {x: 20, y: -2}, {x: 41, y: 13}, {x: 27, y: 31}, {x: 10, y: 31}, {x: -2, y: 14}];

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

    // Get Turret data from JSON file
    request.open('GET', 'json/turrets.json', false);
    request.send(null);
    this.turretData = JSON.parse(request.responseText);

    // Use the turret and projectile data to generate description data
    this.descData = [];

    this.turretData.forEach(t => {
      // Calculate DPS, if possible
      let dps = null;
      let bullet = null;
      if (t.projectile) {
        bullet = this.projectileData.find(x => x.type === t.projectile);
        dps = bullet.damage;
        dps = dps * 60 / t.delay; // Game runs at 60 FPS
      }

      this.descData.push({
        printedname: t.printedname,
        name: t.name,
        buildCost: t.buildCost,
        unlockCost: t.unlockCost,
        damage: bullet ? bullet.damage : null,
        ep: t.ep ? t.ep : null,
        dps: dps
      });
    });

    let lev = Player.level - 1; // Current level index

    // Music: "A Bit of Hope", from FesliyanStudios.com
    // Background music via https://www.FesliyanStudios.com
    // Source:  https://www.fesliyanstudios.com/royalty-free-music/download/a-bit-of-hope/565
    this.load.audio('bgm', ['sound/bgm/2020-03-22_-_A_Bit_Of_Hope_-_David_Fesliyan.mp3']);
    this.load.audio('explosion', ['sound/sfx/Explosion.mp3']);
    this.load.audio('build-turret', ['sound/sfx/make_turret.mp3']);
    this.load.audio('delete-turret', ['sound/sfx/delete_turret.wav']);
    this.load.audio('firewallSfx', ['sound/sfx/Laser_Shoot.mp3']);
    this.load.audio('virusBlasterSfx', ['sound/sfx/virus-blaster.ogg']);
    this.load.audio('rectifierSfx', ['sound/sfx/rectifier.ogg']);
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
    this.load.image('core-frame', 'images/player-sprites/core-frame.png');
    this.load.spritesheet('core', 'images/player-sprites/core.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('hcore', 'images/player-sprites/hardened-core.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('firewall', 'images/player-sprites/firewall.png', { frameWidth: 16, frameHeight: 24 });
    this.load.spritesheet('virus-blaster', 'images/player-sprites/virus-blaster.png', { frameWidth: 16, frameHeight: 24 });
    this.load.spritesheet('rectifier', 'images/player-sprites/rectifier.png', { frameWidth: 16, frameHeight: 24 });
    this.load.spritesheet('psu', 'images/player-sprites/psu.png', { frameWidth: 16, frameHeight: 24 });
    this.load.spritesheet('charger', 'images/player-sprites/charger.png', { frameWidth: 16, frameHeight: 24 });

    //**************************
    this.load.spritesheet(this.projectileData[0].type, this.projectileData[0].source, {frameHeight: this.projectileData[0].height, frameWidth: this.projectileData[0].width});
    this.load.spritesheet(this.projectileData[1].type, this.projectileData[1].source, {frameHeight: this.projectileData[1].height, frameWidth: this.projectileData[1].width});
    this.load.spritesheet(this.projectileData[2].type, this.projectileData[2].source, {frameHeight: this.projectileData[2].height, frameWidth: this.projectileData[2].width});
    //**************************
    // Explosion
    this.load.spritesheet('explosion-frames', 'images/effects/explosion1.png', { frameWidth: 32, frameHeight: 32, endFrame: 27 });
    this.load.spritesheet('explosion-frames-2', 'images/effects/explosion2.png', { frameWidth: 8, frameHeight: 8, endFrame: 13 });
    this.load.spritesheet('explosion-demolish', 'images/effects/demolish.png', { frameWidth: 16, frameHeight: 24, endFrame: 11 });

    // Set up keyboard handler
    this.keyUp = this.input.keyboard.addKey('W');
    this.keyDown = this.input.keyboard.addKey('S');
    this.keyLeft = this.input.keyboard.addKey('A');
    this.keyRight = this.input.keyboard.addKey('D');
    this.keyAltUp = this.input.keyboard.addKey('Up');
    this.keyAltDown = this.input.keyboard.addKey('Down');
    this.keyAltLeft = this.input.keyboard.addKey('Left');
    this.keyAltRight = this.input.keyboard.addKey('Right');


    // === Debug keys ===
    // this.keyC = this.input.keyboard.addKey('M'); // For debug operations
    // this.keyU = this.input.keyboard.addKey('U'); // To test the upgrade menu
    // this.keyX = this.input.keyboard.addKey('X'); // Debug key. Use however you want!
    let loadBar = this.add.graphics({
      fillStyle: {
        color: 0x89DDFF
      }
    })
    //create a loading bar https://www.youtube.com/watch?v=OS7neDUUhPE
    this.add.text(150, 200, 'LOADING').setFontFamily('m5x7').setFontSize(32);
    this.load.on('progress', (percent)=>{
      loadBar.fillRect(0, 250, this.game.renderer.width * percent , 15)
    })
  }

  create(){
    // Set starting coin amount for the level
    Player.levelStartCoin = Player.viruscoins;

    // Star BGM
    bgm = this.sound.add('bgm', { loop: true, volume: 0.25 });
    bgm.play();

    // SFX
    this.explosion = this.sound.add('explosion', { loop: false, volume: 0.25 });
    this.buildSfx = this.sound.add('build-turret', { loop: false, volume: 0.25 });
    this.delTurret = this.sound.add('delete-turret', { loop: false, volume: 0.25 });
    this.firewallSfx = this.sound.add('firewallSfx', { loop: false, volume: 0.25 });
    this.virusBlasterSfx = this.sound.add('virusBlasterSfx', { loop: false, volume: 0.25 });
    this.rectifierSfx = this.sound.add('rectifierSfx', { loop: false, volume: 0.25 });

    // Map and tiles setup
    this.tilemap = this.make.tilemap({ key: this.levelData[Player.level - 1].map });
    let tileset = this.tilemap.addTilesetImage(this.levelData[Player.level - 1].tiles, 'tiles');
    this.tilemap.createLayer('base', tileset);
    this.tilemap.createLayer('above1', tileset);



    // Add turret unlock costs to Player
    Player.unlockCosts['firewall'] = this.turretData[0]['unlockCost'];
    Player.unlockCosts['charger'] = this.turretData[1]['unlockCost'];
    Player.unlockCosts['virus-blaster'] = this.turretData[2]['unlockCost'];
    Player.unlockCosts['rectifier'] = this.turretData[3]['unlockCost'];
    Player.unlockCosts['psu'] = this.turretData[4]['unlockCost'];
    Player.unlockCosts['hardened-core'] = this.coreData[1]['unlockCost'];

    // Set up core for the player to protect
    let whichCore = Player.unlocked['hardened-core'] ? 1 : 0;
    this.core = new Core(this, this.levelData[Player.level - 1].core_x * TILE, this.levelData[Player.level - 1].core_y * TILE, this.coreData[whichCore]);
    this.deathCountdown = 120;
    Player.coreHP = this.core.hp;
    this.targetX = Math.floor(this.levelData[Player.level - 1].core_x);
    this.targetY = Math.floor(this.levelData[Player.level - 1].core_y);

    this.turrets = [];
    this.turretMap = new Array(this.tilemap.width * this.tilemap.height).fill(null);

    setUpBuildSystem(this);
    setUpTextPopups(this);

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
    this.anims.create({
      key: 'explosion-anim-2',
      frameRate: 60,
      frames: this.anims.generateFrameNumbers('explosion-frames-2', { start: 0, end: 13 }),
      repeat: 0
    });
    this.anims.create({
      key: 'explosion-anim-demolish',
      frameRate: 60,
      frames: this.anims.generateFrameNumbers('explosion-demolish', { start: 0, end: 11 }),
      repeat: 0
    });

    // TEMPORARY - charger/psu animations
    this.anims.create({
      key: 'psu-anim',
      frameRate: 15,
      frames: this.anims.generateFrameNumbers('psu', { start: 0, end: 3 }),
      repeat: -1
    });

    this.anims.create({
      key: 'charger-anim',
      frameRate: 15,
      frames: this.anims.generateFrameNumbers('charger', { start: 0, end: 3 }),
      repeat: -1
    });

    // Core animations
    this.anims.create({
      key: 'core-anim',
      frameRate: 15,
      frames: this.anims.generateFrameNumbers('core', { start: 0, end: 7 }),
      repeat: -1
    });

    this.anims.create({
      key: 'hardened-core-anim',
      frameRate: 15,
      frames: this.anims.generateFrameNumbers('hcore', { start: 0, end: 7 }),
      repeat: -1
    });
    this.core.play(`${this.coreData[whichCore].name}-anim`);

    // making bullet and enemy physics groups
    this.gBullets = this.physics.add.group();
    this.gEnemies = this.physics.add.group();

    //add collider between groups
    this.physics.add.overlap(this.gEnemies, this.gBullets, (enemy, bullet) => {
      enemy.hp -= bullet.damage;
      enemy.showAttacked();
      let explosion = new Explosion({scene: this, x: bullet.x, y: bullet.y, animKey: 'explosion-frames-2', framesCount: 13});
      explosion.setVelocity(bullet.body.velocity.x / 4, bullet.body.velocity.y / 4);
      bullet.destroy();
      explosion.explode('explosion-anim-2');
    });


    this.levelEnemies = [];
    this.rootkits = [];
    this.wave(this.waveCount);
    this.waveCount++; // update the wave count
    // end of enemy stuff

    // After enemies are set up, create second layer that will render above everything else
    this.tilemap.createLayer('above2', tileset).setDepth(900);
    
    this.collidemap = this.tilemap.createLayer('collide', tileset);
    this.collidemap.setVisible(false);


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
    this.scene.launch(CONST.SCENES.BUILD_MENU, { descData: this.descData }); 

    this.pathmap = generatePathMap(this.levelData[Player.level - 1].core_x, this.levelData[Player.level - 1].core_y, this.collidemap);


    // Do not remove check, otherwise we end up with Player.level amount of listeners
    if (Player.level === 3) {
      this.scene.get(CONST.SCENES.LEVEL).events.on('onCompleteHandler', () => {
        this.levelEnemies.push(this.rootkits[0]);
      });
    }
    this.cameras.main.fadeIn(250, 0, 0, 0);
  }

  wave(waveCount) {
    const min = Player.level - 1;
    let max = min + 2;
    let enemyIndex;
    let choice;
    let enemyCount = Player.level * Differentials[Player.level - 1] + Math.ceil((waveCount + 1) * 5 * Differentials[3]);
    for (let i = 0; i < enemyCount; i++) {
      // Rootkit specific
      if (Player.level === 3 && waveCount === 9) {
        enemyIndex = 4;
        choice = 3;
      } else {
        if (waveCount >= 4 && max === min + 2 && Player.level !== 3) {
          max++;
        } else if (Player.level === 3 && waveCount <= 3) {
          max = min; // Only trojans until Wave 4 of Level 3
        }
        enemyIndex = Math.floor(Math.random() * (max - min) + min);
        // choose any of the 5 possible enemies
        choice = Math.floor(Math.random() * 6);
      }

      let newOne = new Virus(
        {
          scene: this, 
          x: possibles[choice].x * TILE + TILE / 2, 
          y: possibles[choice].y * TILE + TILE / 2, 
          hp: this.eData[enemyIndex].hp, 
          damage: this.eData[enemyIndex].damage, 
          points: this.eData[enemyIndex].points,
          hitX: this.eData[enemyIndex].hitX,
          hitY: this.eData[enemyIndex].hitY,
          width: this.eData[enemyIndex].width,
          height: this.eData[enemyIndex].height,
          travelRate: this.eData[enemyIndex].travelRate
        }
      );
      newOne.play(this.eneAnims[enemyIndex]);
      newOne.moveX = 0;
      newOne.moveY = 0;
      newOne.moveVal = -1;
      newOne.dirVector = {x: 0, y: 0};

      this.gEnemies.add(newOne);
      if (Player.level === 3 && waveCount === 9) {
        this.rootkits.push(newOne);
        this.timer = this.time.delayedCall(3000, this.walk, [this.rootkits[0]], this);
        break;
      } else {
        // Number of frames to delay movement
        newOne.delay = Math.floor(Math.random() * MAX_DELAY) + MIN_DELAY;
        this.levelEnemies.push(newOne);
      }
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
    buildPreview(this);

    if (this.rootkits.length > 0) {
      this.rootkits[0].update();
      if(this.rootkits[0].hp <= 0) {
        Player.score += this.rootkits[0].points;
        Player.viruscoins += this.rootkits[0].points;

        this.timeline.stop();
        // Play explosion
        let newOne = new Explosion({scene: this, x: this.rootkits[0]['x'], y: this.rootkits[0]['y'], animKey: 'explosion-frames', framesCount: 15});

        this.rootkits[0].destroy();
        this.explosion.play();
        this.rootkits.splice(0, 1);

        newOne.explode('explosion-anim'); // Automatically garbage collected after animation completion
      }
    }

    // Enemy logic
    if (this.pathmap) {
      for (let [index, critter] of this.levelEnemies.entries()) {
        critter.update();
        if(critter.hp <= 0){
          Player.score += critter.points;
          Player.viruscoins += critter.points;

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
          // Move it!
          if (critter.moveVal <= 0) {
            // Figure out direction to move in

            if (Math.floor(critter.x / TILE) == this.targetX && Math.floor(critter.y / TILE) == this.targetY) {
              // cause damage and disappear
              this.core.hp -= critter.damage;
              if (this.core.hp < 0) this.core.hp = 0;
              this.core.showAttacked();
              critter.destroy();
              this.explosion.play();
              this.levelEnemies.splice(index, 1);
              if (this.rootkits.length > 0) {
                this.rootkits.splice(0, 1);
              }

              // Play explosion
              let newOne = new Explosion({scene: this, x: critter.x, y: critter.y, animKey: 'explosion-frames'});
              newOne.explode('explosion-anim'); // Automatically garbage collected after animation completion
              break;
            }

            critter.dirVector = nextDir(Math.floor(critter.x / TILE), Math.floor(critter.y / TILE), this.pathmap);
            critter.moveVal = TILE / critter.travelRate;
          }
  
          critter.x += critter.dirVector.x * critter.travelRate;
          critter.y += critter.dirVector.y * critter.travelRate;
          critter.moveVal--;
        }
      }
    }

    // GAME OVER, YOU LOSE
    if (this.core.hp <= 0) {
      if (this.deathCountdown == 100) {
        this.cameras.main.fadeOut(3000, 255, 100, 50);
      }
      // Death countdown so we can watch the core explode and the scene fade to red
      this.deathCountdown--;
      if (this.deathCountdown < 0) {
        this.scene.start(CONST.SCENES.DEATH);
        bgm.stop();
        this.scene.stop(CONST.SCENES.LEVEL);
        this.scene.stop(CONST.SCENES.BUILD_MENU);
      }
    } else if (this.core.hp > 0 && this.waveCount === 11) { // YOU WIN
      if (Player.level === 3) {
        this.scene.start(CONST.SCENES.VIC);
      } else {
        Player.levelUp();
        this.scene.start(CONST.SCENES.SHOP, { descData: this.descData });
      }
      bgm.stop();
      this.scene.stop(CONST.SCENES.LEVEL);
      this.scene.stop(CONST.SCENES.BUILD_MENU);
    }

    // New wave
    if (this.levelEnemies.length === 0 && this.rootkits.length === 0 && this.waveCount < 11) {
      this.wave(this.waveCount);
      this.waveCount++;
    }
    //Passes array of critters to Turrets to see when a critter is near a turret
    this.turrets.forEach(turret => {
      if(this.levelEnemies.length !== 0){
        let passArray = this.levelEnemies;
        turret.update(passArray);
      }
      if(this.rootkits.length !== 0) {
        let passArray = this.rootkits;
        turret.update(passArray);
      }
    });

    // Check on the core
    this.core.update();

    // Text popup handling
    handleTextPopups(this);

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

    // === Debug keys ===
    // if (this.keyC.isDown) { // Debug - restarts the scene
    //   bgm.stop();
    //   Player.levelUp();
    //   this.scene.restart();
    // }
    // if (this.keyU.isDown) {
    //   this.input.setDefaultCursor('url(images/ui/cursors/default.png), pointer');
    //   this.scene.start(CONST.SCENES.SHOP, { descData: this.descData });
    //   this.scene.stop(CONST.SCENES.LEVEL);
    //   this.scene.stop(CONST.SCENES.BUILD_MENU);
    //   bgm.stop();
    // }
    // if (this.keyX.isDown) {
    //   this.core.hp -= 4;
    // }
  }
}
