// A simple coin that can do a few tricks
// Handles animating and moving a coin sprite.

import Phaser from 'phaser'


export class Coin extends Phaser.Physics.Arcade.Sprite {
  // TODO - Make this useful

  constructor(config) {
    super(config.scene, config.x, config.y, config.staticKey, 0);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    this.animKey = config.animKey;
    
  }

  launchUp() {
    this.play(this.animKey);
    this.setVelocityY(-80);
    this.once('animationcomplete', () => {
      this.destroy();
    });
  }
}