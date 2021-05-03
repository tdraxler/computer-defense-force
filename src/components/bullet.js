import Phaser from 'phaser';
import {CONST} from '../constants';

//https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/

export class Bullet extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.START
    });
  }
  preload()
  {
    this.load.spritesheet('bullet', './images/bullet_5px.png', {frameWidth: 5, frameHeight: 5});
    //this.load.image('smBullet', '../images/bullet_5px.png');
    //, {frameWidth:5, frameHeight: 5}
  }

  fire(x, y, angle, dist, enemy) {
    const addBullet = this.physics.add.sprite(this.x, this.y, 'bullet');//load bullet image at position of turret
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

  create()
  {

  }
}
