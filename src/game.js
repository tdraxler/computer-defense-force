import Phaser from 'phaser';
import { Player } from './components/player';
import { Virus } from './components/virus';

console.log('Game script loaded successfully!');

let config = {
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  backgroundColor: '#ffffff',
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
  this.load.spritesheet('testRec', 'src/images/testRec.png', {
    frameHeight: 20, frameWidth: 20
  });
}

// adapted from https://phaser.io/examples/v3/view/game-objects/container/add-sprite-to-container
// https://shawnhymel.com/1220/getting-started-with-phaser-part-3-sprites-and-movement/
function create()
{
  // TODO

  // add to middle of area
  this.rec = this.add.sprite(100, 100, 'testRec');
  this.rec.anchor.set(0.5, 0.5);

  this.keys = config.input.keyboard.createCursorKeys();

}

function createVirus(){

}

function update()
{
  // TODO
  // adding sprite move functionality from https://phaser.io/examples/v2/sprites/move-a-sprite
  if (config.keys.left.isDown) {
    this.rec.x -= 4;
  }
  if (config.keys.right.isDown) {
    this.rec.x += 4;
  }
  if (config.keys.up.isDown) {
    this.rec.y -= 4;
  }
  if (config.keys.down.isDown) {
    this.rec.y += 4;
  }
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