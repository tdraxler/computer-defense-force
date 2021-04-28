import Phaser from 'phaser';
import { CONST, CURRENT_ACTION } from '../constants';
import Player from '../components/player';

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

    // Since we will be adding more buttons, we'll eventually want to create
    // a button class so we don't repeat ourselves.
    this.buildBarUpper = this.add.sprite(100, 0, 'build-bar-upper').setOrigin(0,0);
    this.buildButton = this.add.sprite(131, 2, 'buttons', 0).setOrigin(0,0);
    this.demolishButton = this.add.sprite(179, 2, 'buttons', 2).setOrigin(0,0);

    this.buildBarUpper.setInteractive();
    this.buildButton.setInteractive();
    this.demolishButton.setInteractive();

    this.buildButton.on('pointerdown', () => {
      this.buildButton.setFrame(1);
    });

    this.demolishButton.on('pointerdown', () => {
      this.demolishButton.setFrame(3);
    });

    this.buildButton.on('pointerup', () => {
      this.buildButton.setFrame(0);
      this.input.setDefaultCursor('url(images/ui/cursors/build.png), pointer');
      Player.setAction(CURRENT_ACTION.BUILD);
    });

    this.demolishButton.on('pointerup', () => {
      this.demolishButton.setFrame(2);
      this.input.setDefaultCursor('url(images/ui/cursors/delete.png), pointer');
      Player.setAction(CURRENT_ACTION.DEMOLISH);
    });

    this.buildButton.on('pointerout', () => {
      this.buildButton.setFrame(0);
    });

    this.demolishButton.on('pointerout', () => {
      this.demolishButton.setFrame(2);
    });
  }

  update() {
  }
}