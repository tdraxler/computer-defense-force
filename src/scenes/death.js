import Phaser from 'phaser';
import Player from '../components/player';
import { CONST } from '../constants';
//import {start} from '../';

let dBgm;
export class Death extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.DEATH
    });
  }
  //data from others scenes gets passed in here
  init(){

  }
  preload(){
    // Music: "Ruined Planet", from patrickdearteaga.com
    // By Patrick de Arteaga
    // https://patrickdearteaga.com/arcade-music/
    this.load.audio('dBgm', ['sound/bgm/Ruined_Planet.ogg']);
  }
  //must include create
  create(){
    dBgm = this.sound.add('dBgm', { loop: true, volume: 0.25 });
    dBgm.play();
    this.add.image(0,0,'gameOver-back').setOrigin(0).setDepth(0); //set origin to middle of screen instead of upper left
    this.add.image(55,25,'game-over').setOrigin(0).setDepth(3);
    this.add.image(30,15,'over-back').setOrigin(0).setDepth(2);

    let playAgainButton = this.add.image(150,250,'play-again_death').setOrigin(0).setDepth(1)
    playAgainButton.setInteractive();
    playAgainButton.on('pointerover',()=>{
      playAgainButton.alpha=.7;
    })
    playAgainButton.on('pointerout', ()=>{
      playAgainButton.alpha=1;
    })
    playAgainButton.on('pointerup', ()=>{
      playAgainButton.alpha=1;
      dBgm.stop();
      Player.restartLevel();
      this.scene.start(CONST.SCENES.MENU);
    })

  }
  update(){
  }
}