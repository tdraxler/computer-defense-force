// from here on out adapted from udemy course examples:
// https://www.udemy.com/course/making-html5-games-with-phaser-3/
// Main change is the use of a timeline instead of a single event
export function walk(enemy) {
  this.timeline = this.tweens.createTimeline();

  let positions = [
    {x: this.game.config.width + 50, y: this.game.config.height + 200},  // start
    {x: this.game.config.width + 50, y: this.game.config.height + 130},  // up
    {x: this.game.config.width + 190, y: this.game.config.height + 130}, // right
    {x: this.game.config.width + 190, y: this.game.config.height - 170}, // up
    {x: this.game.config.width + 80, y: this.game.config.height - 170},  // left
    {x: this.game.config.width + 80, y: this.game.config.height + 30},   // down
    {x: this.game.config.width - 20, y: this.game.config.height + 30},   // left
    {x: this.game.config.width - 90, y: this.game.config.height - 90}    // diagonal left-up
  ];

  for (let i = 0; i < positions.length; i++) {
    if (i === 7) {
      this.timeline.add({
        targets: enemy,
        duration: 2000,
        x: positions[i].x,
        y: positions[i].y,
        onComplete: this.onCompleteHandler
      });
    } else {
      this.timeline.add({
        targets: enemy,
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
  targets[0].x = this.game.config.width - 90;
  targets[0].y = this.game.config.height - 90;
  this.events.emit('onCompleteHandler', 1); // <- event emitter
}