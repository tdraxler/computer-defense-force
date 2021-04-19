import Phaser from 'phaser';
import {Level} from './scenes/level';
import {Menu} from './scenes/menu';
import {TitleScene} from './scenes/title';
import {FirstEnemy} from './scenes/enemy';

console.log('Game script loaded successfully!');

let config = {
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  //backgroundColor: '#000000',
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
    TitleScene, Menu, Level, FirstEnemy
  ]
};

// Begin

// eslint-disable-next-line
let game = new Phaser.Game(config);
