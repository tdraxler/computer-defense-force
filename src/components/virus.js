import Phaser from 'phaser'

const VIRUS_KEY = 'virus'
export class Virus extends Phaser.GameObjects.Image {
  // TODO - Make this useful

  constructor(scene, width, height) {
    super(scene, width, height, 'virus');

    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.scene.load.image('enemy2', 'images/Sprite-0002.png');
    //this.config = config;
    //this.config.scene.load.image('enemy2', 'images/Sprite-0002.png', { frameWidth: 200, frameHeight: 50 });
  }

  createVirus(){
    //this.scene.virus = this.physics.add.sprite(,,VIRUS_KEY)
    this.scene.add.image(200, this.scene.height / 2, 'enemy2');
  }

  // from here on out adapted from udemy course examples with very minor changes:
  // https://www.udemy.com/course/making-html5-games-with-phaser-3/
  update() {
    this.scene.virus.x += 2;
    if (this.scene.virus.x > this.scene.width) {
      this.scene.virus.x = 0;
    }
  }

  walk() {
    this.scene.tweens.add({
      targets: this.scene.virus,
      duration: 8000,
      x: this.scene.width,
      y: 0,
      onComplete: this.onCompleteHandler.bind(this)
    });
  }

  onCompleteHandler(tween, targets, custom) {
    let virus = targets[0];
    virus.x = 0;
    virus.y = this.scene.height / 2;
    this.walk();
  }

  testFunc() {
    console.log('test');
  }
}