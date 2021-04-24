import Phaser from 'phaser';

// Since JavaScript doesn't have type checking, we need a way to make sure the
// construction for the class below has a way to validate parameters
function validTurretType(buildType) {
  return buildType === 'firewall';
}

export class Turret extends Phaser.GameObjects.Sprite {

  getBody() {
    return this.body;
  }

  constructor(
    scene,
    x, y,
    buildType  // Should be a string here
  ) {

    if (!validTurretType(buildType)) {
      buildType = 'firewall'; // default turret
    }

    super(scene, x, y, buildType);

    // Add object to the scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);
    this.getBody().setAllowGravity(false);
  }

  update() {

  }
}