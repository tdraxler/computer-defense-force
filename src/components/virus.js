import Phaser from 'phaser'

let wid;
let hei;

export class Virus extends Phaser.GameObjects.Container {
  // TODO - Make this useful

  constructor(config) {
    super(config.scene, config.width, config.height);

    this.scene = config.scene;
    this.scene.add.existing(this);
    this.obj = this.scene.add.image(config.width - 10, config.height / 2, 'enemy1');
    this.add(this.obj);
    this.hp = 10;
  }

  addVirus(x, y) {
    this.obj = this.scene.add.image(x - 10, y / 2, 'enemy1');
    this.add(this.obj);
  }

  walk(width, height) {
    this.timeline = this.scene.tweens.createTimeline();
    wid = width;
    hei = height;

    let positions = [
      {x: width - 10, y: 25,}, 
      {x: 10, y: 25}, 
      {x: 10, y: height - 10}, 
      {x: width - 50, y: height - 15}, 
      {x: width - 50, y: height - 200}, 
      {x: width - 120, y: height - 200}, 
      {x: width - 120, y: height - 100}, 
      {x: width / 2, y: height - 100}, 
      {x: width / 2, y: height / 2}
    ];

    for (let i = 0; i < positions.length; i++) {
      if (i === 8) {
        this.timeline.add({
          targets: this.obj,
          duration: 2000,
          x: positions[i].x,
          y: positions[i].y,
          onComplete: this.onCompleteHandler.bind(this)
        });
      } else {
        this.timeline.add({
          targets: this.obj,
          duration: 2000,
          x: positions[i].x,
          y: positions[i].y
        });
      }
    }

    this.timeline.play();
  }

  // center reached
  onCompleteHandler(tween, targets, custom) {
    this.scene.events.emit('onCompleteHandler', 1); // <- event emitter
    let virus = targets[0];
    virus.x = wid - 10;
    virus.y = hei - 25;
    this.walk();
  }
}