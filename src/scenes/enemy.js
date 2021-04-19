import Phaser from 'phaser';
import { CONST } from '../constants';
import { Virus } from '../components/virus';

let enemy;
let bgm;

export class FirstEnemy extends Phaser.Scene {
  constructor() {
    super({
      key: CONST.SCENES.ENEMY
    });
    this.points = [0, 0, 0, 400, 400, 300, 0, 300];
    this.path;
  }

  preload() {
    // Testing setting background sound, 
    // Source:  https://www.fesliyanstudios.com/royalty-free-music/download/a-bit-of-hope/565
    this.load.audio('bgm', ['2020-03-22_-_A_Bit_Of_Hope_-_David_Fesliyan.mp3']);
    //this.load.image('enemy1', 'images/Sprite-0002.png');
    this.virus2 = new Virus(this, this.game.config.width, this.game.config.height / 2);
  }

  create() {
    bgm = this.sound.add('bgm', { loop: true, volume: 0.25 });
    bgm.play();
    //this.virus = this.add.image(this.game.config.height / 2, this.game.config.width, 'enemy1');
    let curve = new Phaser.Curves.CubicBezier(this.points);
    this.path.add(curve);
    
    this.virus2.createVirus();
    this.walk();
    //this.walk();
  }

  // from here on out adapted from udemy course examples with very minor changes:
  // https://www.udemy.com/course/making-html5-games-with-phaser-3/
  update() {
    /*this.virus.x -= 2;
    if (this.virus.x < 0) {
      this.virus.x = this.game.config.width;
    }*/

    this.virus2.update();
  }

  walk() {
    this.tweens.add({
      targets: this.virus2,
      duration: 2000,
      x: 0,
      y: 0,
      onComplete: this.onCompleteHandler.bind(this)
    });
  }

  onCompleteHandler(tween, targets, custom) {
    let virus = targets[0];
    virus.x = this.game.config.width;
    virus.y = this.game.config.height / 2;
    this.walk();
  }
}