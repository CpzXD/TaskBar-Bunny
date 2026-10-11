class Butterfly {
  constructor(app) {
    this.app = app;
    this.active = false;
    this.spawnTimer = 0;
    this.spawnInterval = 5 * 60 * 1000; // 5 minutes
    this.x = -30;
    this.y = 200;
    this.baseY = 200;
    this.vx = 1.2;
    this.wingAngle = 0;
    this.flightTime = 0;
    this.sparkles = [];
  }

  update(deltaTime) {
    // Sparkle trail
    for (let i = this.sparkles.length - 1; i >= 0; i--) {
      const s = this.sparkles[i];
      s.life += deltaTime;
      s.y -= 0.2;
      s.alpha = Math.max(0, 1 - (s.life / s.maxLife));
      if (s.life >= s.maxLife) {
        this.sparkles.splice(i, 1);
      }
    }

    if (!this.active) {
      this.spawnTimer += deltaTime;
      if (this.spawnTimer >= this.spawnInterval) {
        this.spawn();
      }
      return;
    }

    this.flightTime += deltaTime;
    this.wingAngle = Math.sin(this.flightTime * 0.018);

    // Flutter across the screen with sine wave motion
    this.x += this.vx * (deltaTime / 16.6);
    this.y = this.baseY + Math.sin(this.flightTime * 0.0035) * 45;

    // Emit occasional sparkle
    if (Math.random() < 0.2) {
      this.sparkles.push({
        x: this.x + (Math.random() - 0.5) * 8,
        y: this.y + (Math.random() - 0.5) * 8,
        color: Math.random() > 0.5 ? '#fef08a' : '#7dd3fc',
        life: 0,
        maxLife: 600,
        alpha: 1.0
      });
    }

    const maxW = (this.app?.canvas?.width) || 1920;
    if (this.vx > 0 && this.x > maxW + 50) {
      this.despawn();
    } else if (this.vx < 0 && this.x < -50) {
      this.despawn();
    }
  }

  spawn() {
    this.active = true;
    this.spawnTimer = 0;
    this.flightTime = 0;
    const maxW = (this.app?.canvas?.width) || 1920;
    const fromLeft = Math.random() > 0.5;
    this.vx = (fromLeft ? 1 : -1) * (1.1 + Math.random() * 0.5);
    this.x = fromLeft ? -25 : maxW + 25;
    const ground = (this.app?.groundY) || 900;
    this.baseY = Math.max(120, ground - 130 - Math.random() * 120);
    this.y = this.baseY;
  }

  despawn() {
    this.active = false;
    this.spawnTimer = 0;
  }

  draw(ctx) {
    // Draw sparkles
    for (const s of this.sparkles) {
      ctx.save();
      ctx.globalAlpha = s.alpha;
      ctx.fillStyle = s.color;
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 2, 2);
      ctx.restore();
    }

    if (!this.active) return;

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    const px = Math.floor(this.x);
    const py = Math.floor(this.y);
    const wingSpan = Math.max(1, Math.round(Math.abs(this.wingAngle) * 7));

    // Left Wing (Monarch Orange + Black Edge)
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(px - wingSpan / 2 - 1, py - 3, wingSpan / 2 + 1, 6, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Right Wing
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.ellipse(px + wingSpan / 2 + 1, py - 3, wingSpan / 2 + 1, 6, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Wing white spots
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(px - wingSpan, py - 6, 1, 1);
    ctx.fillRect(px + wingSpan - 1, py - 6, 1, 1);

    // Butterfly slender dark body
    ctx.fillStyle = '#18181b';
    ctx.fillRect(px - 1, py - 5, 2, 8);

    // Antennae
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(px - 1, py - 5);
    ctx.lineTo(px - 3, py - 9);
    ctx.moveTo(px + 1, py - 5);
    ctx.lineTo(px + 3, py - 9);
    ctx.stroke();

    ctx.restore();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Butterfly };
}
