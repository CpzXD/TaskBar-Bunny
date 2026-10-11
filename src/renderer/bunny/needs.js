// src/renderer/bunny/needs.js
// Hunger decay, happiness stats, leveling, XP, and passive income timers

const { HUNGER_SPEED_FACTORS, FOODS } = require('../../shared/constants');

class BunnyNeeds {
  constructor(bunnyData = {}, settings = {}) {
    this.hunger = bunnyData.hunger !== undefined ? bunnyData.hunger : 85;
    this.happiness = bunnyData.happiness !== undefined ? bunnyData.happiness : 90;
    this.level = bunnyData.level || 1;
    this.xp = bunnyData.xp || 0;
    this.hungerSpeed = settings.hungerSpeed || 'normal';
    this.lastDrainTime = Date.now();
    this.lastPassiveCarrotTime = Date.now();
    this.passiveCarrotIntervalMs = 5 * 60 * 1000; // 1 passive carrot every 5 minutes
  }

  update(onLevelUp, onPassiveCarrot) {
    const now = Date.now();
    const elapsedSec = (now - this.lastDrainTime) / 1000;

    // Normal speed: ~30 points drained per 30 minutes (0.0167 points/sec)
    const factor = HUNGER_SPEED_FACTORS[this.hungerSpeed] || 1.0;
    const drainPerSec = (30 / 1800) * factor;

    if (elapsedSec >= 1) {
      this.hunger = Math.max(0, this.hunger - (drainPerSec * elapsedSec));
      this.lastDrainTime = now;

      // Happiness slowly drifts down if hunger is critical (< 20)
      if (this.hunger < 20) {
        this.happiness = Math.max(10, this.happiness - (0.01 * elapsedSec));
      }
    }

    // Passive carrot generation while running
    if (now - this.lastPassiveCarrotTime >= this.passiveCarrotIntervalMs) {
      this.lastPassiveCarrotTime = now;
      if (onPassiveCarrot) onPassiveCarrot();
    }
  }

  feed(foodId) {
    const food = FOODS[foodId] || FOODS.carrot;
    const prevHunger = this.hunger;
    this.hunger = Math.min(100, this.hunger + food.hungerRestore);
    this.happiness = Math.min(100, this.happiness + food.happinessBonus);
    const xpGained = Math.round(food.hungerRestore * 0.8 + food.happinessBonus * 0.5);
    return {
      hungerRestored: this.hunger - prevHunger,
      happinessGained: food.happinessBonus,
      xpGained
    };
  }

  pet() {
    this.happiness = Math.min(100, this.happiness + 2);
    const xpGained = 2;
    return { happiness: this.happiness, xpGained };
  }

  addXp(amount, onLevelUp) {
    this.xp += amount;
    const requiredXp = this.level * 100;
    if (this.xp >= requiredXp) {
      this.xp -= requiredXp;
      this.level += 1;
      if (onLevelUp) onLevelUp(this.level);
    }
  }

  isHungry() {
    return this.hunger < 35;
  }

  isSulky() {
    return this.hunger < 15;
  }

  isHappy() {
    return this.happiness >= 75 && this.hunger >= 50;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BunnyNeeds };
}
