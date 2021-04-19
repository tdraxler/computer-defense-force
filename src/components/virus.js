import Phaser from 'phaser'

const VIRUS_KEY = 'virus'
export class Virus {
  // TODO - Make this useful

  construction() {
    //super();

    this.load.spritesheet('enemy1', 'images/virus_v1.png', { frameWidth: 200, frameHeight: 50});
  }

  createVirus(){
    //this.virus = this.physics.add.sprite(,,VIRUS_KEY)
    this.add.sprite(0, 0, 'enemy1');
  }

  update() {

  }

  testFunc() {
    console.log('test');
  }
}