import Phaser from 'phaser';
import { Explosion } from './explosion';

export class Core extends Phaser.GameObjects.Sprite {

  getBody() {
    return this.body;
  }

  constructor(scene, x, y, coreConfig) {
    // For some reason, Phaser hates the name 'hardened-core',
    // So for now, we load the texture 'core'
    super(scene, x, y, 'core', 0);

    console.log(coreConfig);
    // Add object to the scene
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);
    this.getBody().setAllowGravity(false);

    this.hp = coreConfig.hp;

    this.frameCounter = 0;
    this.showDamage = 0;
    this.dangerGlow = 0;
    this.dangerGlowDir = 1;
  }

  showAttacked() {
    this.showDamage = 30;
    this.frameCounter = 0;
    if (this.hp < 150) {
      this.damageFrame = this.scene.add.sprite(this.x, this.y, 'core-frame');
      this.damageFrame.setDepth(this.depth + 1);
    }
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

    if (this.hp > 0 && this.hp < 150) {
      if (this.damageFrame) {
        let glowColor = this.dangerGlow << 16; // Get red value
        this.damageFrame.setTintFill(glowColor);
        this.dangerGlow += 4 * this.dangerGlowDir;
        if (this.dangerGlow > 250) this.dangerGlowDir = -1;
        else if (this.dangerGlow < 10) this.dangerGlowDir = 1;
      }

      // Random small explosions when heavily damaged
      if (this.frameCounter % 10 == 0) {
        let angle = Math.random() * 2 * Math.PI;
        let newExplosion = new Explosion(
          {scene: this.scene,
            x: this.x + Math.cos(angle) * Math.floor(Math.random() * 10),
            y: this.y + Math.sin(angle) * Math.floor(Math.random() * 10),
            animKey: 'explosion-frames-2',
            framesCount: 13});
        newExplosion.setVelocity(
          Math.cos(angle) * 128,
          Math.sin(angle) * 128
        );
        newExplosion.explode('explosion-anim-2');
      }
    }

    // Game's over
    // Show random explosions and hide the core sprite
    if (this.hp <= 0) {
      if (this.damageFrame) {
        this.damageFrame.setVisible(false);
        this.damageFrame.destroy();
        this.damageFrame = null;
      }

      if (Math.floor(this.frameCounter / 5) % 2 == 0) {
        this.setVisible(false);
      }
      else {
        this.setVisible(true);
      }

      if (this.frameCounter % 10 == 0) {
        let angle = Math.random() * 2 * Math.PI;
        let newExplosion = new Explosion(
          {scene: this.scene,
            x: this.x + Math.cos(angle) * Math.floor(Math.random() * 64),
            y: this.y + Math.sin(angle) * Math.floor(Math.random() * 64),
            animKey: 'explosion-frames',
            framesCount: 15});
        newExplosion.explode('explosion-anim');
      }
    }
  }
}