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
        null, { turretChoice: 'firewall'}
      );
    }

    if (Player.unlocked['charger']) {
      this.fireWallButton = new Button(
        this, 1, 144, 'turret-buttons', 12, true,
        null, { turretChoice: 'charger'}
      );
    }

    if (Player.unlocked['virus-blaster']) {
      this.virusBlasterButton = new Button(
        this, 1, 165, 'turret-buttons', 3, true,
        null, { turretChoice: 'virus-blaster'}
      );
    }

    if (Player.unlocked['rectifier']) {
      this.rectifierButton = new Button(
        this, 1, 186, 'turret-buttons', 6, true,
        null, { turretChoice: 'rectifier'}
      );
    }

    if (Player.unlocked['psu']) {
      this.psuButton = new Button(
        this, 1, 207, 'turret-buttons', 9, true,
        null, { turretChoice: 'psu'}
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
  }

  update() {
  }

  updateHpScore(hp, wave) {
    this.hpCount.setText('HP: ' + hp);
    this.score.setText('Score: ' + Player.score);
    this.wave.setText('Wave: ' + wave);
    this.money.setText('Coins: ' + Player.viruscoins);
    this.energy.setText('Energy: ' + Player.energy);
  }

}
