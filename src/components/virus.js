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
    //this.setBodySize(5, 5, true);
    //this.setBodySize(1,1, true);
    //this.setOffset(5,5);

  }
}