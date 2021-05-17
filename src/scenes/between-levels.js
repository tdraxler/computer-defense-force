// This scene is viewed between levels and gives the player the opportunity
// to purchase upgrades.
// Might get merged with victory.js - need to figure that out.

import Phaser from 'phaser';
import Player from '../components/player';
import { Button } from '../components/button';
import { Coin } from '../components/coin';
import { CONST } from '../constants';

class PriceLabel {
  constructor(scene, x, y, value=200) {
    this.coin = new Coin({scene: scene, x: x, y: y, staticKey: 'coin', animKey: 'coin-anim-final'});
    this.label = scene.add.text(
      x + 12, y + 4,
      `${value}`,
      { 
        fontFamily: ['press_start', 'sans-serif'],
        fontSize: 8, 
        color: '#ffffff'
      }
    );
  }
}

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
    this.load.spritesheet('upgrade-buttons', 'images/ui/upgrade-buttons.png', { frameWidth: 64, frameHeight: 60 });

    this.load.spritesheet('coin', 'images/ui/coin.png', {frameWidth: 16, frameHeight: 16});

    this.keyC = this.input.keyboard.addKey('M'); // For debug operations
  }

  create() {
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
    if (!Player.unlocked['virus-blaster']) {
      this.virusBlasterButton = new Button(
        this, 48, 168, 'upgrade-buttons', 0, true,
        null, { upgrade: 'virus-blaster' }
      );
    }

    if (!Player.unlocked['rectifier']) {
      this.rectifierButton = new Button(
        this, 128, 168, 'upgrade-buttons', 3, true,
        null, { upgrade: 'rectifier' }
      );
    }

    if (!Player.unlocked['psu']) {
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

    this.coins = {
      'virus-blaster': new PriceLabel(this, 60, 215),
      'rectifier': new PriceLabel(this, 140, 215),
      'psu': new PriceLabel(this, 220, 215),
      'hardened-core': new PriceLabel(this, 300, 215)
    };


    // Text
    this.add.text(310, 140, `${Player.viruscoins}`, { fontFamily: ['press_start', 'sans-serif'], fontSize: 8, color: '#ffffff', fontSmooth: 'never'});
    this.add.sprite(290, 136, 'coin').setOrigin(0, 0).play('coin-anim');

    // this.testCoin = new Coin({scene: this, x: 100, y: 200, staticKey: 'coin', animKey: 'coin-anim-final'});
    // this.testCoin.launchUp();
  }

  update() {
    if (this.keyC.isDown) { // Debug - restarts the scene
      console.log('Restart level!');
      this.scene.start(CONST.SCENES.LEVEL);
      this.scene.stop(CONST.SCENES.SHOP);
    }
  }
}