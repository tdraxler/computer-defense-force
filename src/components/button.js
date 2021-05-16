import Phaser from 'phaser';
import Player from '../components/player';

export class Button extends Phaser.GameObjects.Sprite {

  // Frame should be the index of the button when it's NOT clicked
  constructor(
    scene,
    x, y,
    texture,
    frame,
    clickable, 
    newAction = null,
    buttonConfig = null,
    newCursorIconPath = null
  ) {
    super(scene, x, y, texture, frame);
    this.defaultFrame = frame;
    this.newCursorIconPath = newCursorIconPath;
    this.newAction = newAction;
    this.buttonConfig = buttonConfig;

    this.scene.add.existing(this);
    this.setOrigin(0,0);
    this.setFrame(this.defaultFrame);

    if (clickable) {
      this.setInteractive();
    }

    this.on('pointerdown', () => {
      this.setFrame(this.defaultFrame + 1);
    });

    this.on('pointerup', () => {
      this.setFrame(this.defaultFrame);

      if (this.newCursorIconPath) {
        this.scene.input.setDefaultCursor(this.newCursorIconPath);
      }
      if (this.newAction) {
        Player.setAction(this.newAction);
      }
      if (this.buttonConfig) {
        Player.setVal(buttonConfig);
        if (this.buttonConfig.upgrade) {
          this.destroy(); // Upgrade buttons should be disabled when clicked
        }
      }
    });

    this.on('pointerover', () => {
      this.setFrame(this.defaultFrame + 2);
    });

    this.on('pointerout', () => {
      this.setFrame(this.defaultFrame);
    });
  }

  update() {
    console.log('It\'s working!!');
  }
}