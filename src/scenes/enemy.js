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
    // Will return to debug commented out code if modularization figured out.
    //this.virus2 = new Virus(this, this.game.config.width, this.game.config.height / 2);
  }

  create() {
    bgm = this.sound.add('bgm', { loop: true, volume: 0.25 });
    bgm.play();
    //this.virus = this.add.image(this.game.config.width - 10, this.game.config.height /2, 'enemy1');
    this.virus = new Virus({ scene: this });
    this.virus.setScale(0.5, 0.5);
    this.virus.addVirus(this.game.config.width, this.game.config.height);
    //this.virus2.createVirus();
    this.virus.walk();
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

    let positions = [
      {x: this.game.config.width - 10, y: 25,}, 
      {x: 10, y: 25}, 
      {x: 10, y: this.game.config.height - 10}, 
      {x: this.game.config.width - 50, y: this.game.config.height - 15}, 
      {x: this.game.config.width - 50, y: this.game.config.height - 200}, 
      {x: this.game.config.width - 120, y: this.game.config.height - 200}, 
      {x: this.game.config.width - 120, y: this.game.config.height - 100}, 
      {x: this.game.config.width / 2, y: this.game.config.height - 100}, 
      {x: this.game.config.width / 2, y: this.game.config.height / 2}
    ];

    for (let i = 0; i < positions.length; i++) {
      if (i === 8) {
        this.timeline.add({
          targets: this.virus,
          duration: 2000,
          x: positions[i].x,
          y: positions[i].y,
          onComplete: this.onCompleteHandler.bind(this)
        });
      } else {
        this.timeline.add({
          targets: this.virus,
          duration: 2000,
          x: positions[i].x,
          y: positions[i].y
        });
      }
    }

    this.timeline.play();
  }

  // center reached
  onCompleteHandler(tween, targets, custom) {
    this.events.emit('onCompleteHandler', 1); // <- event emitter
    let virus = targets[0];
    virus.x = this.game.config.width - 10;
    virus.y = this.game.config.height - 25;
    this.walk();
  }
}