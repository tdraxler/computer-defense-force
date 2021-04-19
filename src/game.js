import Phaser from 'phaser';
import {TitleScene} from './scenes/title';
import {Menu} from './scenes/menu';
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
  scene: /*[
    TitleScene, Menu
  ]*/{
    preload: preload,
    create: create,
    update: update
  }
};
//var testRec;
let vir;
function preload()
{
  // TODO
  // Testing setting background sound, 
  // Source:  https://www.fesliyanstudios.com/royalty-free-music/download/a-bit-of-hope/565
  this.load.audio('bgm', ['2020-03-22_-_A_Bit_Of_Hope_-_David_Fesliyan.mp3']);

  this.load.image('enemy1', 'images/Sprite-0002.png');
}

// adapted from https://phaser.io/examples/v3/view/game-objects/container/add-sprite-to-container
// https://shawnhymel.com/1220/getting-started-with-phaser-part-3-sprites-and-movement/
let bgm;
function create()
{
  // TODO
  bgm = this.sound.add('bgm', { loop: true, volume: 0.25 });
  bgm.play();
  this.virus = this.add.image(200, game.config.height / 2, 'enemy1');

}

function update() {
  
}

let game = new Phaser.Game(config);
/*
let player = new Player();
player.testFunc();
//copied from above Kirsten C
let virus = new Virus();
virus.testFunc();*/