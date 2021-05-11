import Phaser from 'phaser';
import '../scenes/level';
import {CONST} from '../constants';

//https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/

export class Bullet extends Phaser.GameObjects.Sprite {

  getBody() {
    return this.body;
  }

  constructor(scene, x, y, enemy) {
    super(scene, x, y, 'bullet');
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
    // this.addBullet = this.physics.add.sprite(this.x, this.y, 'bullet').setDepth(2);
    this.setDepth(2);
  }
  fire() {
    //this.addBullet = this.scene.physics.add.sprite(this.x, this.y, 'bullet').setDepth(2);
    this.scene.physics.moveToObject(this, this.enemy, 400); //suggested by Abraham
    // this.addBullet.setVisible(true);
    // from https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    //this.scene.physics.add.overlap(this, this.enemy);
    //return this.addBullet;

  }
  update(){
    console.log('bullet update called');
    // this.add.overlap(this, this.enemy, destroy, null, this);
    if(this.x>this.scene.physics.world.bounds.width || this.y>this.scene.physics.world.bounds.height || this.x<0 || this.y<0){
      this.destroy();
      console.log('bullet destroy called');
    }

  }
}
/*function destroy(){
  // this.addBullet.setVisible(false);
  this.destroy();
}*/

