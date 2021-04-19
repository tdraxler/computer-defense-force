import Phaser from 'phaser';
import {TitleScene} from './Scenes/title';
import {Menu} from './Scenes/menu';
import { Player } from './components/player';
import { Virus } from './components/virus';

console.log('Game script loaded successfully!');

let config = {
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  backgroundColor: '#000000',
  scale: {
    mode: Phaser.Scale.FIT
  },
  parent: 'game',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 100 }
    }
  },
  scene: [
    TitleScene, Menu
  ]/*{
    preload: preload,
    create: create,
    update: update
  }*/
};
//var testRec;
function preload()
{
  // TODO
  //this.load.spritesheet('testRec', './images/testRec.png', {frameHeight: 20, frameWidth: 20});
}

// adapted from https://phaser.io/examples/v3/view/game-objects/container/add-sprite-to-container
// https://shawnhymel.com/1220/getting-started-with-phaser-part-3-sprites-and-movement/
function create()
{
  // TODO
  // add to middle of area
  //testRec = this.add.sprite(200, 105, 'testRec');
  /*this.cursors = this.input.keyboard.createCursorKeys();
  this.rect = testRec;*/


}

function update() {
  // TODO
  //testRec.rotation += 0.01;
  //testRec.body.velocity.x=50;
  /*if(this.cursors.left.isDown){
    this.rect.setVelocityX(-20);
  } else if(this.cursors.right.isDown){
    this.rect.setVelocityX(20);
  } else{
    this.rect.setVelocityX(0);
  }*/
}


// Begin

// eslint-disable-next-line
let game = new Phaser.Game(config);
/*
let player = new Player();
player.testFunc();
//copied from above Kirsten C
let virus = new Virus();
virus.testFunc();*/