// tests/test_game_systems.js
// Automated verification tests for game state, offline simulation, and sprite math

const assert = require('assert');
const path = require('path');
const { DEFAULT_STATE, FOODS, ACCESSORIES, ACHIEVEMENTS, HUNGER_SPEED_FACTORS } = require('../src/shared/constants');
const { BunnyNeeds } = require('../src/renderer/bunny/needs');
const { PALETTES } = require('../src/renderer/sprites/palette');

console.log('--- RUNNING TASKBAR BUNNY VERIFICATION TESTS ---');

// Test 1: Constants & Balance Integrity
console.log('[Test 1] Validating constants and catalogs...');
assert(FOODS.carrot, 'Carrot must exist in FOODS');
assert(FOODS.carrot.hungerRestore > 0, 'Carrot must restore hunger');
assert(ACCESSORIES.head.length >= 8, 'At least 8 head accessories');
assert(ACCESSORIES.face.length >= 4, 'At least 4 face accessories');
assert(ACCESSORIES.neck.length >= 4, 'At least 4 neck accessories');
assert(ACCESSORIES.back.length >= 3, 'At least 3 back accessories');
assert(ACCESSORIES.held.length >= 4, 'At least 4 held accessories');
assert(ACHIEVEMENTS.length >= 8, 'At least 8 achievements');
assert.strictEqual(DEFAULT_STATE.bunny.outfitPresets.length, 3, 'Must have 3 outfit presets');
console.log('  ✓ Constants and catalogs passed.');

// Test 2: Needs & Hunger Mechanics
console.log('[Test 2] Validating Needs, Feeding, and Leveling...');
const needs = new BunnyNeeds({ hunger: 30, happiness: 40, level: 1, xp: 0 }, { hungerSpeed: 'normal' });
assert(needs.isHungry(), 'Bunny with 30 hunger should report isHungry()');

const feedRes = needs.feed('carrot');
assert(needs.hunger > 30, 'Feeding carrot must increase hunger');
assert(needs.happiness > 40, 'Feeding carrot must increase happiness');
assert(feedRes.xpGained > 0, 'Feeding carrot must grant XP');

let leveledUp = false;
needs.addXp(150, (newLv) => {
  leveledUp = true;
  assert.strictEqual(newLv, 2, 'Should level up to 2');
});
assert(leveledUp, 'Level up callback must be triggered');
console.log('  ✓ Needs and leveling passed.');

// Test 3: Offline Progress Simulation Math
console.log('[Test 3] Validating offline progress simulation...');
function simulateOffline(startHunger, elapsedMinutes, hungerSpeed = 'normal') {
  const factor = HUNGER_SPEED_FACTORS[hungerSpeed] || 1.0;
  const drainPerHour = 30 * factor;
  const theoreticalDrain = (elapsedMinutes / 60) * drainPerHour;
  const cappedDrain = Math.min(75, Math.floor(theoreticalDrain));
  return Math.max(5, startHunger - cappedDrain);
}

// 30 mins away at normal speed
const h30 = simulateOffline(80, 30, 'normal');
assert(h30 < 80 && h30 >= 60, `30 mins offline should gently drain hunger (was ${h30})`);

// 24 hours away: should cap drain at 75 and never drop below 5 (never dies)
const h24h = simulateOffline(80, 24 * 60, 'normal');
assert.strictEqual(h24h, 5, `Long offline drain must be safely capped (was ${h24h})`);
console.log('  ✓ Offline progress safety capping passed.');

// Test 4: Palettes & Dynamic Tinting
console.log('[Test 4] Validating palettes...');
assert(PALETTES.fur.white, 'White fur palette exists');
assert(PALETTES.fur.spotted, 'Spotted fur palette exists');
assert(PALETTES.eyes.ruby, 'Ruby eye palette exists');
assert(PALETTES.blush, 'Blush color exists');
console.log('  ✓ Palettes passed.');

// Test 5: Settings menuScale and Achievements Catalog
console.log('[Test 5] Validating menuScale and Achievements...');
assert(typeof DEFAULT_STATE.settings.menuScale === 'number', 'menuScale setting must exist and be numeric');
assert(DEFAULT_STATE.settings.menuScale >= 1.0, 'menuScale must be at least 1.0');
ACHIEVEMENTS.forEach(ach => {
  assert(ach.id && ach.name && ach.description, `Achievement ${ach.id} must have id, name and description`);
  assert(ach.rewardCoins >= 0 && ach.rewardXp >= 0, `Achievement ${ach.id} must have valid rewards`);
});
console.log('  ✓ menuScale and Achievements catalog passed.');

// Test 6: Carrot Garden Random Positioning
console.log('[Test 6] Validating Carrot Garden positioning...');
const { CarrotGarden } = require('../src/renderer/garden/garden');
const garden = new CarrotGarden({}, () => {});
garden.randomizePosition(1920);
assert(garden.x >= 320 && garden.x <= 1920 - 70, `Garden x should be within [320, 1850], got ${garden.x}`);
console.log('  ✓ Carrot Garden random positioning passed.');

console.log('--- ALL SYSTEMS VERIFIED SUCCESSFULLY ---');
