// from here on out adapted from udemy course examples:
// https://www.udemy.com/course/making-html5-games-with-phaser-3/
// Main change is the use of a timeline instead of a single event
export function walk(enemy) {
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
        targets: enemy,
        duration: 5000,
        x: positions[i].x,
        y: positions[i].y,
        onComplete: this.onCompleteHandler
      });
    } else {
      this.timeline.add({
        targets: enemy,
        duration: 5000,
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
  this.explosion.play();
  targets[0].destroy();
}