const { BunnySpriteGenerator } = require('../sprites/bunnySprites');
const { AccessoryRenderer } = require('../sprites/accessories');
const { ItemSprites } = require('../sprites/itemSprites');
const { BunnyStateMachine } = require('./stateMachine');
const { BunnyNeeds } = require('./needs');
const { soundEngine } = require('../engine/soundEngine');

class Bunny {
  constructor(initialData = {}, settings = {}, screenWidth = 1920, screenHeight = 180) {
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;

    // Settings
    this.scale = settings.bunnyScale || 2.5;
    this.isDoNotDisturb = Boolean(settings.doNotDisturb);
    this.roamingArea = settings.roamingArea || 'cozy';
    this.floorMode = settings.floorMode || 'taskbar';

    // Appearance
    this.appearance = {
      furColor: initialData.furColor || 'white',
      earStyle: initialData.earStyle || 'upright',
      eyeColor: initialData.eyeColor || 'ruby',
      blush: initialData.blush !== false
    };

    // Wardrobe equipped items
    this.equipped = initialData.equipped || {
      head: 'none',
      face: 'none',
      neck: 'none',
      back: 'none',
      held: 'none'
    };

    this.name = initialData.name || 'Barnaby';
    this.nameTimer = 0;
    this.isHovered = false;
    this.isSleepingInDen = false;

    // Needs & stats
    this.needs = new BunnyNeeds(initialData, settings);

    // Position & Physics
    this.baseSpriteSize = 32;
    this.width = this.baseSpriteSize * this.scale;
    this.height = this.baseSpriteSize * this.scale;
    this.taskbarOverlap = 0; // px of the canvas hidden under the taskbar
    this.taskbarFloorY = this.screenHeight - this.taskbarOverlap - 12;
    this.customGroundY = (initialData.customGroundY && this.floorMode === 'free')
      ? initialData.customGroundY
      : null;
    this.groundY = (this.floorMode === 'free' && this.customGroundY)
      ? this.customGroundY
      : this.taskbarFloorY;

    this.x = Math.max(100, Math.min(screenWidth - 100, screenWidth / 2));
    this.y = this.groundY;
    this.vx = 0;
    this.vy = 0;
    this.targetX = this.x;
    this.targetY = this.y;
    this.direction = 1; // 1: right, -1: left

    // Dragging & Interaction
    this.isDragging = false;
    this.dragOffsetX = 0;
    this.dragOffsetY = 0;

    // Food target
    this.currentEatingFood = null;
    this.eatCrunchTimer = 0;

    // Particles (hearts, crumbs, stars, zzz)
    this.particles = [];

    // State machine
    this.stateMachine = new BunnyStateMachine(this);
    this.stateMachine.setState('idle');

    // Stats tracking
    this.totalPetCount = initialData.totalPetCount || 0;
    this.totalCarrotsFed = initialData.totalCarrotsFed || 0;
  }

  resize(newWidth, newHeight, taskbarOverlap = 0) {
    this.screenWidth = newWidth;
    this.screenHeight = newHeight;
    this.taskbarOverlap = taskbarOverlap;
    this.taskbarFloorY = this.screenHeight - this.taskbarOverlap - 12;
    if (this.floorMode === 'free' && this.customGroundY) {
      this.groundY = Math.min(this.taskbarFloorY, Math.max(50, this.customGroundY));
    } else {
      this.groundY = this.taskbarFloorY;
    }
    if (!this.isDragging && this.y >= this.groundY - 10) {
      this.y = this.groundY;
    }
    this.x = Math.max(40, Math.min(this.screenWidth - 40, this.x));
  }

  getRoamingHeight() {
    const area = this.roamingArea || 'cozy';
    switch (area) {
      case 'taskbar': return 40;
      case 'cozy': return 220;
      case 'desk': return 450;
      case 'full': return Math.max(100, this.screenHeight - 100);
      default: return 220;
    }
  }

  update(deltaTime, worldFoods = [], onLevelUp, onPassiveCarrot) {
    if (this.nameTimer > 0) this.nameTimer -= deltaTime;
    this.worldFoods = worldFoods;
    this.needs.update(onLevelUp, onPassiveCarrot);
    this.stateMachine.update(deltaTime);
    this.updateParticles(deltaTime);
  }

  updateWalk(deltaTime) {
    const distX = this.targetX - this.x;
    if (Math.abs(distX) < 3) {
      this.x = this.targetX;
      this.y = this.groundY;
      this.stateMachine.setState('idle');
      return;
    }

    const isHungry = this.needs.isHungry();
    const speed = (isHungry ? 22 : 45) * (deltaTime / 1000);
    if (Math.abs(distX) > 1) {
      this.direction = distX > 0 ? 1 : -1;
    }
    this.x += (distX > 0 ? 1 : -1) * Math.min(Math.abs(distX), speed);
    this.y = this.groundY;

    const halfW = this.width / 2;
    this.x = Math.max(halfW, Math.min(this.screenWidth - halfW, this.x));
  }

  startHop() {
    this.vy = -3.8;
    soundEngine.playHop();
    this.addParticle(this.x, this.y, 0, -0.5, 'star');
  }

  updateHop(deltaTime) {
    const gravity = 0.012 * deltaTime;
    this.vy += gravity;
    this.y += this.vy * (deltaTime / 16.6);

    // Horizontal leap momentum
    const hopSpeed = 24 * (deltaTime / 1000);
    this.x += this.direction * hopSpeed;
    const halfW = this.width / 2;
    this.x = Math.max(halfW, Math.min(this.screenWidth - halfW, this.x));

    if (this.y >= this.groundY) {
      this.y = this.groundY;
      this.vy = 0;
      this.stateMachine.setState('idle', 1200);
    }
  }

  updateFalling(deltaTime) {
    const gravity = 0.018 * deltaTime;
    this.vy += gravity;
    this.y += this.vy * (deltaTime / 16.6);

    if (this.y >= this.groundY) {
      this.y = this.groundY;
      if (Math.abs(this.vy) > 1.8) {
        // Bounce!
        this.vy = -this.vy * 0.35;
        soundEngine.playHop();
      } else {
        this.vy = 0;
        soundEngine.playHop();
        this.stateMachine.setState('idle', 1500);
      }
    }
  }

  updateEating(deltaTime) {
    if (!this.currentEatingFood) {
      this.stateMachine.setState('idle');
      return;
    }

    this.eatCrunchTimer += deltaTime;
    if (this.eatCrunchTimer >= 380) {
      this.eatCrunchTimer = 0;
      soundEngine.playCrunch();
      // Scatter crumbs
      for (let i = 0; i < 3; i++) {
        const vx = (Math.random() - 0.5) * 1.5;
        const vy = -Math.random() * 1.5;
        this.addParticle(this.x + (this.direction * 12), this.y - 10, vx, vy, 'crumb');
      }
    }

    if (this.stateMachine.stateTimer >= this.stateMachine.stateDuration) {
      // Finished meal!
      const foodId = this.currentEatingFood.id;
      const res = this.needs.feed(foodId);
      this.totalCarrotsFed++;

      // Heart burst
      for (let i = 0; i < 4; i++) {
        const vx = (Math.random() - 0.5) * 1.2;
        const vy = -1 - Math.random() * 1.5;
        this.addParticle(this.x + vx * 10, this.y - 25, vx, vy, 'heart');
      }

      if (this.currentEatingFood) {
        this.currentEatingFood.beingEatenBy = null;
      }
      if (this.onFoodEaten) {
        this.onFoodEaten(this.currentEatingFood);
      }
      this.currentEatingFood = null;
      this.stateMachine.setState('happy', 2000);
    }
  }

  findNearestFood() {
    if (!this.worldFoods || this.worldFoods.length === 0) return null;
    let closest = null;
    let minDistance = Infinity;
    for (const food of this.worldFoods) {
      // Only target food that is grounded or near the floor
      if (!food.isGrounded && food.y < this.groundY - 50) continue;
      // Do not target food already claimed by another bunny
      if (food.beingEatenBy && food.beingEatenBy !== this) continue;

      const dist = Math.hypot(this.x - food.x, this.y - food.y);
      if (dist < minDistance) {
        minDistance = dist;
        closest = food;
      }
    }
    return closest;
  }

  // --- Interactions ---

  startDrag(mouseX, mouseY) {
    this.isSleepingInDen = false;
    this.isDragging = true;
    this.dragOffsetX = this.x - mouseX;
    this.dragOffsetY = this.y - mouseY;
    this.stateMachine.setState('dangling');
  }

  updateDrag(mouseX, mouseY) {
    if (!this.isDragging) return;
    this.x = mouseX + this.dragOffsetX;
    this.y = mouseY + this.dragOffsetY;
    const halfW = this.width / 2;
    this.x = Math.max(halfW, Math.min(this.screenWidth - halfW, this.x));
    this.y = Math.min(this.taskbarFloorY, Math.max(35, this.y));
  }

  endDrag() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.vy = 0;

    if (this.floorMode === 'free') {
      if (this.y >= this.taskbarFloorY - 60) {
        this.groundY = this.taskbarFloorY;
        this.customGroundY = null;
      } else {
        this.groundY = Math.max(50, Math.min(this.taskbarFloorY, this.y));
        this.customGroundY = this.groundY;
      }
    } else {
      this.groundY = this.taskbarFloorY;
      this.customGroundY = null;
    }

    this.targetY = this.groundY;
    this.stateMachine.setState('falling');
  }

  pet(mouseX, mouseY) {
    this.isSleepingInDen = false;
    this.totalPetCount++;
    this.nameTimer = 2500;
    this.needs.pet();
    soundEngine.playPet();
    for (let i = 0; i < 3; i++) {
      const vx = (Math.random() - 0.5) * 1.5;
      const vy = -1.2 - Math.random() * 1.2;
      this.addParticle(this.x + vx * 12, this.y - 28, vx, vy, 'heart');
    }
    this.stateMachine.setState('happy', 2200);
  }

  doubleClick() {
    this.startHop();
    this.stateMachine.setState('hop');
  }

  addParticle(x, y, vx, vy, type) {
    this.particles.push({
      x,
      y,
      vx,
      vy,
      type,
      alpha: 1.0,
      life: 0,
      maxLife: type === 'heart' ? 1200 : (type === 'star' ? 1000 : 700)
    });
  }

  updateParticles(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += deltaTime;
      p.x += p.vx * (deltaTime / 16.6);
      p.y += p.vy * (deltaTime / 16.6);
      if (p.type === 'crumb') {
        p.vy += 0.08;
      }
      p.alpha = Math.max(0, 1 - (p.life / p.maxLife));
      if (p.life >= p.maxLife) {
        this.particles.splice(i, 1);
      }
    }
  }

  drawParticles(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      const px = Math.floor(p.x);
      const py = Math.floor(p.y);

      if (p.type === 'heart') {
        ctx.fillStyle = '#ff4d6d';
        ctx.fillRect(px - 3, py - 3, 2, 2);
        ctx.fillRect(px + 1, py - 3, 2, 2);
        ctx.fillRect(px - 4, py - 1, 8, 3);
        ctx.fillRect(px - 2, py + 2, 4, 2);
        ctx.fillRect(px - 1, py + 4, 2, 1);
      } else if (p.type === 'crumb') {
        ctx.fillStyle = '#ed8936';
        ctx.fillRect(px, py, 2, 2);
      } else if (p.type === 'star') {
        ctx.fillStyle = '#ffd166';
        ctx.fillRect(px - 1, py - 2, 3, 5);
        ctx.fillRect(px - 2, py - 1, 5, 3);
      } else if (p.type === 'zzz') {
        ctx.fillStyle = '#74c0fc';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('z', px, py);
      }
      ctx.restore();
    }
  }

  isPointInside(px, py) {
    const halfW = (this.width * 0.50) / 2;
    const left = this.x - halfW;
    const right = this.x + halfW;
    const top = this.y - (this.height * 0.75);
    const bottom = this.y;
    return px >= left && px <= right && py >= top && py <= bottom;
  }

  draw(ctx) {
    if (this.isSleepingInDen) {
      return;
    }

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    const stateName = (this.needs.isHungry() && this.stateMachine.currentState === 'idle')
      ? 'sad'
      : this.stateMachine.currentState;

    const { canvas: frameCanvas } = BunnySpriteGenerator.renderFrame({
      state: stateName,
      frameIndex: this.stateMachine.frameIndex,
      direction: this.direction,
      appearance: this.appearance,
      equipped: this.equipped
    });

    const drawX = Math.floor(this.x - this.width / 2);
    const drawY = Math.floor(this.y - this.height);
    ctx.drawImage(frameCanvas, drawX, drawY, this.width, this.height);

    if (this.stateMachine.currentState === 'sleep') {
      if (this.stateMachine.frameIndex % 3 === 0) {
        ItemSprites.drawThoughtBubble(ctx, this.x, drawY - 4, 'sleep');
      }
    } else if (this.needs.isHungry() && this.stateMachine.currentState !== 'eat') {
      ItemSprites.drawThoughtBubble(ctx, this.x, drawY - 4, 'carrot');
    }

    this.drawParticles(ctx);

    if (this.nameTimer > 0 || this.isHovered) {
      const nameText = this.name || 'Barnaby';
      ctx.save();
      ctx.font = 'bold 10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const textW = ctx.measureText(nameText).width;
      const badgeW = textW + 14;
      const badgeH = 16;
      const badgeX = Math.round(this.x - badgeW / 2);
      const badgeY = Math.round(drawY - badgeH - 4);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#831843';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(nameText, this.x, badgeY + badgeH / 2);
      ctx.restore();
    }

    ctx.restore();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Bunny };
}
