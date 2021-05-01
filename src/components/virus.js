import Phaser from 'phaser'


export class Virus extends Phaser.GameObjects.Sprite {
  // TODO - Make this useful

  constructor(config) {
    super(config.scene, config.x, config.y, config.hp, config.dmg);

    config.scene.add.existing(this);
    this.setInteractive();
    this.x = config.x;
    this.y = config.y;
    this.hp = config.hp;
    this.dmg = config.dmg;
  }
}