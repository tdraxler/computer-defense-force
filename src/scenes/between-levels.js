// This scene is viewed between levels and gives the player the opportunity
// to purchase upgrades.
// Might get merged with victory.js - need to figure that out.

import Phaser from 'phaser';
import Player from '../components/player';
import { Button } from '../components/button';
import { Coin } from '../components/coin';
import { CONST, FONT_CONFIG_SMALL } from '../constants';
class PriceLabel {
  constructor(scene, x, y, name, value=200) {
    this.scene = scene;
    this.coin = new Coin({scene: this.scene, x, y, staticKey: 'coin', animKey: 'coin-anim-final'});
    this.label = scene.add.text(
      x + 12, y - 2,
      `${value}`,
      FONT_CONFIG_SMALL
    );
    this.name = name;
    this.active = true;
  }
  getRid() {
    this.coin.launchUp();
    this.label.destroy();
    this.active = false;
  }
}

export class Shop extends Phaser.Scene {
  constructor() {
    super({
      key:CONST.SCENES.SHOP
    });
  }

  init() {
    // let element = document.createElement('style');
    // document.head.appendChild(element);
    // let sheet = element.sheet;
    // let styles = `@font-face {
    //   font-family: 'press_start';
    //   src: url('fonts/PressStart2P-Regular.ttf');
    //   font-weight: 400;
    //   font-weight: normal;
    // }`;
    // sheet.insertRule(styles, 0);

  }

  preload() {
    this.load.image('background', 'images/ui/between-levels.png');
    this.load.spritesheet('upgrade-buttons', 'images/ui/upgrade-buttons.png', { frameWidth: 64, frameHeight: 60 });

    this.load.spritesheet('coin', 'images/ui/coin.png', {frameWidth: 16, frameHeight: 16});

    this.keyC = this.input.keyboard.addKey('M'); // For debug operations
  }

  create() {
    // Get Turret data from JSON file
    const request = new XMLHttpRequest();
    request.open('GET', 'json/turrets.json', false);
    request.send(null);
    this.turretData = JSON.parse(request.responseText);

    this.background = this.add.sprite(0, 0, 'background').setOrigin(0,0);

    this.anims.create({
      key: 'coin-anim',
      frameRate: 15,
      frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
      repeat: -1
    });

    this.anims.create({ // Played as a coin disappears
      key: 'coin-anim-final',
      frameRate: 40,
      frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 5 }),
      repeat: 3
    });

    // Upgrade buttons
    if (!Player.unlocked['virus-blaster'] && Player.viruscoins > this.turretData[1].unlockCost) {
      this.virusBlasterButton = new Button(
        this, 48, 168, 'upgrade-buttons', 0, true,
        null, { upgrade: 'virus-blaster' }
      );
    }

    if (!Player.unlocked['rectifier'] && Player.viruscoins > this.turretData[2].unlockCost) {
      this.rectifierButton = new Button(
        this, 128, 168, 'upgrade-buttons', 3, true,
        null, { upgrade: 'rectifier' }
      );
    }

    if (!Player.unlocked['psu'] && Player.viruscoins > this.turretData[3].unlockCost) {
      this.psuButton = new Button(
        this, 208, 168, 'upgrade-buttons', 6, true,
        null, { upgrade: 'psu' }
      );
    }

    if (!Player.unlocked['hardened-core']) {
      this.hardenedCoreButton = new Button(
        this, 288, 168, 'upgrade-buttons', 9, true,
        null, { upgrade: 'hardened-core' }
      );
    }

    
    // Text
    this.add.sprite(290, 136, 'coin').setOrigin(0, 0).play('coin-anim');
    this.coins = this.add.text(310, 140, `${Player.viruscoins}`, FONT_CONFIG_SMALL);
    this.priceLabels = [];
    if (!Player.unlocked['virus-blaster'])
      this.priceLabels.push(new PriceLabel(this, 60, 215, 'virus-blaster'));
    if (!Player.unlocked['rectifier'])
      this.priceLabels.push(new PriceLabel(this, 140, 215, 'rectifier'));
    if (!Player.unlocked['psu'])
      this.priceLabels.push(new PriceLabel(this, 220, 215, 'psu'));
    if (!Player.unlocked['hardened-core'])
      this.priceLabels.push(new PriceLabel(this, 300, 215, 'hardened-core'));

  }

  update() {
    this.coins.setText(`${Player.viruscoins}`, FONT_CONFIG_SMALL);
    if (this.keyC.isDown) { // Debug - restarts the scene
      console.log('Restart level!');
      this.scene.start(CONST.SCENES.LEVEL);
      this.scene.stop(CONST.SCENES.SHOP);
    }

    // If a thing has been unlocked, remove the label for it.
    this.priceLabels.forEach((label) => {
      if (label.active && Player.unlocked[label.name]) {
        label.getRid();
      }
    });
  }
}