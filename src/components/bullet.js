import Phaser from 'phaser';
import {CONST} from '../constants';

//https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
export class BulletGroup extends Phaser.GameObjects.Sprite {
  constructor() {
    super({
      key: CONST.SCENES.ENEMY
    });
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);
    this.getBody().setAllowGravity(false);
    this.createMultiple({})
  }
}
class Bullet extends Phaser.GameObjects.Sprite{
  preload(){
    //link for bullet sprite
    //this.load.spritesheet('bullet', '../public/images/bullet_5px.png', {frameWidth: 5, frameHeight: 5});
  }
  create(){
    //this.add.sprite()
    let bulletAnims = {
      key: 'fire',
      frames: this.anims.generateFrameNumbers('bullet', {start: 0, end: 3, first: 3}),
      frameRate: 8,
      repeat: -1
    }
    this.anims.create(bulletAnims);
    this.bullets = [];


  }
  //currently is a placeholder
  //bullet could accelerate towards X enemy using https://phaser.io/examples/v3/view/physics/arcade/accelerate-to
  fire(x, y, angle, dist, enemy) {
    let addBullet = this.physics.add.sprite(this.x, this.y, 'bullet');//load bullet image at position of turret
    addBullet.setVelocity(100, 100);
    this.physics.add.collider(addBullet, enemy);
    this.physics.accelerateToObject(addBullet, enemy, 60, 100, 100);
    //angle towards enemy
    //shoot bullet with X speed for some sort of distance/until hits enemy or wall
    //do damage
    var attack = this.physics.add.overlap(addBullet, enemy, function (destroyBullet){
      destroyBullet.body.stop();
      this.physics.world.removeCollider(attack)
    }, null, this);
    //disappear
  }
  update(){

  }
}