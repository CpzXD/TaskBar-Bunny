// src/renderer/bunny/stateMachine.js
// Finite State Machine controlling autonomous bunny behaviors and transitions

class BunnyStateMachine {
  constructor(bunny) {
    this.bunny = bunny;
    this.currentState = 'idle';
    this.stateTimer = 0;
    this.stateDuration = 4000; // ms to spend in current state
    this.frameTimer = 0;
    this.frameIndex = 0;
    this.frameRate = 180; // ms per frame
  }

  setState(newState, customDuration = null) {
    if (this.currentState === newState && newState !== 'walk' && newState !== 'hop') return;
    this.currentState = newState;
    this.stateTimer = 0;
    this.frameIndex = 0;

    switch (newState) {
      case 'idle':
        this.stateDuration = customDuration || (3000 + Math.random() * 4000);
        this.frameRate = 350;
        break;
      case 'walk':
        this.stateDuration = customDuration || (2500 + Math.random() * 4500);
        this.frameRate = 160;
        break;
      case 'sit':
        this.stateDuration = customDuration || (4000 + Math.random() * 5000);
        this.frameRate = 400;
        break;
      case 'groom':
        this.stateDuration = customDuration || (3000 + Math.random() * 2500);
        this.frameRate = 220;
        break;
      case 'sleep':
        this.stateDuration = customDuration || (10000 + Math.random() * 15000);
        this.frameRate = 600;
        break;
      case 'hop':
        this.stateDuration = customDuration || 900;
        this.frameRate = 150;
        break;
      case 'eat':
        this.stateDuration = customDuration || 3200;
        this.frameRate = 180;
        break;
      case 'happy':
        this.stateDuration = customDuration || 2200;
        this.frameRate = 160;
        break;
      case 'sad':
        this.stateDuration = customDuration || 5000;
        this.frameRate = 450;
        break;
      case 'dangling':
        this.stateDuration = Infinity;
        this.frameRate = 200;
        break;
      case 'falling':
        this.stateDuration = Infinity;
        this.frameRate = 150;
        break;
      default:
        this.stateDuration = 3000;
        this.frameRate = 200;
    }
  }

  update(deltaTime) {
    this.stateTimer += deltaTime;
    this.frameTimer += deltaTime;

    // Advance sprite frame
    if (this.frameTimer >= this.frameRate) {
      this.frameTimer -= this.frameRate;
      this.frameIndex++;
    }

    // State specific updates
    if (this.currentState === 'walk') {
      this.bunny.updateWalk(deltaTime);
    } else if (this.currentState === 'hop') {
      this.bunny.updateHop(deltaTime);
    } else if (this.currentState === 'falling') {
      this.bunny.updateFalling(deltaTime);
    } else if (this.currentState === 'eat') {
      this.bunny.updateEating(deltaTime);
    }

    // Do Not Disturb mode: remain idle or asleep
    if (this.bunny.isDoNotDisturb) {
      if (this.currentState !== 'sleep' && this.currentState !== 'sit') {
        this.setState('sit', 20000);
      }
      return;
    }

    // Check food targeting: if food dropped and not currently eating or dangling
    if (this.currentState !== 'eat' && this.currentState !== 'dangling' && this.currentState !== 'falling') {
      const nearestFood = this.bunny.findNearestFood();
      if (nearestFood) {
        const dist = Math.hypot(this.bunny.x - nearestFood.x, this.bunny.y - nearestFood.y);
        if (dist > 14) {
          this.bunny.targetX = nearestFood.x;
          this.bunny.targetY = nearestFood.y;
          this.bunny.direction = (nearestFood.x > this.bunny.x) ? 1 : -1;
          if (this.currentState !== 'walk') {
            this.setState('walk', 8000);
          }
          return;
        } else {
          // Reached food!
          this.bunny.currentEatingFood = nearestFood;
          this.setState('eat', 3200);
          return;
        }
      }
    }

    // Timer-based transitions
    if (this.stateTimer >= this.stateDuration) {
      this.chooseNextState();
    }
  }

  chooseNextState() {
    // Check night time (11pm - 7am)
    const hour = new Date().getHours();
    const isNight = hour >= 23 || hour < 7;
    const isSulky = this.bunny.needs.isSulky();
    const isHungry = this.bunny.needs.isHungry();

    if (isNight || isSulky) {
      if (Math.random() < 0.7) {
        this.setState('sleep');
        return;
      }
    }

    if (isHungry && Math.random() < 0.5) {
      this.setState('sad');
      return;
    }

    // Random roll for day time cozy activity
    const roll = Math.random();
    if (roll < 0.45) {
      // Pick random destination across the roaming area
      const margin = 80;
      const minX = margin;
      const maxX = Math.max(minX + 100, this.bunny.screenWidth - margin);
      this.bunny.targetX = minX + Math.random() * (maxX - minX);

      const roamingH = this.bunny.getRoamingHeight ? this.bunny.getRoamingHeight() : 220;
      const minY = Math.max(40, this.bunny.groundY - roamingH);
      this.bunny.targetY = minY + Math.random() * (this.bunny.groundY - minY);

      this.bunny.direction = (this.bunny.targetX > this.bunny.x) ? 1 : -1;
      this.setState('walk');
    } else if (roll < 0.65) {
      this.setState('sit');
    } else if (roll < 0.80) {
      this.setState('groom');
    } else if (roll < 0.90) {
      // Little casual hop
      this.bunny.startHop();
      this.setState('hop');
    } else {
      this.setState('idle');
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BunnyStateMachine };
}
