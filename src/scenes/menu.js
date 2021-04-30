import Phaser from 'phaser';
import { CONST } from '../constants';
//import {start} from '../';


export class Menu extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.MENU
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
    this.add.image(55,35,'title').setOrigin(0).setDepth(3);
    this.add.image(55,25,'title_back').setOrigin(0).setDepth(2);

    let startButton = this.add.image(150,200,'startButton').setOrigin(0).setDepth(1)
    startButton.setInteractive();
    startButton.on('pointerover',()=>{
      startButton.alpha=.7;
    })
    startButton.on('pointerout', ()=>{
      startButton.alpha=1;
    })
    startButton.on('pointerup', ()=>{
      startButton.alpha=1;
      this.scene.start(CONST.SCENES.LEVEL);
    })

  }
  
  //the rotation of the rectangle
  update(){
  }
}