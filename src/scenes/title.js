/* eslint-disable quotes */
import Phaser from 'phaser';
import {CONST, FONT_CONFIG_MOUSEOVER, FONT_CONFIG_SMALL} from '../constants';

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
    this.load.image('imgTitle', 'images/start-victory-gameover/TitlePage-Background.png');
    this.load.image('startButton', 'images/start-victory-gameover/start.png');
    this.load.image('tutorialButton', 'images/tutorial/tutorial-button.png');
    this.load.image('title', 'images/start-victory-gameover/titlePage-title.png');
    this.load.image('title_back', 'images/start-victory-gameover/titleName_background.png');
    this.load.image('victory', 'images/start-victory-gameover/victory-letters.png');
    this.load.image('vic_back', 'images/start-victory-gameover/vicTitle_background.png');
    this.load.image('game-over', 'images/start-victory-gameover/game-over.png');
    this.load.image('over-back', 'images/start-victory-gameover/over-back.png');
    this.load.image('gameOver-back', 'images/start-victory-gameover/gameOver-background.png');
    this.load.image('victory-background', 'images/start-victory-gameover/VictoryPage-Background.png');
    this.load.image('play-again_vic', 'images/start-victory-gameover/playAgain.png');
    this.load.image('play-again_death', 'images/start-victory-gameover/playAgainDeath.png');
    this.load.image('tutorial', 'images/tutorial/toturialPage.png');
    this.load.image('tutorial-back', 'images/tutorial/Tutorial-Background.png');
    this.load.image('tutorial-title', 'images/tutorial/tutorial-title.png');
    this.load.image('next-page', 'images/tutorial/next.png');
    this.load.image('tutorial-text', 'images/tutorial/tutorial-text.png');
    this.load.image('tutorial-text2', 'images/tutorial/tutorial-text2.png');
    this.load.image('tutorial-text3', 'images/tutorial/tutorial-text3.png');
    this.load.image('wasd', 'images/tutorial/wasd.png')
    
    // TESTING LOADING GAME INFO IN TITLE NOT LEVEL
    // Load config data from JSON
    const request = new XMLHttpRequest();
    request.open('GET', 'json/enemies.json', false);
    request.send(null);
    this.eData = JSON.parse(request.responseText);

    // Load enemy sprites
    this.load.spritesheet(this.eData[4].name, this.eData[4].source, { frameWidth: this.eData[4].width, frameHeight: this.eData[4].height, endFrame: 10 }); // Rootkit
    this.load.spritesheet(this.eData[3].name, this.eData[3].source, { frameWidth: this.eData[3].width, frameHeight: this.eData[3].height, endFrame: 4 }); // Virus
    this.load.spritesheet(this.eData[2].name, this.eData[2].source, { frameWidth: this.eData[2].width, frameHeight: this.eData[2].height, endFrame: 6}); // Trojan
    this.load.spritesheet(this.eData[1].name, this.eData[1].source, { frameWidth: this.eData[1].width, frameHeight: this.eData[1].height, endFrame: 4}); // Worm
    this.load.spritesheet(this.eData[0].name, this.eData[0].source, { frameWidth: this.eData[0].width, frameHeight: this.eData[0].height, endFrame:  8}); // Spyware

    // Load player structures/turrets
    this.load.image('hardened-core', 'images/player-sprites/hardened-core.png');
    this.load.image('still_firewall', 'images/player-sprites/still_firewall.png');
    this.load.image('still_virus-blaster', 'images/player-sprites/still_virus-blaster.png');
    this.load.image('still_rectifier', 'images/player-sprites/still_rectifier.png');
    this.load.spritesheet('psu', 'images/player-sprites/psu.png', { frameWidth: 16, frameHeight: 24 });
    this.load.spritesheet('charger', 'images/player-sprites/charger.png', { frameWidth: 16, frameHeight: 24 });

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
  //must include create
  create(){
    this.scene.start(CONST.SCENES.MENU);
  }
}