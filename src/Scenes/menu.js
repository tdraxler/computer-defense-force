import Phaser from 'phaser';
import { CST } from '../CST';

let testRec;

export class Menu extends Phaser.Scene {
  constructor() {
    super({
      key:CST.SCENES.MENU
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
    this.add.image(150,200,'startButton').setOrigin(0).setDepth(1)
  }
  update(){
    testRec.rotation += 0.01;
  }
}