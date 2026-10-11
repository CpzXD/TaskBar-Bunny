class BunnyDen {
  constructor(app) {
    this.app = app;
    this.width = 56;
    this.height = 44;
    this.x = 110;
    this.y = 0;
    this.showStats = false;
    this.statsTimer = 0;
    this.zzzTimer = 0;
    this.lightsFlickerTimer = 0;
  }

  get skin() {
    return this.app?.state?.settings?.denSkin || 'default';
  }

  get primaryBunny() {
    return (this.app?.bunnies && this.app.bunnies[0]) || this.app?.bunny;
  }

  isPointInside(px, py) {
    const halfW = this.width / 2;
    const left = this.x - halfW;
    const right = this.x + halfW;
    const top = this.y - this.height;
    const bottom = this.y + 4;
    return px >= left && px <= right && py >= top && py <= bottom;
  }

  toggleStats() {
    this.showStats = !this.showStats;
    if (this.showStats) {
      this.statsTimer = 9000;
    }
  }

  update(deltaTime) {
    this.y = this.app.groundY;

    // Anchor next to setting/bag menu button
    if (this.app.hud && this.app.hud.bagBtn) {
      const bag = this.app.hud.bagBtn;
      this.x = Math.round(bag.x + bag.width / 2 + 38);
    }

    if (this.statsTimer > 0) {
      this.statsTimer -= deltaTime;
      if (this.statsTimer <= 0) {
        this.showStats = false;
      }
    }

    this.zzzTimer += deltaTime;
    this.lightsFlickerTimer += deltaTime;
  }

  draw(ctx) {
    const x = Math.round(this.x);
    const y = Math.round(this.y);
    const w = this.width;
    const h = this.height;
    const halfW = Math.round(w / 2);

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    const isSleeping = this.primaryBunny && this.primaryBunny.isSleepingInDen;

    if (this.skin === 'festive') {
      this.drawFestiveDen(ctx, x, y, halfW, h, isSleeping);
    } else {
      this.drawDefaultDen(ctx, x, y, halfW, h, isSleeping);
    }

    // Floating ZZZ particles if bunny is asleep in den
    if (isSleeping) {
      const zOffset = (this.zzzTimer * 0.03) % 24;
      const alpha = Math.max(0, 1 - (zOffset / 24));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#7dd3fc';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('z', x + 8, y - h - zOffset);
      ctx.font = 'bold 9px monospace';
      ctx.fillText('z', x + 14, y - h - zOffset - 8);
      ctx.restore();
    }

    // Stats popup badge if toggled
    if (this.showStats && this.primaryBunny) {
      this.drawStatsBadge(ctx, x, y - h - 10);
    }

    ctx.restore();
  }

  drawDefaultDen(ctx, x, y, halfW, h, isSleeping) {
    const w = this.width;
    // 1. Earthy base mound / shadows
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.roundRect(x - halfW - 2, y - 6, w + 4, 8, 4);
    ctx.fill();

    // 2. Wooden Burrow Body
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(x - halfW, y - h + 12, w, h - 12, 6);
    ctx.fill();

    // Wood plank horizontal lines
    ctx.strokeStyle = '#5c2b09';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x - halfW, y - h + 22);
    ctx.lineTo(x + halfW, y - h + 22);
    ctx.moveTo(x - halfW, y - h + 32);
    ctx.lineTo(x + halfW, y - h + 32);
    ctx.stroke();

    // 3. Thatched / Mossy Roof
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.moveTo(x - halfW - 6, y - h + 14);
    ctx.lineTo(x, y - h - 2);
    ctx.lineTo(x + halfW + 6, y - h + 14);
    ctx.closePath();
    ctx.fill();

    // Roof highlight & straw details
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - halfW - 4, y - h + 12);
    ctx.lineTo(x, y - h);
    ctx.lineTo(x + halfW + 4, y - h + 12);
    ctx.stroke();

    // 4. Arched Entrance Hole
    const archW = 20;
    const archH = 22;
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(x, y - archH / 2, archW / 2, Math.PI, 0, false);
    ctx.rect(x - archW / 2, y - archH / 2, archW, archH / 2);
    ctx.fill();

    // Little warm straw bedding inside arch
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x - 8, y - 3, 16, 3);

    // If sleeping: show cute sleeping bunny face inside door
    if (isSleeping) {
      ctx.fillStyle = '#fdfbf7';
      ctx.beginPath();
      ctx.arc(x, y - 8, 6, 0, Math.PI * 2);
      ctx.fill();
      // Closed happy eyes ^ ^
      ctx.strokeStyle = '#831843';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 4, y - 9); ctx.lineTo(x - 2, y - 10); ctx.lineTo(x, y - 9);
      ctx.moveTo(x + 1, y - 9); ctx.lineTo(x + 3, y - 10); ctx.lineTo(x + 5, y - 9);
      ctx.stroke();
      // Little pink nose
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(x - 1, y - 7, 2, 1);
    }
  }

  drawFestiveDen(ctx, x, y, halfW, h, isSleeping) {
    const w = this.width;
    // 1. Gingerbread Wall Body
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.roundRect(x - halfW, y - h + 12, w, h - 12, 6);
    ctx.fill();

    // White icing wall trims
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - halfW + 2, y - h + 14, w - 4, h - 16);

    // 2. Frosted Snowy Roof
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x - halfW - 6, y - h + 14);
    ctx.lineTo(x, y - h - 3);
    ctx.lineTo(x + halfW + 6, y - h + 14);
    ctx.closePath();
    ctx.fill();

    // Icicle drips hanging down
    ctx.fillStyle = '#e0f2fe';
    for (let ix = x - halfW - 2; ix <= x + halfW + 2; ix += 6) {
      ctx.beginPath();
      ctx.moveTo(ix - 2, y - h + 14);
      ctx.lineTo(ix, y - h + 18);
      ctx.lineTo(ix + 2, y - h + 14);
      ctx.fill();
    }

    // 3. Twinkling Holiday Lights along roof
    const colors = ['#ef4444', '#10b981', '#f59e0b', '#3b82f6'];
    const flickerStep = Math.floor(this.lightsFlickerTimer / 350) % colors.length;
    let colorIdx = 0;
    for (let lx = x - halfW; lx <= x + halfW; lx += 8) {
      const c = colors[(colorIdx + flickerStep) % colors.length];
      colorIdx++;
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(lx, y - h + 12, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Candy-Cane Doorway
    const archW = 20;
    const archH = 22;
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(x, y - archH / 2, archW / 2, Math.PI, 0, false);
    ctx.rect(x - archW / 2, y - archH / 2, archW, archH / 2);
    ctx.fill();

    // Candy cane striped door border
    ctx.strokeStyle = '#dc2626';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 5. Holiday Wreath with Bow above door
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(x, y - archH - 3, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(x, y - archH - 3, 2, 0, Math.PI * 2);
    ctx.fill();
    // Red bow
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x - 2, y - archH - 7, 4, 2);

    // If sleeping: show sleeping bunny face inside door
    if (isSleeping) {
      ctx.fillStyle = '#fdfbf7';
      ctx.beginPath();
      ctx.arc(x, y - 8, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#831843';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 4, y - 9); ctx.lineTo(x - 2, y - 10); ctx.lineTo(x, y - 9);
      ctx.moveTo(x + 1, y - 9); ctx.lineTo(x + 3, y - 10); ctx.lineTo(x + 5, y - 9);
      ctx.stroke();
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(x - 1, y - 7, 2, 1);
    }
  }

  drawStatsBadge(ctx, bx, by) {
    const bunny = this.primaryBunny;
    if (!bunny) return;

    const hunger = Math.round(bunny.needs.hunger);
    const happiness = Math.round(bunny.needs.happiness);
    const name = bunny.name || 'Barnaby';

    const cardW = 120;
    const cardH = 46;
    const left = bx - Math.round(cardW / 2);
    const top = by - cardH;

    // Background card
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    ctx.strokeStyle = '#f472b6';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(left, top, cardW, cardH, 8);
    ctx.fill();
    ctx.stroke();

    // Header title
    ctx.fillStyle = '#831843';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`🐰 ${name}'s Den Stats`, bx, top + 12);

    // Hunger row
    const barW = 54;
    const barH = 5;
    const barX = left + 56;

    ctx.font = '9px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#b45309';
    ctx.fillText(`🥕 ${hunger}%`, left + 8, top + 24);

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(barX, top + 19, barW, barH, 2.5);
    ctx.fill();
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.roundRect(barX, top + 19, Math.round((barW * hunger) / 100), barH, 2.5);
    ctx.fill();

    // Happiness row
    ctx.fillStyle = '#be185d';
    ctx.fillText(`💖 ${happiness}%`, left + 8, top + 38);

    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.roundRect(barX, top + 33, barW, barH, 2.5);
    ctx.fill();
    ctx.fillStyle = '#ec4899';
    ctx.beginPath();
    ctx.roundRect(barX, top + 33, Math.round((barW * happiness) / 100), barH, 2.5);
    ctx.fill();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BunnyDen };
}
