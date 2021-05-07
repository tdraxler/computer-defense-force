import Phaser from 'phaser';
import '../scenes/level';
import {CONST} from '../constants';

//https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/

export class Bullet extends Phaser.GameObjects.Sprite {
  constructor(scene, enemy) {
    super(
      scene, enemy
    );
    this.scene.add.existing(this);
    this.setInteractive();
    this.enemy = enemy;
  }
  preload()
  {
    //this.load.spritesheet('bullet', './images/bullet_5px.png', {frameWidth: 5, frameHeight: 5});
    //this.load.image('smBullet', '../images/bullet_5px.png');
    //, {frameWidth:5, frameHeight: 5}
  }

  fire(x, y, curEnemy) {
    this.addBullet = this.scene.physics.add.sprite(x, y, 'bullet');
    this.scene.physics.moveTo(this.addBullet, curEnemy.x, curEnemy.y);
    //this.addBullet.body.collideWorldBounds = true; // sets so that the bullets don't keep going off of the map
    this.scene.physics.add.collider(this.addBullet, curEnemy);
    this.addBullet.setMaxVelocity(700, 700);
    this.addBullet.lifespan=300;
    // from https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    let attack = this.scene.physics.add.overlap(this.addBullet, curEnemy, function (destroyBullet) {
      destroyBullet.body.stop();
      this.scene.physics.world.removeCollider(attack)
    }, null, this);
  }

  create()
  {

  }

  update(){
    for(let i = 0; i<this.enemy.length; i++){
      if(this.enemy[i].active && Phaser.Math.Distance.Between(this.x, this.y, this.enemy[i].x, this.enemy[i].y)<=50){
        let newAngle = Phaser.Math.Angle.Between(this.x, this.y, this.enemy[i].x, this.enemy[i].y);
        this.angle = (newAngle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        this.setRotation((newAngle + Math.PI/2)-160);
        this.fire(this.x, this.y, this.enemy[i]);
        //let bullet = new Bullet({scene: this, x: this.x, y: this.y, enemy: enemyUnits[i]});
        //this.fire();
        //bullet.fire(this.x, this.y, enemyUnits[i]);
        //firedUpon.push(bullet);
      }
    }
  }
}
