// This scene is viewed between levels and gives the player the opportunity
// to purchase upgrades.
// Might get merged with victory.js - need to figure that out.

import Phaser from 'phaser';
import Player from '../components/player';
import { Button } from '../components/button';
import { CONST } from '../constants';

export class Shop extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.SHOP
    });
  }

  init() {

  }

  preload() {
    this.load.image('background', 'images/ui/between-levels.png');
    this.load.spritesheet('upgrade-buttons', 'images/ui/upgrade-buttons.png', { frameWidth: 64, frameHeight: 80 });

    this.keyC = this.input.keyboard.addKey('M'); // For debug operations
  }

  create() {
    this.background = this.add.sprite(0, 0, 'background').setOrigin(0,0);

    // Upgrade buttons
    if (!Player.unlocked['virus-blaster']) {
      this.virusBlasterButton = new Button(
        this, 48, 200, 'upgrade-buttons', 0, true,
        null, { upgrade: 'virus-blaster' }
      );
    }

    if (!Player.unlocked['rectifier']) {
      this.rectifierButton = new Button(
        this, 128, 200, 'upgrade-buttons', 2, true,
        null, { upgrade: 'rectifier' }
      );
    }

    if (!Player.unlocked['psu']) {
      this.psuButton = new Button(
        this, 208, 200, 'upgrade-buttons', 4, true,
        null, { upgrade: 'psu' }
      );
    }

    if (!Player.unlocked['hardened-core']) {
      this.hardenedCoreButton = new Button(
        this, 288, 200, 'upgrade-buttons', 6, true,
        null, { upgrade: 'hardened-core' }
      );
    }
  }

  update() {
    if (this.keyC.isDown) { // Debug - restarts the scene
      console.log('Restart level!');
      this.scene.start(CONST.SCENES.LEVEL);
      this.scene.stop(CONST.SCENES.SHOP);
    }
  }
}