import Phaser from 'phaser'


export class Explosion extends Phaser.Physics.Arcade.Sprite {
  // TODO - Make this useful

  constructor(config) {
    super(config.scene, config.x, config.y, config.animKey);
    config.scene.add.existing(this);
    config.scene.physics.add.existing(this);
    this.framesCount = config.framesCount;
  }

  explode(animKey) {
    this.play(animKey, 15, this.framesCount);
    this.once('animationcomplete', () => {
      this.destroy();
    });
  }
}