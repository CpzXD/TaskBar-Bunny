// src/renderer/app.js
// Main renderer application coordinator: connects Bunny, HUD, Garden, Loop, and IPC

const { Bunny } = require('./bunny/bunny');
const { CarrotGarden } = require('./garden/garden');
const { HUD } = require('./ui/hud');
const { InputManager } = require('./engine/inputManager');
const { GameLoop } = require('./engine/gameLoop');
const { soundEngine } = require('./engine/soundEngine');
const { ItemSprites } = require('./sprites/itemSprites');
const { ACHIEVEMENTS, FOODS } = require('../shared/constants');

class TaskbarBunnyApp {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.state = null;
    this.bunny = null;
    this.garden = null;
    this.hud = null;
    this.input = null;
    this.loop = null;

    // Dropped food items in world
    this.worldFoods = [];

    // Pixels at the bottom of the canvas hidden under the taskbar (set by the main process)
    this.taskbarOverlap = 0;

    // Cute random events (butterfly, coin find, sneeze)
    this.butterfly = null; // { x, y, vx, vy, life }
    this.randomEventTimer = 0;

    // Auto-save timer
    this.autoSaveTimer = 0;

    this.init();
  }

  // Y coordinate of the floor: just above the taskbar, whatever its height
  get groundY() {
    return this.canvas.height - this.taskbarOverlap - 12;
  }

  async init() {
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    // Ask the main process how much of the canvas the taskbar covers, and keep it updated
    try {
      const layout = await window.api.getLayout();
      this.taskbarOverlap = (layout && layout.taskbarOverlap) || 0;
    } catch (err) {
      console.error('[Renderer] Could not read taskbar layout:', err);
    }
    window.api.onLayoutUpdate((layout) => {
      this.taskbarOverlap = (layout && layout.taskbarOverlap) || 0;
      this.applyLayout();
    });

    // 1. Load initial game state via IPC
    const { state, offlineSummary } = await window.api.loadState();
    this.state = state;

    // 2. Sound setup
    if (this.state.settings) {
      soundEngine.setVolume(this.state.settings.volume ?? 0.6);
      soundEngine.setMuted(Boolean(this.state.settings.isMuted));
    }

    // 3. Create entities
    this.bunny = new Bunny(
      this.state.bunny,
      this.state.settings,
      this.canvas.width,
      this.canvas.height
    );

    this.bunny.onFoodEaten = (eatenFood) => {
      this.removeWorldFood(eatenFood);
      this.checkAchievements();
      this.saveState();
    };

    this.garden = new CarrotGarden(this.state.garden, (reward) => {
      this.inventory.foods.carrot = (this.inventory.foods.carrot || 0) + reward.carrots;
      this.inventory.coins = (this.inventory.coins || 0) + reward.coins;
      this.bunny.needs.addXp(reward.xp, (newLv) => this.onLevelUp(newLv));
      this.hud.showNotification(`+${reward.carrots} Carrots harvested!`, `+${reward.coins} Coins`, 3500, '🥕');
      this.checkAchievements();
      this.saveState();
    });

    this.hud = new HUD(this);
    this.input = new InputManager(this);
    this.applyLayout();

    console.log('[Renderer] App initialized successfully. Canvas:', this.canvas.width, 'x', this.canvas.height);

    // 4. Listen for offline summary
    if (offlineSummary) {
      this.handleOfflineSummary(offlineSummary);
    }
    window.api.onOfflineSummary((summary) => this.handleOfflineSummary(summary));

    // 5. Listen for state updates from companion windows
    window.api.onStateUpdate((updatedState) => {
      this.syncState(updatedState);
    });

    // 6. Listen for tray actions
    window.api.onTrayAction((action) => {
      if (action === 'feed-carrot') {
        const dropX = Math.max(95, this.bunny ? this.bunny.x + (this.bunny.direction * 35) : 120);
        this.dropFood('carrot', dropX, 40);
      }
    });

    // 7. Start Game Loop
    this.loop = new GameLoop(
      (dt) => this.update(dt),
      () => this.render()
    );
    this.loop.start();
  }

  get inventory() {
    return this.state.inventory;
  }

  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.applyLayout();
  }

  applyLayout() {
    if (this.bunny) {
      this.bunny.resize(this.canvas.width, this.canvas.height, this.taskbarOverlap);
    }
    if (this.garden) {
      this.garden.y = this.groundY;
      if (!this.garden.x || this.garden.x < 320) {
        this.garden.randomizePosition(this.canvas.width);
      }
    }
    if (this.hud) {
      this.hud.layout(this.canvas.height, this.taskbarOverlap);
    }
    // Resting food follows the floor
    for (const food of this.worldFoods) {
      food.groundY = this.groundY;
    }
  }

  handleOfflineSummary(summary) {
    if (!summary || summary.elapsedMinutes < 2) return;
    const msg = `Away for ${summary.elapsedMinutes} mins`;
    let sub = '';
    if (summary.carrotsGrown > 0) {
      sub += `🥕 ${summary.carrotsGrown} carrots ready! `;
    }
    if (summary.streakBonus > 0) {
      sub += `🎁 +${summary.streakBonus} streak coins!`;
    }
    this.hud.showNotification(msg, sub || 'Barnaby missed you!', 5000, '🐰');
  }

  dropFood(foodId, x, y) {
    if (!this.inventory.foods[foodId] || this.inventory.foods[foodId] <= 0) {
      this.hud.showNotification(`No ${FOODS[foodId]?.name || 'food'} left!`, 'Plant in garden or wait for passive earn', 3000, '❌');
      return;
    }

    this.inventory.foods[foodId]--;
    const groundY = this.groundY;
    const db = this.hud ? this.hud.getDrawerBounds() : null;
    const minX = (this.hud && this.hud.isDrawerOpen && db) ? (db.x + db.width + 30) : 100;
    let safeX = x;
    if (safeX < minX) {
      const maxX = Math.max(minX + 80, this.canvas.width - 50);
      safeX = Math.floor(Math.random() * (maxX - minX)) + minX;
    } else {
      safeX = Math.min(this.canvas.width - 35, safeX);
    }

    this.worldFoods.push({
      id: foodId,
      x: safeX,
      y: Math.min(y, groundY - 10),
      vy: 1.5,
      groundY: groundY,
      isGrounded: false
    });

    soundEngine.playHop();
    this.saveState();
  }

  removeWorldFood(target) {
    const idx = this.worldFoods.indexOf(target);
    if (idx !== -1) {
      this.worldFoods.splice(idx, 1);
    }
  }

  onLevelUp(newLevel) {
    soundEngine.playLevelUp();
    this.inventory.coins = (this.inventory.coins || 0) + 50;
    this.hud.showNotification(`LEVEL UP! Now Level ${newLevel}!`, '+50 Coins awarded', 5000, '⭐');

    // Spawn celebration stars
    for (let i = 0; i < 8; i++) {
      const vx = (Math.random() - 0.5) * 3;
      const vy = -1.5 - Math.random() * 2;
      this.bunny.addParticle(this.bunny.x, this.bunny.y - 20, vx, vy, 'star');
    }

    this.checkAchievements();
    this.saveState();
  }

  onPassiveCarrot() {
    this.inventory.foods.carrot = (this.inventory.foods.carrot || 0) + 1;
    this.hud.showNotification('+1 Passive Carrot!', 'Earned by keeping bunny company', 3000, '🥕');
    this.saveState();
  }

  checkAchievements() {
    if (!this.state.achievements) this.state.achievements = { unlocked: [] };
    const unlocked = this.state.achievements.unlocked;

    const check = (id, condition) => {
      if (!unlocked.includes(id) && condition) {
        unlocked.push(id);
        const ach = ACHIEVEMENTS.find(a => a.id === id);
        if (ach) {
          soundEngine.playLevelUp();
          this.inventory.coins += ach.rewardCoins;
          this.bunny.needs.addXp(ach.rewardXp, (lv) => this.onLevelUp(lv));
          this.hud.showNotification(`🏆 Achievement Unlocked!`, `${ach.name}: ${ach.description}`, 5000, '🏆');
        }
      }
    };

    check('first_carrot', this.bunny.totalCarrotsFed >= 1);
    check('fed_25', this.bunny.totalCarrotsFed >= 25);
    check('fed_100', this.bunny.totalCarrotsFed >= 100);
    check('pet_50', this.bunny.totalPetCount >= 50);
    check('pet_200', this.bunny.totalPetCount >= 200);
    check('first_harvest', this.state.garden?.plots?.some(p => p.ready || p.plantedAt));
    check('level_5', this.bunny.needs.level >= 5);
    check('level_10', this.bunny.needs.level >= 10);
  }

  update(deltaTime) {
    // 1. Update World dropped foods
    for (const food of this.worldFoods) {
      // Un-trap any legacy food from behind the counter badge or drawer
      const db = this.hud ? this.hud.getDrawerBounds() : null;
      const minX = (this.hud && this.hud.isDrawerOpen && db) ? (db.x + db.width + 25) : 95;
      if (food.x < minX) {
        food.x = minX + 20 + Math.random() * 60;
      }

      if (!food.isGrounded) {
        food.vy += 0.35;
        food.y += food.vy;
        if (food.y >= food.groundY) {
          food.y = food.groundY;
          if (food.vy > 1.2) {
            food.vy = -food.vy * 0.3; // bounce
          } else {
            food.vy = 0;
            food.isGrounded = true;
          }
        }
      }
    }

    // 2. Update Garden
    if (this.garden) {
      this.garden.update(deltaTime);
    }

    // 3. Update Bunny
    if (this.bunny) {
      this.bunny.update(
        deltaTime,
        this.worldFoods,
        (newLv) => this.onLevelUp(newLv),
        () => this.onPassiveCarrot()
      );
    }

    // 4. Update HUD
    if (this.hud) {
      this.hud.update(deltaTime);
    }

    // 5. Random cute events (butterfly, sneeze, coin find)
    this.updateRandomEvents(deltaTime);

    // 6. Intelligent Idle optimization
    if (this.loop && this.bunny) {
      const isDormant = (
        (this.bunny.stateMachine.currentState === 'sleep' || this.bunny.stateMachine.currentState === 'sit') &&
        this.worldFoods.length === 0 &&
        this.bunny.particles.length === 0 &&
        !this.input.isMouseDown &&
        !this.butterfly
      );
      this.loop.setIdleMode(isDormant);
    }

    // 7. Auto-save every 30 seconds
    this.autoSaveTimer += deltaTime;
    if (this.autoSaveTimer >= 30000) {
      this.autoSaveTimer = 0;
      this.saveState();
    }
  }

  updateRandomEvents(deltaTime) {
    this.randomEventTimer += deltaTime;
    if (this.randomEventTimer >= 35000 && !this.butterfly) {
      this.randomEventTimer = 0;
      const roll = Math.random();
      if (roll < 0.4) {
        // Spawn fluttering butterfly!
        this.butterfly = {
          x: Math.random() < 0.5 ? 20 : this.canvas.width - 20,
          y: this.groundY - 48 - Math.random() * 50,
          vx: Math.random() < 0.5 ? 1.2 : -1.2,
          vy: -0.4,
          life: 0,
          color: ['#ffb7b2', '#b5ead7', '#e2f0cb', '#c7ceea'][Math.floor(Math.random() * 4)]
        };
      } else if (roll < 0.7) {
        // Bunny sneezes!
        if (this.bunny && this.bunny.stateMachine.currentState === 'idle') {
          soundEngine.playSneeze();
          this.bunny.addParticle(this.bunny.x, this.bunny.y - 15, 0, -1, 'star');
        }
      } else {
        // Find a coin!
        this.inventory.coins = (this.inventory.coins || 0) + 10;
        soundEngine.playCoin();
        this.hud.showNotification('Lucky! Found 10 Coins!', 'Barnaby noticed something shiny', 3500, '🪙');
        this.saveState();
      }
    }

    // Animate butterfly
    if (this.butterfly) {
      this.butterfly.life += deltaTime;
      this.butterfly.x += this.butterfly.vx * (deltaTime / 16.6);
      this.butterfly.y += Math.sin(this.butterfly.life / 200) * 0.8;

      if (this.butterfly.x < -20 || this.butterfly.x > this.canvas.width + 20 || this.butterfly.life > 18000) {
        this.butterfly = null;
      }
    }
  }

  render() {
    // Clear screen transparently
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw Garden Plot
    if (this.garden) {
      this.garden.draw(this.ctx);
    }

    // 2. Draw Butterfly
    if (this.butterfly) {
      this.ctx.save();
      this.ctx.fillStyle = this.butterfly.color;
      const bx = Math.floor(this.butterfly.x);
      const by = Math.floor(this.butterfly.y);
      const flap = (Math.floor(this.butterfly.life / 100) % 2 === 0) ? 0 : 2;
      this.ctx.fillRect(bx - 3, by - 2 - flap, 3, 4);
      this.ctx.fillRect(bx + 1, by - 2 - flap, 3, 4);
      this.ctx.fillStyle = '#333333';
      this.ctx.fillRect(bx, by - 1, 1, 3);
      this.ctx.restore();
    }

    // 3. Draw Bunny
    if (this.bunny) {
      this.bunny.draw(this.ctx);
    }

    // 4. Draw HUD (Drawer and Basket)
    if (this.hud && this.bunny) {
      this.hud.draw(
        this.ctx,
        this.inventory,
        this.inventory.coins,
        this.bunny.needs.level,
        this.bunny.needs.hunger,
        this.bunny.needs.happiness
      );
    }

    // 5. Draw Dropped & Draggable Foods (Rendered ON TOP so they are always visible & movable)
    for (const food of this.worldFoods) {
      const isHovered = this.input && this.input.findFoodAt(this.input.lastMouseX, this.input.lastMouseY) === food;
      const isDragged = this.input && this.input.draggedFood === food;

      if (isHovered || isDragged) {
        this.ctx.save();
        this.ctx.strokeStyle = '#f97316';
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(food.x, food.y - 4, 11, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.restore();
      }

      ItemSprites.drawFood(this.ctx, food.id, food.x, food.y - 4, 18);
    }
  }

  syncState(updatedState) {
    if (!updatedState) return;
    this.state = updatedState;

    if (this.bunny) {
      this.bunny.appearance = {
        furColor: this.state.bunny.furColor,
        earStyle: this.state.bunny.earStyle,
        eyeColor: this.state.bunny.eyeColor,
        blush: this.state.bunny.blush
      };
      this.bunny.equipped = this.state.bunny.equipped;
      if (this.state.settings) {
        this.bunny.scale = this.state.settings.bunnyScale || 2.5;
        this.bunny.width = this.bunny.baseSpriteSize * this.bunny.scale;
        this.bunny.height = this.bunny.baseSpriteSize * this.bunny.scale;
        this.bunny.isDoNotDisturb = Boolean(this.state.settings.doNotDisturb);
        soundEngine.setVolume(this.state.settings.volume ?? 0.6);
        soundEngine.setMuted(Boolean(this.state.settings.isMuted));
      }
    }
  }

  saveState() {
    if (!this.state || !this.bunny) return;

    this.state.bunny.hunger = Math.round(this.bunny.needs.hunger);
    this.state.bunny.happiness = Math.round(this.bunny.needs.happiness);
    this.state.bunny.level = this.bunny.needs.level;
    this.state.bunny.xp = this.bunny.needs.xp;
    this.state.bunny.totalCarrotsFed = this.bunny.totalCarrotsFed;
    this.state.bunny.totalPetCount = this.bunny.totalPetCount;
    this.state.bunny.equipped = this.bunny.equipped;
    this.state.bunny.furColor = this.bunny.appearance.furColor;
    this.state.bunny.earStyle = this.bunny.appearance.earStyle;
    this.state.bunny.eyeColor = this.bunny.appearance.eyeColor;
    this.state.bunny.blush = this.bunny.appearance.blush;

    if (this.garden) {
      this.state.garden.plots = this.garden.plots;
      this.state.garden.x = this.garden.x;
    }

    if (window.api && window.api.saveState) {
      window.api.saveState(this.state);
    }
  }
}

// Start application when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  window.appInstance = new TaskbarBunnyApp();
});
