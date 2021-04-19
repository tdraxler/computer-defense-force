import Phaser from 'phaser'

const VIRUS_KEY = 'virus'
export class Virus {
  // TODO - Make this useful

  constructor(config) {
    this.config = config;
    this.scene = config.scene;
    this.scene.load.image('enemy1', 'images/Sprite-0002.png', { frameWidth: 200, frameHeight: 50 });
    this.createVirus();
  }

  createVirus(){
    //this.virus = this.physics.add.sprite(,,VIRUS_KEY)
    this.virus = this.scene.add.image(200, this.config.height / 2, 'enemy1');
  }

  // from here on out adapted from udemy course examples with very minor changes:
  // https://www.udemy.com/course/making-html5-games-with-phaser-3/
  update() {
    this.virus.x += 2;
    if (this.virus.x > this.game.config.width) {
      this.virus.x = 0;
    }
  }

  walk() {
    this.tweens.add({
      targets: this.virus,
      duration: 8000,
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

  testFunc() {
    console.log('test');
  }
}