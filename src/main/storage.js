const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const { DEFAULT_STATE, HUNGER_SPEED_FACTORS } = require('../shared/constants');

class StorageManager {
  constructor() {
    this.userDataPath = this.resolveUserDataPath();
    this.saveFilePath = path.join(this.userDataPath, 'taskbar-bunny-save.json');
    this.backupFilePath = path.join(this.userDataPath, 'taskbar-bunny-save.json.bak');
    this.state = null;
    this.offlineSummary = null;
    this.isInitialized = false;
  }

  resolveUserDataPath() {
    if (app && typeof app.getPath === 'function') {
      try {
        const primary = app.getPath('userData');
        const primaryFile = path.join(primary, 'taskbar-bunny-save.json');
        if (fs.existsSync(primaryFile)) {
          return primary;
        }

        const appData = app.getPath('appData');
        const alt1 = path.join(appData, 'taskbar-bunny');
        const alt2 = path.join(appData, 'Taskbar Bunny');

        if (fs.existsSync(path.join(alt1, 'taskbar-bunny-save.json'))) {
          return alt1;
        }
        if (fs.existsSync(path.join(alt2, 'taskbar-bunny-save.json'))) {
          return alt2;
        }
        return primary;
      } catch (e) {
        // Fallback to standard
      }
    }
    return path.join(__dirname, '../../userData');
  }

  loadState(forceReload = false) {
    // If state is already loaded in memory and no explicit reload is requested,
    // return memory state directly to prevent concurrent read glitches and re-draining offline stats.
    if (this.state && !forceReload) {
      return { state: this.state, offlineSummary: this.offlineSummary };
    }

    let loaded = null;

    // 1. Try reading the primary save file
    try {
      if (fs.existsSync(this.saveFilePath)) {
        const raw = fs.readFileSync(this.saveFilePath, 'utf8');
        if (raw && raw.trim().length > 0) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
            loaded = parsed;
          }
        }
      }
    } catch (err) {
      console.warn('[Storage] Primary save file read/parse failed, checking backup:', err.message);
    }

    // 2. If primary failed or was empty, try reading the backup (.bak) file
    if (!loaded) {
      try {
        if (fs.existsSync(this.backupFilePath)) {
          const rawBak = fs.readFileSync(this.backupFilePath, 'utf8');
          if (rawBak && rawBak.trim().length > 0) {
            const parsedBak = JSON.parse(rawBak);
            if (parsedBak && typeof parsedBak === 'object' && !Array.isArray(parsedBak)) {
              console.log('[Storage] Successfully recovered state from backup (.bak)!');
              loaded = parsedBak;
              try {
                fs.writeFileSync(this.saveFilePath, JSON.stringify(loaded, null, 2), 'utf8');
              } catch (e) {}
            }
          }
        }
      } catch (bakErr) {
        console.error('[Storage] Backup file recovery failed:', bakErr.message);
      }
    }

    // 3. If loaded successfully, merge with defaults
    if (loaded) {
      this.state = this.deepMerge(JSON.parse(JSON.stringify(DEFAULT_STATE)), loaded);
      if (!this.isInitialized) {
        this.calculateOfflineProgress();
        this.isInitialized = true;
      }
      return { state: this.state, offlineSummary: this.offlineSummary };
    }

    // 4. If disk read failed completely, but we ALREADY have a valid state in memory:
    // NEVER overwrite an active in-memory state with defaults!
    if (this.state && typeof this.state === 'object') {
      console.warn('[Storage] Preserving active in-memory state despite disk load failure');
      return { state: this.state, offlineSummary: this.offlineSummary };
    }

    // 5. First launch fallback
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.isInitialized = true;
    this.saveState();
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

    if (Array.isArray(this.state.extraBunnies)) {
      for (const eb of this.state.extraBunnies) {
        if (typeof eb.hunger === 'number') {
          eb.hunger = Math.max(5, eb.hunger - cappedDrain);
          if (eb.hunger < 25) {
            eb.happiness = Math.max(20, (eb.happiness || 90) - 15);
          }
        }
      }
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

    if (!this.state.meta) {
      this.state.meta = {};
    }
    this.state.meta.lastSaved = Date.now();

    try {
      if (!fs.existsSync(this.userDataPath)) {
        fs.mkdirSync(this.userDataPath, { recursive: true });
      }

      const content = JSON.stringify(this.state, null, 2);
      if (!content || content.length < 20) {
        console.error('[Storage] Refusing to save invalid/empty state string');
        return;
      }

      // 1. Maintain backup of existing save file before replacing
      if (fs.existsSync(this.saveFilePath)) {
        try {
          const stats = fs.statSync(this.saveFilePath);
          if (stats.size > 50) {
            fs.copyFileSync(this.saveFilePath, this.backupFilePath);
          }
        } catch (bakErr) {
          // Non-fatal if backup copy fails
        }
      }

      // 2. Write to temp file first
      const tempPath = this.saveFilePath + '.tmp';
      fs.writeFileSync(tempPath, content, 'utf8');

      // 3. Atomic rename with Windows retry and copy fallback
      let success = false;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          fs.renameSync(tempPath, this.saveFilePath);
          success = true;
          break;
        } catch (renameErr) {
          if (attempt === 2) {
            try {
              fs.copyFileSync(tempPath, this.saveFilePath);
              try { fs.unlinkSync(tempPath); } catch (_) {}
              success = true;
            } catch (copyErr) {
              console.error('[Storage] Error copying to save file:', copyErr);
            }
          }
        }
      }

      if (!success) {
        // Direct write fallback
        try {
          fs.writeFileSync(this.saveFilePath, content, 'utf8');
        } catch (directErr) {
          console.error('[Storage] Direct write fallback failed:', directErr);
        }
      }
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
