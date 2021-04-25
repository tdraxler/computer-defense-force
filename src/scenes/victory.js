import Phaser from 'phaser';
import { CONST } from '../constants';
//import {start} from '../';



export class Victory extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.VIC
    });
  }
  //data from others scenes gets passed in here
  init(){

  }
  preload(){

  }
  //must include create
  create(){
    this.add.image(0,0,'victory-background').setOrigin(0).setDepth(0); //set origin to middle of screen instead of upper left
    this.add.image(55,35,'victory').setOrigin(0).setDepth(3);
    this.add.image(55,25,'vic_back').setOrigin(0).setDepth(2);
    //testRec = this.add.sprite(200, 150, 'testRec').setOrigin(0).setDepth(2);
    let playAgainButton = this.add.image(150,250,'play-again_vic').setOrigin(0).setDepth(1)
    playAgainButton.setInteractive();
    playAgainButton.on('pointerover',()=>{
      playAgainButton.alpha=.7;
    })
    playAgainButton.on('pointerout', ()=>{
      playAgainButton.alpha=1;
    })
    playAgainButton.on('pointerup', ()=>{
      playAgainButton.alpha=1;
      this.scene.start(CONST.SCENES.DEATH);
    })

  }
  //the rotation of the rectangle
  update(){
    this.add.text(100, 145, 'WE ARE SAVED!!').setFontFamily('Sans-Serif').setFontSize(25);
  }
}