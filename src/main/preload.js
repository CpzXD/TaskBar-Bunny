// src/main/preload.js
// Context bridge exposing safe IPC channels to the renderer

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  setIgnoreMouseEvents: (ignore, options) => {
    ipcRenderer.send('set-ignore-mouse-events', ignore, options);
  },
  loadState: () => ipcRenderer.invoke('load-state'),
  saveState: (state) => ipcRenderer.send('save-state', state),
  resetState: () => ipcRenderer.invoke('reset-state'),
  getDisplays: () => ipcRenderer.invoke('get-displays'),
  setMonitor: (index) => ipcRenderer.send('set-monitor', index),
  setStartWithWindows: (enable) => ipcRenderer.send('set-start-with-windows', enable),
  openWardrobe: () => ipcRenderer.send('open-wardrobe'),
  openSettings: () => ipcRenderer.send('open-settings'),
  closeWindow: (winName) => ipcRenderer.send('close-window', winName),
  quitApp: () => ipcRenderer.send('quit-app'),

  onStateUpdate: (callback) => {
    ipcRenderer.on('state-updated', (_event, state) => callback(state));
  },
  onOfflineSummary: (callback) => {
    ipcRenderer.on('offline-summary', (_event, summary) => callback(summary));
  },
  onTrayAction: (callback) => {
    ipcRenderer.on('tray-action', (_event, action) => callback(action));
  }
});
