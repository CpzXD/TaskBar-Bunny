class WorldTerrain {
  constructor(app) {
    this.app = app;
    this.animationTimer = 0;
  }

  get active() {
    return this.app?.state?.settings?.activeTerrain || 'grassy';
  }

  update(deltaTime) {
    this.animationTimer += deltaTime;
  }

  draw(ctx, groundY, screenWidth) {
    const y = Math.round(groundY);
    const w = screenWidth || 1920;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    if (this.active === 'icy') {
      this.drawIcyTerrain(ctx, y, w);
    } else {
      this.drawGrassyTerrain(ctx, y, w);
    }

    ctx.restore();
  }

  drawGrassyTerrain(ctx, y, w) {
    // 1. Earthy soil bed below taskbar ground line
    ctx.fillStyle = '#451a03';
    ctx.fillRect(0, y - 1, w, 14);

    // 2. Rich mossy grass base line
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, y - 3, w, 3);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, y - 4, w, 2);

    // 3. Grass blades tufts & little wild flowers
    ctx.fillStyle = '#4ade80';
    for (let x = 12; x < w; x += 32) {
      ctx.fillRect(x, y - 6, 2, 3);
      ctx.fillRect(x + 2, y - 5, 1, 2);
    }

    // Little yellow daisies & white buttercups
    for (let x = 45; x < w; x += 110) {
      // White petals
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 2, y - 7, 5, 3);
      ctx.fillRect(x - 1, y - 8, 3, 5);
      // Yellow core
      ctx.fillStyle = '#facc15';
      ctx.fillRect(x, y - 6, 1, 1);
    }
  }

  drawIcyTerrain(ctx, y, w) {
    // 1. Deep cold lake water under ice
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, y - 1, w, 14);

    // 2. Translucent glacial ice surface
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(0, y - 4, w, 4);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(0, y - 5, w, 2);

    // 3. Crystalline reflection streaks & ice cracks
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 30; x < w; x += 95) {
      ctx.moveTo(x, y - 4);
      ctx.lineTo(x + 18, y - 2);
      ctx.moveTo(x + 40, y - 3);
      ctx.lineTo(x + 55, y - 5);
    }
    ctx.stroke();

    // 4. Twinkling ice crystals & frost sparkles
    const twinkle = Math.floor(this.animationTimer / 300);
    const glintColors = ['#ffffff', '#7dd3fc', '#e0f2fe'];
    for (let i = 0; i < 18; i++) {
      const gx = ((i * 107) + (twinkle * 13)) % w;
      const c = glintColors[(i + twinkle) % glintColors.length];
      ctx.fillStyle = c;
      ctx.fillRect(gx, y - 6, 2, 2);
      ctx.fillRect(gx - 1, y - 5, 4, 1);
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WorldTerrain };
}
