import Phaser from 'phaser'


export class Virus extends Phaser.Physics.Arcade.Sprite {
  // TODO - Make this useful

  constructor(config) {
    super(config.scene, config.x, config.y);

    config.scene.add.existing(this);
    this.setInteractive();
    this.x = config.x;
    this.y = config.y;
    this.hp = config.hp;
    this.damage = config.damage;
    this.points = config.points;
    this.scene.physics.add.existing(this);
    this.setBodySize(15, 15, true);

  }
}