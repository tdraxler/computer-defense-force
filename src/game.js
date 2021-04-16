import Phaser from 'phaser';
import { Player } from './components/player';

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