import Phaser from 'phaser';
import { CONST } from '../constants';
import { Virus } from '../components/virus';
import { walk, onCompleteHandler } from '../components/walk';

export class FirstEnemy extends Phaser.Scene {
  constructor() {
    super({
      key: CONST.SCENES.ENEMY
    });

    this.walk = walk.bind(this);
    this.onCompleteHandler = onCompleteHandler.bind(this);
  }

  preload() {

  }

  create() {

    this.explosion = this.sound.add('explosion', { loop: false, volume: 0.25 });

    // Add walking animation for sprite
    let enemyAnims = { 
      key: 'walking', 
      frames: this.anims.generateFrameNumbers('enemy1', { start: 0, end: 3, first: 3 }),
      frameRate: 8,
      repeat: -1
    };
    this.anims.create(enemyAnims);
    this.viruses = [];
    // create viruses and have them do their path
    for(let i = 0; i < 4; i++) {
      this.viruses.push(new Virus({scene: this, x: this.game.config.width - 10, y: this.game.config.height + 50}));

      this.viruses[i].play('walking');

      // delay each virus walk start
      this.timer = this.time.delayedCall(i * 5000, this.walk, [this.viruses[i]], this);
    }
  }

  // from here on out adapted from udemy course examples:
  // https://www.udemy.com/course/making-html5-games-with-phaser-3/
  // Main change is the use of a timeline instead of a single event
  update() {
  }
}