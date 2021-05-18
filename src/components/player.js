import { CURRENT_ACTION, LIMITS } from '../constants';

class Player {
  constructor() {
    this.score = 0;
    this.energy = 1000;
    this.action = CURRENT_ACTION.NONE;
    this.level = 1;
    this.chosenTurret = 'firewall';
    this.unlocked = {
      'firewall': true,
      'virus-blaster': false,
      'rectifier': false,
      'psu': false,
      'hardened-core': false
    };
    this.unlockCosts = {
      'firewall': 0,
      'virus-blaster': 0,
      'rectifier': 0,
      'psu': 0,
      'hardened-core': 0
    };
    this.viruscoins = 5000;
    this.coreHP = 0;
  }

  reset() {
    this.score = 0;
    this.energy = 1000;
    this.action = CURRENT_ACTION.NONE;
    this.level = 1;
    this.chosenTurret = 'firewall';
    this.unlocked = {
      'firewall': true,
      'virus-blaster': false,
      'rectifier': false,
      'psu': true,
      'hardened-core': false
    };
    this.unlockCosts = {
      'firewall': 0,
      'virus-blaster': 0,
      'rectifier': 0,
      'psu': 0,
      'hardened-core': 0
    };
    this.viruscoins = 5000;
    this.coreHP = 0;
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
        console.log(this.money);
      }
    }
  }

  unlock(ability) {
    this.unlocked[ability] = true;
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