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
    this.load.image('startButton', './images/start.png')
    this.load.image('title', './images/titlePage-title.png')

    let loadBar = this.add.graphics({
      fillStyle: {
        color: 0x89DDFF
      }
    })
    //create a loading bar
    //simulate larger load for testing purposes
    for (let i = 0; i < 200; i++){
      this.load.spritesheet('testRec' + i, './images/testRec.png', {frameHeight: 20, frameWidth: 20});
    }
    this.load.on('progress', (percent)=>{
      loadBar.fillRect(0, 250, this.game.renderer.width * percent , 15)
    })

  }
  //must include create
  create(){
    //set origin to middle of screen instead of upper left
    this.scene.start(CONST.SCENES.MENU, "This is the TITLE SCENE");
  }
}