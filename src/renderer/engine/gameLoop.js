// src/renderer/engine/gameLoop.js
// 30 FPS game loop with automatic idle-throttling to achieve near 0% CPU usage

class GameLoop {
  constructor(updateFn, renderFn) {
    this.update = updateFn;
    this.render = renderFn;
    this.isRunning = false;
    this.lastTime = 0;
    this.targetFps = 30;
    this.frameInterval = 1000 / this.targetFps;
    this.animationFrameId = null;

    // Idle optimization
    this.isIdle = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop = this.loop.bind(this);
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  setIdleMode(isIdle) {
    this.isIdle = isIdle;
    // When deeply sleeping, throttle to 8 FPS to save CPU
    this.targetFps = isIdle ? 8 : 30;
    this.frameInterval = 1000 / this.targetFps;
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    const delta = currentTime - this.lastTime;

    if (delta >= this.frameInterval) {
      // Limit delta to 100ms max to prevent physics explosions after background sleep
      const clampedDelta = Math.min(delta, 100);
      this.lastTime = currentTime - (delta % this.frameInterval);

      this.update(clampedDelta);
      this.render();
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameLoop };
}
