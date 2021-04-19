import Phaser from 'phaser';
import {TitleScene} from './scenes/title';
import {Menu} from './scenes/menu';
import { Player } from './components/player';
import { Virus } from './components/virus';
import { FirstEnemy } from './scenes/enemy';

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
    /*TitleScene, Menu*/FirstEnemy
  ]/*{
    preload: preload,
    create: create,
    update: update
  }*/
};
//var testRec;
let vir;
function preload()
{
  // TODO
  
}

// adapted from https://phaser.io/examples/v3/view/game-objects/container/add-sprite-to-container
// https://shawnhymel.com/1220/getting-started-with-phaser-part-3-sprites-and-movement/
let bgm;
function create()
{
  // TODO

}

function update() {
  // TODO
}

let game = new Phaser.Game(config);
/*
let player = new Player();
player.testFunc();
//copied from above Kirsten C
let virus = new Virus();
virus.testFunc();*/