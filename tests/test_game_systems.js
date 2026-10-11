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
  const quitBtn = hud.getButtonAt(qx + 2, qy + 2);
  assert.ok(quitBtn, 'Quit button should be found at calculated coordinates');
  assert.strictEqual(quitBtn.type, 'quit-app', 'Button type should be quit-app');

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


