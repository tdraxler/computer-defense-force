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
  this.load.image('rec', 'src/images/testRec.png');
}

// adapted from https://phaser.io/examples/v3/view/game-objects/container/add-sprite-to-container
// https://shawnhymel.com/1220/getting-started-with-phaser-part-3-sprites-and-movement/
function create()
{
  // TODO

  // add to middle of area
  this.rec = this.add.sprite(150, 75, 'rec');
  this.rec.anchor.set(0.5, 0.5);

  this.keys = config.input.keyboard.createCursorKeys();

}

function createVirus(){

}

function update()
{
  // TODO
  // adding sprite move functionality from https://phaser.io/examples/v2/sprites/move-a-sprite
  if (this.keys.left.isDown) {
    this.rec.x -= 4;
  }
  if (this.keys.right.isDown) {
    this.rec.x += 4;
  }
  if (this.keys.up.isDown) {
    this.rec.y -= 4;
  }
  if (this.keys.down.isDown) {
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