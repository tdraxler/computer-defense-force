import Phaser from 'phaser';
import { CONST } from '../constants';
import { Virus } from '../components/virus';
import { walk, onCompleteHandler } from '../components/walk';

let bgm;
let num = -2;

export class FirstEnemy extends Phaser.Scene {
  constructor() {
    super({
      key: CONST.SCENES.ENEMY
    });

    this.walk = walk.bind(this);
    this.onCompleteHandler = onCompleteHandler.bind(this);
  }

  preload() {
    // Testing setting background sound, 
    // Source:  https://www.fesliyanstudios.com/royalty-free-music/download/a-bit-of-hope/565
    this.load.audio('bgm', ['2020-03-22_-_A_Bit_Of_Hope_-_David_Fesliyan.mp3']);
    this.load.image('enemy1', 'images/Sprite-0002.png');
  }

  create() {
    bgm = this.sound.add('bgm', { loop: true, volume: 0.25 });
    bgm.play();
    this.virus = new Virus({scene: this, x: this.game.config.width - 10, y: this.game.config.height / 2});
    this.virus.setScale(0.5, 0.5);
    this.walk();
  }

  // from here on out adapted from udemy course examples:
  // https://www.udemy.com/course/making-html5-games-with-phaser-3/
  // Main change is the use of a timeline instead of a single event
  update() {
    this.virus.x += num;
    if (this.virus.x < 0) {
      num *= -1;
    }
  }
}