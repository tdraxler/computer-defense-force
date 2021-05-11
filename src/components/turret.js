import Phaser from 'phaser';
import '../scenes/level';
import {Bullet} from './bullet';

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
    this.scene.add.existing(this).setDepth(3);

  }
  preload(){
  }
  //https://www.udemy.com/course/making-html5-games-with-phaser-3/learn/lecture/12610782#overview
  //https://steemit.com/utopian-io/@onepice/move-objects-according-to-the-mouse-position-with-phaser-3

  create(){

  }

  update(toTrack) {
    //let firedUpon = [];
    //https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    //https://blog.ourcade.co/posts/2020/how-to-make-enemy-sprite-rotation-track-player-phaser-3/
    let enemyUnits = toTrack;
    for(let i = 0; i<enemyUnits.length; i++){
      if(enemyUnits[i].active && Phaser.Math.Distance.Between(this.x, this.y, enemyUnits[i].x, enemyUnits[i].y)<=50){
        let newAngle = Phaser.Math.Angle.Between(this.x, this.y, enemyUnits[i].x, enemyUnits[i].y);
        this.angle = (newAngle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        this.setRotation((newAngle + Math.PI/2)-160);
        let bullet = new Bullet(this.scene, this.x, this.y, enemyUnits[i]);
        bullet.fire();
      }
    }
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
    this.scene.physics.add.existing(this).setDepth(1);
    this.getBody().setCollideWorldBounds(true);
    this.getBody().setAllowGravity(false);

    // Add head to the turret
    this.head = new Head(this.scene, x, y, buildType);
    // this.add.Sprite(new Head(this.scene, x, y, buildType))
  }
  preload(){
  }

  update(toTrack) {
    this.head.update(toTrack);
  }

  dismantle() {
    this.head.destroy();
    this.head = null;
  }
}