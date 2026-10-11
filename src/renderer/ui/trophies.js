const { ACHIEVEMENTS } = require('../../shared/constants');

class TrophiesController {
  constructor() {
    this.closeBtn = document.getElementById('closeBtn');
    this.trophiesContainer = document.getElementById('trophiesContainer');
    this.unlockedCountEl = document.getElementById('unlockedCount');
    this.totalCountEl = document.getElementById('totalCount');
    this.overviewPctEl = document.getElementById('overviewPct');
    this.overviewFillEl = document.getElementById('overviewFill');

    this.state = null;
    this.init();
  }

  async init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        if (window.api && window.api.closeWindow) {
          window.api.closeWindow('trophies');
        }
      });
    }

    try {
      const { state } = await window.api.loadState();
      this.state = state;
      this.render();
    } catch (err) {
      console.error('[Trophies] Could not load state:', err);
    }

    if (window.api && window.api.onStateUpdate) {
      window.api.onStateUpdate((newState) => {
        this.state = newState;
        this.render();
      });
    }
  }

  getAchievementProgress(ach) {
    const isUnlocked = Boolean(this.state?.achievements?.unlocked?.includes(ach.id));
    const bunny = this.state?.bunny || {};
    let current = 0;
    let max = 1;

    switch (ach.id) {
      case 'first_carrot':
        current = (bunny.totalCarrotsFed || 0) >= 1 ? 1 : 0;
        max = 1;
        break;
      case 'fed_25':
        current = Math.min(25, bunny.totalCarrotsFed || 0);
        max = 25;
        break;
      case 'fed_100':
        current = Math.min(100, bunny.totalCarrotsFed || 0);
        max = 100;
        break;
      case 'pet_50':
        current = Math.min(50, bunny.totalPetCount || 0);
        max = 50;
        break;
      case 'pet_200':
        current = Math.min(200, bunny.totalPetCount || 0);
        max = 200;
        break;
      case 'first_harvest':
        current = this.state?.garden?.plots?.some(p => p.ready || p.plantedAt) ? 1 : 0;
        max = 1;
        break;
      case 'fashion_pioneer':
        current = Object.values(bunny.equipped || {}).some(v => v && v !== 'none') ? 1 : 0;
        max = 1;
        break;
      case 'three_presets':
        current = (bunny.outfitPresets && bunny.outfitPresets.length >= 3) ? 1 : 0;
        max = 1;
        break;
      case 'level_5':
        current = Math.min(5, bunny.level || 1);
        max = 5;
        break;
      case 'level_10':
        current = Math.min(10, bunny.level || 1);
        max = 10;
        break;
      default:
        current = isUnlocked ? 1 : 0;
        max = 1;
    }

    if (isUnlocked) current = max;
    const pct = Math.min(100, Math.round((current / max) * 100));
    return { isUnlocked, current, max, pct };
  }

  render() {
    if (!this.state || !this.trophiesContainer) return;
    this.trophiesContainer.innerHTML = '';

    const unlockedList = this.state.achievements?.unlocked || [];
    const totalCount = ACHIEVEMENTS.length;
    const unlockedCount = ACHIEVEMENTS.filter(a => unlockedList.includes(a.id)).length;
    const overallPct = Math.round((unlockedCount / totalCount) * 100);

    if (this.unlockedCountEl) this.unlockedCountEl.textContent = unlockedCount;
    if (this.totalCountEl) this.totalCountEl.textContent = totalCount;
    if (this.overviewPctEl) this.overviewPctEl.textContent = `${overallPct}%`;
    if (this.overviewFillEl) this.overviewFillEl.style.width = `${overallPct}%`;

    for (const ach of ACHIEVEMENTS) {
      const { isUnlocked, current, max, pct } = this.getAchievementProgress(ach);

      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;

      card.innerHTML = `
        <div class="ach-header">
          <div class="ach-icon">${isUnlocked ? '🏆' : '🔒'}</div>
          <div class="ach-info">
            <div class="ach-title">${ach.name}</div>
            <div class="ach-desc">${ach.description}</div>
            ${
              ach.rewardItem
                ? `<div class="ach-cosmetic-reward" style="margin-top: 5px;">🎁 Reward: ${ach.rewardItem.name} ${isUnlocked ? '(Unlocked! ✨)' : ''}</div>`
                : ''
            }
          </div>
          <div class="ach-reward">
            +<span class="coin-icon"></span> ${ach.rewardCoins}
            <span class="ach-xp">+${ach.rewardXp} XP</span>
          </div>
        </div>
        <div class="ach-progress-row">
          <div class="ach-progress-bar">
            <div class="ach-progress-fill" style="width: ${pct}%"></div>
          </div>
          <div class="ach-progress-text">${isUnlocked ? 'Completed! ✨' : `${current} / ${max} (${pct}%)`}</div>
        </div>
      `;

      this.trophiesContainer.appendChild(card);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new TrophiesController();
});
