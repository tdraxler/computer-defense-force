import Phaser from 'phaser';
import { CONST } from '../constants';
//import {start} from '../';

export class Tutorial3 extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.TUTORIAL3
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
    this.add.image(0,0,'tutorial').setOrigin(0).setDepth(0); //set origin to middle of screen instead of upper left
    this.add.image(80,15,'tutorial-title').setOrigin(0).setDepth(3);
    this.add.image(20,75,'tutorial-text').setOrigin(0).setDepth(3);

    let nextButton = this.add.image(150,250,'next-page').setOrigin(0).setDepth(1);
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
    //this.add.text(10, 10, 'HOW TO PLAY').setFontFamily('Sans-Serif').setFontSize(30);
  }
}