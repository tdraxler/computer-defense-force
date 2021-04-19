import Phaser from 'phaser';

let enemy;
let bgm;

export class FirstEnemy extends Phaser.Scene {
  constructor() {
    super({ key: 'FirstEnemy' });
  }

  init() {}

  preload() {
    // Testing setting background sound, 
    // Source:  https://www.fesliyanstudios.com/royalty-free-music/download/a-bit-of-hope/565
    this.load.audio('bgm', ['2020-03-22_-_A_Bit_Of_Hope_-_David_Fesliyan.mp3']);
    this.load.image('enemy1', 'images/Sprite-0002.png');
  }

  create() {
    bgm = this.sound.add('bgm', { loop: true, volume: 0.25 });
    bgm.play();
    this.virus = this.add.image(200, this.game.config.height / 2, 'enemy1');

    this.walk();
  }

  update() {
    this.virus.x += 2;
    if (this.virus.x > this.game.config.width) {
      this.virus.x = 0;
    }
  }

  walk() {
    this.tweens.add({
      targets: this.virus,
      duration: 2000,
      x: this.game.config.width,
      y: 0,
      onComplete: this.onCompleteHandler.bind(this)
    });
  }

  onCompleteHandler(tween, targets, custom) {
    let virus = targets[0];
    virus.x = 0;
    virus.y = this.game.config.height / 2;
    this.walk();
  }
}