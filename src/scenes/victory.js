import Phaser from 'phaser';
import { CONST } from '../constants';
//import {start} from '../';

let testRec;

export class Victory extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.VIC
    });
  }
  //data from others scenes gets passed in here
  init(data){

  }
  preload(){

  }
  //must include create
  create(){
    this.add.image(0,0,'imgTitle').setOrigin(0).setDepth(0); //set origin to middle of screen instead of upper left
    this.add.image(55,35,'victory').setOrigin(0).setDepth(3);
    this.add.image(55,25,'vic_back').setOrigin(0).setDepth(2);
    //testRec = this.add.sprite(200, 150, 'testRec').setOrigin(0).setDepth(2);
    let startButton = this.add.image(150,250,'startButton').setOrigin(0).setDepth(1)
    startButton.setInteractive();
    startButton.on('pointerover',()=>{
      startButton.alpha=.7;
    })
    startButton.on('pointerout', ()=>{
      startButton.alpha=1;
    })
    startButton.on('pointerup', ()=>{
      startButton.alpha=1;
      this.scene.start(CONST.SCENES.DEATH);
    })

  }
  //the rotation of the rectangle
  update(){
    this.add.text(100, 145, 'WE ARE SAVED!!').setFontFamily('Sans-Serif').setFontSize(25);
  }
}