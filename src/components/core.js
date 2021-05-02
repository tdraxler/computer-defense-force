import Phaser from 'phaser';

export class Core extends Phaser.GameObjects.Sprite {

  getBody() {
    return this.body;
  }

  constructor(scene, x, y, coreConfig) {
    super(scene, x, y, 'core');

    console.log(coreConfig);
    // Add object to the scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);
    this.getBody().setAllowGravity(false);
  }

  update() {

  }
}