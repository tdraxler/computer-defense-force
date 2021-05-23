import Phaser from 'phaser';
import { CONST } from '../constants';
//import {start} from '../';

let testRec;

export class Tutorial2 extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.TUTORIAL2
    });
  }
  //data from others scenes gets passed in here
  init(data){
    console.log(data);
    console.log('I am now the  tutorial scene, I got data from the menu scene!')
  }
  preload(){

  }
  //must include create
  create(){
    this.add.image(0,0,'tutorial-back').setOrigin(0).setDepth(0); //set origin to middle of screen instead of upper left
    this.add.image(80,10,'tutorial-title').setOrigin(0).setDepth(3);
    this.add.image(25,75,'tutorial-text2').setOrigin(0).setDepth(3);

    this.add.sprite(140, 200, 'still_firewall');
    this.add.sprite(200, 200,'still_virus-blaster');
    this.add.sprite(260, 200,'still_rectifier');

    let nextButton = this.add.image(160,250,'next-page').setOrigin(0).setDepth(1);
    nextButton.setInteractive();
    nextButton.on('pointerover',()=>{
      nextButton.alpha=.7;
    })
    nextButton.on('pointerout', ()=>{
      nextButton.alpha=1;
    })
    nextButton.on('pointerup', ()=>{
      nextButton.alpha=1;
      this.scene.start(CONST.SCENES.TUTORIAL3);
    })
  }
  //the rotation of the rectangle
  update(){
    //this.add.text(10, 10, 'HOW TO PLAY').setFontFamily('Sans-Serif').setFontSize(30);
  }
}