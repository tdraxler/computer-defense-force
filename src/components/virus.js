import Phaser from 'phaser';
import { CONST } from '../constants';

// Handles enemies that try to attack the core.
export class Virus extends Phaser.Physics.Arcade.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y);

    config.scene.add.existing(this);
    this.setInteractive();
    this.x = config.x;
    this.y = config.y;
    this.hp = config.hp;
    this.damage = config.damage;
    this.points = config.points;
    this.travelRate = config.travelRate;
    this.scene.physics.add.existing(this);
    this.setBodySize(config.hitX, config.hitY, true);
    this.body.setOffset(config.width / 2 - config.hitX / 2, config.height * 3 / 4 - config.hitY / 2);
    this.setDepth(250); // Just to make sure it's above any turrets.

    this.showDamage = 0;
  }

  showAttacked() {
    this.showDamage = 5;
    this.setTint(0xffbbbb);
  }

  update() {
    if (this.showDamage > 0) {
      this.showDamage--;
      if (this.showDamage <= 0) {
        this.clearTint();
      }
    }

    // Set depth (z-index) based on current y position
    this.setDepth(2 * Math.floor(this.y / CONST.T_SIZE));
  }
}
