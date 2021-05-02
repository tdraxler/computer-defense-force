import Phaser from 'phaser';

//https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
class Bullet extends Phaser.GameObjects.Sprite {
  preload(){
    //link for bullet sprite
    this.load.image('bullet', '../public/images/bullet_5px.png');
  }
  //currently is a placeholder
  //bullet could accelerate towards X enemy using https://phaser.io/examples/v3/view/physics/arcade/accelerate-to
  fire(x, y, angle, dist, enemy) {
    var addBullet = this.physics.add.sprite(x, y, 'bullet');//load bullet image at position of turret
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