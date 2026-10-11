// src/main/windowManager.js
// Multi-monitor positioning, transparent taskbar overlay, and popup window management

const { BrowserWindow, screen, app } = require('electron');
const path = require('path');

class WindowManager {
  constructor() {
    this.overlayWindow = null;
    this.wardrobeWindow = null;
    this.settingsWindow = null;
    this.currentMonitorIndex = 0;
    this.overlayHeight = 180;
  }

  createOverlayWindow(monitorIndex = 0) {
    this.currentMonitorIndex = monitorIndex;
    const bounds = this.getOverlayBounds(this.currentMonitorIndex);

    this.overlayWindow = new BrowserWindow({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      transparent: true,
      frame: false,
      resizable: false,
      hasShadow: false,
      roundedCorners: false,
      skipTaskbar: true,
      alwaysOnTop: true,
      focusable: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    this.overlayWindow.setAlwaysOnTop(true, 'screen-saver');
    this.overlayWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    this.overlayWindow.webContents.on('console-message', (event, level, message) => {
      console.log(`[Renderer] ${message}`);
    });

    this.overlayWindow.once('ready-to-show', () => {
      this.overlayWindow.show();
      // Enable click-through by default with forward enabled so mousemove is detected
      this.overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    });

    // Listen for screen resolution/workArea changes
    screen.on('display-metrics-changed', () => {
      this.repositionOverlay();
    });

    return this.overlayWindow;
  }

  getOverlayBounds(monitorIndex = 0) {
    const displays = screen.getAllDisplays();
    const display = displays[monitorIndex] || screen.getPrimaryDisplay();
    const { workArea } = display;

    return {
      x: workArea.x,
      y: workArea.y + workArea.height - this.overlayHeight,
      width: workArea.width,
      height: this.overlayHeight
    };
  }

  setMonitor(index) {
    const displays = screen.getAllDisplays();
    if (index >= 0 && index < displays.length) {
      this.currentMonitorIndex = index;
      this.repositionOverlay();
    }
  }

  repositionOverlay() {
    if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
    const bounds = this.getOverlayBounds(this.currentMonitorIndex);
    this.overlayWindow.setBounds(bounds);
  }

  setIgnoreMouseEvents(ignore, options) {
    if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
    this.overlayWindow.setIgnoreMouseEvents(ignore, options);
  }

  getDisplaysInfo() {
    return screen.getAllDisplays().map((d, index) => ({
      index,
      id: d.id,
      label: `Display ${index + 1} (${d.bounds.width}x${d.bounds.height})`,
      isPrimary: d.id === screen.getPrimaryDisplay().id
    }));
  }

  // --- Wardrobe Window ---
  openWardrobe() {
    if (this.wardrobeWindow && !this.wardrobeWindow.isDestroyed()) {
      this.wardrobeWindow.show();
      this.wardrobeWindow.focus();
      return;
    }

    this.wardrobeWindow = new BrowserWindow({
      width: 480,
      height: 560,
      frame: false,
      transparent: true,
      resizable: false,
      alwaysOnTop: true,
      skipTaskbar: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    this.wardrobeWindow.loadFile(path.join(__dirname, '../renderer/ui/wardrobe.html'));
    this.wardrobeWindow.on('closed', () => {
      this.wardrobeWindow = null;
    });
  }

  // --- Settings Window ---
  openSettings() {
    if (this.settingsWindow && !this.settingsWindow.isDestroyed()) {
      this.settingsWindow.show();
      this.settingsWindow.focus();
      return;
    }

    this.settingsWindow = new BrowserWindow({
      width: 450,
      height: 520,
      frame: false,
      transparent: true,
      resizable: false,
      alwaysOnTop: true,
      skipTaskbar: false,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    });

    this.settingsWindow.loadFile(path.join(__dirname, '../renderer/ui/settings.html'));
    this.settingsWindow.on('closed', () => {
      this.settingsWindow = null;
    });
  }

  broadcastStateUpdate(state) {
    if (this.overlayWindow && !this.overlayWindow.isDestroyed()) {
      this.overlayWindow.webContents.send('state-updated', state);
    }
    if (this.wardrobeWindow && !this.wardrobeWindow.isDestroyed()) {
      this.wardrobeWindow.webContents.send('state-updated', state);
    }
    if (this.settingsWindow && !this.settingsWindow.isDestroyed()) {
      this.settingsWindow.webContents.send('state-updated', state);
    }
  }
}

module.exports = new WindowManager();
