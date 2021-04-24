export function walk() {
  this.timeline = this.tweens.createTimeline();

  let positions = [
    {x: this.game.config.width - 10, y: 25,}, 
    {x: 10, y: 25}, 
    {x: 10, y: this.game.config.height - 10}, 
    {x: this.game.config.width - 50, y: this.game.config.height - 15}, 
    {x: this.game.config.width - 50, y: this.game.config.height - 200}, 
    {x: this.game.config.width - 120, y: this.game.config.height - 200}, 
    {x: this.game.config.width - 120, y: this.game.config.height - 100}, 
    {x: this.game.config.width / 2, y: this.game.config.height - 100}, 
    {x: this.game.config.width / 2, y: this.game.config.height / 2}
  ];

  for (let i = 0; i < positions.length; i++) {
    if (i === 8) {
      this.timeline.add({
        targets: this.virus,
        duration: 2000,
        x: positions[i].x,
        y: positions[i].y,
        onComplete: this.onCompleteHandler
      });
    } else {
      this.timeline.add({
        targets: this.virus,
        duration: 2000,
        x: positions[i].x,
        y: positions[i].y
      });
    }
  }

  this.timeline.play();
}

// center reached
export function onCompleteHandler (tween, targets, custom) {
  this.events.emit('onCompleteHandler', 1); // <- event emitter
  let virus = targets[0];
  virus.x = this.game.config.width - 10;
  virus.y = this.game.config.height - 25;
  this.walk();
}