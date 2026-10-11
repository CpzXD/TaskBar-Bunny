class AccessoryRenderer {
  /**
   * Draws equipped accessories over the bunny canvas.
   * @param {CanvasRenderingContext2D} ctx - Context of the target 32x32 canvas
   * @param {Object} equipped - { head, face, neck, back, held }
   * @param {Object} anchors - { head: {x,y}, face: {x,y}, neck: {x,y}, back: {x,y}, held: {x,y} }
   * @param {number} direction - 1 for right, -1 for left
   * @param {number} frame - animation frame
   */
  static renderAccessories(ctx, equipped = {}, anchors = {}, direction = 1, frame = 0) {
    if (!anchors || !anchors.head) return;

    // Helper functions for pixel drawing
    const p = (x, y, color) => {
      if (x >= 0 && x < 32 && y >= 0 && y < 32 && color) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
      }
    };

    const rect = (x, y, w, h, color) => {
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
      }
    };

    const dir = direction; // 1 or -1

    // 1. Back Accessories (Rendered behind or on back)
    if (equipped.back && equipped.back !== 'none') {
      const bx = anchors.back.x;
      const by = anchors.back.y;

      switch (equipped.back) {
        case 'backpack':
          rect(bx - 2 * dir, by - 2, 4, 6, '#8b5a2b');
          rect(bx - 1 * dir, by - 1, 2, 2, '#a06a38');
          p(bx - 1 * dir, by + 1, '#ffd700'); // gold buckle
          p(bx - 3 * dir, by - 1, '#4a2f18');
          p(bx - 3 * dir, by + 4, '#4a2f18');
          break;

        case 'cape':
          const flutter = (frame % 2 === 0) ? 0 : 1;
          rect(bx - 4 * dir, by - 1, 3, 7 + flutter, '#e63946');
          rect(bx - 5 * dir, by + 1, 2, 6 + flutter, '#ba181b');
          p(bx - 1 * dir, by - 2, '#ffd700'); // clasp
          break;

        case 'angel_wings':
          const flap = (frame % 2 === 0) ? 0 : -1;
          rect(bx - 4 * dir, by - 4 + flap, 3, 5, '#ffffff');
          rect(bx - 6 * dir, by - 5 + flap, 3, 4, '#e0f2fe');
          p(bx - 7 * dir, by - 6 + flap, '#bae6fd');
          p(bx - 5 * dir, by + 1 + flap, '#7dd3fc');
          break;
      }
    }

    // 2. Neck Accessories
    if (equipped.neck && equipped.neck !== 'none') {
      const nx = anchors.neck.x;
      const ny = anchors.neck.y - 2;

      switch (equipped.neck) {
        case 'red_scarf':
          rect(nx - 4, ny, 8, 3, '#e63946');
          rect(nx - 2, ny + 1, 4, 1, '#ff6b6b');
          rect(nx - 5 * dir, ny + 1, 3, 5, '#ba181b'); // scarf tail
          rect(nx - 6 * dir, ny + 5, 2, 1, '#ffd166'); // fringe
          break;

        case 'bowtie':
          rect(nx - 3, ny, 2, 3, '#e63946');
          rect(nx + 1, ny, 2, 3, '#e63946');
          rect(nx - 1, ny + 1, 2, 1, '#ffffff'); // knot
          break;

        case 'bell_collar':
          rect(nx - 4, ny, 8, 2, '#d90429');
          rect(nx - 1, ny + 2, 3, 3, '#ffd700'); // bell
          p(nx, ny + 3, '#78350f'); // clapper
          break;

        case 'flower_lei':
          p(nx - 4, ny, '#ff6b6b');
          p(nx - 2, ny + 1, '#ffd166');
          p(nx, ny + 1, '#48bb78');
          p(nx + 2, ny + 1, '#38bdf8');
          p(nx + 4, ny, '#f472b6');
          break;
      }
    }

    // 3. Face Accessories
    if (equipped.face && equipped.face !== 'none') {
      const fx = anchors.face.x;
      const fy = anchors.face.y;

      switch (equipped.face) {
        case 'glasses':
          // Round spectacles
          rect(fx - 4 * dir, fy - 1, 3, 3, '#1f2937');
          rect(fx + 2 * dir, fy - 1, 3, 3, '#1f2937');
          p(fx - 3 * dir, fy, '#93c5fd'); // lens
          p(fx + 3 * dir, fy, '#93c5fd');
          rect(fx - 1 * dir, fy, 2, 1, '#1f2937'); // bridge
          break;

        case 'sunglasses':
          // Cool shades
          rect(fx - 5 * dir, fy - 1, 10, 3, '#111827');
          p(fx - 3 * dir, fy, '#6b7280'); // shine
          p(fx + 2 * dir, fy, '#6b7280');
          break;

        case 'monocle':
          rect(fx + 2 * dir, fy - 1, 3, 3, '#d97706');
          p(fx + 3 * dir, fy, '#bae6fd');
          p(fx + 4 * dir, fy + 2, '#d97706'); // chain
          p(fx + 3 * dir, fy + 3, '#d97706');
          break;

        case 'mustache':
          rect(fx - 3, fy + 3, 6, 2, '#451a03');
          p(fx - 4 * dir, fy + 2, '#451a03');
          p(fx + 4 * dir, fy + 2, '#451a03');
          break;
      }
    }

    // 4. Headwear Accessories
    if (equipped.head && equipped.head !== 'none') {
      const hx = anchors.head.x;
      const hy = anchors.head.y;

      switch (equipped.head) {
        case 'party_hat':
          // Conical party cone
          rect(hx - 1, hy - 8, 3, 2, '#fbbf24'); // pompom
          rect(hx - 2, hy - 6, 4, 3, '#ec4899');
          rect(hx - 3, hy - 3, 6, 3, '#3b82f6');
          rect(hx - 4, hy, 8, 2, '#10b981');
          break;

        case 'beanie':
          // Winter knit cap
          p(hx, hy - 6, '#ffffff'); // bobble
          rect(hx - 4, hy - 5, 8, 4, '#dc2626');
          rect(hx - 5, hy - 1, 10, 2, '#ffffff'); // folded rim
          break;

        case 'cowboy_hat':
          // Stetson
          rect(hx - 3, hy - 6, 6, 4, '#78350f');
          rect(hx - 2, hy - 2, 5, 1, '#f59e0b'); // band
          rect(hx - 6, hy - 1, 13, 2, '#92400e'); // brim
          break;

        case 'wizard_hat':
          // Star pointed hat
          p(hx - 1 * dir, hy - 10, '#fde047'); // star tip
          rect(hx - 1, hy - 8, 3, 3, '#4338ca');
          rect(hx - 2, hy - 5, 5, 3, '#3730a3');
          p(hx, hy - 4, '#fde047'); // gold star
          rect(hx - 6, hy - 2, 12, 2, '#312e81'); // wide brim
          break;

        case 'flower_crown':
          p(hx - 5, hy - 1, '#f43f5e');
          p(hx - 3, hy - 2, '#fbbf24');
          p(hx - 1, hy - 2, '#38bdf8');
          p(hx + 1, hy - 2, '#a855f7');
          p(hx + 3, hy - 1, '#22c55e');
          p(hx + 5, hy, '#f43f5e');
          break;

        case 'headphones':
          // Over-ear headphones
          rect(hx - 5, hy - 4, 10, 2, '#1f2937'); // headband
          rect(hx - 6 * dir, hy - 2, 3, 5, '#ec4899'); // ear cups
          rect(hx + 4 * dir, hy - 2, 3, 5, '#ec4899');
          p(hx - 5 * dir, hy, '#ffffff');
          p(hx + 5 * dir, hy, '#ffffff');
          break;

        case 'golden_crown':
          // Royal crown with gems
          rect(hx - 4, hy - 4, 9, 2, '#f59e0b');
          p(hx - 4, hy - 6, '#fbbf24'); // 3 peaks
          p(hx, hy - 7, '#fbbf24');
          p(hx + 4, hy - 6, '#fbbf24');
          p(hx - 2, hy - 3, '#ef4444'); // ruby gem
          p(hx + 2, hy - 3, '#3b82f6'); // sapphire gem
          break;

        case 'bunny_ears_headband':
          // Joke bunny ears on headband
          rect(hx - 4, hy - 1, 9, 1, '#111827');
          rect(hx - 3, hy - 7, 2, 6, '#f472b6');
          p(hx - 2, hy - 6, '#ffffff');
          rect(hx + 2, hy - 7, 2, 6, '#f472b6');
          p(hx + 3, hy - 6, '#ffffff');
          break;
      }
    }

    // 5. Held Items
    if (equipped.held && equipped.held !== 'none') {
      const hx = anchors.held.x;
      const hy = anchors.held.y;

      switch (equipped.held) {
        case 'balloon':
          // Floating heart balloon on string
          const sway = (frame % 2 === 0) ? 0 : 1;
          const bx = hx + 1 * dir + sway;
          const by = hy - 15;
          rect(bx - 3, by, 6, 5, '#ff4d6d');
          p(bx - 2, by - 1, '#ff4d6d');
          p(bx + 1, by - 1, '#ff4d6d');
          p(bx - 2, by + 1, '#ffccd5'); // shine
          p(bx, by + 5, '#c9184a'); // knot
          // String down to hand
          p(bx, by + 6, '#94a3b8');
          p(bx, by + 8, '#94a3b8');
          p(hx, hy, '#94a3b8');
          break;

        case 'flag':
          // Cheering flag on little wooden pole
          rect(hx, hy - 10, 1, 12, '#92400e'); // pole
          rect(hx + 1 * dir, hy - 10, 5, 4, '#3b82f6'); // flag cloth
          p(hx + 3 * dir, hy - 8, '#ffffff'); // star/symbol
          break;

        case 'lollipop':
          // Rainbow swirl candy
          rect(hx, hy - 2, 1, 5, '#ffffff'); // stick
          rect(hx - 2, hy - 6, 5, 4, '#fb7185');
          rect(hx - 1, hy - 5, 3, 2, '#fde047');
          p(hx, hy - 4, '#38bdf8');
          break;

        case 'wand':
          // Golden star wand
          rect(hx, hy - 4, 1, 7, '#d97706'); // gold stick
          p(hx, hy - 7, '#fef08a');
          rect(hx - 1, hy - 6, 3, 2, '#eab308');
          p(hx, hy - 5, '#ffffff');
          break;
      }
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AccessoryRenderer };
}
