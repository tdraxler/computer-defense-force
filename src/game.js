import Phaser from 'phaser';
import { Player } from './components/player';
import { Virus } from './components/virus';

console.log('Game script loaded successfully!');

let config = {
  type: Phaser.AUTO,
  width: 400,
  height: 300,
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
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

function preload()
{
  // TODO
  this.load.spritesheet('virus', 'images/virus_v1.png',{
    frameWidth: 50, frameHeight: 50
})
}

function create()
{
  // TODO
}

function update()
{
  // TODO
}


// Begin

// eslint-disable-next-line
let game = new Phaser.Game(config);

let player = new Player();
player.testFunc();
//copied from above Kirsten C
let virus = new Virus();
virus.testFunc();