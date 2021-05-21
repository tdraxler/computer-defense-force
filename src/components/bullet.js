import Phaser from 'phaser';
import '../scenes/level';
import {CONST} from '../constants';

//https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/

export class Bullet extends Phaser.Physics.Arcade.Sprite {

  getBody() {
    return this.body;
  }

  constructor(scene, x, y, enemy, bulType) {
    super(scene, x, y, bulType);
    this.enemy = enemy;
    this.x = x;
    this.y=y;
    this.damage = bulType.damage;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this).setDepth(1);
    this.getBody().setCollideWorldBounds(false);
    this.getBody().setAllowGravity(false);
    this.setBodySize(5, 5, true)

  }

  preload()
  {

  }
  create()
  {
    this.setDepth(2);
  }
  fire() {
    this.scene.physics.moveToObject(this, this.enemy, 400); //suggested by Abraham
    //sets the angle of the sprite
    let newAngle = Phaser.Math.Angle.Between(this.x, this.y, this.enemy.x, this.enemy.y);
    this.angle = (newAngle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
    this.setRotation((newAngle + Math.PI/2));
  }
  update(){
  }
}

