const { soundEngine } = require('./soundEngine');

class InputManager {
  constructor(app) {
    this.app = app;
    this.isMouseDown = false;
    this.mouseDownX = 0;
    this.mouseDownY = 0;
    this.mouseDownTime = 0;
    this.isDragging = false;
    this.isInteractiveHover = false;
    this.lastClickTime = 0;

    this.dragTarget = null;
    this.draggedFood = null;
    this.draggedBunny = null;
    this.dragFoodOffsetX = 0;
    this.dragFoodOffsetY = 0;
    this.pendingFoodSlot = null;
    this.dragMenuOffsetX = 0;
    this.dragMenuOffsetY = 0;
    this.menuDragStartX = 0;
    this.menuDragStartY = 0;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    window.addEventListener('mouseleave', () => this.onMouseLeave());
    window.addEventListener('contextmenu', (e) => {
      if (this.app.hud && this.app.hud.selectedFoodToDrop) {
        e.preventDefault();
        this.app.hud.selectedFoodToDrop = null;
      }
    });
  }

  findFoodAt(px, py) {
    if (!this.app.worldFoods) return null;
    for (let i = this.app.worldFoods.length - 1; i >= 0; i--) {
      const food = this.app.worldFoods[i];
      const dist = Math.hypot(food.x - px, (food.y - 4) - py);
      if (dist <= 20) {
        return food;
      }
    }
    return null;
  }

  checkInteractivity(px, py) {
    if (this.isDragging) return true;

    if (this.findFoodAt(px, py)) return true;
    if (this.app.getBunnyAt ? this.app.getBunnyAt(px, py) : (this.app.bunny && this.app.bunny.isPointInside(px, py))) return true;
    if (this.app.hud && this.app.hud.isPointInside(px, py)) return true;
    if (this.app.garden && this.app.garden.isPointInside(px, py)) return true;

    if (this.app.hud && this.app.hud.selectedFoodToDrop) {
      return true;
    }

    return false;
  }

  updateMouseIgnoreState(isInteractive) {
    if (isInteractive !== this.isInteractiveHover) {
      this.isInteractiveHover = isInteractive;
      if (window.api && window.api.setIgnoreMouseEvents) {
        if (isInteractive) {
          window.api.setIgnoreMouseEvents(false);
        } else {
          window.api.setIgnoreMouseEvents(true, { forward: true });
        }
      }
    }
  }

  onMouseMove(e) {
    const px = e.clientX;
    const py = e.clientY;
    this.lastMouseX = px;
    this.lastMouseY = py;

    const isInteractive = this.checkInteractivity(px, py);
    this.updateMouseIgnoreState(isInteractive);

    if (this.app.bunnies) {
      for (const b of this.app.bunnies) {
        b.isHovered = b.isPointInside(px, py);
      }
    }

    // Update cursor
    if (this.findFoodAt(px, py)) {
      document.body.style.cursor = 'grab';
    } else if (this.app.getBunnyAt ? this.app.getBunnyAt(px, py) : (this.app.bunny && this.app.bunny.isPointInside(px, py))) {
      document.body.style.cursor = 'pointer';
    } else if (this.app.hud) {
      const btn = this.app.hud.getButtonAt(px, py);
      if (btn) {
        if (btn.type === 'bag' || btn.type === 'drawer-bg') {
          document.body.style.cursor = 'grab';
        } else {
          document.body.style.cursor = 'pointer';
        }
      } else {
        document.body.style.cursor = 'default';
      }
    } else {
      document.body.style.cursor = 'default';
    }

    if (!this.isMouseDown) return;

    const dist = Math.hypot(px - this.mouseDownX, py - this.mouseDownY);

    if (this.dragTarget === 'food' && this.draggedFood) {
      if (dist > 3) this.isDragging = true;
      if (this.isDragging) {
        document.body.style.cursor = 'grabbing';
        this.draggedFood.x = px + this.dragFoodOffsetX;
        this.draggedFood.y = py + this.dragFoodOffsetY;
        this.draggedFood.isGrounded = false;
        this.draggedFood.vy = 0;

        if (this.app.bunny) {
          this.app.bunny.direction = (this.draggedFood.x > this.app.bunny.x) ? 1 : -1;
        }
      }
      return;
    }

    if (this.dragTarget === 'drawer-food' && this.pendingFoodSlot) {
      if (dist > 8) {
        if (this.app.inventory.foods[this.pendingFoodSlot] > 0) {
          this.app.inventory.foods[this.pendingFoodSlot]--;
          const groundY = this.app.bunny ? this.app.bunny.groundY : this.app.groundY;
          const newFood = {
            id: this.pendingFoodSlot,
            x: px,
            y: py,
            vy: 0,
            groundY: groundY,
            isGrounded: false
          };
          this.app.worldFoods.push(newFood);
          this.dragTarget = 'food';
          this.draggedFood = newFood;
          this.dragFoodOffsetX = 0;
          this.dragFoodOffsetY = 0;
          this.isDragging = true;
          this.pendingFoodSlot = null;
          soundEngine.playHop();
          this.app.saveState();
        }
      }
      return;
    }

    if (this.dragTarget === 'menu' && this.app.hud) {
      if (dist > 4) this.isDragging = true;
      if (this.isDragging) {
        document.body.style.cursor = 'move';
        this.app.hud.setMenuPosition(px + this.dragMenuOffsetX, py + this.dragMenuOffsetY);
      }
      return;
    }

    if (this.dragTarget === 'bunny' && this.draggedBunny) {
      if (dist > 5) {
        if (!this.isDragging) {
          this.isDragging = true;
          this.draggedBunny.startDrag(px, py);
        }
        this.draggedBunny.updateDrag(px, py);
      }
      return;
    }
  }

  onMouseDown(e) {
    this.isMouseDown = true;
    this.mouseDownX = e.clientX;
    this.mouseDownY = e.clientY;
    this.mouseDownTime = Date.now();
    this.isDragging = false;

    const px = e.clientX;
    const py = e.clientY;

    const food = this.findFoodAt(px, py);
    if (food) {
      this.dragTarget = 'food';
      this.draggedFood = food;
      this.dragFoodOffsetX = food.x - px;
      this.dragFoodOffsetY = food.y - py;
      return;
    }

    const clickedBunny = this.app.getBunnyAt ? this.app.getBunnyAt(px, py) : (this.app.bunny && this.app.bunny.isPointInside(px, py) ? this.app.bunny : null);
    if (clickedBunny) {
      this.dragTarget = 'bunny';
      this.draggedBunny = clickedBunny;
      return;
    }

    if (this.app.hud) {
      const btn = this.app.hud.getButtonAt(px, py);
      if (btn) {
        if (btn.type === 'food') {
          this.dragTarget = 'drawer-food';
          this.pendingFoodSlot = btn.foodId;
          return;
        } else if (btn.type === 'bag' || btn.type === 'drawer-bg') {
          this.dragTarget = 'menu';
          this.dragMenuOffsetX = this.app.hud.bagBtn.x - px;
          this.dragMenuOffsetY = this.app.hud.bagBtn.y - py;
          this.menuDragStartX = px;
          this.menuDragStartY = py;
          return;
        }
      }
    }

    this.dragTarget = null;
  }

  onMouseUp(e) {
    const px = e.clientX;
    const py = e.clientY;
    const now = Date.now();
    const clickDuration = now - this.mouseDownTime;
    document.body.style.cursor = 'default';

    // Handle dragged food drop
    if (this.dragTarget === 'food' && this.draggedFood) {
      const food = this.draggedFood;
      this.draggedFood = null;
      this.dragTarget = null;
      this.isDragging = false;
      this.isMouseDown = false;

      // Check if dropped directly on any bunny
      const targetBunny = this.app.getBunnyAt ? this.app.getBunnyAt(px, py) : (this.app.bunny && this.app.bunny.isPointInside(px, py) ? this.app.bunny : null);
      if (targetBunny) {
        targetBunny.needs.feed(food.id);
        targetBunny.totalCarrotsFed++;
        soundEngine.playCrunch();

        for (let i = 0; i < 4; i++) {
          const vx = (Math.random() - 0.5) * 1.5;
          const vy = -1 - Math.random() * 1.5;
          targetBunny.addParticle(targetBunny.x + vx * 10, targetBunny.y - 25, vx, vy, 'heart');
        }

        targetBunny.stateMachine.setState('happy', 2200);
        this.app.removeWorldFood(food);
        this.app.checkAchievements();
        this.app.saveState();
        return;
      }

      // Dropped onto ground/taskbar
      food.vy = 1.2;
      food.groundY = this.app.bunny ? this.app.bunny.groundY : this.app.groundY;
      const db = this.app.hud ? this.app.hud.getDrawerBounds() : null;
      if (this.app.hud && this.app.hud.isDrawerOpen && db) {
        if (food.x >= db.x - 20 && food.x <= db.x + db.width + 20) {
          food.x = (db.x + db.width + 50 < this.app.canvas.width - 40)
            ? db.x + db.width + 40 + Math.random() * 40
            : db.x - 50 - Math.random() * 40;
        }
      }
      food.x = Math.max(40, Math.min(this.app.canvas.width - 40, food.x));
      food.isGrounded = false;
      soundEngine.playHop();

      // Nearest bunny walks over to eat the dropped/moved treat
      let closestBunny = null;
      let minD = Infinity;
      for (const b of (this.app.bunnies || [this.app.bunny])) {
        if (b && b.stateMachine.currentState !== 'dangling') {
          const d = Math.hypot(b.x - food.x, b.y - food.y);
          if (d < minD) { minD = d; closestBunny = b; }
        }
      }
      if (closestBunny) {
        closestBunny.targetX = food.x;
        closestBunny.targetY = food.y;
        closestBunny.direction = (food.x > closestBunny.x) ? 1 : -1;
        closestBunny.stateMachine.setState('walk', 6000);
      }
      return;
    }

    // Handle dragged menu
    if (this.dragTarget === 'menu') {
      const wasDragging = this.isDragging;
      this.dragTarget = null;
      this.isDragging = false;
      this.isMouseDown = false;

      if (wasDragging) {
        if (this.app.state && this.app.state.settings && this.app.hud) {
          this.app.state.settings.menuPosition = {
            x: Math.round(this.app.hud.bagBtn.x),
            y: Math.round(this.app.hud.bagBtn.y)
          };
          this.app.saveState();
        }
        return;
      } else {
        if (clickDuration < 400 && this.app.hud) {
          const btn = this.app.hud.getButtonAt(px, py);
          if (btn && btn.type === 'bag') {
            this.app.hud.toggleDrawer();
          }
        }
        return;
      }
    }

    // Handle dragged bunny drop
    if (this.dragTarget === 'bunny' && this.draggedBunny) {
      if (this.isDragging) {
        this.draggedBunny.endDrag();
        this.isDragging = false;
        this.isMouseDown = false;
        this.dragTarget = null;
        const b = this.draggedBunny;
        this.draggedBunny = null;
        if (b.floorMode === 'free') {
          this.app.saveState();
        }
        return;
      }
    }

    this.isDragging = false;
    this.isMouseDown = false;
    this.dragTarget = null;
    this.pendingFoodSlot = null;

    // Handle clicks
    if (clickDuration < 400) {
      this.handleClick(px, py, now);
    }
  }

  handleClick(px, py, now) {
    if (this.app.hud && this.app.hud.selectedFoodToDrop) {
      const foodId = this.app.hud.selectedFoodToDrop;
      this.app.dropFood(foodId, px, -28);
      this.app.hud.selectedFoodToDrop = null;
      return;
    }

    const food = this.findFoodAt(px, py);
    if (food) {
      let closestBunny = null;
      let minD = Infinity;
      for (const b of (this.app.bunnies || [this.app.bunny])) {
        if (b) {
          const d = Math.hypot(b.x - food.x, b.y - food.y);
          if (d < minD) { minD = d; closestBunny = b; }
        }
      }
      if (closestBunny) {
        closestBunny.targetX = food.x - ((food.x > closestBunny.x ? 1 : -1) * 10);
        closestBunny.targetY = closestBunny.groundY;
        closestBunny.direction = (food.x > closestBunny.x) ? 1 : -1;
        closestBunny.stateMachine.setState('walk', 6000);
        soundEngine.playHop();
      }
      return;
    }

    if (this.app.hud) {
      const btn = this.app.hud.getButtonAt(px, py);
      if (btn) {
        if (btn.type === 'bag') {
          this.app.hud.toggleDrawer();
          return;
        } else if (btn.type === 'food') {
          if (this.app.inventory.foods[btn.foodId] > 0) {
            const margin = 80;
            const dropX = Math.floor(Math.random() * (this.app.canvas.width - margin * 2)) + margin;
            this.app.dropFood(btn.foodId, dropX, -28);
            this.app.hud.selectedFoodToDrop = null;
          }
          return;
        } else if (btn.type === 'add-bunny') {
          this.app.addBunny();
          return;
        } else if (btn.type === 'bunny-status') {
          const count = (this.app.bunnies && this.app.bunnies.length) || 1;
          const max = this.app.getMaxBunnies ? this.app.getMaxBunnies() : 1;
          const nextLv = count * 10;
          this.app.hud.showNotification(
            `Bunny Family (${count}/${max})`,
            `Next companion unlocks at Level ${nextLv}!`,
            4000,
            '🐰'
          );
          return;
        } else if (btn.type === 'open-wardrobe') {
          if (window.api) window.api.openWardrobe();
          return;
        } else if (btn.type === 'open-settings') {
          if (window.api) window.api.openSettings();
          return;
        } else if (btn.type === 'quit-app') {
          if (this.app) this.app.saveState();
          if (window.api) window.api.quitApp();
          return;
        }
        return;
      }
    }

    if (this.app.garden && this.app.garden.isPointInside(px, py)) {
      this.app.garden.harvest(1);
      return;
    }

    const clickedBunny = this.draggedBunny || (this.app.getBunnyAt ? this.app.getBunnyAt(px, py) : (this.app.bunny && this.app.bunny.isPointInside(px, py) ? this.app.bunny : null));
    this.draggedBunny = null;

    if (clickedBunny) {
      const isDoubleClick = (now - this.lastClickTime < 320);
      this.lastClickTime = now;

      if (isDoubleClick) {
        clickedBunny.doubleClick();
      } else {
        clickedBunny.pet(px, py);
      }
      return;
    }
  }

  onMouseLeave() {
    if (this.isDragging && this.dragTarget === 'bunny' && this.draggedBunny) {
      this.draggedBunny.endDrag();
      this.draggedBunny = null;
    }
    if (this.draggedFood) {
      this.draggedFood.isGrounded = false;
      this.draggedFood.vy = 1.0;
      this.draggedFood.x = Math.max(90, Math.min(this.app.canvas.width - 40, this.draggedFood.x));
      this.draggedFood = null;
    }
    this.isDragging = false;
    this.isMouseDown = false;
    this.dragTarget = null;
    this.pendingFoodSlot = null;
    if (this.app.bunnies) {
      for (const b of this.app.bunnies) {
        b.isHovered = false;
      }
    }
    this.updateMouseIgnoreState(false);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { InputManager };
}
