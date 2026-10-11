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

    // Docked Bag Button bounds (bottom left, just above the taskbar)
    this.bagBtn = {
      x: 36,
      y: 154,
      width: 44,
      height: 24
    };
    // Top of the food drawer; both y values are recomputed in layout()
    this.drawerY = 78;

    // Food items for quick tray
    this.foodKeys = ['carrot', 'lettuce', 'apple', 'clover', 'strawberry'];
  }

  get scale() {
    return this.app.state?.settings?.menuScale || 1.0;
  }

  // Anchor the bottom-left controls to the visible bottom edge (the top of the taskbar)
  layout(canvasHeight, taskbarOverlap = 0) {
    this.canvasHeight = canvasHeight;
    this.taskbarOverlap = taskbarOverlap;
    const s = this.scale;
    const bottom = canvasHeight - taskbarOverlap;

    this.bagBtn.width = Math.round(52 * s);
    this.bagBtn.height = Math.round(28 * s);
    this.bagBtn.x = Math.round(16 + this.bagBtn.width / 2);
    this.bagBtn.y = bottom - Math.round(this.bagBtn.height / 2) - 8;
    this.drawerY = bottom - Math.round(115 * s) - 8;
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
    const s = this.scale;
    return {
      x: 16,
      y: this.drawerY,
      width: Math.round(270 * s),
      height: Math.round(76 * s)
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
        const s = this.scale;
        const slotW = Math.round(38 * s);
        const slotH = Math.round(36 * s);
        const slotGap = Math.round(44 * s);
        const startX = db.x + Math.round(8 * s);
        const startY = db.y + Math.round(6 * s);

        // Food item slots (row 1)
        for (let i = 0; i < this.foodKeys.length; i++) {
          const fx = startX + i * slotGap;
          if (px >= fx && px <= fx + slotW && py >= startY && py <= startY + slotH) {
            return { type: 'food', foodId: this.foodKeys[i] };
          }
        }

        // Action icons (row 2: Wardrobe, Settings)
        const btnY = db.y + Math.round(45 * s);
        const btnH = Math.round(22 * s);
        const btn1W = Math.round(68 * s);
        const btn2W = Math.round(68 * s);
        const wx = db.x + Math.round(8 * s);
        if (px >= wx && px <= wx + btn1W && py >= btnY && py <= btnY + btnH) {
          return { type: 'open-wardrobe' };
        }
        const sx = wx + btn1W + Math.round(6 * s);
        if (px >= sx && px <= sx + btn2W && py >= btnY && py <= btnY + btnH) {
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

    const s = this.scale;

    // 1. Bag Button
    const bx = Math.floor(this.bagBtn.x - this.bagBtn.width / 2);
    const by = Math.floor(this.bagBtn.y - this.bagBtn.height / 2);

    // Cute rounded pill button
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.strokeStyle = '#fcd34d';
    ctx.lineWidth = Math.max(1.5, Math.round(2 * s));
    ctx.beginPath();
    ctx.roundRect(bx, by, this.bagBtn.width, this.bagBtn.height, Math.round(8 * s));
    ctx.fill();
    ctx.stroke();

    // Carrot icon & count
    ItemSprites.drawFood(ctx, 'carrot', bx + Math.round(14 * s), by + Math.round(14 * s), Math.round(16 * s));
    ctx.fillStyle = '#4a2810';
    ctx.font = `bold ${Math.max(10, Math.round(11 * s))}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${inventory.foods.carrot || 0}`, bx + Math.round(24 * s), by + Math.round(14 * s));

    // 2. Drawer Panel
    if (this.isDrawerOpen) {
      const db = this.getDrawerBounds();

      // Drawer background card
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = Math.max(1.5, Math.round(2 * s));
      ctx.beginPath();
      ctx.roundRect(db.x, db.y, db.width, db.height, Math.round(10 * s));
      ctx.fill();
      ctx.stroke();

      // Draw foods row
      const slotW = Math.round(38 * s);
      const slotH = Math.round(36 * s);
      const slotGap = Math.round(44 * s);
      const startX = db.x + Math.round(8 * s);
      const startY = db.y + Math.round(6 * s);

      for (let i = 0; i < this.foodKeys.length; i++) {
        const key = this.foodKeys[i];
        const fx = startX + i * slotGap;
        const count = inventory.foods[key] || 0;
        const isSelected = this.selectedFoodToDrop === key;

        // Slot card
        ctx.fillStyle = isSelected ? '#ffedd5' : '#f8fafc';
        ctx.strokeStyle = isSelected ? '#f97316' : '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(fx, startY, slotW, slotH, Math.round(6 * s));
        ctx.fill();
        ctx.stroke();

        // Food sprite
        ItemSprites.drawFood(ctx, key, fx + Math.round(slotW / 2), startY + Math.round(15 * s), Math.round(16 * s));

        // Count badge
        ctx.fillStyle = count > 0 ? '#1e293b' : '#94a3b8';
        ctx.font = `bold ${Math.max(8, Math.round(9 * s))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`x${count}`, fx + Math.round(slotW / 2), startY + Math.round(29 * s));
      }

      // Action buttons: Wardrobe & Settings
      const btnY = db.y + Math.round(45 * s);
      const btnH = Math.round(22 * s);
      const btn1W = Math.round(68 * s);
      const btn2W = Math.round(68 * s);
      const wx = db.x + Math.round(8 * s);
      const sx = wx + btn1W + Math.round(6 * s);

      // Wardrobe Button
      ctx.fillStyle = '#fce7f3';
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(wx, btnY, btn1W, btnH, Math.round(4 * s));
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#9d174d';
      ctx.font = `bold ${Math.max(9, Math.round(10 * s))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👗 Closet', wx + Math.round(btn1W / 2), btnY + Math.round(btnH / 2));

      // Settings Button
      ctx.fillStyle = '#f1f5f9';
      ctx.strokeStyle = '#94a3b8';
      ctx.beginPath();
      ctx.roundRect(sx, btnY, btn2W, btnH, Math.round(4 * s));
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#334155';
      ctx.fillText('⚙️ Setup', sx + Math.round(btn2W / 2), btnY + Math.round(btnH / 2));

      // Coin counter badge
      const coinY = btnY + Math.round(btnH / 2);
      const coinX = sx + btn2W + Math.round(14 * s);
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(coinX, coinY, Math.round(5 * s), 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b45309';
      ctx.font = `bold ${Math.max(9, Math.round(10 * s))}px sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(`${coins || 0}g`, coinX + Math.round(8 * s), coinY);

      // Lv badge
      ctx.fillStyle = '#4f46e5';
      ctx.font = `bold ${Math.max(9, Math.round(10 * s))}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(`Lv.${level || 1}`, db.x + db.width - Math.round(8 * s), coinY);
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
