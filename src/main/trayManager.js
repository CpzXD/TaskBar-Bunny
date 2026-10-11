// src/main/trayManager.js
// System tray icon and context menu management

const { Tray, Menu, nativeImage, app } = require('electron');
const path = require('path');
const windowManager = require('./windowManager');

class TrayManager {
  constructor() {
    this.tray = null;
    this.isBunnyVisible = true;
  }

  init(storage) {
    this.storage = storage;
    const iconPath = path.join(__dirname, '../../assets/tray-icon.png');
    const trayIcon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });

    this.tray = new Tray(trayIcon);
    this.tray.setToolTip('Taskbar Bunny');

    this.buildContextMenu(this.storage);

    this.tray.on('click', () => {
      this.toggleBunnyVisibility();
    });
  }

  buildContextMenu(storage) {
    if (storage) this.storage = storage;
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Taskbar Bunny',
        enabled: false
      },
      { type: 'separator' },
      {
        label: this.isBunnyVisible ? 'Hide Bunny' : 'Show Bunny',
        click: () => this.toggleBunnyVisibility()
      },
      {
        label: 'Open Wardrobe',
        click: () => windowManager.openWardrobe()
      },
      {
        label: 'Settings',
        click: () => windowManager.openSettings()
      },
      { type: 'separator' },
      {
        label: 'Feed Carrot',
        click: () => {
          if (windowManager.overlayWindow && !windowManager.overlayWindow.isDestroyed()) {
            windowManager.overlayWindow.webContents.send('tray-action', 'feed-carrot');
          }
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => app.quit()
      }
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  setBunnyVisibility(visible) {
    this.isBunnyVisible = Boolean(visible);
    if (windowManager.overlayWindow && !windowManager.overlayWindow.isDestroyed()) {
      if (this.isBunnyVisible) {
        windowManager.overlayWindow.show();
      } else {
        windowManager.overlayWindow.hide();
      }
    }
    this.buildContextMenu(this.storage);
  }

  toggleBunnyVisibility() {
    this.setBunnyVisibility(!this.isBunnyVisible);
  }

  updateToolTip(text) {
    if (this.tray) {
      this.tray.setToolTip(text);
    }
  }
}

module.exports = new TrayManager();
