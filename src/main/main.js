const { app, ipcMain, BrowserWindow } = require('electron');
const path = require('path');

process.on('uncaughtException', err => {
  console.error('[Main] Uncaught Exception:', err);
});

process.on('unhandledRejection', err => {
  console.error('[Main] Unhandled Rejection:', err);
});

if (app && typeof app.setName === 'function') {
  app.setName('Taskbar Bunny');
}

const storage = require('./storage');
const windowManager = require('./windowManager');
const trayManager = require('./trayManager');

const gotLock = (app && typeof app.requestSingleInstanceLock === 'function') ? app.requestSingleInstanceLock() : true;
if (!gotLock) {
  if (app && typeof app.quit === 'function') app.quit();
} else if (app && typeof app.whenReady === 'function') {
  app.on('second-instance', () => {
    try {
      if (trayManager) {
        trayManager.setBunnyVisibility(true);
      }
    } catch (err) {
      console.error('[Main] Error handling second-instance visibility:', err);
    }
    if (windowManager.overlayWindow && !windowManager.overlayWindow.isDestroyed()) {
      windowManager.overlayWindow.show();
      windowManager.overlayWindow.focus();
    }
  });

  app.whenReady().then(() => {
    const { state, offlineSummary } = storage.loadState();

    if (state.settings && state.settings.startWithWindows !== undefined) {
      try {
        app.setLoginItemSettings({
          openAtLogin: Boolean(state.settings.startWithWindows)
        });
      } catch (err) {
        console.error('[Main] setLoginItemSettings error:', err);
      }
    }

    const monitorIndex = state.settings ? state.settings.monitorIndex : 0;
    const overlayWin = windowManager.createOverlayWindow(monitorIndex);

    overlayWin.webContents.once('did-finish-load', () => {
      if (offlineSummary) {
        overlayWin.webContents.send('offline-summary', offlineSummary);
      }
    });

    trayManager.init(storage);
    setupIpcHandlers();
  }).catch(err => {
    console.error('[Main] app.whenReady initialization error:', err);
  });

  app.on('window-all-closed', () => {
    // Keep alive in tray
  });

  app.on('before-quit', () => {
    storage.saveState();
  });
}

const clamp = (v, min = 0, max = Infinity) =>
  Number.isFinite(v) ? Math.max(min, Math.min(max, v)) : undefined;

function sanitizeState(incoming, current) {
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
    return current;
  }

  const safe = JSON.parse(JSON.stringify(current || {}));
  const b = incoming.bunny;
  if (b && typeof b === 'object' && !Array.isArray(b)) {
    safe.bunny = safe.bunny || {};
    if (typeof b.name === 'string') safe.bunny.name = b.name.slice(0, 32);

    const intBounds = {
      hunger: [0, 100],
      happiness: [0, 100],
      level: [1, 100],
      xp: [0],
      totalCarrotsFed: [0],
      totalPetCount: [0],
      customGroundY: [0]
    };
    for (const [key, [min, max]] of Object.entries(intBounds)) {
      const val = clamp(b[key], min, max);
      if (val !== undefined) safe.bunny[key] = (key === 'customGroundY' ? Math.floor(val) : Math.round(val));
    }

    for (const key of ['furColor', 'earStyle', 'eyeColor']) {
      if (typeof b[key] === 'string') safe.bunny[key] = b[key];
    }
    if (typeof b.blush === 'boolean') safe.bunny.blush = b.blush;

    if (b.equipped && typeof b.equipped === 'object' && !Array.isArray(b.equipped)) {
      safe.bunny.equipped = safe.bunny.equipped || {};
      for (const slot of ['head', 'face', 'neck', 'back', 'held']) {
        if (typeof b.equipped[slot] === 'string') safe.bunny.equipped[slot] = b.equipped[slot];
      }
    }

    if (Array.isArray(b.outfitPresets)) {
      safe.bunny.outfitPresets = b.outfitPresets.slice(0, 3).map((p, i) => {
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

  if (Array.isArray(incoming.extraBunnies)) {
    safe.extraBunnies = incoming.extraBunnies.slice(0, 10).map((eb, idx) => {
      if (!eb || typeof eb !== 'object') return null;
      const item = {
        name: typeof eb.name === 'string' ? eb.name.slice(0, 32) : `Bunny ${idx + 2}`,
        hunger: clamp(eb.hunger, 0, 100) ?? 85,
        happiness: clamp(eb.happiness, 0, 100) ?? 90,
        level: clamp(eb.level, 1, 100) ?? 1,
        xp: clamp(eb.xp, 0) ?? 0,
        totalCarrotsFed: clamp(eb.totalCarrotsFed, 0) ?? 0,
        totalPetCount: clamp(eb.totalPetCount, 0) ?? 0,
        customGroundY: clamp(eb.customGroundY, 0) ?? null,
        furColor: typeof eb.furColor === 'string' ? eb.furColor : 'brown',
        earStyle: typeof eb.earStyle === 'string' ? eb.earStyle : 'floppy',
        eyeColor: typeof eb.eyeColor === 'string' ? eb.eyeColor : 'ruby',
        blush: typeof eb.blush === 'boolean' ? eb.blush : true,
        equipped: {
          head: typeof eb.equipped?.head === 'string' ? eb.equipped.head : 'none',
          face: typeof eb.equipped?.face === 'string' ? eb.equipped.face : 'none',
          neck: typeof eb.equipped?.neck === 'string' ? eb.equipped.neck : 'none',
          back: typeof eb.equipped?.back === 'string' ? eb.equipped.back : 'none',
          held: typeof eb.equipped?.held === 'string' ? eb.equipped.held : 'none'
        }
      };
      return item;
    }).filter(Boolean);
  }

  const inv = incoming.inventory;
  if (inv && typeof inv === 'object' && !Array.isArray(inv)) {
    safe.inventory = safe.inventory || {};
    const coins = clamp(inv.coins, 0);
    if (coins !== undefined) safe.inventory.coins = Math.floor(coins);

    if (inv.foods && typeof inv.foods === 'object' && !Array.isArray(inv.foods)) {
      safe.inventory.foods = safe.inventory.foods || {};
      for (const [k, v] of Object.entries(inv.foods)) {
        if (!['__proto__', 'constructor', 'prototype'].includes(k)) {
          const count = clamp(v, 0);
          if (count !== undefined) safe.inventory.foods[k] = Math.floor(count);
        }
      }
    }
    if (Array.isArray(inv.unlockedCosmetics)) {
      const incCosmetics = inv.unlockedCosmetics.filter(c => typeof c === 'string' && c.length < 64);
      const curCosmetics = Array.isArray(current?.inventory?.unlockedCosmetics) ? current.inventory.unlockedCosmetics : [];
      safe.inventory.unlockedCosmetics = Array.from(new Set([...curCosmetics, ...incCosmetics]));
    }
    if (Array.isArray(inv.unlockedTerrains)) {
      const incTerrains = inv.unlockedTerrains.filter(t => ['grassy', 'icy'].includes(t));
      const curTerrains = Array.isArray(current?.inventory?.unlockedTerrains) ? current.inventory.unlockedTerrains : ['grassy'];
      safe.inventory.unlockedTerrains = Array.from(new Set([...curTerrains, ...incTerrains]));
    }
  }

  if (incoming.garden && typeof incoming.garden === 'object' && !Array.isArray(incoming.garden)) {
    safe.garden = safe.garden || {};
    const gx = clamp(incoming.garden.x, 0);
    if (gx !== undefined) safe.garden.x = gx;
    if (Array.isArray(incoming.garden.plots)) safe.garden.plots = incoming.garden.plots;
  }

  const s = incoming.settings;
  if (s && typeof s === 'object' && !Array.isArray(s)) {
    safe.settings = safe.settings || {};
    const numBounds = { volume: [0, 1], bunnyScale: [1, 5], menuScale: [0.5, 3], monitorIndex: [0, 20] };
    for (const [key, [min, max]] of Object.entries(numBounds)) {
      const val = clamp(s[key], min, max);
      if (val !== undefined) safe.settings[key] = key === 'monitorIndex' ? Math.floor(val) : val;
    }
    if (typeof s.isMuted === 'boolean') safe.settings.isMuted = s.isMuted;
    if (typeof s.startWithWindows === 'boolean') safe.settings.startWithWindows = s.startWithWindows;
    if (typeof s.doNotDisturb === 'boolean') safe.settings.doNotDisturb = s.doNotDisturb;
    if (['relaxed', 'normal', 'fast'].includes(s.hungerSpeed)) safe.settings.hungerSpeed = s.hungerSpeed;
    if (['taskbar', 'cozy', 'desk', 'full'].includes(s.roamingArea)) safe.settings.roamingArea = s.roamingArea;
    if (['taskbar', 'free'].includes(s.floorMode)) safe.settings.floorMode = s.floorMode;
    if (['default', 'festive'].includes(s.denSkin)) safe.settings.denSkin = s.denSkin;
    if (['grassy', 'icy'].includes(s.activeTerrain)) safe.settings.activeTerrain = s.activeTerrain;

    if (s.menuPosition === null) {
      safe.settings.menuPosition = null;
    } else if (s.menuPosition && typeof s.menuPosition === 'object') {
      const mx = clamp(s.menuPosition.x, 0);
      const my = clamp(s.menuPosition.y, 0);
      if (mx !== undefined && my !== undefined) {
        safe.settings.menuPosition = { x: Math.round(mx), y: Math.round(my) };
      }
    }
  }

  if (incoming.achievements && Array.isArray(incoming.achievements.unlocked)) {
    safe.achievements = safe.achievements || { unlocked: [] };
    const incAch = incoming.achievements.unlocked.filter(id => typeof id === 'string' && id.length < 64);
    const curAch = Array.isArray(current?.achievements?.unlocked) ? current.achievements.unlocked : [];
    safe.achievements.unlocked = Array.from(new Set([...curAch, ...incAch]));
  }

  return safe;
}

function setupIpcHandlers() {
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    windowManager.setIgnoreMouseEvents(ignore, options);
  });

  ipcMain.handle('load-state', () => {
    return storage.loadState(false);
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

  ipcMain.on('open-trophies', () => {
    windowManager.openTrophies();
  });

  ipcMain.on('close-window', (event, winName) => {
    if (winName === 'wardrobe' && windowManager.wardrobeWindow) {
      windowManager.wardrobeWindow.close();
    } else if (winName === 'settings' && windowManager.settingsWindow) {
      windowManager.settingsWindow.close();
    } else if (winName === 'trophies' && windowManager.trophiesWindow) {
      windowManager.trophiesWindow.close();
    }
  });

  ipcMain.on('quit-app', () => {
    app.quit();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { sanitizeState };
}
