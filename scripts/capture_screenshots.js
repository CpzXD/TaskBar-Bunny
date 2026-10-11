const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

fs.writeFileSync(path.join(__dirname, 'capture.log'), 'Script loaded\n');
process.on('uncaughtException', (err) => {
  fs.appendFileSync(path.join(__dirname, 'capture.log'), 'Uncaught: ' + err.stack + '\n');
});

const mockState = {
  version: 1,
  bunny: {
    name: 'Barnaby',
    furColor: 'white',
    earStyle: 'upright',
    eyeColor: 'ruby',
    blush: true,
    equipped: { head: 'party_hat', face: 'none', neck: 'red_scarf', back: 'none', held: 'none' },
    hunger: 85,
    happiness: 95,
    level: 12,
    xp: 450,
    totalCarrotsFed: 85,
    totalPetCount: 160,
    outfitPresets: [
      { name: 'Celebration Look', head: 'party_hat', face: 'none', neck: 'red_scarf', back: 'none', held: 'balloon', saved: true },
      { name: 'Preset 2', head: 'none', face: 'none', neck: 'none', back: 'none', held: 'none' },
      { name: 'Preset 3', head: 'none', face: 'none', neck: 'none', back: 'none', held: 'none' }
    ]
  },
  extraBunnies: [
    {
      name: 'Mochi',
      furColor: 'caramel',
      earStyle: 'floppy',
      eyeColor: 'amber',
      blush: true,
      equipped: { head: 'flower_crown', face: 'none', neck: 'none', back: 'none', held: 'none' },
      hunger: 90,
      happiness: 100,
      level: 4,
      xp: 180,
      totalCarrotsFed: 24,
      totalPetCount: 65
    }
  ],
  inventory: {
    coins: 680,
    foods: { carrot: 8, lettuce: 4, strawberry: 3, apple: 2, clover: 2 },
    unlockedCosmetics: [
      'head:party_hat', 'head:flower_crown', 'head:beanie', 'neck:red_scarf', 'face:glasses', 'held:balloon', 'back:backpack'
    ],
    unlockedTerrains: ['grassy', 'icy']
  },
  garden: {
    plots: [
      { id: 1, planted: true, plantedAt: Date.now() - 100000, growDurationMs: 90000, ready: true, crop: 'strawberry' }
    ],
    x: 600
  },
  settings: {
    bunnyScale: 2.5,
    menuScale: 1.0,
    monitorIndex: 0,
    volume: 0.6,
    isMuted: false,
    hungerSpeed: 'normal',
    roamingArea: 'cozy',
    floorMode: 'taskbar',
    activeTerrain: 'grassy',
    denSkin: 'default'
  },
  achievements: {
    unlocked: ['first_carrot', 'fed_25', 'pet_50', 'level_5', 'level_10', 'fashion_pioneer', 'first_harvest']
  }
};

const logFile = path.join(__dirname, 'capture.log');
function log(msg) {
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
}
log('Script loaded');

process.on('uncaughtException', (err) => {
  log('Uncaught: ' + err.stack);
});

app.disableHardwareAcceleration();

app.whenReady().then(async () => {
  log('app.whenReady called');
  ipcMain.handle('load-state', () => {
    log('ipcMain load-state called');
    return { state: mockState, offlineSummary: null };
  });
  ipcMain.handle('get-layout', () => ({ taskbarOverlap: 44 }));
  ipcMain.handle('get-displays', () => [
    { id: 0, label: 'Primary Monitor (1920x1080)', bounds: { width: 1920, height: 1080 } }
  ]);
  ipcMain.handle('reset-state', () => ({ state: mockState }));
  ipcMain.on('set-ignore-mouse-events', () => {});
  ipcMain.on('set-monitor', () => {});
  ipcMain.on('set-start-with-windows', () => {});
  ipcMain.on('save-state', () => {});
  ipcMain.on('close-window', () => {});
  ipcMain.on('open-wardrobe', () => {});
  ipcMain.on('open-settings', () => {});
  ipcMain.on('open-trophies', () => {});
  ipcMain.on('quit-app', () => {});

  const assetsDir = path.join(__dirname, '../assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  log('[1/5] Capturing Wardrobe (Headwear tab)...');
  const w1 = new BrowserWindow({
    width: 490,
    height: 560,
    frame: false,
    transparent: true,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, '../src/main/preload.js'),
      contextIsolation: true,
      sandbox: true
    }
  });
  await w1.loadFile(path.join(__dirname, '../src/renderer/ui/wardrobe.html'));
  await sleep(800);
  await w1.webContents.executeJavaScript(`
    const headBtn = document.querySelector('.tab-btn[data-tab="head"]');
    if (headBtn) headBtn.click();
  `);
  await sleep(500);
  const imgW1 = await w1.webContents.capturePage();
  fs.writeFileSync(path.join(assetsDir, 'wardrobe-headwear.png'), imgW1.toPNG());
  log('Saved wardrobe-headwear.png');
  w1.close();

  log('[2/5] Capturing Wardrobe (Terrain tab)...');
  const wTerrain = new BrowserWindow({
    width: 490,
    height: 560,
    frame: false,
    transparent: true,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, '../src/main/preload.js'),
      contextIsolation: true,
      sandbox: true
    }
  });
  await wTerrain.loadFile(path.join(__dirname, '../src/renderer/ui/wardrobe.html'));
  await sleep(600);
  await wTerrain.webContents.executeJavaScript(`
    const tBtn = document.querySelector('.tab-btn[data-tab="terrain"]');
    if (tBtn) tBtn.click();
  `);
  await sleep(500);
  const imgTerrain = await wTerrain.webContents.capturePage();
  fs.writeFileSync(path.join(assetsDir, 'shop-terrain.png'), imgTerrain.toPNG());
  log('Saved shop-terrain.png');
  wTerrain.close();

  log('[3/5] Capturing Settings...');
  const wSettings = new BrowserWindow({
    width: 450,
    height: 520,
    frame: false,
    transparent: true,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, '../src/main/preload.js'),
      contextIsolation: true,
      sandbox: true
    }
  });
  await wSettings.loadFile(path.join(__dirname, '../src/renderer/ui/settings.html'));
  await sleep(600);
  const imgSettings = await wSettings.webContents.capturePage();
  fs.writeFileSync(path.join(assetsDir, 'settings-preview.png'), imgSettings.toPNG());
  log('Saved settings-preview.png');
  wSettings.close();

  log('[4/5] Capturing Trophies...');
  const wTrophies = new BrowserWindow({
    width: 480,
    height: 540,
    frame: false,
    transparent: true,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, '../src/main/preload.js'),
      contextIsolation: true,
      sandbox: true
    }
  });
  await wTrophies.loadFile(path.join(__dirname, '../src/renderer/ui/trophies.html'));
  await sleep(600);
  const imgTrophies = await wTrophies.webContents.capturePage();
  fs.writeFileSync(path.join(assetsDir, 'trophies-preview.png'), imgTrophies.toPNG());
  log('Saved trophies-preview.png');
  wTrophies.close();

  log('[5/5] Capturing Gameplay with Grassy Meadow & Icy Rink...');
  // Gameplay capture window with simulated taskbar background
  const wGame = new BrowserWindow({
    width: 1060,
    height: 290,
    frame: false,
    show: true,
    webPreferences: {
      preload: path.join(__dirname, '../src/main/preload.js'),
      contextIsolation: true,
      sandbox: true
    }
  });
  await wGame.loadFile(path.join(__dirname, '../src/renderer/index.html'));
  await sleep(1000);

  // Position bunnies, open food drawer, add simulated falling treats and background wallpaper
  await wGame.webContents.executeJavaScript(`
    (() => {
      const app = window.appInstance;
      if (app) {
        document.body.style.background = 'radial-gradient(ellipse at bottom, #1e1e2f 0%, #0f172a 100%)';
        app.taskbarOverlap = 44;
        app.applyLayout();

        if (app.hud) {
          app.hud.isDrawerOpen = true;
        }

        if (app.bunnies && app.bunnies[0]) {
          app.bunnies[0].x = 450;
          app.bunnies[0].direction = 1;
          app.bunnies[0].stateMachine.setState('idle');
        }

        if (app.bunnies && app.bunnies[1]) {
          app.bunnies[1].x = 820;
          app.bunnies[1].direction = -1;
          app.bunnies[1].stateMachine.setState('idle');
        }

        if (app.butterfly) {
          app.butterfly.active = true;
          app.butterfly.x = 420;
          app.butterfly.y = 85;
        }

        if (app.worldFoods) {
          app.worldFoods.push({
            id: 'strawberry',
            x: 520,
            y: 70,
            vy: 2,
            rotation: 0.2,
            groundY: app.groundY,
            isGrounded: false
          });
          app.worldFoods.push({
            id: 'carrot',
            x: 740,
            y: 110,
            vy: 3,
            rotation: -0.3,
            groundY: app.groundY,
            isGrounded: false
          });
        }

        // Override clearRect to render authentic dark desktop wallpaper & taskbar
        const ctx = app.ctx;
        ctx.clearRect = function(x, y, w, h) {
          ctx.save();
          const bgGrad = ctx.createLinearGradient(0, 0, 0, app.canvas.height);
          bgGrad.addColorStop(0, '#090d16');
          bgGrad.addColorStop(0.5, '#1e1b4b');
          bgGrad.addColorStop(1, '#0f172a');
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, app.canvas.width, app.canvas.height);

          // Subtle wallpaper star dust
          ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
          for (let i = 0; i < 18; i++) {
            const sx = (i * 61 + 35) % app.canvas.width;
            const sy = (i * 29 + 15) % (app.canvas.height - 50);
            ctx.fillRect(sx, sy, 2, 2);
          }

          // Windows 11 Taskbar background
          ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
          ctx.fillRect(0, app.canvas.height - 40, app.canvas.width, 40);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, app.canvas.height - 40);
          ctx.lineTo(app.canvas.width, app.canvas.height - 40);
          ctx.stroke();

          // Centered Windows 11 app icons mock
          const iconY = app.canvas.height - 30;
          const iconColors = ['#0284c7', '#38bdf8', '#fbbf24', '#f43f5e', '#10b981', '#a855f7'];
          iconColors.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(app.canvas.width / 2 - 80 + i * 28, iconY, 19, 19, 4);
            ctx.fill();
          });
          ctx.restore();
        };
      }
      return true;
    })()
  `);

  await sleep(600);
  const imgGame = await wGame.webContents.capturePage();
  fs.writeFileSync(path.join(assetsDir, 'taskbar-gameplay.png'), imgGame.toPNG());
  log('Saved taskbar-gameplay.png');

  // Capture Icy Rink version
  await wGame.webContents.executeJavaScript(`
    (() => {
      const app = window.appInstance;
      if (app && app.state && app.state.settings) {
        app.state.settings.activeTerrain = 'icy';
        if (app.bunnies && app.bunnies[0]) {
          app.bunnies[0].stateMachine.setState('walk');
        }
      }
      return true;
    })()
  `);
  await sleep(500);
  const imgIce = await wGame.webContents.capturePage();
  fs.writeFileSync(path.join(assetsDir, 'ice-gameplay.png'), imgIce.toPNG());
  log('Saved ice-gameplay.png');

  wGame.close();

  log('All screenshots captured successfully!');
  app.quit();
});
