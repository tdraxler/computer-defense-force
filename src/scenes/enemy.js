import Phaser from 'phaser';
import { CONST } from '../constants';
import { Virus } from '../components/virus';
import { walk, onCompleteHandler } from '../components/walk';

let bgm;
let num = -2;

export class FirstEnemy extends Phaser.Scene {
  constructor() {
    super({
      key: CONST.SCENES.ENEMY
    });

    this.walk = walk.bind(this);
    this.onCompleteHandler = onCompleteHandler.bind(this);
  }

  preload() {
    // Testing setting background sound, 
    // Source:  https://www.fesliyanstudios.com/royalty-free-music/download/a-bit-of-hope/565
    this.load.audio('bgm', ['2020-03-22_-_A_Bit_Of_Hope_-_David_Fesliyan.mp3']);
    this.load.audio('explosion', ['sound/sfx/Explosion.mp3']);
    this.load.spritesheet('enemy1', 'images/virus_v1.png', { frameWidth: 50, frameHeight: 50, endFrame: 4 });
  }

  create() {
    bgm = this.sound.add('bgm', { loop: true, volume: 0.25 });
    bgm.play();
    this.explosion = this.sound.add('explosion', { loop: false, volume: 0.25 });

    // Add walking animation for sprite
    let enemyAnims = { 
      key: 'walking', 
      frames: this.anims.generateFrameNames('enemy1', { start: 0, end: 3, first: 3 }),
      frameRate: 8,
      repeat: -1
    };
    this.anims.create(enemyAnims);
    this.viruses = [];
    // create viruses and have them do their path
    for(let i = 0; i < 4; i++) {
      this.viruses.push(new Virus({scene: this, x: this.game.config.width - 10, y: this.game.config.height + 50}))
      this.viruses[i].setScale(0.5, 0.5);
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