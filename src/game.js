import Phaser from 'phaser';
import {TitleScene} from './scenes/title';
import {Menu} from './scenes/menu';
import { Player } from './components/player';

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
  this.load.setBaseURL('/');
  // Load tile maps
  this.load.image('tiles', 'images/level1.png');
  this.load.tilemapTiledJSON('maps/level1');
}

// adapted from https://phaser.io/examples/v3/view/game-objects/container/add-sprite-to-container
// https://shawnhymel.com/1220/getting-started-with-phaser-part-3-sprites-and-movement/
function create()
{
  // Set up the map
  const tilemap = this.make.tilemap({ key: 'maps/level1' });
  const tileset = tilemap.addTilesetImage('level1_tiles', 'tiles');
  tilemap.createLayer('base', tileset);
}

function update() {
  // TODO

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