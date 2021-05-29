import Phaser from 'phaser'

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

    this.frameCounter = 0;
    this.showDamage = 0;
  }

  showAttacked() {
    this.showDamage = 30;
    this.frameCounter = 0;
  }

  update() {
    // increment and reset to zero if it gets too big
    this.frameCounter = (this.frameCounter + 1) & 0xff;

    if (this.showDamage > 0) {
      this.showDamage--;
      if (Math.floor(this.frameCounter / 4) % 2 == 0) {
        this.setTint(0xffbbbb);
      }
      else {
        this.clearTint();
      }

      if (this.showDamage <= 0) {
        this.clearTint();
      }
    }
  }
}
