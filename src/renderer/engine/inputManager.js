// src/renderer/engine/inputManager.js
// Handles user clicks, carrot/food dragging, bunny picking up, petting, and click-through switching

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

    // Drag target tracking
    this.dragTarget = null; // 'food' | 'bunny' | 'drawer-food'
    this.draggedFood = null;
    this.dragFoodOffsetX = 0;
    this.dragFoodOffsetY = 0;
    this.pendingFoodSlot = null;

    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    window.addEventListener('mouseleave', () => this.onMouseLeave());
  }

  findFoodAt(px, py) {
    if (!this.app.worldFoods) return null;
    // Check foods in reverse order (topmost first)
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

    // 1. Dropped Food hit test (highest priority)
    if (this.findFoodAt(px, py)) return true;

    // 2. Bunny hit test (smaller tight hitbox)
    if (this.app.bunny && this.app.bunny.isPointInside(px, py)) return true;

    // 3. HUD hit test
    if (this.app.hud && this.app.hud.isPointInside(px, py)) return true;

    // 4. Garden hit test
    if (this.app.garden && this.app.garden.isPointInside(px, py)) return true;

    // 5. If food is selected to drop, clicking anywhere on the ground is interactive
    if (this.app.hud && this.app.hud.selectedFoodToDrop) {
      if (py >= 40) return true;
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

    // Update cursor
    if (this.findFoodAt(px, py)) {
      document.body.style.cursor = 'grab';
    } else if (this.app.bunny && this.app.bunny.isPointInside(px, py)) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }

    if (!this.isMouseDown) return;

    const dist = Math.hypot(px - this.mouseDownX, py - this.mouseDownY);

    // 1. Dragging dropped food
    if (this.dragTarget === 'food' && this.draggedFood) {
      if (dist > 3) this.isDragging = true;
      if (this.isDragging) {
        document.body.style.cursor = 'grabbing';
        this.draggedFood.x = px + this.dragFoodOffsetX;
        this.draggedFood.y = py + this.dragFoodOffsetY;
        this.draggedFood.isGrounded = false;
        this.draggedFood.vy = 0;

        // Bunny tracks the carrot with its head
        if (this.app.bunny) {
          this.app.bunny.direction = (this.draggedFood.x > this.app.bunny.x) ? 1 : -1;
        }
      }
      return;
    }

    // 2. Dragging directly from drawer slot
    if (this.dragTarget === 'drawer-food' && this.pendingFoodSlot) {
      if (dist > 8) {
        if (this.app.inventory.foods[this.pendingFoodSlot] > 0) {
          this.app.inventory.foods[this.pendingFoodSlot]--;
          const groundY = this.app.canvas.height - 12;
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

    // 3. Dragging bunny
    if (this.dragTarget === 'bunny' && this.app.bunny) {
      if (dist > 5) {
        if (!this.isDragging) {
          this.isDragging = true;
          this.app.bunny.startDrag(px, py);
        }
        this.app.bunny.updateDrag(px, py);
      }
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

    // 1. Check if clicking on dropped food
    const food = this.findFoodAt(px, py);
    if (food) {
      this.dragTarget = 'food';
      this.draggedFood = food;
      this.dragFoodOffsetX = food.x - px;
      this.dragFoodOffsetY = food.y - py;
      return;
    }

    // 2. Check if clicking on bunny
    if (this.app.bunny && this.app.bunny.isPointInside(px, py)) {
      this.dragTarget = 'bunny';
      return;
    }

    // 3. Check if clicking on drawer food slot
    if (this.app.hud) {
      const btn = this.app.hud.getButtonAt(px, py);
      if (btn && btn.type === 'food') {
        this.dragTarget = 'drawer-food';
        this.pendingFoodSlot = btn.foodId;
        return;
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

      // Check if dropped directly on bunny
      if (this.app.bunny && this.app.bunny.isPointInside(px, py)) {
        this.app.bunny.needs.feed(food.id);
        this.app.bunny.totalCarrotsFed++;
        soundEngine.playCrunch();

        for (let i = 0; i < 4; i++) {
          const vx = (Math.random() - 0.5) * 1.5;
          const vy = -1 - Math.random() * 1.5;
          this.app.bunny.addParticle(this.app.bunny.x + vx * 10, this.app.bunny.y - 25, vx, vy, 'heart');
        }

        this.app.bunny.stateMachine.setState('happy', 2200);
        this.app.removeWorldFood(food);
        this.app.checkAchievements();
        this.app.saveState();
        return;
      }

      // Dropped onto ground/taskbar
      food.vy = 1.2;
      food.groundY = this.app.canvas.height - 12;
      // Safety clamp: keep at least 90px from left edge so it never hides behind the counter pill
      food.x = Math.max(90, Math.min(this.app.canvas.width - 40, food.x));
      food.isGrounded = false;
      soundEngine.playHop();

      // Bunny walks over to eat the dropped/moved treat
      if (this.app.bunny && this.app.bunny.stateMachine.currentState !== 'dangling') {
        this.app.bunny.targetX = food.x;
        this.app.bunny.direction = (food.x > this.app.bunny.x) ? 1 : -1;
        this.app.bunny.stateMachine.setState('walk', 6000);
      }
      return;
    }

    // Handle dragged bunny drop
    if (this.dragTarget === 'bunny' && this.app.bunny) {
      if (this.isDragging) {
        this.app.bunny.endDrag();
        this.isDragging = false;
        this.isMouseDown = false;
        this.dragTarget = null;
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
    // 1. If dropping food selected from drawer
    if (this.app.hud && this.app.hud.selectedFoodToDrop) {
      const foodId = this.app.hud.selectedFoodToDrop;
      this.app.dropFood(foodId, px, py);
      this.app.hud.selectedFoodToDrop = null;
      return;
    }

    // 2. Check dropped food click -> bunny walks over to it
    const food = this.findFoodAt(px, py);
    if (food) {
      if (this.app.bunny) {
        this.app.bunny.targetX = food.x;
        this.app.bunny.direction = (food.x > this.app.bunny.x) ? 1 : -1;
        this.app.bunny.stateMachine.setState('walk', 6000);
        soundEngine.playHop();
      }
      return;
    }

    // 3. Check HUD buttons
    if (this.app.hud) {
      const btn = this.app.hud.getButtonAt(px, py);
      if (btn) {
        if (btn.type === 'bag') {
          this.app.hud.toggleDrawer();
          return;
        } else if (btn.type === 'food') {
          if (this.app.inventory.foods[btn.foodId] > 0) {
            this.app.hud.selectedFoodToDrop = btn.foodId;
          }
          return;
        } else if (btn.type === 'open-wardrobe') {
          if (window.api) window.api.openWardrobe();
          return;
        } else if (btn.type === 'open-settings') {
          if (window.api) window.api.openSettings();
          return;
        }
        return;
      }
    }

    // 4. Check Garden harvest
    if (this.app.garden && this.app.garden.isPointInside(px, py)) {
      this.app.garden.harvest(1);
      return;
    }

    // 5. Check Bunny (Pet or Double Click Hop)
    if (this.app.bunny && this.app.bunny.isPointInside(px, py)) {
      const isDoubleClick = (now - this.lastClickTime < 320);
      this.lastClickTime = now;

      if (isDoubleClick) {
        this.app.bunny.doubleClick();
      } else {
        this.app.bunny.pet(px, py);
      }
      return;
    }
  }

  onMouseLeave() {
    if (this.isDragging && this.app.bunny && this.dragTarget === 'bunny') {
      this.app.bunny.endDrag();
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
    this.updateMouseIgnoreState(false);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { InputManager };
}
