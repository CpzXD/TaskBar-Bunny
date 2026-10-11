// src/renderer/sprites/itemSprites.js
// Procedural pixel sprites for food items, garden growth stages, thought bubbles, and particle effects

class ItemSprites {
  /**
   * Draw a food item centered at (x, y)
   * @param {CanvasRenderingContext2D} ctx
   * @param {string} foodId - 'carrot', 'lettuce', 'apple', 'clover', 'strawberry'
   * @param {number} x - center x
   * @param {number} y - center y
   * @param {number} size - 16 or 24 px
   */
  static drawFood(ctx, foodId, x, y, size = 16) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    const ox = Math.floor(x - size / 2);
    const oy = Math.floor(y - size / 2);

    const p = (dx, dy, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(ox + dx, oy + dy, 1, 1);
    };

    const rect = (dx, dy, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(ox + dx, oy + dy, w, h);
    };

    switch (foodId) {
      case 'carrot':
        // Crisp crunchy carrot (16x16)
        // Green leaves on top
        p(7, 2, '#48bb78'); p(8, 1, '#38a169'); p(9, 2, '#48bb78');
        p(6, 3, '#2f855a'); p(8, 3, '#38a169'); p(10, 3, '#2f855a');
        // Orange carrot body
        rect(7, 4, 3, 2, '#ed8936');
        rect(6, 6, 4, 2, '#dd6b20');
        rect(6, 8, 3, 2, '#c05621');
        rect(7, 10, 2, 2, '#dd6b20');
        rect(7, 12, 1, 2, '#c05621');
        // Highlights & grooves
        p(7, 5, '#f6ad55');
        p(7, 7, '#f6ad55');
        p(8, 9, '#7b341e');
        break;

      case 'lettuce':
        // Crispy green ruffled leaf
        rect(5, 5, 6, 6, '#48bb78');
        rect(4, 6, 8, 4, '#68d391');
        rect(6, 4, 4, 8, '#9ae6b4');
        p(7, 7, '#ffffff'); // crisp stem
        p(7, 8, '#ffffff');
        p(7, 9, '#ffffff');
        p(4, 5, '#2f855a');
        p(11, 5, '#2f855a');
        p(4, 10, '#2f855a');
        p(11, 10, '#2f855a');
        break;

      case 'apple':
        // Sweet red apple slice
        rect(5, 5, 6, 6, '#e53e3e');
        rect(6, 4, 4, 1, '#c53030');
        p(7, 2, '#744210'); // stem
        p(8, 2, '#48bb78'); // leaf
        rect(6, 6, 4, 4, '#fff5f5'); // juicy white center
        p(7, 8, '#744210'); // pip / seed
        break;

      case 'clover':
        // Four-leaf clover
        rect(4, 4, 3, 3, '#38a169');
        rect(9, 4, 3, 3, '#38a169');
        rect(4, 9, 3, 3, '#38a169');
        rect(9, 9, 3, 3, '#38a169');
        p(5, 5, '#9ae6b4');
        p(10, 5, '#9ae6b4');
        p(5, 10, '#9ae6b4');
        p(10, 10, '#9ae6b4');
        // Stem
        p(8, 8, '#276749');
        p(7, 11, '#276749');
        p(6, 13, '#276749');
        break;

      case 'strawberry':
        // Ripe strawberry
        // Green leafy cap
        p(6, 3, '#48bb78'); p(8, 2, '#38a169'); p(10, 3, '#48bb78');
        rect(5, 4, 6, 2, '#2f855a');
        // Berry heart
        rect(5, 6, 6, 4, '#e53e3e');
        rect(6, 10, 4, 3, '#c53030');
        rect(7, 13, 2, 1, '#9b2c2c');
        // Yellow seed flecks
        p(6, 7, '#fef08a');
        p(9, 7, '#fef08a');
        p(7, 9, '#fef08a');
        p(8, 11, '#fef08a');
        break;

      default:
        rect(6, 6, 4, 4, '#ffd166');
    }
    ctx.restore();
  }

  /**
   * Draw carrot garden growth plot (24x20)
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x - center x
   * @param {number} y - bottom y (sits on taskbar)
   * @param {number} stage - 0: seed, 1: sprout, 2: growing, 3: harvest-ready
   * @param {number} frame - animation frame
   */
  static drawGardenPlot(ctx, x, y, stage = 0, frame = 0) {
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    const ox = Math.floor(x - 12);
    const oy = Math.floor(y - 14);

    const rect = (dx, dy, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(ox + dx, oy + dy, w, h);
    };

    const p = (dx, dy, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(ox + dx, oy + dy, 1, 1);
    };

    // 1. Soil mound (rich garden brown)
    rect(2, 10, 20, 4, '#5c3d2e');
    rect(1, 12, 22, 2, '#42281d');
    rect(4, 9, 16, 1, '#785340');
    // Soil pebble highlights
    p(5, 11, '#8f6750');
    p(14, 11, '#8f6750');
    p(18, 12, '#331f17');

    // 2. Plant stage
    if (stage === 0) {
      // Planted seed bump
      rect(11, 8, 2, 2, '#38a169');
      p(11, 7, '#48bb78');
    } else if (stage === 1) {
      // Tiny cute sprout
      p(11, 7, '#38a169');
      rect(10, 6, 3, 1, '#48bb78');
      p(9, 5, '#68d391');
      p(13, 5, '#68d391');
    } else if (stage === 2) {
      // Growing green fronds
      rect(11, 4, 2, 5, '#2f855a');
      rect(9, 3, 2, 3, '#38a169');
      rect(13, 3, 2, 3, '#38a169');
      p(8, 2, '#68d391');
      p(15, 2, '#68d391');
    } else if (stage >= 3) {
      // Harvest ready! Golden/orange carrot peaking out with sparkles!
      rect(10, 6, 4, 3, '#ed8936');
      rect(11, 9, 2, 1, '#dd6b20');
      // Tall lush greens
      rect(11, 2, 2, 4, '#2f855a');
      rect(9, 1, 2, 3, '#38a169');
      rect(13, 1, 2, 3, '#38a169');
      p(8, 0, '#68d391');
      p(15, 0, '#68d391');

      // Sparkle bounce
      const sp = (frame % 4 < 2) ? 0 : 1;
      p(6, 4 + sp, '#ffd700');
      p(17, 3 - sp, '#ffd700');
    }

    ctx.restore();
  }

  /**
   * Draw cute thought bubble above bunny
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x - center x
   * @param {number} y - bottom tip y
   * @param {string} type - 'carrot', 'sleep', 'heart'
   */
  static drawThoughtBubble(ctx, x, y, type = 'carrot') {
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    const ox = Math.floor(x - 12);
    const oy = Math.floor(y - 20);

    const rect = (dx, dy, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(ox + dx, oy + dy, w, h);
    };

    const p = (dx, dy, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(ox + dx, oy + dy, 1, 1);
    };

    // Bubble cloud outline & fill (24x16)
    rect(3, 1, 18, 12, '#ffffff');
    rect(1, 3, 22, 8, '#ffffff');

    // Outline
    rect(3, 0, 18, 1, '#4a5568');
    rect(3, 13, 18, 1, '#4a5568');
    rect(0, 3, 1, 8, '#4a5568');
    rect(23, 3, 1, 8, '#4a5568');
    p(1, 1, '#4a5568'); p(2, 2, '#4a5568');
    p(22, 1, '#4a5568'); p(21, 2, '#4a5568');
    p(1, 12, '#4a5568'); p(2, 11, '#4a5568');
    p(22, 12, '#4a5568'); p(21, 11, '#4a5568');

    // Trailing little bubbles
    p(12, 15, '#4a5568');
    p(11, 17, '#4a5568');

    // Bubble content
    if (type === 'carrot') {
      // Tiny mini carrot (8x8)
      p(11, 3, '#38a169'); p(13, 3, '#38a169');
      rect(11, 4, 3, 2, '#ed8936');
      rect(12, 6, 2, 2, '#dd6b20');
      p(12, 8, '#c05621');
    } else if (type === 'sleep') {
      // Z z Z
      ctx.fillStyle = '#4299e1';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('zZ', ox + 7, oy + 10);
    } else if (type === 'heart') {
      rect(10, 5, 2, 2, '#e53e3e');
      rect(13, 5, 2, 2, '#e53e3e');
      rect(9, 7, 7, 2, '#e53e3e');
      rect(10, 9, 5, 1, '#e53e3e');
      p(12, 10, '#e53e3e');
    }

    ctx.restore();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ItemSprites };
}
