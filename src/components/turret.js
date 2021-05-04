import Phaser from 'phaser';
import '../scenes/level';
//import {Bullet} from './projectile';
import { CONST } from '../constants';

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

  }
  preload(){
  }
  //https://www.udemy.com/course/making-html5-games-with-phaser-3/learn/lecture/12610782#overview
  setAngleBullet(angle){
    let rads = angle * Math.PI/180;
    var tanX = Math.cos(rads);
    var tanY = Math.sin(rads);
    return {tanX, tanY}
  }
  fire(x, y, angle, enemy) {
    let dirctBull = this.setAngleBullet(angle)
    this.addBullet = this.scene.physics.add.sprite(this.x + dirctBull.tanX * 30, this.y + dirctBull.tanY * 30, 'bullet');  //load bullet image at position of turret
    this.addBullet.angle = (angle);
    this.addBullet.body.setVelocity(dirctBull.tanX*100, dirctBull.tanY*100)
    //this.addBullet.setVelocity(100, 100);

    this.scene.physics.add.collider(this.addBullet, enemy);
// from https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/

   // this.scene.physics.accelerateToObject(this.addBullet, enemy, 60, 60, 60);
    //angle towards enemy
    //shoot bullet with X speed for some sort of distance/until hits enemy or wall
    //do damage
    let attack = this.scene.physics.add.overlap(this.addBullet, enemy, function (destroyBullet) {
      destroyBullet.body.stop();
      this.scene.physics.world.removeCollider(attack)
    }, null, this);
  }
  update(toTrack) {
    //https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    //https://blog.ourcade.co/posts/2020/how-to-make-enemy-sprite-rotation-track-player-phaser-3/
    //const BulletScene = Phaser.Scenes.get('Bullet');

    let enemyUnits = toTrack;
    //print(enemyUnits.length);
    for(let i = 0; i<enemyUnits.length; i++){
      if(enemyUnits[i].active && Phaser.Math.Distance.Between(this.x, this.y, enemyUnits[i].x, enemyUnits[i].y)<=50){
        let newAngle = Phaser.Math.Angle.Between(this.x, this.y, enemyUnits[i].x, enemyUnits[i].y);
        this.angle = (newAngle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        this.setRotation((newAngle + Math.PI/2)-160);
        //BulletScene.fire(this.x, this.y, this.angle, enemyUnits[i]);
        this.fire(this.x, this.y, this.angle, enemyUnits[i]); //cannot read property of add of 'undefined'
        //bullet.fire(this.x, this.y, this.angle, enemyUnits[i]);
        //this.fire(this.x, this.y, this.angle, Phaser.Math.Distance.Between(this.x, this.y, enemyUnits[i].x, enemyUnits[i].y))
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
    this.scene.physics.add.existing(this);
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