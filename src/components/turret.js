import Phaser from 'phaser';
import '../scenes/level';
import {Bullet} from './bullet';
import { CONST } from '../constants';

// Since JavaScript doesn't have type checking, we need a way to make sure the
// construction for the class below has a way to validate parameters
function validTurretType(buildType) {
  return buildType === 'firewall' ||
         buildType === 'rectifier' ||
         buildType === 'virus-blaster' ||
         buildType === 'psu';
}

// Unfortunately, Phaser seems to struggle with child sprites, so for now we
// a reference to the turret Head in the Turret class instance.
class Head extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, headType, bodyDepth=0) {
    super(scene, x, y, headType, 1);
    this.scene.add.existing(this).setDepth(bodyDepth + 1);
    this.delay = 0;

    this.turretType = headType;
  }

  preload(){
  }
  //https://www.udemy.com/course/making-html5-games-with-phaser-3/learn/lecture/12610782#overview
  //https://steemit.com/utopian-io/@onepice/move-objects-according-to-the-mouse-position-with-phaser-3

  create(){
  }

  update(toTrack) {
    //let firedUpon = [];
    //https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    //https://blog.ourcade.co/posts/2020/how-to-make-enemy-sprite-rotation-track-player-phaser-3/

    let enemyUnits = toTrack;
    for(let i = 0; i<enemyUnits.length; i++){
      if(enemyUnits[i].active && Phaser.Math.Distance.Between(this.x, this.y, enemyUnits[i].x, enemyUnits[i].y)<=75){
        let newAngle = Phaser.Math.Angle.Between(this.x, this.y, enemyUnits[i].x, enemyUnits[i].y);
        this.angle = (newAngle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        this.setRotation((newAngle + Math.PI/2)-160);
        if(this.delay >= 10){
          let bullet = new Bullet(this.scene, this.x, this.y, enemyUnits[i]);
          if(this.scene.gBullets){
            this.scene.gBullets.add(bullet);
          }
          bullet.anims.create({key:'fired', frames: this.anims.generateFrameNumbers('bullet', {start: 0, end: 3 }), frameRate: 10, repeat: -1});
          bullet.setCollideWorldBounds(true);
          bullet.body.onWorldBounds = true;
          bullet.body.world.on('worldbounds', function(body){
            if(body.gameObject === this){
              bullet.destroy()
            }
          })
          bullet.play('fired');
          bullet.fire();
          bullet.update();
          this.scene.firewallSfx.play();
          this.delay=0;
        }
        //add new turret to bullet group
      }
    }

    this.delay++;
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
    this.scene.physics.add.existing(this).setDepth(1);
    this.getBody().setCollideWorldBounds(true);
    this.getBody().setAllowGravity(false);
    this.setDepth(2 * Math.floor(this.y / CONST.T_SIZE));

    // Add head to the turret
    if (buildType != 'psu') {
      this.head = new Head(this.scene, x, y, buildType, this.depth);
    }
    this.hp = 5;

    // Set depth so that turrets closer to the top of the map render first
  }
  preload(){
  }

  update(toTrack) {
    if (this.head) {
      this.head.update(toTrack);
    }
  }

  dismantle() {
    if (this.head) {
      this.head.destroy();
      this.head = null;
    }
  }
}