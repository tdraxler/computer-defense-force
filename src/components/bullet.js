import Phaser from 'phaser';
import '../scenes/level';
import {CONST} from '../constants';

//https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/

export class Bullet extends Phaser.GameObjects.Sprite {

  constructor(scene, x, y, enemy) {
    super(scene, x, y, enemy);
    this.enemy = enemy;
    this.x = x;
    this.y=y;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this).setDepth(1);
    this.getBody().setCollideWorldBounds(true);
    this.getBody().setAllowGravity(false);
  }

  preload()
  {

  }
  create()
  {
    this.addBullet = this.physics.add.sprite(this.x, this.y, 'bullet').setDepth(2);
  }
  fire() {
    //this.addBullet = this.scene.physics.add.sprite(this.x, this.y, 'bullet').setDepth(2);
    this.physics.moveToObject(this.addBullet, this.enemy, 400); //suggested by Abraham
    this.addBullet.setVisible(true);
    // from https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    this.physics.add.overlap(this.addBullet, this.enemy);
    //return this.addBullet;
  }
  update(){
    this.add.overlap(this.addBullet, this.enemy, destroy, null, this)
  }
}
function destroy(){
  this.addBullet.disableBody(true,true);
}

