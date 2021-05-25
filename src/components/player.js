import { CURRENT_ACTION, LIMITS } from '../constants';

class Player {
  constructor() {
    this.reset();
  }

  // Called if you want to start a new game and make everything as it should be
  // for the player
  reset() {
    this.score = 0;
    this.energy = 1000;
    this.action = CURRENT_ACTION.NONE;
    this.level = 1;
    this.chosenTurret = 'firewall';
    this.unlocked = {
      'firewall': true,
      'charger': true,
      'virus-blaster': false,
      'rectifier': false,
      'psu': false,
      'hardened-core': false
    };
    this.unlockCosts = {
      'firewall': 0,
      'charger': 0,
      'virus-blaster': 0,
      'rectifier': 0,
      'psu': 0,
      'hardened-core': 0
    };
    this.viruscoins = 0;
    this.levelStartCoin = 0;
    this.coreHP = 0;
    this.showAltText = false;
    this.altText = '';
  }

  restartLevel() {
    this.viruscoins = this.levelStartCoin;
    if (this.level === 1) {
      this.energy = 1000;
    } else {
      this.energy = this.level * 1000 - 500;
    }
  }

  setAction(newAction) {
    this.action = newAction;
  }

  setVal(newVal) {
    if (newVal) {
      // Change turret type
      if (newVal.turretChoice) {
        this.chosenTurret = newVal.turretChoice;
      }

      // TODO - other actions
      if (newVal.upgrade) {
        this.unlocked[newVal.upgrade] = true;
        this.viruscoins -= this.unlockCosts[newVal.upgrade];
      }
    }
  }

  levelUp() {
    this.level++;
    this.energy = this.level * 1000 - 500;
    if (this.level > LIMITS.LEVELS) {
      this.level = 1;
    }
  }
}

// This next line makes it so the entire game just uses one Player instance
export default (new Player);