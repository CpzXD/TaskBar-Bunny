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
        contextIsolation: true,
        sandbox: true
      }
    });

    this.applySecurityHandlers(this.overlayWindow);
    this.overlayWindow.setAlwaysOnTop(true, 'screen-saver');
    this.overlayWindow.loadFile(path.join(__dirname, '../renderer/index.html'));

    this.overlayWindow.once('ready-to-show', () => {
      this.overlayWindow.show();
      // Enable click-through by default with forward enabled so mousemove is detected
      this.overlayWindow.setIgnoreMouseEvents(true, { forward: true });
    });

    // Tell the renderer where the taskbar is once it has loaded
    this.overlayWindow.webContents.on('did-finish-load', () => this.sendLayout());

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
      y: workArea.y,
      width: workArea.width,
      height: workArea.height
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
    this.sendLayout();
  }

  // Pixels at the bottom of the overlay that sit underneath the taskbar.
  // 0 when the overlay is entirely above it. Derived from the OS work area
  // (the screen minus the taskbar), so it adapts to any taskbar height,
  // DPI scale or monitor without hardcoding a pixel value.
  getTaskbarOverlap() {
    if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return 0;
    const win = this.overlayWindow.getBounds();
    const { workArea } = screen.getDisplayMatching(win);
    const overlap = (win.y + win.height) - (workArea.y + workArea.height);
    // Clamp so a bad reading can never push the UI off the top of the canvas
    // (real taskbars are well under 72 px tall)
    return Math.max(0, Math.min(Math.round(overlap), 72));
  }

  getLayout() {
    return { taskbarOverlap: this.getTaskbarOverlap() };
  }

  sendLayout() {
    if (!this.overlayWindow || this.overlayWindow.isDestroyed()) return;
    this.overlayWindow.webContents.send('layout-updated', this.getLayout());
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
        contextIsolation: true,
        sandbox: true
      }
    });

    this.applySecurityHandlers(this.wardrobeWindow);
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
        contextIsolation: true,
        sandbox: true
      }
    });

    this.applySecurityHandlers(this.settingsWindow);
    this.settingsWindow.loadFile(path.join(__dirname, '../renderer/ui/settings.html'));
    this.settingsWindow.on('closed', () => {
      this.settingsWindow = null;
    });
  }

  applySecurityHandlers(win) {
    if (!win || !win.webContents) return;
    win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    win.webContents.on('will-navigate', (event) => {
      event.preventDefault();
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
