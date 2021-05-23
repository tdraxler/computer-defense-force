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
    console.log('I am now the  tutorial scene, I got data from the menu scene!')
  }
  preload(){

  }
  //must include create
  create(){
    this.add.image(0,0,'imgTitle').setOrigin(0).setDepth(0); //set origin to middle of screen instead of upper left
    this.add.image(80,15,'tutorial-title').setOrigin(0).setDepth(3);
    this.add.image(20,75,'tutorial-text').setOrigin(0).setDepth(3);
    let virus = this.add.sprite(100, 200, 'virus');
    let spyware = this.add.sprite(150, 200, 'spyware');
    let trojan = this.add.sprite(200, 200, 'trojan');
    let worm = this.add.sprite(250, 200, 'worm');
    let rootKit = this.add.sprite(300, 200, 'rootkit');

    //ANIMATIONS FOR ENEMIES
    this.anims.create({key:'v_move', frames: this.anims.generateFrameNumbers('virus', {start: 0, end: 3}),frameRate: 10,repeat: -1});
    this.anims.create({key:'s_move',frames: this.anims.generateFrameNumbers('spyware',{start: 0,end: 7}),frameRate: 10,repeat: -1});
    this.anims.create({key:'t_move',frames: this.anims.generateFrameNumbers('trojan',{start: 0,end: 5}),frameRate: 10,repeat: -1});
    this.anims.create({key:'w_move',frames: this.anims.generateFrameNumbers('worm',{start: 0,end: 3}),frameRate: 10,repeat: -1});
    this.anims.create({key:'r_move',frames: this.anims.generateFrameNumbers('rootkit',{start: 0,end: 9}),frameRate: 10,repeat: -1});

    virus.play('v_move');
    spyware.play('s_move');
    trojan.play('t_move');
    worm.play('w_move');
    rootKit.play('r_move');

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
      this.scene.start(CONST.SCENES.TUTORIAL2);
    })
  }
  //the rotation of the rectangle
  update(){
    //this.add.text(10, 10, 'HOW TO PLAY').setFontFamily('Sans-Serif').setFontSize(30);
  }
}