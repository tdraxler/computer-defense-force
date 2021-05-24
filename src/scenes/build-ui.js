import Phaser from 'phaser';
import { CONST, CURRENT_ACTION, FONT_CONFIG_SMALL } from '../constants';
import Player from '../components/player';
import { Button } from '../components/button';
import updateHpScore from '../components/hpscoreevent';

export class BuildMenu extends Phaser.Scene {
  constructor() {
    super({
      key: CONST.SCENES.BUILD_MENU
    });
  }

  init(data) {
    if (data.turretData) {
      this.turretData = data.turretData;
    }
  }

  preload() {
    this.load.image('build-bar-upper', 'images/ui/build-bar1.png');
    this.load.image('build-bar-left', 'images/ui/build-bar2.png');
    this.load.spritesheet('buttons', 'images/ui/buttons.png', { frameWidth: 42, frameHeight: 18 });
    this.load.spritesheet('turret-buttons', 'images/ui/turret-icons.png', { frameWidth: 18, frameHeight: 18 });

    this.input.setTopOnly(true); // Makes it so clicking on this UI not register a click below
  }

  create() {
    this.buildBarUpper = this.add.sprite(100, 0, 'build-bar-upper').setOrigin(0,0);
    this.buildBarLeft = this.add.sprite(0, 100, 'build-bar-left').setOrigin(0,0);

    // Buttons for top panel
    this.buildButton = new Button(
      this, 131, 2, 'buttons', 0, true,
      CURRENT_ACTION.BUILD, null,
      'url(images/ui/cursors/build.png), pointer'
    );

    this.demolishButton = new Button(
      this, 179, 2, 'buttons', 3, true,
      CURRENT_ACTION.DEMOLISH, null,
      'url(images/ui/cursors/delete.png), pointer'
    );

    // Buttons for side panel
    if (Player.unlocked['firewall']) {
      this.fireWallButton = new Button(
        this, 1, 123, 'turret-buttons', 0, true,
        null, { turretChoice: 'firewall', altText: this.turretData[0].printedname}
      );
    }

    if (Player.unlocked['charger']) {
      this.fireWallButton = new Button(
        this, 1, 144, 'turret-buttons', 12, true,
        null, { turretChoice: 'charger', altText: this.turretData[0].printedname}
      );
    }

    if (Player.unlocked['virus-blaster']) {
      this.virusBlasterButton = new Button(
        this, 1, 165, 'turret-buttons', 3, true,
        null, { turretChoice: 'virus-blaster', altText: this.turretData[0].printedname}
      );
    }

    if (Player.unlocked['rectifier']) {
      this.rectifierButton = new Button(
        this, 1, 186, 'turret-buttons', 6, true,
        null, { turretChoice: 'rectifier', altText: this.turretData[0].printedname}
      );
    }

    if (Player.unlocked['psu']) {
      this.psuButton = new Button(
        this, 1, 207, 'turret-buttons', 9, true,
        null, { turretChoice: 'psu', altText: this.turretData[0].printedname}
      );
    }

    this.buildBarUpper.setInteractive();
    this.buildBarLeft.setInteractive();


    this.hpCount = this.add.text(305, 5, 'HP: ' + 0, FONT_CONFIG_SMALL);
    this.score = this.add.text(285, 15, 'Score: ' + Player.score, FONT_CONFIG_SMALL);
    this.wave = this.add.text(25, 5, 'Wave: ' + 1, FONT_CONFIG_SMALL);
    this.money = this.add.text(25, 15, 'Coins: ' + Player.viruscoins, FONT_CONFIG_SMALL);
    this.energy = this.add.text(25, 25, 'Energy: ' + Player.energy, FONT_CONFIG_SMALL)
    
    updateHpScore.on('update-hp-score', this.updateHpScore, this);

    // Mouseover info
    this.mouseOverInfo = this.add.text(305, 5, Player.altText, FONT_CONFIG_SMALL);
    this.mouseOverInfo.setVisible(false);
  }

  update() {
    if (Player.showAltText) {
      if (!this.mouseOverInfo.visible) {
        this.mouseOverInfo.setText(Player.altText);
        this.mouseOverInfo.setVisible(true);
      }
      // Get cursor position and update mouseover info location to that
      this.input.activePointer.updateWorldPoint(this.cameras.main);
      this.mouseOverInfo.setX(this.input.activePointer.worldX + 8);
      this.mouseOverInfo.setY(this.input.activePointer.worldY + 4);
    }
    else if (!Player.showAltText && this.mouseOverInfo.visible) {
      this.mouseOverInfo.setVisible(false);
    }
  }

  updateHpScore(hp, wave) {
    this.hpCount.setText('HP: ' + hp);
    this.score.setText('Score: ' + Player.score);
    this.wave.setText('Wave: ' + wave);
    this.money.setText('Coins: ' + Player.viruscoins);
    this.energy.setText('Energy: ' + Player.energy);
  }

}
