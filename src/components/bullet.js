import Phaser from 'phaser';
import '../scenes/level';
import {CONST} from '../constants';

//https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/

export class Bullet extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(
      config.scene,
      config.x,
      config.y
    );
    config.scene.add.existing(this);
    this.setInteractive();
    this.x = config.x;
    this.y = config.y;
    this.enemy = config.enemy;
  }
  preload()
  {
    //this.load.spritesheet('bullet', './images/bullet_5px.png', {frameWidth: 5, frameHeight: 5});
    //this.load.image('smBullet', '../images/bullet_5px.png');
    //, {frameWidth:5, frameHeight: 5}
  }

  fire() {
    this.addBullet = this.scene.physics.add.sprite(this.x, this.y, 'bullet');
    this.scene.physics.moveTo(this.addBullet, this.enemy.x, this.enemy.y);
    //this.addBullet.body.collideWorldBounds = true; // sets so that the bullets don't keep going off of the map
    this.scene.physics.add.collider(this.addBullet, this.enemy);
    this.addBullet.setMaxVelocity(700, 700);
    this.addBullet.lifespan=300;
    // from https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    let attack = this.scene.physics.add.overlap(this.addBullet, this.enemy, function (destroyBullet) {
      destroyBullet.body.stop();
      this.scene.physics.world.removeCollider(attack)
    }, null, this);
  }

  create()
  {

  }
}
