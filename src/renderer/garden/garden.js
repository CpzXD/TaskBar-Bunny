// src/renderer/garden/garden.js
// Carrot mini-garden plot simulation and growth tracking

const { ItemSprites } = require('../sprites/itemSprites');
const { soundEngine } = require('../engine/soundEngine');

class CarrotGarden {
  constructor(gardenData = {}, onHarvestCallback) {
    this.plots = gardenData.plots || [
      { id: 1, planted: true, plantedAt: Date.now() - 30000, growDurationMs: 90000, ready: false }
    ];
    this.onHarvest = onHarvestCallback;
    this.x = 240; // Default screen X position
    this.y = 168; // Ground Y position
    this.width = 36;
    this.height = 24;
    this.animationFrame = 0;
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
      // Auto re-plant after short delay
      setTimeout(() => {
        plot.planted = true;
        plot.plantedAt = Date.now();
        plot.ready = false;
      }, 1500);

      const reward = {
        carrots: 2 + Math.floor(Math.random() * 2), // 2-3 carrots
        coins: 15,
        xp: 25
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
    const plot = this.plots[0];
    if (!plot) return;

    const stage = this.getPlotStage(plot);
    ItemSprites.drawGardenPlot(ctx, this.x, this.y, Math.max(0, stage), this.animationFrame);

    // Harvest tooltip indicator if ready
    if (plot.ready) {
      ctx.save();
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
