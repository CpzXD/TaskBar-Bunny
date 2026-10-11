// src/renderer/ui/hud.js
// Overlay HUD: inventory bag, food drop drawer, notifications, dropped items, and garden

const { ItemSprites } = require('../sprites/itemSprites');
const { FOODS } = require('../../shared/constants');
const { soundEngine } = require('../engine/soundEngine');

class HUD {
  constructor(app) {
    this.app = app;
    this.isDrawerOpen = false;
    this.selectedFoodToDrop = null;
    this.notifications = []; // { text, subtext, icon, timer, duration }

    // Docked Bag Button bounds (bottom left of overlay)
    this.bagBtn = {
      x: 36,
      y: 154,
      width: 44,
      height: 24
    };

    // Food items for quick tray
    this.foodKeys = ['carrot', 'lettuce', 'apple', 'clover', 'strawberry'];
  }

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
    soundEngine.playHop();
  }

  showNotification(text, subtext = '', duration = 4000, icon = '🥕') {
    this.notifications.push({
      text,
      subtext,
      icon,
      timer: 0,
      duration,
      alpha: 1.0
    });
  }

  update(deltaTime) {
    for (let i = this.notifications.length - 1; i >= 0; i--) {
      const n = this.notifications[i];
      n.timer += deltaTime;
      if (n.timer >= n.duration) {
        this.notifications.splice(i, 1);
      } else if (n.timer >= n.duration - 800) {
        n.alpha = Math.max(0, (n.duration - n.timer) / 800);
      }
    }
  }

  getDrawerBounds() {
    if (!this.isDrawerOpen) return null;
    return {
      x: 16,
      y: 78,
      width: 250,
      height: 68
    };
  }

  getButtonAt(px, py) {
    // 1. Check Bag Button
    if (
      px >= this.bagBtn.x - this.bagBtn.width / 2 &&
      px <= this.bagBtn.x + this.bagBtn.width / 2 &&
      py >= this.bagBtn.y - this.bagBtn.height / 2 &&
      py <= this.bagBtn.y + this.bagBtn.height / 2
    ) {
      return { type: 'bag' };
    }

    // 2. Check Drawer buttons if open
    if (this.isDrawerOpen) {
      const db = this.getDrawerBounds();
      if (px >= db.x && px <= db.x + db.width && py >= db.y && py <= db.y + db.height) {
        // Food item slots (row 1)
        const slotW = 36;
        const startX = db.x + 8;
        const startY = db.y + 6;

        for (let i = 0; i < this.foodKeys.length; i++) {
          const fx = startX + i * 42;
          const fy = startY;
          if (px >= fx && px <= fx + 36 && py >= fy && py <= fy + 36) {
            return { type: 'food', foodId: this.foodKeys[i] };
          }
        }

        // Action icons (row 2: Wardrobe, Settings)
        const wx = db.x + 10;
        const wy = db.y + 44;
        if (px >= wx && px <= wx + 56 && py >= wy && py <= wy + 20) {
          return { type: 'open-wardrobe' };
        }
        const sx = db.x + 72;
        const sy = db.y + 44;
        if (px >= sx && px <= sx + 54 && py >= sy && py <= sy + 20) {
          return { type: 'open-settings' };
        }

        return { type: 'drawer-bg' };
      }
    }

    return null;
  }

  isPointInside(px, py) {
    if (this.getButtonAt(px, py)) return true;
    return false;
  }

  draw(ctx, inventory, coins, level, hunger, happiness) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;

    // 1. Bag Button
    const bx = Math.floor(this.bagBtn.x - this.bagBtn.width / 2);
    const by = Math.floor(this.bagBtn.y - this.bagBtn.height / 2);

    // Cute rounded pill button
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.strokeStyle = '#fcd34d';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bx, by, this.bagBtn.width, this.bagBtn.height, 8);
    ctx.fill();
    ctx.stroke();

    // Carrot icon & count
    ItemSprites.drawFood(ctx, 'carrot', bx + 12, by + 12, 16);
    ctx.fillStyle = '#4a2810';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${inventory.foods.carrot || 0}`, bx + 22, by + 12);

    // 2. Drawer Panel
    if (this.isDrawerOpen) {
      const db = this.getDrawerBounds();

      // Drawer background card
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(db.x, db.y, db.width, db.height, 10);
      ctx.fill();
      ctx.stroke();

      // Draw foods row
      const startX = db.x + 8;
      const startY = db.y + 6;

      for (let i = 0; i < this.foodKeys.length; i++) {
        const key = this.foodKeys[i];
        const fx = startX + i * 42;
        const count = inventory.foods[key] || 0;
        const isSelected = this.selectedFoodToDrop === key;

        // Slot card
        ctx.fillStyle = isSelected ? '#ffedd5' : '#f8fafc';
        ctx.strokeStyle = isSelected ? '#f97316' : '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(fx, startY, 36, 34, 6);
        ctx.fill();
        ctx.stroke();

        // Food sprite
        ItemSprites.drawFood(ctx, key, fx + 18, startY + 14, 16);

        // Count badge
        ctx.fillStyle = count > 0 ? '#1e293b' : '#94a3b8';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`x${count}`, fx + 18, startY + 29);
      }

      // Action buttons: Wardrobe & Settings
      // Wardrobe Button
      ctx.fillStyle = '#fce7f3';
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(db.x + 10, db.y + 44, 56, 18, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#9d174d';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👗 Closet', db.x + 38, db.y + 53);

      // Settings Button
      ctx.fillStyle = '#f1f5f9';
      ctx.strokeStyle = '#94a3b8';
      ctx.beginPath();
      ctx.roundRect(db.x + 72, db.y + 44, 54, 18, 4);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#334155';
      ctx.fillText('⚙️ Setup', db.x + 99, db.y + 53);

      // Coin counter badge
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(db.x + 144, db.y + 53, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${coins || 0}g`, db.x + 152, db.y + 53);

      // Lv badge
      ctx.fillStyle = '#4f46e5';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`Lv.${level || 1}`, db.x + db.width - 8, db.y + 53);
    }

    // 3. Drop food cursor hint
    if (this.selectedFoodToDrop) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = '#ff8800';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(14, 18, 175, 22, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#c2410c';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`Click taskbar to drop ${FOODS[this.selectedFoodToDrop]?.name || 'treat'}!`, 22, 29);
      ctx.restore();
    }

    // 4. Notifications
    let notifY = 22;
    for (const notif of this.notifications) {
      ctx.save();
      ctx.globalAlpha = notif.alpha;
      const nw = 280;
      const nh = 36;
      const nx = Math.floor((ctx.canvas.width - nw) / 2);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(nx, notifY, nw, nh, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = '16px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(notif.icon, nx + 10, notifY + 18);

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(notif.text, nx + 34, notifY + 12);

      if (notif.subtext) {
        ctx.fillStyle = '#64748b';
        ctx.font = '9px sans-serif';
        ctx.fillText(notif.subtext, nx + 34, notifY + 25);
      }

      ctx.restore();
      notifY += 42;
    }

    ctx.restore();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HUD };
}
