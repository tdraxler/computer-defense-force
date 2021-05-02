import Phaser from 'phaser';

//https://gamedevacademy.org/how-to-make-tower-defense-game-with-phaser-3/
class Bullet extends Phaser.GameObjects.Sprite {
  preload(){
    //link for bullet sprite
    this.load.image('bullet', '../public/images/bullet_5px.png');
  }
  fire(x, y, angle, dist) {
    //load bullet image at position of turret
    //angle towards enemy
    //shoot bullet with X speed for some sort of distance/until hits enemy or wall
    //do damage
    //disappear
  }
  update(){

  }
}