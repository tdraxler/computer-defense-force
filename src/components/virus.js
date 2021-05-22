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
    this.setBodySize(config.hitX, config.hitY, true);
    this.body.setOffset(config.width / 2 - config.hitX / 2, config.height * 3 / 4 - config.hitY / 2);
  }
}
