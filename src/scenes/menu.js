import Phaser from 'phaser';
import { CONST } from '../constants';
import Player from '../components/player';
//import {start} from '../';


let mBgm;
export class Menu extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.MENU
    });
  }

  //data from others scenes gets passed in here
  init(){
  }

  preload(){
    // Music: “Spinning Gears”, from PlayOnLoop.com
    // Licensed under Creative Commons by Attribution 4.0
    // https://www.playonloop.com/2016-music-loops/spinning-gears/
    this.load.audio('mBgm', ['sound/bgm/POL-spinning-gears-short.wav']);
  }

  //must include create
  create(){
    this.input.setDefaultCursor('url(images/ui/cursors/default.png), pointer');
    mBgm = this.sound.add('mBgm', { loop: true, volume: 0.25 });
    mBgm.play();
    this.add.image(0,0,'imgTitle').setOrigin(0).setDepth(0); //set origin to middle of screen instead of upper left
    this.add.image(55,35,'title').setOrigin(0).setDepth(3);
    this.add.image(55,25,'title_back').setOrigin(0).setDepth(2);

    let startButton = this.add.image(200,200,'startButton').setOrigin(0).setDepth(1)
    let tutorialButton = this.add.image(100,200,'tutorialButton').setOrigin(0).setDepth(1)
    startButton.setInteractive();
    startButton.on('pointerover',()=>{
      startButton.alpha=.7;
    })
    startButton.on('pointerout', ()=>{
      startButton.alpha=1;
    })
    startButton.on('pointerup', ()=>{
      startButton.alpha=1;
      mBgm.stop();
      Player.reset();
      this.scene.start(CONST.SCENES.LEVEL);
    })
    tutorialButton.setInteractive();
    tutorialButton.on('pointerover',()=>{
      tutorialButton.alpha=.7;
    })
    tutorialButton.on('pointerout', ()=>{
      tutorialButton.alpha=1;
    })
    tutorialButton.on('pointerup', ()=>{
      tutorialButton.alpha=1;
      mBgm.stop();
      this.scene.start(CONST.SCENES.TUTORIAL);
    })
    this.cameras.main.fadeIn(250, 0, 0, 0);
  }
  
  //the rotation of the rectangle
  update(){
  }
}