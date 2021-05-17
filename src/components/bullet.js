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
    this.damage = 1;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this).setDepth(1);
    this.getBody().setCollideWorldBounds(false);
    this.getBody().setAllowGravity(false);

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
  }

  update(){
    if(this.x>this.scene.physics.world.bounds.height || this.y>this.scene.physics.world.bounds.width || this.x<0 || this.y<0){
      this.destroy();
    }


  }
}

