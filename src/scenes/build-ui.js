import Phaser from 'phaser';
import { CONST } from '../constants';

export class BuildMenu extends Phaser.Scene {
  constructor() {
    super({
      key: CONST.SCENES.BUILD_MENU
    });
  }

  preload() {
    this.load.image('build-bar-upper', 'images/ui/build-bar1.png');
  }

  create() {
    this.buildBarUpper = this.add.sprite(100, 0, 'build-bar-upper').setOrigin(0,0);
  }

  update() {
  }
}