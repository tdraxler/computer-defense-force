import Phaser from 'phaser';
import { CONST } from '../constants';
//import {start} from '../';

export class Tutorial3 extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.TUTORIAL3
    });
  }
  init(data){
  }
  preload(){

  }
  //must include create
  create(){
    this.add.image(0,0,'tutorial-back').setOrigin(0).setDepth(0); //set origin to middle of screen instead of upper left
    this.add.image(80,10,'tutorial-title').setOrigin(0).setDepth(3);
    this.add.image(25,75,'tutorial-text3').setOrigin(0).setDepth(3);
    let core = this.add.sprite(175, 200,'psu');
    let recharge = this.add.sprite(225, 200, 'charger');

    this.anims.create({key:'anim_core', frames: this.anims.generateFrameNumbers('psu', {start: 0, end: 3}),frameRate: 10,repeat: -1});
    this.anims.create({key:'anim_recharge',frames: this.anims.generateFrameNumbers('charger',{start: 0,end: 3}),frameRate: 10,repeat: -1});

    core.play('anim_core');
    recharge.play('anim_recharge');

    let startButton = this.add.image(150,250,'startButton').setOrigin(0).setDepth(1);
    startButton.setInteractive();
    startButton.on('pointerover',()=>{
      startButton.alpha=.7;
    })
    startButton.on('pointerout', ()=>{
      startButton.alpha=1;
    })
    startButton.on('pointerup', ()=>{
      startButton.alpha=1;
      this.scene.start(CONST.SCENES.MENU);
    })
  }
  update(){

  }
}