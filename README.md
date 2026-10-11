# 🐰 Taskbar Bunny

<p align="center">
  <img src="assets/taskbar-gameplay.png" alt="Taskbar Bunny Gameplay Preview" width="900" />
</p>

A cozy, lightweight, pixel-art desktop pet game for Windows that lives directly on top of your taskbar, in the spirit of *Taskbar Hero*.

Barnaby hops, wanders, nibbles carrots, takes naps, and reacts to your interactions—all while running quietly in the background without stealing focus or blocking your clicks.

---

## 📸 Screenshots

<p align="center">
  <img src="assets/taskbar-gameplay.png" alt="Taskbar Bunny Gameplay Preview (Lush Meadow)" width="900" />
</p>
<p align="center">
  <em>🌾 Lush Meadow: Barnaby & companion wandering on the taskbar with independent burrow den, harvestable garden, and floating HUD drawer</em>
</p>

<p align="center">
  <img src="assets/ice-gameplay.png" alt="Frosty Ice Rink Gameplay" width="900" />
</p>
<p align="center">
  <em>❄️ Frosty Ice Rink: Frictionless ice skating, falling treats, and butterfly chasing</em>
</p>

<p align="center">
  <img src="assets/wardrobe-headwear.png" alt="Bunny Wardrobe & Customizer" width="280" />
  &nbsp;&nbsp;
  <img src="assets/shop-terrain.png" alt="Terrain Shop & Unlocks" width="280" />
  &nbsp;&nbsp;
  <img src="assets/trophies-preview.png" alt="Trophies & Achievements" width="280" />
</p>
<p align="center">
  <em>Left: Bunny Shop & Customizer &bull; Center: Terrain Shop (500g) &bull; Right: Progressive Trophies & Milestones</em>
</p>

<p align="center">
  <img src="assets/settings-preview.png" alt="Taskbar Bunny Settings" width="400" />
</p>
<p align="center">
  <em>Companion Settings, Monitor Selection & Roaming Controls</em>
</p>

---

## ✨ Features

- **Transparent & Non-Intrusive**:
  - Automatically docks right on top of the Windows taskbar across screen resolutions.
  - **Click-Through Overlay**: You can click desktop icons and apps underneath freely. Mouse events are only captured when interacting with the bunny or the floating bag.
  - Never appears in the taskbar app list or Alt+Tab (`skipTaskbar: true`).
  - Does not steal focus from your active apps (`focusable: false`).
- **🏞️ Terrain System (Lush Meadow & Frosty Ice Rink)**:
  - **Lush Meadow (Free)**: Fresh green meadow with grass tufts and tiny daisies. Homegrown plots harvest crisp carrots, sweet strawberries, and cabbage!
  - **Frosty Ice Rink (500 Coins in Shop)**: Glistening frozen lake! Bunnies frictionless-glide and ice-skate with speed boosts, occasionally slipping and falling over (every 30–40s) with comical sneeze SFX and star bursts. Forages sweet apples & lucky clovers!
- **🚀 Throw Velocity & Wall-Bouncing Physics**:
  - Click and fling your bunny across the screen! Realistic momentum release (clamped to safe max speed of 20).
  - Bunny bounces off left and right screen borders with reverse momentum, hop sound effects, star bursts, and floor bounce dampening.
- **🏡 Cozy Detached Den Burrow & Sleep Mechanics**:
  - Warm wooden burrow with thatched moss roof sits independently at its own peaceful spot along the taskbar.
  - If unattended for 5 minutes, your bunny hops over to the den to curl up and sleep.
  - Click the den anytime to toggle a live floating **Hunger & Happiness status badge**!
  - Unlock festive den cosmetics like the **Festive Christmas Den** (gingerbread roof, holiday lights, and wreath).
- **🦋 Butterfly Spawning & Chasing**:
  - A colorful animated butterfly spawns every 5 minutes and flutters gently across your desktop.
  - Awake bunnies notice the butterfly and enthusiastically chase after it! Sleeping bunnies remain undisturbed.
- **🏆 Non-Ending Progressive Trophies & Milestones**:
  - Trophies scale progressively up to **10,000 pets** (*Mythical Cuddler*), **5,000 feedings** (*Infinite Feeder*), and **Level 100** (*Eternal Fluff Legend*).
  - Unlock bonus coins, XP, and exclusive cosmetics like the Festive Christmas Den.
- **👕 Wardrobe & Clothes Grant XP**:
  - Purchasing accessories and cosmetics in the Shop awards bonus XP directly to your companion to speed up leveling.
  - Save and load up to 3 outfit presets with the Stylist Guru milestone.
- **Cozy Bunny AI & State Machine**:
  - Natural behavioral cycle: idle, walk, sit, groom face, hop, eat treats, and curl into a loaf to sleep.
  - Real-time hunger decay (relaxed ~60m, normal ~30m, fast ~15m).
  - Sleeps automatically during late night hours (system clock) or when ignored for long periods.
  - No permadeath or penalties: a hungry bunny simply walks slower, looks sad, and shows a thought bubble until fed.
- **Interactive Affection & Feeding**:
  - **Pet**: Click to pet (spawns hearts, boosts happiness, awards XP, plays chime).
  - **Drag & Drop**: Click and drag to pick up the bunny (dangling legs animation) or fling them across your screen.
  - **Double Click**: Double click to make the bunny perform an excited high hop!
- **Multi-Bunny Family (Unlock Every 10 Levels)**:
  - Reach Level 10, 20, 30, and beyond to adopt companion bunnies for your desktop!
  - Adopt new bunny friends directly from the food drawer menu with custom names, distinct fur coats, ear shapes, and eye colors.
  - Each bunny independently wanders, hops, naps, and eats treats, and can be customized separately in the Closet.
- **Sky Food Drops & Multi-Crop Harvesting**:
  - Drop carrots, lettuce, apple slices, four-leaf clovers, and strawberries from the food drawer or tray.
  - Treats tumble gracefully from above the screen down to the taskbar with gravity physics, bounce effects, and crumb landing puffs.
  - Homegrown patch on the taskbar grows different crops depending on active terrain (carrots, strawberries, cabbage, apples, clovers) for bonus coins, crops, and XP!
  - Passive income: earn free carrots periodically just by keeping the app open.
- **Deep Wardrobe & Layered Cosmetics**:
  - Live animated 32x32 wardrobe preview with 4x scaling.
  - Customize fur coat, ear styles (Upright, Floppy, Derpy), eye colors, and cheek blush.
  - Layered accessory slots: **Headwear**, **Face**, **Neck**, **Back**, and **Held Items** with live icon preview of your bunny wearing each item.
- **Offline Progress**:
  - Accurately tracks elapsed time while closed. Crops finish growing, hunger is gently adjusted (with a safety cap so it's never punitive), and daily login streak rewards are granted.
- **Multi-Monitor & System Tray**:
  - Choose which monitor the bunny lives on in settings.
  - System tray menu with quick Show/Hide, Wardrobe, Settings, and Feed Carrot shortcuts.
  - Toggle "Start with Windows" in settings.
  - "Do Not Disturb" mode to keep the bunny still and quiet.
- **Convenient Exit & Closing Options**:
  - Easily exit the game anytime without Task Manager: click **`✕ Exit`** in the floating food drawer, click **`Quit Game 🚪`** in Settings ⚙️, or right-click the system tray icon and select **Quit**.
- **Expanded Roaming Area & Movable Menu**:
  - Full display transparent click-through overlay. Move the bunny around anywhere across your screen, and customize roaming height in Settings (Taskbar line, Cozy 220px, Lower Desk 450px, or Full Screen free roam).
  - Flexible floor mode: keep the bunny attached to the taskbar, or enable "Free Perch" to let the bunny live and walk at whatever height you place it!
  - The inventory pill and food drawer menu are fully draggable—click and drag the bag button or drawer card anywhere on screen, and your chosen position is automatically remembered.
- **Lightweight & Web Audio**:
  - Pure vanilla JavaScript and HTML Canvas.
  - Low resource footprint with adaptive idle frame throttling.
  - Procedural sound effects generated on-the-fly via the Web Audio API (crunch, hop, pet, fanfare, chime).

---

## 🎮 How to Play / Download

### For Players (Download Executable)
1. Go to the [Releases](https://github.com/CpzXD/TaskBar-Bunny/releases) page on GitHub.
2. Download the standalone executable: **[Taskbar-Bunny-Portable.exe](https://github.com/CpzXD/TaskBar-Bunny/releases/latest/download/Taskbar-Bunny-Portable.exe)** from the [Latest Release](https://github.com/CpzXD/TaskBar-Bunny/releases/latest).
3. Run it and Barnaby will immediately appear sitting on your taskbar!

### 🛡️ Windows SmartScreen / Security Note
Because **Taskbar Bunny** is a free indie open-source project and not code-signed with an expensive corporate enterprise certificate ($400+/year), Windows SmartScreen may show a prompt on first launch:
> *"Windows protected your PC — Microsoft Defender SmartScreen prevented an unrecognized app from starting."*

**How to open:**
1. Click **"More info"** on the popup.
2. Click **"Run anyway"**.

> **Note**: Taskbar Bunny is open-source, runs locally, makes no network calls (see `src/`), contains zero telemetry, and saves game data strictly on your local computer.

---

### 📂 File Locations & Where It Is Installed

| Component | Location on Windows | Description |
| :--- | :--- | :--- |
| **Portable Executable** | Wherever you download or place `Taskbar-Bunny-Portable.exe` (e.g. `Downloads`, `Desktop`, or your tools folder) | **No installation required**. Runs directly as a standalone binary with zero registry clutter. |
| **Windows Installer** | `%LOCALAPPDATA%\Programs\taskbar-bunny` (`C:\Users\<YourUsername>\AppData\Local\Programs\taskbar-bunny`) | If using the setup installer (`.exe`), this is the default user-level install directory (can be customized during setup). |
| **Save Data & Settings** | `%APPDATA%\taskbar-bunny\taskbar-bunny-save.json` (`C:\Users\<YourUsername>\AppData\Roaming\taskbar-bunny\taskbar-bunny-save.json`) | All game progress (coins, wardrobe, hunger, garden, achievements, and settings) is stored locally in plain JSON. |

#### 🔄 Backups & Uninstallation
- **Backing up saves**: Copy `%APPDATA%\taskbar-bunny\taskbar-bunny-save.json` to keep a backup of your bunny's wardrobe, coins, and levels.
- **Resetting save data**: Click **"Reset Save Data"** in Setup ⚙️ or delete the `taskbar-bunny-save.json` file.
- **Uninstalling**:
  - *Portable*: Simply delete `Taskbar-Bunny-Portable.exe` (and optionally `%APPDATA%\taskbar-bunny`).
  - *Installer*: Uninstall through Windows **Settings > Apps > Installed apps**, or run `Uninstall Taskbar Bunny.exe` in `%LOCALAPPDATA%\Programs\taskbar-bunny`.

---

### For Developers & Running from Source
```bash
# Clone the repository
git clone https://github.com/CpzXD/TaskBar-Bunny.git
cd TaskBar-Bunny

# Install dependencies
npm install

# Start the game (runs build and launches Electron)
npm start
```

### Packaging Windows .exe Releases
```bash
# Package portable .exe into the /dist folder
npm run build:portable

# Or package full Windows installer (.exe) into /dist
npm run build
```

---

## 🎨 How to Add New Customizations

All game definitions are located in clean, modular files:

### 1. Adding a New Food
1. Open `src/shared/constants.js`:
   Add your food entry to `FOODS`:
   ```javascript
   watermelon: {
     id: 'watermelon',
     name: 'Juicy Watermelon',
     hungerRestore: 50,
     happinessBonus: 25,
     cost: 35,
     color: '#22c55e',
     description: 'Cool and sweet summer treat!'
   }
   ```
2. Open `src/renderer/sprites/itemSprites.js`:
   Add a case to `ItemSprites.drawFood(ctx, foodId, x, y)` drawing the 16x16 pixel sprite.
3. Open `src/renderer/ui/hud.js`:
   Add `'watermelon'` to `this.foodKeys`.
4. Run `npm run build:renderer` (or `npm start`).

### 2. Adding a New Hat or Accessory
1. Open `src/shared/constants.js`:
   Add your item to `ACCESSORIES.head`, `face`, `neck`, `back`, or `held`:
   ```javascript
   { id: 'chef_hat', name: 'Chef Toque', tier: 'rare', price: 75 }
   ```
2. Open `src/renderer/sprites/accessories.js`:
   Add the drawing logic inside `AccessoryRenderer.renderAccessories`:
   ```javascript
   case 'chef_hat':
     rect(hx - 4, hy - 8, 8, 8, '#ffffff');
     rect(hx - 5, hy - 2, 10, 2, '#e2e8f0');
     break;
   ```
   *(All coordinates automatically inherit `hx`, `hy`, `direction`, and bobbing offsets!)*
3. Run `npm run build:renderer`.

### 3. Adding a New Fur Palette
1. Open `src/renderer/sprites/palette.js`:
   Add a new fur palette under `PALETTES.fur`:
   ```javascript
   lavender: {
     outline: '#2e1065',
     base: '#e9d5ff',
     shadow: '#c084fc',
     highlight: '#f3e8ff',
     innerEar: '#f472b6',
     innerEarShadow: '#db2777',
     nose: '#9333ea'
   }
   ```
2. Open `src/shared/constants.js`:
   Add `lavender: { id: 'lavender', name: 'Pastel Lavender', base: '#e9d5ff' }` to `FUR_COLORS`.

---

## 🛠️ Project Architecture

```
taskbar-bunny/
├── package.json
├── build.js                     # Bundles renderer scripts with esbuild
├── assets/
│   ├── icon.png                 # Bunny application icon
│   └── tray-icon.png            # 16x16 pixel system tray icon
└── src/
    ├── main/
    │   ├── main.js              # Single-instance lock, lifecycle, IPC routes
    │   ├── windowManager.js     # Transparent overlay, multi-monitor bounds calculation
    │   ├── trayManager.js       # System tray icon and context menu
    │   ├── storage.js           # JSON persistence in AppData with offline progress
    │   └── preload.js           # Secure contextBridge API
    ├── shared/
    │   └── constants.js         # Balance constants, catalogs, achievements, defaults
    └── renderer/
        ├── index.html           # Transparent overlay window HTML
        ├── styles.css           # Pixel-crisp canvas styles
        ├── app.js               # Renderer application coordinator
        ├── engine/
        │   ├── gameLoop.js      # 30 FPS loop with intelligent idle throttling
        │   ├── inputManager.js  # Hover hit-testing and click-through toggling
        │   └── soundEngine.js   # Zero-asset Web Audio procedural SFX synthesizer
        ├── bunny/
        │   ├── bunny.js         # Physics, dragging, state machine entity, particles
        │   ├── stateMachine.js  # Behavioral states: idle, walk, sit, groom, sleep, hop, eat
        │   └── needs.js         # Hunger decay, happiness, leveling, XP
        ├── sprites/
        │   ├── palette.js       # Fur palettes, eye colors, accents
        │   ├── bunnySprites.js  # 32x32 procedural multi-state sprite generator
        │   ├── accessories.js   # Layered cosmetic renderer with frame anchors
        │   └── itemSprites.js   # Food items, garden stages, thought bubbles
        ├── garden/
        │   └── garden.js        # Carrot garden patch simulation and harvest
        └── ui/
            ├── hud.js           # Docked basket, food drawer, notifications
            ├── wardrobe.html/js # Live 32x32 animated wardrobe modal with presets
            └── settings.html/js # Monitor selection, scale, hunger speed, autostart
```

---

## 💾 Save Data Location

All game progress, statistics, inventory, and customizations are stored locally as clean JSON:
```
%APPDATA%\taskbar-bunny\taskbar-bunny-save.json
```
To reset your data at any time, open Settings and click **Reset All**, or delete the file above.

---

## 👤 Credits & Authors
- **Lead Developer**: **[CpzXD](https://github.com/CpzXD)**
- **Game Designer / Tester**: **Qnoxs**

---

## 📄 License
MIT License. Crafted for cozy desktop companionship.

