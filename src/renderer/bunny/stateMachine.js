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

    if (this.currentState !== 'eat' && this.currentState !== 'dangling' && this.currentState !== 'falling') {
      const nearestFood = this.bunny.findNearestFood();
      if (nearestFood) {
        const approachDirection = (nearestFood.x > this.bunny.x) ? 1 : -1;
        const walkTargetX = nearestFood.x - (approachDirection * 10);
        const walkTargetY = this.bunny.groundY;

        const distX = Math.abs(this.bunny.x - walkTargetX);
        const distY = Math.abs(this.bunny.y - walkTargetY);

        if (distX > 3 || distY > 3) {
          this.bunny.targetX = walkTargetX;
          this.bunny.targetY = walkTargetY;
          this.bunny.direction = approachDirection;
          if (this.currentState !== 'walk') {
            this.setState('walk', 8000);
          }
          return;
        } else {
          this.bunny.x = walkTargetX;
          this.bunny.y = walkTargetY;
          this.bunny.direction = approachDirection;
          this.bunny.currentEatingFood = nearestFood;
          this.setState('eat', 3200);
          return;
        }
      }
    }

    if (this.stateTimer >= this.stateDuration) {
      this.chooseNextState();
    }
  }

  chooseNextState() {
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

    const roll = Math.random();
    if (roll < 0.45) {
      const margin = 80;
      const minX = margin;
      const maxX = Math.max(minX + 100, this.bunny.screenWidth - margin);
      this.bunny.targetX = minX + Math.random() * (maxX - minX);
      this.bunny.targetY = this.bunny.groundY;

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
