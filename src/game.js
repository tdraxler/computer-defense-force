import Phaser from 'phaser';
import {Level} from './scenes/level';
import {BuildMenu} from './scenes/build-ui';
import {Menu} from './scenes/menu';
import {TitleScene} from './scenes/title';
import {Tutorial} from './scenes/tutorial';
import {Tutorial2} from './scenes/tutorial-2';
import {Tutorial3} from './scenes/tutorial-3';
import {Death} from './scenes/death';
import {Victory} from './scenes/victory';
import {Shop} from './scenes/between-levels';

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
      /* Uncomment the line below if you want to see the collision boxes */
      //debug: true,
      gravity: { y: 0 }
    }
  },
  scene: [
    TitleScene, Menu, Tutorial, Tutorial2, Tutorial3, Level, Death, Victory, BuildMenu, Shop
  ]
};

// Begin

// eslint-disable-next-line
let game = new Phaser.Game(config);