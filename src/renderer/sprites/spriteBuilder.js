class SpriteBuilder {
  /**
   * Render an ASCII/character matrix onto a canvas using a color map.
   * @param {string[]} rows - Array of equal-length strings representing 1px per char
   * @param {Object} colorMap - Mapping from char to hex/rgba color (or null for transparent)
   * @param {number} width - Target width in pixels (e.g. 32)
   * @param {number} height - Target height in pixels (e.g. 32)
   * @returns {HTMLCanvasElement}
   */
  static createFromMatrix(rows, colorMap, width = 32, height = 32) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    for (let y = 0; y < rows.length && y < height; y++) {
      const row = rows[y];
      for (let x = 0; x < row.length && x < width; x++) {
        const char = row[x];
        const color = colorMap[char];
        if (color && color !== '.' && color !== ' ') {
          ctx.fillStyle = color;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    return canvas;
  }

  /**
   * Scale a canvas crisply with pixel-perfect nearest neighbor.
   * @param {HTMLCanvasElement} sourceCanvas
   * @param {number} scale
   * @returns {HTMLCanvasElement}
   */
  static scaleCanvas(sourceCanvas, scale) {
    const scaled = document.createElement('canvas');
    scaled.width = Math.round(sourceCanvas.width * scale);
    scaled.height = Math.round(sourceCanvas.height * scale);
    const ctx = scaled.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sourceCanvas, 0, 0, scaled.width, scaled.height);
    return scaled;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SpriteBuilder };
}
