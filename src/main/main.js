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
    // Focus or show overlay if already running
    if (windowManager.overlayWindow && !windowManager.overlayWindow.isDestroyed()) {
      windowManager.overlayWindow.show();
    }
  });

  app.whenReady().then(() => {
    // 1. Load initial game state from JSON in AppData
    const { state, offlineSummary } = storage.loadState();
    console.log('[Main] Game state loaded. Bunny:', state.bunny.name, 'Hunger:', state.bunny.hunger);

    // 2. Setup login item setting if configured
    if (state.settings && state.settings.startWithWindows !== undefined) {
      app.setLoginItemSettings({
        openAtLogin: Boolean(state.settings.startWithWindows)
      });
    }

    // 3. Create transparent overlay window anchored to selected monitor
    const monitorIndex = state.settings ? state.settings.monitorIndex : 0;
    const overlayWin = windowManager.createOverlayWindow(monitorIndex);
    const bounds = overlayWin.getBounds();
    console.log('[Main] Overlay window created at bounds:', bounds);

    // 4. Send offline summary to overlay window once ready
    overlayWin.webContents.once('did-finish-load', () => {
      console.log('[Main] Overlay window finished loading content');
      if (offlineSummary) {
        overlayWin.webContents.send('offline-summary', offlineSummary);
      }
    });

    // 5. Initialize System Tray
    trayManager.init(storage);
    console.log('[Main] System tray initialized');

    setupIpcHandlers();
    console.log('[Main] IPC handlers setup complete');
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

function setupIpcHandlers() {
  ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
    windowManager.setIgnoreMouseEvents(ignore, options);
  });

  ipcMain.handle('load-state', () => {
    return storage.loadState();
  });

  ipcMain.on('save-state', (event, newState) => {
    storage.saveState(newState);
    windowManager.broadcastStateUpdate(newState);
  });

  ipcMain.handle('reset-state', () => {
    const res = storage.resetState();
    windowManager.broadcastStateUpdate(res);
    return res;
  });

  ipcMain.handle('get-displays', () => {
    return windowManager.getDisplaysInfo();
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
