import Phaser from 'phaser'
import { FONT_CONFIG_ALERT } from '../constants';

export class TextPopup extends Phaser.GameObjects.Text {
  constructor(scene, x, y, message) {
    super(scene, x, y, message, FONT_CONFIG_ALERT);
    scene.add.existing(this);

    this.frameCount = 0;
  }

  update() {
    this.frameCount++;
    // Move text a bit
    if (this.frameCount < 60) {
      this.y -= (60 - this.frameCount) / 120;
    }
    else if (this.frameCount > 90) {
      if (Math.floor(this.frameCount / 3) % 2 == 0) {
        this.setVisible(false);
      }
      else {
        this.setVisible(true);
      }
    }
  }
}

export function setUpTextPopups(scene) {
  scene.popups = [];
}

export function handleTextPopups(scene) {
  scene.popups.forEach((p, ind, popups) => {
    p.update();
    if (p.frameCount >= 120) {
      p.destroy();
      popups.splice(ind, 1);
    }
  });
}

