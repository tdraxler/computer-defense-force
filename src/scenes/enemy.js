import Phaser from 'phaser';
import { CONST } from '../constants';
import { Virus } from '../components/virus';

let bgm;
let num = -2;

export class FirstEnemy extends Phaser.Scene {
  constructor() {
    super({
      key: CONST.SCENES.ENEMY
    });
  }

  preload() {
    // Testing setting background sound, 
    // Source:  https://www.fesliyanstudios.com/royalty-free-music/download/a-bit-of-hope/565
    this.load.audio('bgm', ['2020-03-22_-_A_Bit_Of_Hope_-_David_Fesliyan.mp3']);
    this.load.image('enemy1', 'images/Sprite-0002.png');
    //this.virus2 = new Virus(this, this.game.config.width, this.game.config.height / 2);
  }

  create() {
    bgm = this.sound.add('bgm', { loop: true, volume: 0.25 });
    bgm.play();
    this.virus = this.add.image(this.game.config.height - 25, this.game.config.width - 10, 'enemy1');
    this.virus.setScale(0.5, 0.5);
    
    //this.virus2.createVirus();
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

    //this.virus.update();
  }

  walk() {
    this.timeline = this.tweens.createTimeline();

    // top right
    this.timeline.add({
      targets: this.virus,
      duration: 2000,
      x: this.game.config.width - 10,
      y: 25,
    });

    // top left
    this.timeline.add({
      targets: this.virus,
      duration: 2000,
      x: 10,
      y: 25
    });

    // bottom left
    this.timeline.add({
      targets: this.virus,
      duration: 2000,
      x: 10,
      y: this.game.config.height - 10,
    });

    // bottom right - 50
    this.timeline.add({
      targets: this.virus,
      duration: 2000,
      x: this.game.config.width - 50,
      y: this.game.config.height - 15,
    });

    // go up
    this.timeline.add({
      targets: this.virus,
      duration: 2000,
      x: this.game.config.width - 50,
      y: this.game.config.height - 200
    });

    // go left
    this.timeline.add({
      targets: this.virus,
      duration: 2000,
      x: this.game.config.width - 120,
      y: this.game.config.height - 200
    });

    // go down
    this.timeline.add({
      targets: this.virus,
      duration: 2000,
      x: this.game.config.width - 120,
      y: this.game.config.height - 100
    });

    // left again
    this.timeline.add({
      targets: this.virus,
      duration: 2000,
      x: this.game.config.width / 2,
      y: this.game.config.height - 100
    });

    // up to destination
    this.timeline.add({
      targets: this.virus,
      duration: 2000,
      x: this.game.config.width / 2,
      y: this.game.config.height / 2,
      onComplete: this.onCompleteHandler.bind(this)
    });

    this.timeline.play();
  }

  onCompleteHandler(tween, targets, custom) {
    let virus = targets[0];
    virus.x = this.game.config.width - 10;
    virus.y = this.game.config.height - 25;
    this.walk();
  }
}