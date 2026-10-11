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
    this.bunnies = [];
    this.garden = null;
    this.hud = null;
    this.input = null;
    this.loop = null;

    // Dropped food items in world
    this.worldFoods = [];

    // Pixels at the bottom of the canvas hidden under the taskbar (set by the main process)
    this.taskbarOverlap = 0;

    // Cute random events (butterfly, coin find, sneeze)
    this.butterfly = null;
    this.randomEventTimer = 0;

    // Auto-save timer
    this.autoSaveTimer = 0;

    this.init();
  }

  get bunny() {
    return this.bunnies[0] || null;
  }

  set bunny(b) {
    if (this.bunnies.length === 0) {
      this.bunnies.push(b);
    } else {
      this.bunnies[0] = b;
    }
  }

  getBunnyAt(px, py) {
    for (let i = this.bunnies.length - 1; i >= 0; i--) {
      if (this.bunnies[i].isPointInside(px, py)) {
        return this.bunnies[i];
      }
    }
    return null;
  }

  getMaxBunnies() {
    const primaryLevel = (this.bunny && this.bunny.needs) ? this.bunny.needs.level : 1;
    return Math.min(10, 1 + Math.floor(primaryLevel / 10));
  }

  canAddBunny() {
    return this.bunnies.length < this.getMaxBunnies();
  }

  addBunny(customData = null) {
    if (!this.canAddBunny()) {
      const nextLv = this.bunnies.length * 10;
      if (this.hud) {
        this.hud.showNotification('Bunny limit reached!', `Reach Level ${nextLv} to adopt another bunny`, 4000, '🔒');
      }
      return false;
    }

    const bunnyIndex = this.bunnies.length;
    const names = ['Pip', 'Mochi', 'Clover', 'Boba', 'Daisy', 'Thumper', 'Coco', 'Snowball', 'Bibi', 'Oliver', 'Bella'];
    const furColors = ['brown', 'gray', 'pink', 'black', 'caramel', 'dutch', 'white'];
    const earStyles = ['floppy', 'upright', 'derpy'];
    const eyeColors = ['ruby', 'dark', 'emerald', 'sapphire', 'amber'];

    const usedNames = this.bunnies.map(b => b.name);
    const availableName = names.find(n => !usedNames.includes(n)) || `Bunny ${bunnyIndex + 1}`;
    const furColor = furColors[(bunnyIndex - 1) % furColors.length];
    const earStyle = earStyles[(bunnyIndex - 1) % earStyles.length];
    const eyeColor = eyeColors[(bunnyIndex - 1) % eyeColors.length];

    const data = customData || {
      name: availableName,
      furColor: furColor,
      earStyle: earStyle,
      eyeColor: eyeColor,
      blush: true,
      equipped: { head: 'none', face: 'none', neck: 'none', back: 'none', held: 'none' },
      hunger: 85,
      happiness: 90,
      level: 1,
      xp: 0,
      totalCarrotsFed: 0,
      totalPetCount: 0
    };

    const newBunny = new Bunny(data, this.state.settings, this.canvas.width, this.canvas.height);
    newBunny.name = data.name || availableName;
    newBunny.x = Math.max(100, Math.min(this.canvas.width - 100, Math.random() * (this.canvas.width - 200) + 100));
    newBunny.y = -30;
    newBunny.vy = 2.0;
    newBunny.stateMachine.setState('falling', 2000);

    newBunny.onFoodEaten = (eatenFood) => {
      this.removeWorldFood(eatenFood);
      this.checkAchievements();
      this.saveState();
    };

    this.bunnies.push(newBunny);

    soundEngine.playLevelUp();
    if (this.hud) {
      this.hud.showNotification(`🐰 Welcome ${newBunny.name}!`, 'Customize or rename your companion in the Wardrobe!', 5000, '✨');
    }
    if (window.api && window.api.openWardrobe) {
      window.api.openWardrobe();
    }

    for (let i = 0; i < 12; i++) {
      const vx = (Math.random() - 0.5) * 4;
      const vy = -1.5 - Math.random() * 2.5;
      newBunny.addParticle(newBunny.x, newBunny.groundY - 20, vx, vy, 'star');
    }

    this.saveState();
    return true;
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

    const { state, offlineSummary } = await window.api.loadState();
    this.state = state;

    if (this.state.settings) {
      soundEngine.setVolume(this.state.settings.volume ?? 0.6);
      soundEngine.setMuted(Boolean(this.state.settings.isMuted));
    }

    this.bunnies = [];
    const primaryBunny = new Bunny(
      this.state.bunny,
      this.state.settings,
      this.canvas.width,
      this.canvas.height
    );
    primaryBunny.name = this.state.bunny.name || 'Barnaby';
    primaryBunny.onFoodEaten = (eatenFood) => {
      this.removeWorldFood(eatenFood);
      this.checkAchievements();
      this.saveState();
    };
    this.bunnies.push(primaryBunny);

    if (Array.isArray(this.state.extraBunnies)) {
      for (const eb of this.state.extraBunnies) {
        const companion = new Bunny(
          eb,
          this.state.settings,
          this.canvas.width,
          this.canvas.height
        );
        companion.name = eb.name || 'Companion Bunny';
        companion.onFoodEaten = (eatenFood) => {
          this.removeWorldFood(eatenFood);
          this.checkAchievements();
          this.saveState();
        };
        this.bunnies.push(companion);
      }
    }

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

    if (offlineSummary) {
      this.handleOfflineSummary(offlineSummary);
    }
    window.api.onOfflineSummary((summary) => this.handleOfflineSummary(summary));

    window.api.onStateUpdate((updatedState) => {
      this.syncState(updatedState);
    });

    window.api.onTrayAction((action) => {
      if (action === 'feed-carrot') {
        const dropX = Math.max(95, this.bunny ? this.bunny.x + (this.bunny.direction * 35) : 120);
        this.dropFood('carrot', dropX, -28);
      }
    });

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
    for (const b of this.bunnies) {
      b.resize(this.canvas.width, this.canvas.height, this.taskbarOverlap);
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
    const groundY = this.bunny ? this.bunny.groundY : this.groundY;
    const db = this.hud ? this.hud.getDrawerBounds() : null;
    let safeX = (x !== undefined && Number.isFinite(x))
      ? x
      : Math.floor(Math.random() * (this.canvas.width - 200)) + 100;

    // Ensure food does not drop behind drawer card
    if (this.hud && this.hud.isDrawerOpen && db) {
      if (safeX >= db.x - 20 && safeX <= db.x + db.width + 20) {
        safeX = (db.x + db.width + 50 < this.canvas.width - 40)
          ? db.x + db.width + 40 + Math.random() * 40
          : db.x - 50 - Math.random() * 40;
      }
    }
    safeX = Math.max(40, Math.min(this.canvas.width - 40, safeX));

    // Food drops from above the screen
    const startY = (y !== undefined && y > 0 && y < groundY - 50) ? y : -28;
    this.worldFoods.push({
      id: foodId,
      x: safeX,
      y: startY,
      vy: 2.0,
      rotation: 0,
      spin: (Math.random() - 0.5) * 0.08,
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

  onLevelUp(newLevel, levelingBunny) {
    soundEngine.playLevelUp();
    this.inventory.coins = (this.inventory.coins || 0) + 50;
    const bName = (levelingBunny && levelingBunny.name) ? levelingBunny.name : 'Barnaby';
    this.hud.showNotification(`LEVEL UP! ${bName} reached Level ${newLevel}!`, '+50 Coins awarded', 5000, '⭐');

    if (newLevel % 10 === 0) {
      const maxAllowed = 1 + Math.floor(newLevel / 10);
      this.hud.showNotification(
        `🎉 Milestone Level ${newLevel}!`,
        `New bunny unlocked! (${this.bunnies.length}/${maxAllowed} active — click '+ Bunny' in menu)`,
        7000,
        '🐰'
      );
    }

    // Spawn celebration stars
    const targetBunny = levelingBunny || this.bunny;
    if (targetBunny) {
      for (let i = 0; i < 8; i++) {
        const vx = (Math.random() - 0.5) * 3;
        const vy = -1.5 - Math.random() * 2;
        targetBunny.addParticle(targetBunny.x, targetBunny.y - 20, vx, vy, 'star');
      }
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
    for (const food of this.worldFoods) {
      const db = this.hud ? this.hud.getDrawerBounds() : null;
      const minX = (this.hud && this.hud.isDrawerOpen && db) ? (db.x + db.width + 25) : 95;
      if (food.isGrounded && food.x < minX) {
        food.x = minX + 20 + Math.random() * 60;
      }

      if (!food.isGrounded) {
        food.vy += 0.45;
        if (food.vy > 14) food.vy = 14;
        food.y += food.vy * (deltaTime / 16.6);

        if (food.rotation !== undefined) {
          food.rotation += (food.spin || 0.04);
        }

        if (food.y >= food.groundY) {
          food.y = food.groundY;
          if (food.vy > 2.0) {
            food.vy = -food.vy * 0.35;
            soundEngine.playHop();
            if (this.bunny) {
              this.bunny.addParticle(food.x, food.groundY, (Math.random() - 0.5) * 1.5, -0.8, 'crumb');
            }
          } else {
            food.vy = 0;
            food.isGrounded = true;
            food.rotation = 0;
          }
        }
      }
    }

    if (this.garden) {
      this.garden.update(deltaTime);
    }

    for (const bunny of this.bunnies) {
      bunny.update(
        deltaTime,
        this.worldFoods,
        (newLv) => this.onLevelUp(newLv, bunny),
        () => this.onPassiveCarrot()
      );
    }

    if (this.hud) {
      this.hud.update(deltaTime);
    }

    this.updateRandomEvents(deltaTime);

    if (this.loop && this.bunny) {
      const allDormant = this.bunnies.every(b =>
        (b.stateMachine.currentState === 'sleep' || b.stateMachine.currentState === 'sit') &&
        b.particles.length === 0
      );
      const isDormant = (
        allDormant &&
        this.worldFoods.length === 0 &&
        !this.input.isMouseDown &&
        !this.butterfly
      );
      this.loop.setIdleMode(isDormant);
    }

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
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.garden) {
      this.garden.draw(this.ctx);
    }

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

    for (const bunny of this.bunnies) {
      bunny.draw(this.ctx);
    }

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

      const eater = this.bunnies.find(b => b.stateMachine.currentState === 'eat' && b.currentEatingFood === food);
      if (eater) {
        const progress = eater.stateMachine.stateTimer / Math.max(1, eater.stateMachine.stateDuration);
        const nibbleSize = Math.max(8, 18 * (1 - progress * 0.5));
        const holdX = eater.x + (eater.direction * 10);
        const holdY = eater.y - 12;
        ItemSprites.drawFood(this.ctx, food.id, holdX, holdY, nibbleSize);
      } else {
        if (!food.isGrounded && food.rotation) {
          this.ctx.save();
          this.ctx.translate(food.x, food.y - 4);
          this.ctx.rotate(food.rotation);
          ItemSprites.drawFood(this.ctx, food.id, 0, 0, 18);
          this.ctx.restore();
        } else {
          ItemSprites.drawFood(this.ctx, food.id, food.x, food.y - 4, 18);
        }
      }
    }
  }

  syncState(updatedState) {
    if (!updatedState) return;
    this.state = updatedState;

    if (this.bunnies && this.bunnies[0] && this.state.bunny) {
      const primary = this.bunnies[0];
      if (this.state.bunny.name) primary.name = this.state.bunny.name;
      primary.appearance = {
        furColor: this.state.bunny.furColor,
        earStyle: this.state.bunny.earStyle,
        eyeColor: this.state.bunny.eyeColor,
        blush: this.state.bunny.blush
      };
      primary.equipped = this.state.bunny.equipped;
    }

    if (this.bunnies && Array.isArray(this.state.extraBunnies)) {
      this.state.extraBunnies.forEach((eb, idx) => {
        const companion = this.bunnies[idx + 1];
        if (companion) {
          if (eb.name) companion.name = eb.name;
          companion.appearance = {
            furColor: eb.furColor,
            earStyle: eb.earStyle,
            eyeColor: eb.eyeColor,
            blush: eb.blush
          };
          companion.equipped = eb.equipped;
        }
      });
    }

    if (this.state.settings && this.bunnies) {
      for (const b of this.bunnies) {
        b.scale = this.state.settings.bunnyScale || 2.5;
        b.width = b.baseSpriteSize * b.scale;
        b.height = b.baseSpriteSize * b.scale;
        b.isDoNotDisturb = Boolean(this.state.settings.doNotDisturb);
        b.roamingArea = this.state.settings.roamingArea || 'cozy';
        b.floorMode = this.state.settings.floorMode || 'taskbar';
        if (b.floorMode === 'taskbar') {
          b.groundY = b.taskbarFloorY;
          b.customGroundY = null;
        }
      }
      soundEngine.setVolume(this.state.settings.volume ?? 0.6);
      soundEngine.setMuted(Boolean(this.state.settings.isMuted));
    }
    if (this.hud) {
      this.hud.layout(this.canvas.height, this.taskbarOverlap);
    }
  }

  saveState() {
    if (!this.state || !this.bunny) return;

    const primary = this.bunnies[0];
    if (primary) {
      this.state.bunny.name = primary.name || 'Barnaby';
      this.state.bunny.hunger = Math.round(primary.needs.hunger);
      this.state.bunny.happiness = Math.round(primary.needs.happiness);
      this.state.bunny.level = primary.needs.level;
      this.state.bunny.xp = primary.needs.xp;
      this.state.bunny.totalCarrotsFed = primary.totalCarrotsFed;
      this.state.bunny.totalPetCount = primary.totalPetCount;
      this.state.bunny.equipped = primary.equipped;
      this.state.bunny.furColor = primary.appearance.furColor;
      this.state.bunny.earStyle = primary.appearance.earStyle;
      this.state.bunny.eyeColor = primary.appearance.eyeColor;
      this.state.bunny.blush = primary.appearance.blush;
      this.state.bunny.customGroundY = (primary.floorMode === 'free' && primary.customGroundY)
        ? Math.round(primary.customGroundY)
        : null;
    }

    this.state.extraBunnies = this.bunnies.slice(1).map(b => ({
      name: b.name,
      hunger: Math.round(b.needs.hunger),
      happiness: Math.round(b.needs.happiness),
      level: b.needs.level,
      xp: b.needs.xp,
      totalCarrotsFed: b.totalCarrotsFed,
      totalPetCount: b.totalPetCount,
      equipped: b.equipped,
      furColor: b.appearance.furColor,
      earStyle: b.appearance.earStyle,
      eyeColor: b.appearance.eyeColor,
      blush: b.appearance.blush,
      customGroundY: (b.floorMode === 'free' && b.customGroundY) ? Math.round(b.customGroundY) : null
    }));

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
