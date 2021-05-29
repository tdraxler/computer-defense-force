import Phaser from 'phaser';

export class Core extends Phaser.GameObjects.Sprite {

  getBody() {
    return this.body;
  }

  constructor(scene, x, y, coreConfig) {
    super(scene, x, y, coreConfig.name);

    console.log(coreConfig);
    // Add object to the scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);
    this.getBody().setAllowGravity(false);

    this.hp = coreConfig.hp;

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
        this.setTintFill(0xffffff);
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