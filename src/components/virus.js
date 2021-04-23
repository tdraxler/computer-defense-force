import Phaser from 'phaser'


export class Virus extends Phaser.GameObjects.Container {
  // TODO - Make this useful

  constructor(config) {
    super(config.scene, config.width, config.height);

    this.scene = config.scene;
    this.scene.add.existing(this);
    this.obj = this.scene.add.image(config.width - 380, config.height - 170, 'enemy1');
    this.add(this.obj);
    this.hp = 10;
  }

  walk() {
    this.timeline = this.scene.tweens.createTimeline();

    let positions = [
      {x: this.width - 10, y: 25,}, 
      {x: 10, y: 25}, 
      {x: 10, y: this.height - 10}, 
      {x: this.width - 50, y: this.height - 15}, 
      {x: this.width - 50, y: this.height - 200}, 
      {x: this.width - 120, y: this.height - 200}, 
      {x: this.width - 120, y: this.height - 100}, 
      {x: this.width / 2, y: this.height - 100}, 
      {x: this.width / 2, y: this.height / 2}
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
    virus.x = this.width - 10;
    virus.y = this.height - 25;
    this.walk();
  }
}