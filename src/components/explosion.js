import Phaser from 'phaser'


export class Explosion extends Phaser.GameObjects.Sprite {
  // TODO - Make this useful

  constructor(config) {
    super(config.scene, config.x, config.y, config.animKey);
    config.scene.add.existing(this);
    
  }

  explode(animKey) {
    this.play(animKey, 15, false);
    this.once('animationcomplete', () => {
      this.destroy();
    });
  }
}