/* eslint-disable quotes */
import Phaser from 'phaser';
import { CONST } from '../constants';
import Player from '../components/player';

//loading bar is direct adaptation of https://www.youtube.com/watch?v=OS7neDUUhPE
export class TitleScene extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.START
    });
  }
  init(){

  }
  preload(){
    this.load.spritesheet('testRec', './images/testRec.png', {frameHeight: 20, frameWidth: 20});
    this.load.image('imgTitle', './images/TitlePage-Background.png');
    this.load.image('startButton', './images/start.png');
    this.load.image('title', './images/titlePage-title.png');
    this.load.image('title_back', './images/titleName_background.png');
    this.load.image('victory', './images/victory-letters.png');
    this.load.image('vic_back', './images/vicTitle_background.png');
    this.load.image('game-over', './images/game-over.png');
    this.load.image('over-back', './images/over-back.png');
    this.load.image('gameOver-back', './images/gameOver-background.png');
    this.load.image('victory-background', './images/VictoryPage-Background.png');
    this.load.image('play-again_vic', './images/playAgain.png');
    this.load.image('play-again_death', './images/playAgainDeath.png');
    this.load.image('tutorial', './images/toturialPage.png');
    this.load.image('tutorial-title', './images/tutorial-title.png');
    this.load.image('next-page', './images/next.png');
    this.load.image('tutorial-text', './images/tutorial-text.png');
    
    // TESTING LOADING GAME INFO IN TITLE NOT LEVEL
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

    let lev = Player.level - 1; // Current level index
    console.log(lev);

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
    this.load.spritesheet('charger', 'images/player-sprites/charger.png', { frameWidth: 16, frameHeight: 24 });

    //**************************
    this.load.spritesheet(this.projectileData[0].type, this.projectileData[0].source, {frameHeight: this.projectileData[0].height, frameWidth: this.projectileData[0].width});
    this.load.spritesheet(this.projectileData[1].type, this.projectileData[1].source, {frameHeight: this.projectileData[1].height, frameWidth: this.projectileData[1].width});
    this.load.spritesheet(this.projectileData[2].type, this.projectileData[2].source, {frameHeight: this.projectileData[2].height, frameWidth: this.projectileData[2].width});
    //**************************

    let loadBar = this.add.graphics({
      fillStyle: {
        color: 0x89DDFF
      }
    })
    //create a loading bar https://www.youtube.com/watch?v=OS7neDUUhPE
    this.load.on('progress', (percent)=>{
      loadBar.fillRect(0, 250, this.game.renderer.width * percent , 15)
    })

  }
  //must include create
  create(){
    //set origin to middle of screen instead of upper left
    this.scene.start(CONST.SCENES.MENU);
  }
}