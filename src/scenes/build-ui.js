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
    this.load.spritesheet('buttons', 'images/ui/buttons.png', { frameWidth: 42, frameHeight: 18 });

    this.input.setTopOnly(true); // Makes it so clicking on this UI not register a click below
  }

  create() {
    this.buildBarUpper = this.add.sprite(100, 0, 'build-bar-upper').setOrigin(0,0);
    this.buildButton = this.add.sprite(131, 2, 'buttons', 0).setOrigin(0,0);
    this.demolishButton = this.add.sprite(179, 2, 'buttons', 2).setOrigin(0,0);

    this.buildBarUpper.setInteractive();
    this.buildBarUpper.on('pointerup', () => {
      console.log('Clicked');
    })
  }

  update() {
  }
}