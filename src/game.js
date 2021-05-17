import Phaser from 'phaser';
import {Level} from './scenes/level';
import {BuildMenu} from './scenes/build-ui';
import {Menu} from './scenes/menu';
import {TitleScene} from './scenes/title';
import {Tutorial} from './scenes/tutorial';
import {Death} from './scenes/death';
import {Victory} from './scenes/victory';
import {Shop} from './scenes/between-levels';
// eslint-disable-next-line
import {FirstEnemy} from './scenes/enemy';

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
      gravity: { y: 0 }
    }
  },
  scene: [
    TitleScene, Menu, Tutorial, Level, FirstEnemy, Death, Victory, BuildMenu, Shop
  ]
};

// Begin

// eslint-disable-next-line
let game = new Phaser.Game(config);