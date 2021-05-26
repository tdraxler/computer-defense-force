// This scene is viewed between levels and gives the player the opportunity
// to purchase upgrades.
// Might get merged with victory.js - need to figure that out.

import Phaser from 'phaser';
import Player from '../components/player';
import { Button } from '../components/button';
import { Coin } from '../components/coin';
import { CONST, FONT_CONFIG_SMALL, FONT_CONFIG_MOUSEOVER } from '../constants';
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

  init(data) {
    if (data.descData) {
      this.descData = data.descData;

      // Generate turret descriptions for mouseover text
      this.descData.forEach(tData => {
        let desc = '';
        desc += `${tData.printedname}\n`; // Add the name of the structure
        if (tData.damage && tData.damage > 0) // Add amount of damage, if any
          desc += `Attack: ${String(tData.damage)} (${String(tData.dps.toFixed(1))}/s)\n`;
        
        if (tData.ep && tData.ep != 0) // Add amount of energy generated
          desc += `Charge: ${String(tData.ep)} (${String((tData.ep * CONST.RECHARGE_DELAY / 60).toFixed(1))}/s)\n`; 
        
        desc += `Build Cost: ${String(tData.buildCost)}\n`;
        tData.descr = desc;
      });
    }
  }

  preload() {
    // Music: "8 Bit Menu", from FesliyanStudios.com
    // Background music via https://www.FesliyanStudios.com
    // Source:  https://www.fesliyanstudios.com/royalty-free-music/download/8-bit-menu/287
    this.load.audio('otherBgm', ['sound/bgm/2019-01-02_-_8_Bit_Menu_-_David_Renda_-_FesliyanStudios.com.mp3']);
    this.load.image('background', 'images/ui/between-levels.png');
    this.load.image('continueButton', 'images/start-victory-gameover/continue.png');
    this.load.spritesheet('upgrade-buttons', 'images/ui/upgrade-buttons.png', { frameWidth: 64, frameHeight: 60 });

    this.load.spritesheet('coin', 'images/ui/coin.png', {frameWidth: 16, frameHeight: 16});

    this.keyC = this.input.keyboard.addKey('M'); // For debug operations
  }

  create() {
    this.otherBgm = this.sound.add('otherBgm', { loop: true, volume: 0.25 });
    this.otherBgm.play();
    this.virusBlasterButton;
    this.rectifierButton;
    this.psuButton;
    this.hardenedCoreButton;
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
        null, { upgrade: 'virus-blaster', altText: this.descData.find(x => x.name === 'virus-blaster').descr }
      );
    }

    if (!Player.unlocked['rectifier']) {
      this.rectifierButton = new Button(
        this, 128, 168, 'upgrade-buttons', 3, true,
        null, { upgrade: 'rectifier', altText: this.descData.find(x => x.name === 'rectifier').descr }
      );
    }

    if (!Player.unlocked['psu']) {
      this.psuButton = new Button(
        this, 208, 168, 'upgrade-buttons', 6, true,
        null, { upgrade: 'psu', altText: this.descData.find(x => x.name === 'psu').descr }
      );
    }

    if (!Player.unlocked['hardened-core']) {
      this.hardenedCoreButton = new Button(
        this, 288, 168, 'upgrade-buttons', 9, true,
        null, 
        { 
          upgrade: 'hardened-core',
          altText: 'Hardened Core\nCore HP: 750\n' 
        }
      );
    }

    
    // Text
    this.add.sprite(290, 136, 'coin').setOrigin(0, 0).play('coin-anim');
    this.coins = this.add.text(310, 140, `${Player.viruscoins}`, FONT_CONFIG_SMALL);
    this.priceLabels = [];
    if (!Player.unlocked['virus-blaster'])
      this.priceLabels.push(new PriceLabel(this, 60, 215, 'virus-blaster', Player.unlockCosts['virus-blaster']));
    if (!Player.unlocked['rectifier'])
      this.priceLabels.push(new PriceLabel(this, 140, 215, 'rectifier', Player.unlockCosts['rectifier']));
    if (!Player.unlocked['psu'])
      this.priceLabels.push(new PriceLabel(this, 220, 215, 'psu', Player.unlockCosts['psu']));
    if (!Player.unlocked['hardened-core'])
      this.priceLabels.push(new PriceLabel(this, 300, 215, 'hardened-core', Player.unlockCosts['hardened-core']));

    // Continue
    let continueButton = this.add.image(300, 80, 'continueButton').setOrigin(0).setDepth(1);
    continueButton.setInteractive();
    continueButton.on('pointerover', () => {
      continueButton.alpha = 0.7;
    });
    continueButton.on('pointerout', () => {
      continueButton.alpha = 1;
    });
    continueButton.on('pointerup', () => {
      continueButton.alpha = 1;
      this.otherBgm.stop();
      this.scene.start(CONST.SCENES.LEVEL);
      this.scene.stop(CONST.SCENES.SHOP);
    });

    // Mouseover info
    this.mouseOverInfoBG = this.add.image(305, 5, 'mouseover-bg').setOrigin(0, 0);
    this.mouseOverInfoBG.setVisible(false);
    this.mouseOverInfo = this.add.text(305, 5, Player.altText, FONT_CONFIG_MOUSEOVER);
    this.mouseOverInfo.setVisible(false);
    Player.showAltText = false;
  }

  update() {
    if (Player.showAltText) {
      if (!this.mouseOverInfo.visible) {
        this.mouseOverInfo.setText(Player.altText);
        this.mouseOverInfo.setVisible(true);
        this.mouseOverInfoBG.setVisible(true);
      }
      if (this.mouseOverInfo.text !== Player.altText) {
        this.mouseOverInfo.setText(Player.altText); // Prevents wrong text bug
      }
      // Get cursor position and update mouseover info location to that
      this.input.activePointer.updateWorldPoint(this.cameras.main);
      this.mouseOverInfo.setX(this.input.activePointer.worldX + 8);
      this.mouseOverInfo.setY(this.input.activePointer.worldY - 8);
      this.mouseOverInfoBG.setX(this.input.activePointer.worldX + 5);
      this.mouseOverInfoBG.setY(this.input.activePointer.worldY - 7);
    }
    else if (!Player.showAltText && this.mouseOverInfo.visible) {
      this.mouseOverInfo.setVisible(false);
      this.mouseOverInfoBG.setVisible(false);
    }

    this.coins.setText(`${Player.viruscoins}`, FONT_CONFIG_SMALL);
    if (this.keyC.isDown) { // Debug - restarts the scene
      console.log('Restart level!');
      this.otherBgm.stop();
      this.scene.start(CONST.SCENES.LEVEL);
      this.scene.stop(CONST.SCENES.SHOP);
    }

    // If a thing has been unlocked, remove the label for it.
    this.priceLabels.forEach((label) => {
      if (label.active && Player.unlocked[label.name]) {
        label.getRid();
      }
    });

    // Upgrade buttons
    if (!Player.unlocked['virus-blaster'] && Player.viruscoins < Player.unlockCosts['virus-blaster']) {
      this.virusBlasterButton.destroy();
    }

    if (!Player.unlocked['rectifier'] && Player.viruscoins < Player.unlockCosts['rectifier']) {
      this.rectifierButton.destroy();
    }

    if (!Player.unlocked['psu'] && Player.viruscoins < Player.unlockCosts['psu']) {
      this.psuButton.destroy();
    }

    if (!Player.unlocked['hardened-core'] && Player.viruscoins < Player.unlockCosts['hardened-core']) {
      this.hardenedCoreButton.destroy();
    }

  }
}