import Phaser from 'phaser';
import '../scenes/level';
import { CONST } from '../constants';
import {Level} from '../scenes/level';

export class Bullet extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.angle, config.enemy);
    // Add object to the scene
    config.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);
    this.getBody().setAllowGravity(false);
    this.x = config.x;
    this.y = config.y;
    this.angle = config.angle;
    this.enemy = config.enemy;
    this.fire(this.x, this.y, this.angle, this.enemy);

    // Add head to the turret

    this.add.Sprite(new Head(this.scene, x, y, buildType))
  }
  preload(){
    this.load.spritesheet('testRec', './images/testRec.png', {frameHeight: 20, frameWidth: 20});
  }
  fire(x, y, angle, dist, enemy) {
    const addBullet = this.physics.add.sprite(this.x, this.y, 'testRec');//load bullet image at position of turret
    addBullet.setVelocity(100, 100);
    this.physics.add.collider(addBullet, enemy);
    this.physics.accelerateToObject(addBullet, enemy, 60, 100, 100);
    //angle towards enemy
    //shoot bullet with X speed for some sort of distance/until hits enemy or wall
    //do damage
    let attack = this.physics.add.overlap(addBullet, enemy, function (destroyBullet) {
      destroyBullet.body.stop();
      this.physics.world.removeCollider(attack)
    }, null, this);
  }


  update() {

  }

}