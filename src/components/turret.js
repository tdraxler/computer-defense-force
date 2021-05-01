import Phaser from 'phaser';

// Since JavaScript doesn't have type checking, we need a way to make sure the
// construction for the class below has a way to validate parameters
function validTurretType(buildType) {
  return buildType === 'firewall';
}

// Unfortunately, Phaser seems to struggle with child sprites, so for now we
// a reference to the turret Head in the Turret class instance.
class Head extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, headType) {
    super(scene, x, y, headType, 1);
    this.scene.add.existing(this);

    // Temporary
    this.angle = (Math.random() * 360.0).toFixed(5);
    this.rotSpeed = (Math.random() * 10.0) - 5;
  }
  // adapted from: https://blog.ourcade.co/posts/2020/how-to-make-enemy-sprite-rotation-track-player-phaser-3/
  setTarget(target = Phaser.GameObjects.Components.Transform){
    this.target=target
  }
  update() {
    // TODO - rotate
    //this.angle += this.rotSpeed;
    if(!this.target){
      return
    }
    let targetX=this.target.x;
    let targetY=this.target.y;

    let turretX = this.x;
    let turretY = this.y;

    let rotation = Phaser.Math.Angle.Between(turretX, turretY, targetX, targetY)
    this.setRotation(rotation)
  }
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

    super(scene, x, y, buildType, 0);

    // Add object to the scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);
    this.getBody().setAllowGravity(false);

    // Add head to the turret
    this.head = new Head(this.scene, x, y, buildType);
    // this.add.Sprite(new Head(this.scene, x, y, buildType))
  }

  update() {
    this.head.update();
  }

  dismantle() {
    this.head.destroy();
    this.head = null;
  }
}