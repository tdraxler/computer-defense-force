import Phaser from 'phaser';
import { CONST } from '../constants';
//import {start} from '../';

let testRec;

export class Tutorial extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.TUTORIAL
    });
  }
  //data from others scenes gets passed in here
  init(data){
    console.log(data);
    console.log('I am now the menu scene, I got data from the title scene!')
  }
  preload(){

  }
  //must include create
  create(){
    this.add.image(0,0,'imgTitle').setOrigin(0).setDepth(0); //set origin to middle of screen instead of upper left
    testRec = this.add.sprite(200, 150, 'testRec').setOrigin(0).setDepth(2);
    let nextButton = this.add.image(150,200,'startButton').setOrigin(0).setDepth(1)
    nextButton.setInteractive();
    nextButton.on('pointerover',()=>{
      nextButton.alpha=.7;
    })
    nextButton.on('pointerout', ()=>{
      nextButton.alpha=1;
    })
    nextButton.on('pointerup', ()=>{
      nextButton.alpha=1;
      this.scene.start(CONST.SCENES.LEVEL);
    })
  }
  //the rotation of the rectangle
  update(){
    testRec.rotation += 0.007;
    this.add.text(10, 10, 'HOW TO PLAY').setFontFamily('Sans-Serif').setFontSize(30);
  }
}