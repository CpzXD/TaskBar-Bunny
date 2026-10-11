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
    const extra = this.state?.extraBunnies || [];
    const allBunnies = [bunny, ...extra];
    const totalFed = allBunnies.reduce((sum, b) => sum + (b.totalCarrotsFed || 0), 0);
    const totalPet = allBunnies.reduce((sum, b) => sum + (b.totalPetCount || 0), 0);
    const maxLevel = Math.max(1, ...allBunnies.map(b => b.level || 1));
    const unlockedCosmeticsCount = (this.state?.inventory?.unlockedCosmetics || []).length;

    let current = 0;
    let max = 1;

    if (ach.id.startsWith('fed_')) {
      max = parseInt(ach.id.replace('fed_', ''), 10) || 25;
      current = Math.min(max, totalFed);
    } else if (ach.id === 'first_carrot') {
      max = 1;
      current = Math.min(1, totalFed);
    } else if (ach.id.startsWith('pet_')) {
      max = parseInt(ach.id.replace('pet_', ''), 10) || 50;
      current = Math.min(max, totalPet);
    } else if (ach.id.startsWith('level_')) {
      max = parseInt(ach.id.replace('level_', ''), 10) || 5;
      current = Math.min(max, maxLevel);
    } else if (ach.id.startsWith('cosmetics_')) {
      max = parseInt(ach.id.replace('cosmetics_', ''), 10) || 5;
      current = Math.min(max, unlockedCosmeticsCount);
    } else if (ach.id === 'first_harvest') {
      max = 1;
      current = this.state?.garden?.plots?.some(p => p.ready || p.plantedAt) ? 1 : 0;
    } else if (ach.id === 'fashion_pioneer') {
      max = 1;
      const hasEquipped = allBunnies.some(b => Object.values(b.equipped || {}).some(v => v && v !== 'none'));
      current = hasEquipped ? 1 : 0;
    } else if (ach.id === 'three_presets') {
      max = 3;
      const savedCount = (bunny.outfitPresets || []).filter(p =>
        p.saved || Object.entries(p).some(([k, v]) => k !== 'name' && v && v !== 'none')
      ).length;
      current = Math.min(max, savedCount);
    } else {
      max = 1;
      current = isUnlocked ? 1 : 0;
    }

    if (isUnlocked) current = max;
    const pct = isUnlocked ? 100 : Math.min(100, Math.round((current / max) * 100));
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
