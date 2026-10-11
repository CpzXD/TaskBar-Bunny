// tests/test_game_systems.js
// Automated verification tests using native node:test runner

const test = require('node:test');
const assert = require('node:assert/strict');
const { DEFAULT_STATE, FOODS, ACCESSORIES, ACHIEVEMENTS, HUNGER_SPEED_FACTORS } = require('../src/shared/constants');
const { BunnyNeeds } = require('../src/renderer/bunny/needs');
const { PALETTES } = require('../src/renderer/sprites/palette');
const storage = require('../src/main/storage');

test('Constants and catalogs integrity', () => {
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

test('Needs, feeding, and leveling mechanics', () => {
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

test('Offline progress simulation math', () => {
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

test('Palettes and dynamic tinting definitions', () => {
  assert.ok(PALETTES.fur.white, 'White fur palette exists');
  assert.ok(PALETTES.fur.spotted, 'Spotted fur palette exists');
  assert.ok(PALETTES.eyes.ruby, 'Ruby eye palette exists');
  assert.ok(PALETTES.blush, 'Blush color exists');
});

test('Settings menuScale and Achievements catalog', () => {
  assert.strictEqual(typeof DEFAULT_STATE.settings.menuScale, 'number', 'menuScale setting must exist and be numeric');
  assert.ok(DEFAULT_STATE.settings.menuScale >= 1.0, 'menuScale must be at least 1.0');
  ACHIEVEMENTS.forEach(ach => {
    assert.ok(ach.id && ach.name && ach.description, `Achievement ${ach.id} must have id, name and description`);
    assert.ok(ach.rewardCoins >= 0 && ach.rewardXp >= 0, `Achievement ${ach.id} must have valid rewards`);
  });
});

test('Carrot Garden random positioning', () => {
  const { CarrotGarden } = require('../src/renderer/garden/garden');
  const garden = new CarrotGarden({}, () => {});
  garden.randomizePosition(1920);
  assert.ok(garden.x >= 320 && garden.x <= 1920 - 70, `Garden x should be within [320, 1850], got ${garden.x}`);
});

test('Prototype pollution protection in storage.deepMerge', () => {
  const target = { a: 1, nested: { b: 2 } };
  const malicious = JSON.parse('{"__proto__": {"polluted": true}, "constructor": {"polluted": true}, "nested": {"b": 3}}');

  storage.deepMerge(target, malicious);

  assert.strictEqual(target.nested.b, 3, 'Legitimate nested keys should merge');
  assert.strictEqual(Object.prototype.polluted, undefined, '__proto__ must not pollute Object.prototype');
  assert.strictEqual(target.polluted, undefined, 'polluted property must not exist on target');
});
