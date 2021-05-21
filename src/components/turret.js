import Phaser from 'phaser';
import '../scenes/level';
import {Bullet} from './bullet';
import { CONST } from '../constants';
import Player from './player';

// Since JavaScript doesn't have type checking, we need a way to make sure the
// construction for the class below has a way to validate parameters
function validTurretType(buildType) {
  return buildType === 'firewall' ||
         buildType === 'charger' ||
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

  //html request adapted from level.js. Returns the JSON object with bullet information
  bulletType(turretType){
    const request = new XMLHttpRequest();
    request.open('GET', 'json/projectiles.json', false);
    request.send(null);
    let projObject = JSON.parse(request.responseText);
    switch(turretType){
    case 'rectifier':
      return projObject[1];
    case 'virus-blaster':
      return projObject[2];
    case 'firewall':
    default:
      return projObject[0];
    }
  }

  preload(){
    /*const request = new XMLHttpRequest();
    request.open('GET', 'json/projectiles.json', false);
    request.send(null);
    this.projObject = JSON.parse(request.responseText);*/
  }
  //https://www.udemy.com/course/making-html5-games-with-phaser-3/learn/lecture/12610782#overview
  //https://steemit.com/utopian-io/@onepice/move-objects-according-to-the-mouse-position-with-phaser-3

  create(){
  }

  update(toTrack) {
    //let firedUpon = [];
    //https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
    //https://blog.ourcade.co/posts/2020/how-to-make-enemy-sprite-rotation-track-player-phaser-3/
    //determine projectile type based on turret value.
    let projType = this.bulletType(this.turretType);

    let enemyUnits = toTrack;
    for(let i = 0; i<enemyUnits.length; i++){
      if(enemyUnits[i].active && Phaser.Math.Distance.Between(this.x, this.y, enemyUnits[i].x, enemyUnits[i].y)<=75){
        let newAngle = Phaser.Math.Angle.Between(this.x, this.y, enemyUnits[i].x, enemyUnits[i].y);
        this.angle = (newAngle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        this.setRotation((newAngle + Math.PI/2)-160);
        if(this.delay >= projType.rate){
          let bullet = new Bullet(this.scene, this.x, this.y, enemyUnits[i], projType);
          if(this.scene.gBullets){
            this.scene.gBullets.add(bullet);
          }
          bullet.anims.create({key:'fired', frames: this.anims.generateFrameNumbers(projType.type, {start: projType.start, end: projType.end }), frameRate: 10, repeat: -1});
          //bullet destroy on world bounds https://phaser.io/examples/v3/view/physics/arcade/world-bounds-event
          bullet.setCollideWorldBounds(true);
          bullet.body.onWorldBounds = true;
          bullet.body.world.on('worldbounds', function(body){
            console.log('DEBUGGING: destroy called in Turret')
            bullet.destroy()
          });
          bullet.play('fired');
          bullet.fire();
          bullet.update();
          this.scene.firewallSfx.play();
          this.delay=0;
        }
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
    config  // Should be a string here
  ) {
    let name = config.name;

    if (!validTurretType(config.name)) {
      name = 'firewall'; // default turret
    }
    
    super(scene, x, y, name, 0);

    // Add object to the scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this).setDepth(1);
    this.getBody().setCollideWorldBounds(true);
    this.getBody().setAllowGravity(false);

    // Set depth so that turrets closer to the top of the map render first
    this.setDepth(2 * Math.floor(this.y / CONST.T_SIZE));

    // Add head to the turret
    if (name != 'psu' && name != 'charger') {
      this.head = new Head(this.scene, x, y, name, this.depth);
    }
    this.hp = 5;

    // TODO - clean up animation code
    if (name == 'psu' || name == 'charger') {
      this.play(`${name}-anim`);
    }

    this.ep = 0;
    this.frameCounter = 0;

    // Add energy modifier, if thing will produce energy
    if (config.ep) {
      this.ep = config.ep;
    }
  }
  preload(){
  }

  update(toTrack) {
    if (this.head) {
      this.head.update(toTrack);
    }
    this.frameCounter++;
    if (this.frameCounter >= 10) {
      this.frameCounter = 0;
      Player.energy += this.ep;
    }
  }

  dismantle() {
    if (this.head) {
      this.head.destroy();
      this.head = null;
    }
  }
}