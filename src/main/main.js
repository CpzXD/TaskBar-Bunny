// src/main/main.js
// Main Electron entry point: lifecycle, single-instance lock, and IPC handlers

const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');
const storage = require('./storage');
const windowManager = require('./windowManager');
const trayManager = require('./trayManager');

app.setName('Taskbar Bunny');

// Single instance lock
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Focus or show overlay if already running, keeping tray menu in sync
    trayManager.setBunnyVisibility(true);
    if (windowManager.overlayWindow && !windowManager.overlayWindow.isDestroyed()) {
      windowManager.overlayWindow.focus();
    }
  });

  app.whenReady().then(() => {
    // 1. Load initial game state from JSON in AppData
    const { state, offlineSummary } = storage.loadState();

    // 2. Setup login item setting if configured
    if (state.settings && state.settings.startWithWindows !== undefined) {
      app.setLoginItemSettings({
        openAtLogin: Boolean(state.settings.startWithWindows)
      });
    }

    // 3. Create transparent overlay window anchored to selected monitor
    const monitorIndex = state.settings ? state.settings.monitorIndex : 0;
    const overlayWin = windowManager.createOverlayWindow(monitorIndex);

    // 4. Send offline summary to overlay window once ready
    overlayWin.webContents.once('did-finish-load', () => {
      if (offlineSummary) {
        overlayWin.webContents.send('offline-summary', offlineSummary);
      }
    });

    // 5. Initialize System Tray
    trayManager.init(storage);

    setupIpcHandlers();
  });

  // Keep app running in background / tray when windows are closed
  app.on('window-all-closed', (e) => {
    // Do not quit automatically — lives in tray
  });

  app.on('before-quit', () => {
    // Ensure last state is persisted before quit
    storage.saveState();
  });
}

function sanitizeState(incoming, current) {
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    return current;
  }

  const safe = JSON.parse(JSON.stringify(current || {}));
  const forbidden = ['__proto__', 'constructor', 'prototype'];

  // 1. Bunny stats
  if (incoming.bunny && typeof incoming.bunny === 'object' && !Array.isArray(incoming.bunny)) {
    if (!safe.bunny) safe.bunny = {};
    if (typeof incoming.bunny.name === 'string') safe.bunny.name = incoming.bunny.name.slice(0, 32);
    if (Number.isFinite(incoming.bunny.hunger)) safe.bunny.hunger = Math.max(0, Math.min(100, Math.round(incoming.bunny.hunger)));
    if (Number.isFinite(incoming.bunny.happiness)) safe.bunny.happiness = Math.max(0, Math.min(100, Math.round(incoming.bunny.happiness)));
    if (Number.isFinite(incoming.bunny.level)) safe.bunny.level = Math.max(1, Math.floor(incoming.bunny.level));
    if (Number.isFinite(incoming.bunny.xp)) safe.bunny.xp = Math.max(0, Math.floor(incoming.bunny.xp));
    if (Number.isFinite(incoming.bunny.totalCarrotsFed)) safe.bunny.totalCarrotsFed = Math.max(0, Math.floor(incoming.bunny.totalCarrotsFed));
    if (Number.isFinite(incoming.bunny.totalPetCount)) safe.bunny.totalPetCount = Math.max(0, Math.floor(incoming.bunny.totalPetCount));
    if (typeof incoming.bunny.furColor === 'string') safe.bunny.furColor = incoming.bunny.furColor;
    if (typeof incoming.bunny.earStyle === 'string') safe.bunny.earStyle = incoming.bunny.earStyle;
    if (typeof incoming.bunny.eyeColor === 'string') safe.bunny.eyeColor = incoming.bunny.eyeColor;
    if (typeof incoming.bunny.blush === 'boolean') safe.bunny.blush = incoming.bunny.blush;

    if (incoming.bunny.equipped && typeof incoming.bunny.equipped === 'object' && !Array.isArray(incoming.bunny.equipped)) {
      if (!safe.bunny.equipped) safe.bunny.equipped = {};
      for (const slot of ['head', 'face', 'neck', 'back', 'held']) {
        if (typeof incoming.bunny.equipped[slot] === 'string') {
          safe.bunny.equipped[slot] = incoming.bunny.equipped[slot];
        }
      }
    }

    if (Array.isArray(incoming.bunny.outfitPresets)) {
      safe.bunny.outfitPresets = incoming.bunny.outfitPresets.slice(0, 3).map((p, i) => {
        if (!p || typeof p !== 'object') return { name: `Preset ${i + 1}`, head: 'none', face: 'none', neck: 'none', back: 'none', held: 'none' };
        return {
          name: typeof p.name === 'string' ? p.name.slice(0, 32) : `Preset ${i + 1}`,
          head: typeof p.head === 'string' ? p.head : 'none',
          face: typeof p.face === 'string' ? p.face : 'none',
          neck: typeof p.neck === 'string' ? p.neck : 'none',
          back: typeof p.back === 'string' ? p.back : 'none',
          held: typeof p.held === 'string' ? p.held : 'none'
        };
      });
    }
  }

  // 2. Inventory
  if (incoming.inventory && typeof incoming.inventory === 'object' && !Array.isArray(incoming.inventory)) {
    if (!safe.inventory) safe.inventory = {};
    if (Number.isFinite(incoming.inventory.coins)) safe.inventory.coins = Math.max(0, Math.floor(incoming.inventory.coins));
    if (incoming.inventory.foods && typeof incoming.inventory.foods === 'object' && !Array.isArray(incoming.inventory.foods)) {
      if (!safe.inventory.foods) safe.inventory.foods = {};
      for (const [k, v] of Object.entries(incoming.inventory.foods)) {
        if (!forbidden.includes(k) && Number.isFinite(v)) {
          safe.inventory.foods[k] = Math.max(0, Math.floor(v));
        }
      }
    }
    if (Array.isArray(incoming.inventory.unlockedCosmetics)) {
      safe.inventory.unlockedCosmetics = incoming.inventory.unlockedCosmetics
        .filter(c => typeof c === 'string' && c.length < 64);
    }
  }

  // 3. Garden
  if (incoming.garden && typeof incoming.garden === 'object' && !Array.isArray(incoming.garden)) {
    if (!safe.garden) safe.garden = {};
    if (Number.isFinite(incoming.garden.x)) safe.garden.x = incoming.garden.x;
    if (Array.isArray(incoming.garden.plots)) {
      safe.garden.plots = incoming.garden.plots;
    }
  }

  // 4. Settings
  if (incoming.settings && typeof incoming.settings === 'object' && !Array.isArray(incoming.settings)) {
    if (!safe.settings) safe.settings = {};
    if (Number.isFinite(incoming.settings.volume)) safe.settings.volume = Math.max(0, Math.min(1, incoming.settings.volume));
    if (typeof incoming.settings.isMuted === 'boolean') safe.settings.isMuted = incoming.settings.isMuted;
    if (Number.isFinite(incoming.settings.bunnyScale)) safe.settings.bunnyScale = Math.max(1.0, Math.min(5.0, incoming.settings.bunnyScale));
    if (Number.isFinite(incoming.settings.menuScale)) safe.settings.menuScale = Math.max(0.5, Math.min(3.0, incoming.settings.menuScale));
    if (Number.isFinite(incoming.settings.monitorIndex)) safe.settings.monitorIndex = Math.max(0, Math.floor(incoming.settings.monitorIndex));
    if (['relaxed', 'normal', 'fast'].includes(incoming.settings.hungerSpeed)) safe.settings.hungerSpeed = incoming.settings.hungerSpeed;
    if (typeof incoming.settings.startWithWindows === 'boolean') safe.settings.startWithWindows = incoming.settings.startWithWindows;
    if (typeof incoming.settings.doNotDisturb === 'boolean') safe.settings.doNotDisturb = incoming.settings.doNotDisturb;
    if (typeof incoming.settings.hideWhenFullscreen === 'boolean') safe.settings.hideWhenFullscreen = incoming.settings.hideWhenFullscreen;
  }

  // 5. Achievements
  if (incoming.achievements && Array.isArray(incoming.achievements.unlocked)) {
    if (!safe.achievements) safe.achievements = { unlocked: [] };
    safe.achievements.unlocked = incoming.achievements.unlocked.filter(id => typeof id === 'string' && id.length < 64);
  }

  return safe;
}

function setupIpcHandlers() {
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    windowManager.setIgnoreMouseEvents(ignore, options);
  });

  ipcMain.handle('load-state', () => {
    return storage.loadState();
  });

  ipcMain.on('save-state', (event, newState) => {
    const validatedState = sanitizeState(newState, storage.state);
    storage.saveState(validatedState);
    windowManager.broadcastStateUpdate(validatedState);
  });

  ipcMain.handle('reset-state', () => {
    const res = storage.resetState();
    windowManager.broadcastStateUpdate(res);
    return res;
  });

  ipcMain.handle('get-displays', () => {
    return windowManager.getDisplaysInfo();
  });

  ipcMain.handle('get-layout', () => {
    return windowManager.getLayout();
  });

  ipcMain.on('set-monitor', (event, index) => {
    windowManager.setMonitor(index);
    if (storage.state && storage.state.settings) {
      storage.state.settings.monitorIndex = index;
      storage.saveState();
    }
  });

  ipcMain.on('set-start-with-windows', (event, enable) => {
    app.setLoginItemSettings({ openAtLogin: Boolean(enable) });
    if (storage.state && storage.state.settings) {
      storage.state.settings.startWithWindows = Boolean(enable);
      storage.saveState();
    }
  });

  ipcMain.on('open-wardrobe', () => {
    windowManager.openWardrobe();
  });

  ipcMain.on('open-settings', () => {
    windowManager.openSettings();
  });

  ipcMain.on('close-window', (event, winName) => {
    if (winName === 'wardrobe' && windowManager.wardrobeWindow) {
      windowManager.wardrobeWindow.close();
    } else if (winName === 'settings' && windowManager.settingsWindow) {
      windowManager.settingsWindow.close();
    }
  });

  ipcMain.on('quit-app', () => {
    app.quit();
  });
}
