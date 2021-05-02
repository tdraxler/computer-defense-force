import { CURRENT_ACTION, LIMITS } from '../constants';

class Player {
  constructor() {
    this.score = 0
    this.action = CURRENT_ACTION.NONE;
    this.level = 1;
  }

  reset() {
    this.score = 0;
    this.action = CURRENT_ACTION.BUILD;
    this.level = 1;
  }

  setAction(newAction) {
    this.action = newAction;
  }

  levelUp() {
    this.level++;
    if (this.level > LIMITS.LEVELS) {
      this.level = 1;
    }
  }
}

// This next line makes it so the entire game just uses one Player instance
export default (new Player);