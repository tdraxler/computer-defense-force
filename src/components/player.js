import { CURRENT_ACTION } from '../constants';

class Player {
  constructor() {
    this.score = 0
    this.action = CURRENT_ACTION.BUILD;
  }

  reset() {
    this.score = 0;
    this.action = CURRENT_ACTION.BUILD;
  }

  testFunc() {
    console.log('test');
  }
}

// This next line makes it so the entire game just uses one Player instance
export default (new Player);