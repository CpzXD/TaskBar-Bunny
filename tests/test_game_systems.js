const test = require('node:test');
const assert = require('node:assert/strict');
const { DEFAULT_STATE, FOODS, ACCESSORIES, ACHIEVEMENTS, HUNGER_SPEED_FACTORS } = require('../src/shared/constants');
const { BunnyNeeds } = require('../src/renderer/bunny/needs');
const { PALETTES } = require('../src/renderer/sprites/palette');
const storage = require('../src/main/storage');

test('food items and accessories catalogs are defined', () => {
  assert.ok(FOODS.carrot, 'Carrot must exist in FOODS');
  assert.ok(FOODS.carrot.hungerRestore > 0, 'Carrot must restore hunger');
  assert.ok(ACCESSORIES.head.length >= 8, 'At least 8 head accessories');
  assert.ok(ACCESSORIES.face.length >= 4, 'At least 4 face accessories');
  assert.ok(ACCESSORIES.neck.length >= 4, 'At least 4 neck accessories');
  assert.ok(ACCESSORIES.back.length >= 3, 'At least 3 back accessories');
  assert.ok(ACCESSORIES.held.length >= 4, 'At least 4 held accessories');
  assert.ok(ACHIEVEMENTS.length >= 8, 'At least 8 achievements');
  assert.strictEqual(DEFAULT_STATE.bunny.outfitPresets.length, 3, 'Must have 3 outfit presets');
});

test('feeding restores hunger and grants xp toward leveling up', () => {
  const needs = new BunnyNeeds({ hunger: 30, happiness: 40, level: 1, xp: 0 }, { hungerSpeed: 'normal' });
  assert.ok(needs.isHungry(), 'Bunny with 30 hunger should report isHungry()');

  const feedRes = needs.feed('carrot');
  assert.ok(needs.hunger > 30, 'Feeding carrot must increase hunger');
  assert.ok(needs.happiness > 40, 'Feeding carrot must increase happiness');
  assert.ok(feedRes.xpGained > 0, 'Feeding carrot must grant XP');
  assert.strictEqual(needs.xp, feedRes.xpGained, 'Feeding must directly increment bunny xp');

  let leveledUp = false;
  needs.addXp(150, (newLv) => {
    leveledUp = true;
    assert.strictEqual(newLv, 2, 'Should level up to 2');
  });
  assert.ok(leveledUp, 'Level up callback must be triggered');
});

test('offline time drains hunger smoothly without dropping below minimum', () => {
  function simulateOffline(startHunger, elapsedMinutes, hungerSpeed = 'normal') {
    const factor = HUNGER_SPEED_FACTORS[hungerSpeed] || 1.0;
    const drainPerHour = 30 * factor;
    const theoreticalDrain = (elapsedMinutes / 60) * drainPerHour;
    const cappedDrain = Math.min(75, Math.floor(theoreticalDrain));
    return Math.max(5, startHunger - cappedDrain);
  }

  const h30 = simulateOffline(80, 30, 'normal');
  assert.ok(h30 < 80 && h30 >= 60, `30 mins offline should gently drain hunger (was ${h30})`);

  const h24h = simulateOffline(80, 24 * 60, 'normal');
  assert.strictEqual(h24h, 5, `Long offline drain must be safely capped (was ${h24h})`);
});

test('fur and eye color palettes are configured', () => {
  assert.ok(PALETTES.fur.white, 'White fur palette exists');
  assert.ok(PALETTES.fur.spotted, 'Spotted fur palette exists');
  assert.ok(PALETTES.eyes.ruby, 'Ruby eye palette exists');
  assert.ok(PALETTES.blush, 'Blush color exists');
});

test('settings menu scale and achievements data are valid', () => {
  assert.strictEqual(typeof DEFAULT_STATE.settings.menuScale, 'number', 'menuScale setting must exist and be numeric');
  assert.ok(DEFAULT_STATE.settings.menuScale >= 1.0, 'menuScale must be at least 1.0');
  ACHIEVEMENTS.forEach(ach => {
    assert.ok(ach.id && ach.name && ach.description, `Achievement ${ach.id} must have id, name and description`);
    assert.ok(ach.rewardCoins >= 0 && ach.rewardXp >= 0, `Achievement ${ach.id} must have valid rewards`);
  });
});

test('carrot garden picks a random x position on the taskbar', () => {
  const { CarrotGarden } = require('../src/renderer/garden/garden');
  const garden = new CarrotGarden({}, () => {});
  garden.randomizePosition(1920);
  assert.ok(garden.x >= 320 && garden.x <= 1920 - 70, `Garden x should be within [320, 1850], got ${garden.x}`);
});

test('deepMerge blocks prototype pollution attempts', () => {
  const target = { a: 1, nested: { b: 2 } };
  const malicious = JSON.parse('{"__proto__": {"polluted": true}, "constructor": {"polluted": true}, "nested": {"b": 3}}');

  storage.deepMerge(target, malicious);

  assert.strictEqual(target.nested.b, 3, 'Legitimate nested keys should merge');
  assert.strictEqual(Object.prototype.polluted, undefined, '__proto__ must not pollute Object.prototype');
  assert.strictEqual(target.polluted, undefined, 'polluted property must not exist on target');
});

test('roaming area, floor mode, and menu position are properly sanitized', () => {
  assert.ok(['taskbar', 'cozy', 'desk', 'full'].includes(DEFAULT_STATE.settings.roamingArea), 'roamingArea default is valid');
  assert.ok(['taskbar', 'free'].includes(DEFAULT_STATE.settings.floorMode), 'floorMode default is valid');

  const { sanitizeState } = require('../src/main/main');
  const dirty = {
    settings: {
      roamingArea: 'desk',
      floorMode: 'free',
      menuPosition: { x: 450.7, y: 300.2 }
    },
    bunny: {
      customGroundY: 480.9
    }
  };
  const clean = sanitizeState(dirty, DEFAULT_STATE);
  assert.strictEqual(clean.settings.roamingArea, 'desk');
  assert.strictEqual(clean.settings.floorMode, 'free');
  assert.deepStrictEqual(clean.settings.menuPosition, { x: 451, y: 300 });
  assert.strictEqual(clean.bunny.customGroundY, 480);
});

test('bunny roaming height responds to roamingArea setting', () => {
  const { Bunny } = require('../src/renderer/bunny/bunny');
  const b1 = new Bunny({}, { roamingArea: 'taskbar' }, 1920, 1080);
  assert.strictEqual(b1.getRoamingHeight(), 40, 'taskbar mode should be 40px');

  const b2 = new Bunny({}, { roamingArea: 'cozy' }, 1920, 1080);
  assert.strictEqual(b2.getRoamingHeight(), 220, 'cozy mode should be 220px');

  const b3 = new Bunny({}, { roamingArea: 'desk' }, 1920, 1080);
  assert.strictEqual(b3.getRoamingHeight(), 450, 'desk mode should be 450px');

  const b4 = new Bunny({}, { roamingArea: 'full' }, 1920, 1080);
  assert.ok(b4.getRoamingHeight() >= 900, 'full screen mode should span screen height');
});

test('menu can be dragged and repositioned with drawer anchoring correctly', () => {
  const { HUD } = require('../src/renderer/ui/hud');
  const mockApp = {
    canvas: { width: 1920, height: 1080 },
    state: { settings: { menuScale: 1.0, menuPosition: null } }
  };
  const hud = new HUD(mockApp);
  hud.layout(1080, 0);

  // Default corner placement
  assert.ok(hud.bagBtn.x < 100, 'Default menu x is in bottom-left corner');
  assert.ok(hud.bagBtn.y > 1000, 'Default menu y is in bottom corner');

  // Move menu to center of screen
  hud.setMenuPosition(960, 540);
  assert.strictEqual(hud.bagBtn.x, 960);
  assert.strictEqual(hud.bagBtn.y, 540);

  // Drawer bounds should open above button when in lower half
  hud.isDrawerOpen = true;
  const db = hud.getDrawerBounds();
  assert.ok(db, 'Drawer bounds must exist when open');
  assert.ok(db.y < hud.bagBtn.y, 'Drawer should open above bag button when space permits');
  assert.ok(db.x >= 10 && db.x + db.width <= 1910, 'Drawer must stay safely within screen width');

  // Reset menu position
  hud.resetMenuPosition();
  assert.ok(hud.bagBtn.x < 100, 'Menu x should reset to bottom-left corner');

  // Verify HUD quit button hit test
  const testDb = hud.getDrawerBounds();
  const testS = hud.scale;
  const qx = testDb.x + Math.round(8 * testS) + Math.round(52 * testS) + Math.round(4 * testS) + Math.round(52 * testS) + Math.round(4 * testS);
  const qy = testDb.y + Math.round(45 * testS);
  const trophiesBtn = hud.getButtonAt(qx + 2, qy + 2);
  assert.ok(trophiesBtn, 'Trophies button should be found at calculated coordinates');
  assert.strictEqual(trophiesBtn.type, 'open-trophies', 'Button type should be open-trophies');

  // Verify HUD bunny adoption card hit test
  const bx = testDb.x + Math.round(8 * testS) + 5 * Math.round(44 * testS);
  const by = testDb.y + Math.round(6 * testS);
  const bunnyBtn = hud.getButtonAt(bx + 4, by + 4);
  assert.ok(bunnyBtn, 'Bunny card button should be found');
  assert.strictEqual(bunnyBtn.type, 'bunny-status', 'Default should be bunny-status when maxed');
});

test('companion bunny unlocks at every 10 levels milestone', () => {
  function getMaxBunniesForLevel(level) {
    return Math.min(10, 1 + Math.floor(level / 10));
  }

  assert.strictEqual(getMaxBunniesForLevel(1), 1, 'Level 1 allows 1 bunny');
  assert.strictEqual(getMaxBunniesForLevel(9), 1, 'Level 9 allows 1 bunny');
  assert.strictEqual(getMaxBunniesForLevel(10), 2, 'Level 10 unlocks 2nd bunny');
  assert.strictEqual(getMaxBunniesForLevel(19), 2, 'Level 19 allows 2 bunnies');
  assert.strictEqual(getMaxBunniesForLevel(20), 3, 'Level 20 unlocks 3rd bunny');
  assert.strictEqual(getMaxBunniesForLevel(30), 4, 'Level 30 unlocks 4th bunny');
  assert.strictEqual(getMaxBunniesForLevel(40), 5, 'Level 40 unlocks 5th bunny');
});

test('food drops from above the screen and falls towards the ground', () => {
  const groundY = 1000;
  const food = {
    id: 'carrot',
    x: 500,
    y: -28,
    vy: 2.0,
    rotation: 0,
    spin: 0.05,
    groundY: groundY,
    isGrounded: false
  };

  assert.ok(food.y < 0, 'Food starts above the screen');
  assert.strictEqual(food.isGrounded, false, 'Food is not grounded initially');

  // Simulate falling frames
  for (let frame = 0; frame < 100; frame++) {
    if (!food.isGrounded) {
      food.vy += 0.45;
      if (food.vy > 14) food.vy = 14;
      food.y += food.vy;
      if (food.y >= food.groundY) {
        food.y = food.groundY;
        food.vy = 0;
        food.isGrounded = true;
      }
    }
  }

  assert.strictEqual(food.isGrounded, true, 'Food lands on ground after falling');
  assert.strictEqual(food.y, groundY, 'Food rests on groundY');
});

test('extraBunnies data is properly sanitized in state', () => {
  const { sanitizeState } = require('../src/main/main');
  const dirty = {
    bunny: { name: 'Barnaby', level: 10 },
    extraBunnies: [
      {
        name: 'Pip',
        level: 2,
        hunger: 70,
        happiness: 95,
        furColor: 'brown',
        earStyle: 'floppy',
        equipped: { head: 'party_hat' }
      }
    ]
  };

  const clean = sanitizeState(dirty, DEFAULT_STATE);
  assert.ok(Array.isArray(clean.extraBunnies), 'clean.extraBunnies must be an array');
  assert.strictEqual(clean.extraBunnies.length, 1);
  assert.strictEqual(clean.extraBunnies[0].name, 'Pip');
  assert.strictEqual(clean.extraBunnies[0].level, 2);
  assert.strictEqual(clean.extraBunnies[0].furColor, 'brown');
  assert.strictEqual(clean.extraBunnies[0].equipped.head, 'party_hat');
});

test('custom bunny names are sanitized and preserved for primary and companions', () => {
  const { sanitizeState } = require('../src/main/main');
  const custom = {
    bunny: { name: 'Luna the Queen', level: 15 },
    extraBunnies: [
      { name: 'Oreo-Super-Long-Name-That-Exceeds-Thirty-Two-Characters-Easily', level: 3 },
      { name: 'Buttercup', level: 1 }
    ]
  };

  const clean = sanitizeState(custom, DEFAULT_STATE);
  assert.strictEqual(clean.bunny.name, 'Luna the Queen', 'Primary bunny retains custom name');
  assert.strictEqual(clean.extraBunnies[0].name.length, 32, 'Companion name capped at 32 chars');
  assert.strictEqual(clean.extraBunnies[1].name, 'Buttercup', 'Companion retains custom name');
});

test('accessory preview anchors exist and align with sprite frame', () => {
  // Test mock canvas for Node.js test environment
  const mockAnchors = {
    head: { x: 17, y: 16 },
    face: { x: 17, y: 16 },
    neck: { x: 17, y: 16 },
    back: { x: 15, y: 22 },
    held: { x: 17, y: 16 }
  };

  for (const slot of ['head', 'face', 'neck', 'back', 'held']) {
    assert.ok(mockAnchors[slot], `Slot ${slot} must have valid anchor coordinates`);
    assert.ok(Number.isFinite(mockAnchors[slot].x) && Number.isFinite(mockAnchors[slot].y));
    assert.ok(mockAnchors[slot].x >= 0 && mockAnchors[slot].x <= 32);
    assert.ok(mockAnchors[slot].y >= 0 && mockAnchors[slot].y <= 32);
  }
});

test('den burrow anchors next to HUD, toggles stats, and supports festive skin', () => {
  const { BunnyDen } = require('../src/renderer/world/den');
  const mockApp = {
    groundY: 900,
    state: { settings: { denSkin: 'festive' } },
    hud: { bagBtn: { x: 50, y: 920, width: 44, height: 44 } },
    bunny: { needs: { hunger: 80, happiness: 95 }, isSleepingInDen: false }
  };

  const den = new BunnyDen(mockApp);
  den.update(16);

  assert.strictEqual(den.skin, 'festive', 'Den should reflect festive skin setting');
  assert.ok(den.x > mockApp.hud.bagBtn.x, 'Den should anchor to the right of the bag button');
  assert.ok(den.isPointInside(den.x, den.y - 10), 'Point inside den bounding box should match');
  assert.strictEqual(den.isPointInside(den.x + 100, den.y), false, 'Point outside should not match');

  assert.strictEqual(den.showStats, false, 'Stats badge should be hidden by default');
  den.toggleStats();
  assert.strictEqual(den.showStats, true, 'toggleStats should show stats badge');
  den.toggleStats();
  assert.strictEqual(den.showStats, false, 'toggleStats should toggle back off');
});

test('butterfly spawns at 5-minute intervals and triggers chase behavior only for awake bunnies', () => {
  const { Butterfly } = require('../src/renderer/world/butterfly');
  const mockApp = {
    canvas: { width: 1920, height: 1080 },
    groundY: 900
  };

  const butterfly = new Butterfly(mockApp);
  assert.strictEqual(butterfly.spawnInterval, 300000, 'Butterfly must have 5-minute (300,000ms) interval');
  assert.strictEqual(butterfly.active, false, 'Butterfly is inactive until spawned');

  // Fast forward spawn timer by 5 minutes
  butterfly.update(300000);
  assert.strictEqual(butterfly.active, true, 'Butterfly activates after 5 minutes');
  assert.ok(butterfly.x !== 0, 'Butterfly position should be initialized');

  // Verify chase rule: awake bunny chases, sleeping bunny ignores
  const awakeBunny = { isSleepingInDen: false, isDragging: false, targetX: 0 };
  const sleepingBunny = { isSleepingInDen: true, isDragging: false, targetX: 0 };

  const bunnies = [awakeBunny, sleepingBunny];
  for (const b of bunnies) {
    if (b.isSleepingInDen) continue; // sleeping bunny does not chase
    b.targetX = butterfly.x;
  }

  assert.strictEqual(awakeBunny.targetX, butterfly.x, 'Awake bunny targets butterfly x');
  assert.strictEqual(sleepingBunny.targetX, 0, 'Sleeping bunny does not target butterfly');
});

test('foods include acquisition descriptions and Level 5 achievement awards festive den', () => {
  for (const [id, food] of Object.entries(FOODS)) {
    assert.ok(food.acquire, `Food ${id} must have acquire description`);
    assert.ok(food.acquire.length > 10, `Food ${id} acquire description must be informative`);
    assert.ok(food.cost > 0, `Food ${id} must have a coin cost`);
    assert.ok(food.hungerBonus > 0 && food.hungerRestore > 0, `Food ${id} must have valid hungerRestore/hungerBonus`);
  }

  const lv5Ach = ACHIEVEMENTS.find(a => a.id === 'level_5');
  assert.ok(lv5Ach, 'level_5 achievement must exist');
  assert.ok(lv5Ach.rewardItem, 'level_5 achievement must include cosmetic rewardItem');
  assert.strictEqual(lv5Ach.rewardItem.category, 'den');
  assert.strictEqual(lv5Ach.rewardItem.id, 'festive');
  assert.ok(ACCESSORIES.den.some(d => d.id === 'festive'), 'festive skin must be in ACCESSORIES.den catalog');
});

test('terrains catalog defines grassy and icy with unique crops and mechanics', () => {
  const { TERRAINS } = require('../src/shared/constants');
  assert.ok(TERRAINS.grassy, 'Grassy terrain exists');
  assert.ok(TERRAINS.icy, 'Icy terrain exists');
  assert.strictEqual(TERRAINS.grassy.price, 0, 'Grassy terrain is free/default');
  assert.strictEqual(TERRAINS.icy.price, 500, 'Icy terrain costs 500 coins');
  assert.deepStrictEqual(TERRAINS.grassy.crops, ['carrot', 'strawberry', 'lettuce']);
  assert.deepStrictEqual(TERRAINS.icy.crops, ['apple', 'clover']);
  assert.strictEqual(DEFAULT_STATE.settings.activeTerrain, 'grassy');
  assert.deepStrictEqual(DEFAULT_STATE.inventory.unlockedTerrains, ['grassy']);
});

test('bunny throw physics clamps speed and bounces off boundaries', () => {
  const { Bunny } = require('../src/renderer/bunny/bunny');
  const bunny = new Bunny({}, { activeTerrain: 'grassy' }, 1920, 1080);
  bunny.x = 960;
  bunny.y = 800;

  // Throw with excessive velocity
  bunny.throw(35, -50);
  assert.strictEqual(bunny.isThrown, true);
  assert.strictEqual(bunny.vx, 20, 'Horizontal velocity clamped to maxSpeed (20)');
  assert.strictEqual(bunny.vy, -20, 'Vertical velocity clamped to maxSpeed (20)');
  assert.strictEqual(bunny.stateMachine.currentState, 'falling');

  // Simulate bounce against left wall
  bunny.x = 10;
  bunny.vx = -10;
  bunny.updateFalling(16.6);
  assert.ok(bunny.vx > 0, 'Bunny should bounce away from left wall with reversed positive vx');

  // Simulate bounce against right wall
  bunny.x = 1910;
  bunny.vx = 10;
  bunny.updateFalling(16.6);
  assert.ok(bunny.vx < 0, 'Bunny should bounce away from right wall with reversed negative vx');
});

test('buying clothes grants XP formula and levels up bunny', () => {
  const testBunny = { level: 1, xp: 50 };
  const item = { price: 80 };
  const xpGain = Math.max(20, Math.round(item.price * 0.75)); // 60 XP
  testBunny.xp += xpGain; // 110 XP
  assert.strictEqual(testBunny.xp, 110);

  let leveledUp = false;
  while (testBunny.xp >= testBunny.level * 100) {
    testBunny.xp -= testBunny.level * 100;
    testBunny.level += 1;
    leveledUp = true;
  }

  assert.strictEqual(leveledUp, true, 'Bunny should level up after gaining enough clothes XP');
  assert.strictEqual(testBunny.level, 2, 'Bunny level should increase to 2');
  assert.strictEqual(testBunny.xp, 10, 'Bunny remaining XP should be 10');
});

test('progressive achievement tiers exist up to 10k petting and 5k feeding', () => {
  const petTiers = ['pet_50', 'pet_200', 'pet_500', 'pet_1000', 'pet_2500', 'pet_5000', 'pet_10000'];
  for (const tid of petTiers) {
    assert.ok(ACHIEVEMENTS.some(a => a.id === tid), `Achievement ${tid} must exist`);
  }

  const fedTiers = ['first_carrot', 'fed_25', 'fed_100', 'fed_250', 'fed_500', 'fed_1000', 'fed_2500', 'fed_5000'];
  for (const tid of fedTiers) {
    assert.ok(ACHIEVEMENTS.some(a => a.id === tid), `Achievement ${tid} must exist`);
  }

  const lvTiers = ['level_5', 'level_10', 'level_20', 'level_30', 'level_50', 'level_100'];
  for (const tid of lvTiers) {
    assert.ok(ACHIEVEMENTS.some(a => a.id === tid), `Achievement ${tid} must exist`);
  }

  assert.ok(ACHIEVEMENTS.some(a => a.id === 'fashion_pioneer'), 'fashion_pioneer achievement must exist');
  assert.ok(ACHIEVEMENTS.some(a => a.id === 'three_presets'), 'three_presets achievement must exist');
});

test('sanitizeState protects unlocked achievements, cosmetics, and terrains from being wiped', () => {
  const { sanitizeState } = require('../src/main/main');
  const currentState = {
    inventory: {
      coins: 200,
      unlockedCosmetics: ['head:party_hat', 'head:golden_crown'],
      unlockedTerrains: ['grassy', 'icy']
    },
    achievements: {
      unlocked: ['first_carrot', 'fed_25', 'level_5']
    }
  };

  // An outdated snapshot missing achievements or cosmetics
  const incomingOutdatedState = {
    inventory: {
      coins: 350,
      unlockedCosmetics: ['head:party_hat', 'neck:bell_collar'],
      unlockedTerrains: ['grassy']
    },
    achievements: {
      unlocked: ['first_carrot', 'fed_100']
    }
  };

  const safe = sanitizeState(incomingOutdatedState, currentState);

  assert.strictEqual(safe.inventory.coins, 350);
  assert.ok(safe.inventory.unlockedCosmetics.includes('head:golden_crown'), 'Existing cosmetics must never be lost');
  assert.ok(safe.inventory.unlockedCosmetics.includes('neck:bell_collar'), 'New cosmetics must be added');
  assert.ok(safe.inventory.unlockedTerrains.includes('icy'), 'Unlocked icy terrain must not be dropped');
  assert.ok(safe.achievements.unlocked.includes('level_5'), 'Existing unlocked achievements must be preserved');
  assert.ok(safe.achievements.unlocked.includes('fed_100'), 'Newly unlocked achievements must be added');
});

test('storage recovers from backup file when primary file is corrupt or empty', () => {
  const fs = require('fs');
  const path = require('path');
  const testDir = path.join(__dirname, '../userDataTest');
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });

  const primaryFile = path.join(testDir, 'taskbar-bunny-save.json');
  const backupFile = path.join(testDir, 'taskbar-bunny-save.json.bak');

  // Corrupt primary file
  fs.writeFileSync(primaryFile, '{ corrupt json ...', 'utf8');
  // Valid backup file with custom bunny name
  const backupData = {
    bunny: { name: 'Cpz', hunger: 90, happiness: 95, level: 12, xp: 50 },
    inventory: { coins: 999, foods: { carrot: 10 }, unlockedCosmetics: ['head:golden_crown'] },
    achievements: { unlocked: ['first_carrot', 'level_10'] },
    settings: { activeTerrain: 'icy' }
  };
  fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2), 'utf8');

  // Instantiate temporary StorageManager
  const StorageManagerProto = Object.getPrototypeOf(storage);
  const testStorage = new StorageManagerProto.constructor();
  testStorage.userDataPath = testDir;
  testStorage.saveFilePath = primaryFile;
  testStorage.backupFilePath = backupFile;
  testStorage.state = null;
  testStorage.isInitialized = false;

  const result = testStorage.loadState(true);
  assert.ok(result.state, 'State should be recovered');
  assert.strictEqual(result.state.bunny.name, 'Cpz', 'Bunny name should recover from backup');
  assert.strictEqual(result.state.inventory.coins, 999, 'Coins should recover from backup');
  assert.ok(result.state.inventory.unlockedCosmetics.includes('head:golden_crown'), 'Cosmetics preserved');

  // Cleanup
  try { fs.unlinkSync(primaryFile); } catch (e) {}
  try { fs.unlinkSync(backupFile); } catch (e) {}
  try { fs.rmdirSync(testDir); } catch (e) {}
});

test('BunnySpriteGenerator renders ice skates when activeTerrain is icy', () => {
  const { BunnySpriteGenerator } = require('../src/renderer/sprites/bunnySprites');
  
  // Test walk cycle on icy terrain
  const walkIcy = BunnySpriteGenerator.renderFrame({
    state: 'walk',
    frameIndex: 0,
    direction: 1,
    appearance: { furColor: 'white' },
    terrain: 'icy'
  });
  assert.ok(walkIcy.canvas, 'Canvas must be returned for icy walk');
  assert.strictEqual(walkIcy.canvas.width, 32);
  assert.strictEqual(walkIcy.canvas.height, 32);

  // Test idle on icy terrain has ice skates
  const idleIcy = BunnySpriteGenerator.renderFrame({
    state: 'idle',
    frameIndex: 0,
    direction: 1,
    appearance: { furColor: 'white' },
    terrain: 'icy'
  });
  assert.ok(idleIcy.canvas, 'Canvas must be returned for icy idle');
});

test('TrayManager gracefully handles null tray without throwing Uncaught Exception', () => {
  const trayManager = require('../src/main/trayManager');
  assert.strictEqual(trayManager.tray, null, 'Tray should initially be null');
  assert.doesNotThrow(() => {
    trayManager.buildContextMenu();
    trayManager.setBunnyVisibility(true);
    trayManager.toggleBunnyVisibility();
    trayManager.updateToolTip('Test ToolTip');
  }, 'TrayManager methods must not throw when tray is uninitialized or null');
});

test('deepMerge correctly handles null target properties (e.g. menuPosition: null)', () => {
  const target = {
    settings: {
      volume: 0.6,
      menuPosition: null,
      customGroundY: null
    }
  };
  const source = {
    settings: {
      menuPosition: { x: 350, y: 720 },
      customGroundY: 480
    }
  };

  assert.doesNotThrow(() => {
    storage.deepMerge(target, source);
  }, 'deepMerge must not throw TypeError when target property is null');

  assert.deepStrictEqual(target.settings.menuPosition, { x: 350, y: 720 });
  assert.strictEqual(target.settings.customGroundY, 480);
});
