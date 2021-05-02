/* eslint-disable quotes */
import Phaser from 'phaser';
import { CONST } from '../constants';

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
    this.load.spritesheet('bullet', '../public/images/bullet_5px.png', {frameWidth: 5, frameHeight: 5});

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