const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const { DEFAULT_STATE, HUNGER_SPEED_FACTORS } = require('../shared/constants');

class StorageManager {
  constructor() {
    this.userDataPath = (app && typeof app.getPath === 'function')
      ? app.getPath('userData')
      : path.join(__dirname, '../../userData');
    this.saveFilePath = path.join(this.userDataPath, 'taskbar-bunny-save.json');
    this.state = null;
    this.offlineSummary = null;
  }

  loadState() {
    try {
      if (fs.existsSync(this.saveFilePath)) {
        const raw = fs.readFileSync(this.saveFilePath, 'utf8');
        const parsed = JSON.parse(raw);
        this.state = this.deepMerge(JSON.parse(JSON.stringify(DEFAULT_STATE)), parsed);
        this.calculateOfflineProgress();
      } else {
        this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        this.saveState();
      }
    } catch (err) {
      console.error('[Storage] Error loading save data, falling back to default:', err);
      this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
    return { state: this.state, offlineSummary: this.offlineSummary };
  }

  calculateOfflineProgress() {
    if (!this.state || !this.state.meta || !this.state.meta.lastSaved) return;

    const now = Date.now();
    const lastSaved = this.state.meta.lastSaved;
    const elapsedMs = Math.max(0, now - lastSaved);
    const elapsedMinutes = Math.floor(elapsedMs / (60 * 1000));

    if (elapsedMinutes < 2) {
      this.offlineSummary = null;
      return;
    }

    const speedFactor = HUNGER_SPEED_FACTORS[this.state.settings.hungerSpeed] || 1.0;
    const drainPerHour = 30 * speedFactor;
    const theoreticalDrain = (elapsedMinutes / 60) * drainPerHour;
    // Keep at least 5 hunger points so returning players aren't punished
    const cappedDrain = Math.min(75, Math.floor(theoreticalDrain));
    const previousHunger = this.state.bunny.hunger;
    this.state.bunny.hunger = Math.max(5, this.state.bunny.hunger - cappedDrain);
    const actualDrain = previousHunger - this.state.bunny.hunger;

    if (this.state.bunny.hunger < 25) {
      this.state.bunny.happiness = Math.max(20, this.state.bunny.happiness - 15);
    }

    let carrotsGrown = 0;
    if (this.state.garden && Array.isArray(this.state.garden.plots)) {
      for (const plot of this.state.garden.plots) {
        if (plot.planted && !plot.ready) {
          const plotAge = now - plot.plantedAt;
          if (plotAge >= (plot.growDurationMs || 120000)) {
            plot.ready = true;
            carrotsGrown++;
          }
        }
      }
    }

    const todayDate = new Date().toISOString().slice(0, 10);
    let streakBonus = 0;
    if (this.state.meta.lastLoginDate !== todayDate) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (this.state.meta.lastLoginDate === yesterday) {
        this.state.meta.loginStreak = (this.state.meta.loginStreak || 1) + 1;
      } else {
        this.state.meta.loginStreak = 1;
      }
      this.state.meta.lastLoginDate = todayDate;
      streakBonus = this.state.meta.loginStreak * 10;
      this.state.inventory.coins += streakBonus;
      this.state.inventory.foods.carrot = (this.state.inventory.foods.carrot || 0) + 3;
    }

    this.offlineSummary = {
      elapsedMinutes,
      actualDrain,
      carrotsGrown,
      loginStreak: this.state.meta.loginStreak,
      streakBonus
    };
  }

  saveState(stateToSave) {
    if (stateToSave) {
      this.state = stateToSave;
    }
    if (!this.state) return;

    this.state.meta.lastSaved = Date.now();

    try {
      const tempPath = this.saveFilePath + '.tmp';
      const content = JSON.stringify(this.state, null, 2);
      fs.writeFileSync(tempPath, content, 'utf8');
      fs.renameSync(tempPath, this.saveFilePath);
    } catch (err) {
      console.error('[Storage] Error saving state:', err);
    }
  }

  resetState() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.saveState();
    return this.state;
  }

  deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    const forbidden = ['__proto__', 'constructor', 'prototype'];

    for (const key of Object.keys(source)) {
      if (forbidden.includes(key)) continue;

      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key]) &&
        target &&
        typeof target[key] === 'object' &&
        !Array.isArray(target[key])
      ) {
        this.deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }
}

module.exports = new StorageManager();
