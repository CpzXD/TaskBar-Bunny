const { ItemSprites } = require('../sprites/itemSprites');
const { soundEngine } = require('../engine/soundEngine');
class CarrotGarden {
  constructor(gardenData = {}, onHarvestCallback, app = null) {
    this.app = app;
    this.plots = gardenData.plots || [
      { id: 1, planted: true, plantedAt: Date.now() - 30000, growDurationMs: 90000, ready: false, crop: 'carrot' }
    ];
    this.onHarvest = onHarvestCallback;
    this.x = gardenData.x || 360; // Screen X position
    this.y = 168; // Ground Y position
    this.width = 36;
    this.height = 24;
    this.animationFrame = 0;
    this.lastCanvasWidth = 1200;

    if (!gardenData.x) {
      this.randomizePosition(1200);
    }
  }

  randomizePosition(canvasWidth) {
    if (canvasWidth && canvasWidth > 400) {
      this.lastCanvasWidth = canvasWidth;
    }
    const width = this.lastCanvasWidth || 1200;
    // Keep clear of drawer on the left (min 320px) and margin on the right (max width - 70px)
    const minX = 320;
    const maxX = Math.max(minX + 80, width - 70);
    this.x = Math.floor(Math.random() * (maxX - minX)) + minX;
  }

  update(deltaTime) {
    this.animationFrame++;
    const now = Date.now();

    for (const plot of this.plots) {
      if (plot.planted && !plot.ready) {
        if (now - plot.plantedAt >= (plot.growDurationMs || 90000)) {
          plot.ready = true;
        }
      }
    }
  }

  getPlotStage(plot) {
    if (!plot.planted) return -1;
    if (plot.ready) return 3;
    const progress = (Date.now() - plot.plantedAt) / (plot.growDurationMs || 90000);
    if (progress < 0.33) return 0;
    if (progress < 0.66) return 1;
    return 2;
  }

  plantSeed() {
    const emptyPlot = this.plots.find(p => !p.planted);
    if (emptyPlot) {
      emptyPlot.planted = true;
      emptyPlot.plantedAt = Date.now();
      emptyPlot.growDurationMs = 90000;
      emptyPlot.ready = false;
      this.randomizePosition(this.lastCanvasWidth);
      return true;
    }
    return false;
  }

  harvest(plotId) {
    const plot = this.plots.find(p => p.id === plotId && p.ready);
    if (plot) {
      plot.planted = false;
      plot.ready = false;
      soundEngine.playCoin();

      const terrain = (this.app?.state?.settings?.activeTerrain) || 'grassy';
      let foodType = plot.crop || 'carrot';
      if (!foodType || (terrain === 'icy' && !['apple', 'clover'].includes(foodType))) {
        foodType = Math.random() < 0.5 ? 'apple' : 'clover';
      }

      setTimeout(() => {
        plot.planted = true;
        plot.plantedAt = Date.now();
        plot.ready = false;
        const currentTerrain = (this.app?.state?.settings?.activeTerrain) || 'grassy';
        if (currentTerrain === 'icy') {
          plot.crop = Math.random() < 0.5 ? 'apple' : 'clover';
        } else {
          const roll = Math.random();
          if (roll < 0.45) plot.crop = 'carrot';
          else if (roll < 0.75) plot.crop = 'strawberry';
          else plot.crop = 'lettuce';
        }
        this.randomizePosition(this.lastCanvasWidth);
      }, 1500);

      const count = 2 + Math.floor(Math.random() * 2);
      const reward = {
        foodType: foodType,
        carrots: foodType === 'carrot' ? count : 0,
        count: count,
        coins: 18,
        xp: 28
      };

      if (this.onHarvest) {
        this.onHarvest(reward);
      }
      return reward;
    }
    return null;
  }

  isPointInside(px, py) {
    return px >= this.x - this.width / 2 &&
           px <= this.x + this.width / 2 &&
           py >= this.y - this.height &&
           py <= this.y + 6;
  }

  draw(ctx) {
    if (ctx && ctx.canvas && ctx.canvas.width) {
      this.lastCanvasWidth = ctx.canvas.width;
    }
    const plot = this.plots[0];
    if (!plot) return;

    const stage = this.getPlotStage(plot);
    ItemSprites.drawGardenPlot(ctx, this.x, this.y, Math.max(0, stage), this.animationFrame);

    // Harvest tooltip indicator and ready crop icon
    if (plot.ready) {
      ctx.save();
      const currentCrop = plot.crop || 'carrot';
      if (currentCrop !== 'carrot') {
        ItemSprites.drawFood(ctx, currentCrop, this.x, this.y - 12, 18);
      }
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = '#ffcc00';
      ctx.textAlign = 'center';
      const bounce = (Math.floor(this.animationFrame / 8) % 2 === 0) ? 0 : -2;
      ctx.fillText('CLICK!', this.x, this.y - 20 + bounce);
      ctx.restore();
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CarrotGarden };
}
