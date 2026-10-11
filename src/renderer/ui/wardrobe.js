const { ACCESSORIES, FUR_COLORS, EAR_STYLES, EYE_COLORS, ACHIEVEMENTS } = require('../../shared/constants');
const { BunnySpriteGenerator } = require('../sprites/bunnySprites');
const { AccessoryRenderer } = require('../sprites/accessories');
const { soundEngine } = require('../engine/soundEngine');

class WardrobeController {
  constructor() {
    this.previewCanvas = document.getElementById('previewCanvas');
    this.previewCtx = this.previewCanvas.getContext('2d');
    this.tabContent = document.getElementById('tabContent');
    this.tabsBar = document.getElementById('tabsBar');
    this.coinCountEl = document.getElementById('coinCount');
    this.bunnyNameEl = document.getElementById('bunnyName');
    this.closeBtn = document.getElementById('closeBtn');

    this.state = null;
    this.activeTab = 'base';
    this.previewFrame = 0;
    this.previewTimer = 0;

    this.init();
  }

  syncAudioSettings() {
    if (!this.state || !this.state.settings) return;
    soundEngine.setMuted(Boolean(this.state.settings.isMuted));
    if (typeof this.state.settings.volume === 'number') {
      soundEngine.setVolume(this.state.settings.volume);
    }
  }

  async init() {
    this.closeBtn.addEventListener('click', () => {
      window.api.closeWindow('wardrobe');
    });

    // Tab buttons
    this.tabsBar.addEventListener('click', (e) => {
      if (e.target.classList.contains('tab-btn')) {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.activeTab = e.target.dataset.tab;
        this.renderTabContent();
      }
    });

    // Load initial state
    const { state } = await window.api.loadState();
    this.state = state;
    this.syncAudioSettings();
    this.updateHeaderInfo();
    this.renderTabContent();

    // Start preview animation loop
    this.startPreviewLoop();

    // Listen for state syncs
    window.api.onStateUpdate((newState) => {
      this.state = newState;
      this.syncAudioSettings();
      this.updateHeaderInfo();
      this.renderTabContent();
    });
  }

  updateHeaderInfo() {
    if (!this.state) return;
    this.bunnyNameEl.textContent = this.state.bunny.name || 'Barnaby';
    this.coinCountEl.textContent = this.state.inventory.coins || 0;
  }

  startPreviewLoop() {
    const loop = (time) => {
      this.previewTimer += 16.6;
      if (this.previewTimer >= 220) {
        this.previewTimer = 0;
        this.previewFrame++;
      }
      this.drawPreview();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  drawPreview() {
    if (!this.state) return;
    this.previewCtx.clearRect(0, 0, this.previewCanvas.width, this.previewCanvas.height);
    this.previewCtx.imageSmoothingEnabled = false;

    // Generate 32x32 frame
    const appearance = {
      furColor: this.state.bunny.furColor,
      earStyle: this.state.bunny.earStyle,
      eyeColor: this.state.bunny.eyeColor,
      blush: this.state.bunny.blush
    };

    const { canvas: frameCanvas, anchors } = BunnySpriteGenerator.renderFrame({
      state: 'idle',
      frameIndex: this.previewFrame,
      direction: 1,
      appearance
    });

    // Draw accessories
    const frameCtx = frameCanvas.getContext('2d');
    frameCtx.imageSmoothingEnabled = false;
    AccessoryRenderer.renderAccessories(
      frameCtx,
      this.state.bunny.equipped,
      anchors,
      1,
      this.previewFrame
    );

    // Scale up 3x to 96x96
    this.previewCtx.drawImage(frameCanvas, 0, 0, 96, 96);
  }

  renderTabContent() {
    if (!this.state) return;
    this.tabContent.innerHTML = '';

    if (this.activeTab === 'base') {
      this.renderBaseCustomization();
    } else if (this.activeTab === 'presets') {
      this.renderPresets();
    } else if (this.activeTab === 'achievements') {
      this.renderAchievements();
    } else {
      this.renderAccessoriesCategory(this.activeTab);
    }
  }

  renderBaseCustomization() {
    const b = this.state.bunny;
    const container = document.createElement('div');
    container.className = 'base-controls';

    // 1. Fur Color
    const furRow = document.createElement('div');
    furRow.className = 'base-row';
    furRow.innerHTML = `
      <label>Fur Coat:</label>
      <select id="furSelect">
        ${Object.values(FUR_COLORS).map(f => `<option value="${f.id}" ${b.furColor === f.id ? 'selected' : ''}>${f.name}</option>`).join('')}
      </select>
    `;
    furRow.querySelector('select').addEventListener('change', (e) => {
      this.state.bunny.furColor = e.target.value;
      this.saveState();
    });
    container.appendChild(furRow);

    // 2. Ear Style
    const earRow = document.createElement('div');
    earRow.className = 'base-row';
    earRow.innerHTML = `
      <label>Ear Style:</label>
      <select id="earSelect">
        ${Object.values(EAR_STYLES).map(e => `<option value="${e.id}" ${b.earStyle === e.id ? 'selected' : ''}>${e.name}</option>`).join('')}
      </select>
    `;
    earRow.querySelector('select').addEventListener('change', (e) => {
      this.state.bunny.earStyle = e.target.value;
      this.saveState();
    });
    container.appendChild(earRow);

    // 3. Eye Color
    const eyeRow = document.createElement('div');
    eyeRow.className = 'base-row';
    eyeRow.innerHTML = `
      <label>Eye Color:</label>
      <select id="eyeSelect">
        ${Object.values(EYE_COLORS).map(ey => `<option value="${ey.id}" ${b.eyeColor === ey.id ? 'selected' : ''}>${ey.name}</option>`).join('')}
      </select>
    `;
    eyeRow.querySelector('select').addEventListener('change', (e) => {
      this.state.bunny.eyeColor = e.target.value;
      this.saveState();
    });
    container.appendChild(eyeRow);

    // 4. Blush Toggle
    const blushRow = document.createElement('div');
    blushRow.className = 'base-row';
    blushRow.innerHTML = `
      <label>Cheek Blush:</label>
      <input type="checkbox" id="blushCheck" ${b.blush !== false ? 'checked' : ''} style="transform: scale(1.3); cursor: pointer;">
    `;
    blushRow.querySelector('input').addEventListener('change', (e) => {
      this.state.bunny.blush = e.target.checked;
      this.saveState();
    });
    container.appendChild(blushRow);

    this.tabContent.appendChild(container);
  }

  renderItemIcon(canvas, category, itemId) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    if (itemId === 'none') {
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height / 2, 12, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 8, canvas.height / 2 + 8);
      ctx.lineTo(canvas.width / 2 + 8, canvas.height / 2 - 8);
      ctx.stroke();
      return;
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 32;
    tempCanvas.height = 32;
    const tCtx = tempCanvas.getContext('2d');
    tCtx.imageSmoothingEnabled = false;

    // Centered anchor coordinates in 32x32 frame
    const anchors = {
      head: { x: 16, y: 22 },
      face: { x: 16, y: 15 },
      neck: { x: 16, y: 15 },
      back: { x: 17, y: 14 },
      held: { x: 14, y: 20 }
    };
    if (category === 'held' && itemId === 'balloon') {
      anchors.held = { x: 15, y: 24 };
    } else if (category === 'back' && itemId === 'cape') {
      anchors.back = { x: 18, y: 12 };
    }

    AccessoryRenderer.renderAccessories(tCtx, { [category]: itemId }, anchors, 1, 0);

    ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
  }

  renderAccessoriesCategory(category) {
    const items = ACCESSORIES[category] || [];
    const equippedId = this.state.bunny.equipped[category] || 'none';
    const unlockedList = this.state.inventory.unlockedCosmetics || [];

    for (const item of items) {
      const isEquipped = equippedId === item.id;
      const isUnlocked = item.price === 0 || unlockedList.includes(`${category}:${item.id}`);

      const card = document.createElement('div');
      card.className = `item-card ${isEquipped ? 'equipped' : ''} ${item.tier}`;

      card.innerHTML = `
        <div class="item-header">
          <div class="item-title"></div>
          <span class="item-tier tier-${item.tier}">${item.tier}</span>
        </div>
        <div class="item-visual-wrap">
          <canvas class="item-preview-canvas" width="48" height="48"></canvas>
        </div>
        <div style="font-size: 11px; color: #64748b; margin: 2px 0; text-align: center;">
          ${isUnlocked ? (isEquipped ? 'Currently Wearing' : 'Owned') : `Price: <span class="coin-icon"></span> ${item.price}`}
        </div>
        <div>
          ${
            isEquipped
              ? `<button class="item-btn btn-unequip">Unequip</button>`
              : (isUnlocked
                  ? `<button class="item-btn btn-equip">Equip</button>`
                  : `<button class="item-btn btn-buy">Buy <span class="coin-icon"></span> ${item.price}</button>`)
          }
        </div>
      `;

      card.querySelector('.item-title').textContent = item.name;

      const previewCanvas = card.querySelector('.item-preview-canvas');
      this.renderItemIcon(previewCanvas, category, item.id);

      const btn = card.querySelector('.item-btn');
      btn.addEventListener('click', () => {
        if (isEquipped) {
          this.state.bunny.equipped[category] = 'none';
          soundEngine.playHop();
        } else if (isUnlocked) {
          this.state.bunny.equipped[category] = item.id;
          soundEngine.playHop();
        } else {
          // Buy item
          if (this.state.inventory.coins >= item.price) {
            this.state.inventory.coins -= item.price;
            this.state.inventory.unlockedCosmetics.push(`${category}:${item.id}`);
            this.state.bunny.equipped[category] = item.id;
            soundEngine.playCoin();
            this.updateHeaderInfo();
          } else {
            alert('Not enough coins! Keep your bunny happy to earn more coins.');
            return;
          }
        }
        this.saveState();
        this.renderTabContent();
      });

      this.tabContent.appendChild(card);
    }
  }

  renderAchievements() {
    for (const ach of ACHIEVEMENTS) {
      const { isUnlocked, current, max, pct } = this.getAchievementProgress(ach);

      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;

      card.innerHTML = `
        <div class="ach-header">
          <div class="ach-icon">${isUnlocked ? '🏆' : '🔒'}</div>
          <div class="ach-info">
            <div class="ach-title"></div>
            <div class="ach-desc"></div>
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

      card.querySelector('.ach-title').textContent = ach.name;
      card.querySelector('.ach-desc').textContent = ach.description;

      this.tabContent.appendChild(card);
    }
  }

  getAchievementProgress(ach) {
    const isUnlocked = Boolean(this.state.achievements?.unlocked?.includes(ach.id));
    let current = 0;
    let max = 1;

    switch (ach.id) {
      case 'first_carrot':
        max = 1;
        current = Math.min(max, this.state.bunny.totalCarrotsFed || 0);
        break;
      case 'fed_25':
        max = 25;
        current = Math.min(max, this.state.bunny.totalCarrotsFed || 0);
        break;
      case 'fed_100':
        max = 100;
        current = Math.min(max, this.state.bunny.totalCarrotsFed || 0);
        break;
      case 'pet_50':
        max = 50;
        current = Math.min(max, this.state.bunny.totalPetCount || 0);
        break;
      case 'pet_200':
        max = 200;
        current = Math.min(max, this.state.bunny.totalPetCount || 0);
        break;
      case 'first_harvest':
        max = 1;
        current = isUnlocked ? 1 : 0;
        break;
      case 'fashion_pioneer':
        max = 1;
        const hasEquipped = Object.values(this.state.bunny.equipped || {}).some(v => v && v !== 'none');
        current = isUnlocked || hasEquipped ? 1 : 0;
        break;
      case 'three_presets':
        max = 3;
        const savedCount = (this.state.bunny.outfitPresets || []).filter(p =>
          Object.entries(p).some(([k, v]) => k !== 'name' && v !== 'none')
        ).length;
        current = isUnlocked ? 3 : Math.min(max, savedCount);
        break;
      case 'level_5':
        max = 5;
        current = Math.min(max, this.state.bunny.level || 1);
        break;
      case 'level_10':
        max = 10;
        current = Math.min(max, this.state.bunny.level || 1);
        break;
      default:
        current = isUnlocked ? 1 : 0;
        max = 1;
    }

    const pct = isUnlocked ? 100 : Math.min(100, Math.round((current / max) * 100));
    return { isUnlocked, current, max, pct };
  }

  renderPresets() {
    const presets = this.state.bunny.outfitPresets || [
      { name: 'Preset 1', head: 'none', face: 'none', neck: 'none', back: 'none', held: 'none' },
      { name: 'Preset 2', head: 'none', face: 'none', neck: 'none', back: 'none', held: 'none' },
      { name: 'Preset 3', head: 'none', face: 'none', neck: 'none', back: 'none', held: 'none' }
    ];

    presets.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = 'preset-card';

      const itemsDesc = Object.entries(p)
        .filter(([k, v]) => k !== 'name' && v !== 'none')
        .map(([k, v]) => v)
        .join(', ') || 'Default Look';

      card.innerHTML = `
        <div>
          <div class="preset-title"></div>
          <div class="preset-desc" style="font-size: 11px; color: #64748b;"></div>
        </div>
        <div class="preset-actions">
          <button class="btn-preset btn-save-preset">Save Current</button>
          <button class="btn-preset btn-load-preset">Load</button>
        </div>
      `;

      card.querySelector('.preset-title').textContent = p.name || `Preset ${idx + 1}`;
      card.querySelector('.preset-desc').textContent = itemsDesc;

      card.querySelector('.btn-save-preset').addEventListener('click', () => {
        this.state.bunny.outfitPresets[idx] = {
          name: `Preset ${idx + 1}`,
          head: this.state.bunny.equipped.head,
          face: this.state.bunny.equipped.face,
          neck: this.state.bunny.equipped.neck,
          back: this.state.bunny.equipped.back,
          held: this.state.bunny.equipped.held
        };
        soundEngine.playCoin();
        this.saveState();
        this.renderTabContent();
      });

      card.querySelector('.btn-load-preset').addEventListener('click', () => {
        const loaded = this.state.bunny.outfitPresets[idx];
        if (loaded) {
          this.state.bunny.equipped.head = loaded.head || 'none';
          this.state.bunny.equipped.face = loaded.face || 'none';
          this.state.bunny.equipped.neck = loaded.neck || 'none';
          this.state.bunny.equipped.back = loaded.back || 'none';
          this.state.bunny.equipped.held = loaded.held || 'none';
          soundEngine.playHop();
          this.saveState();
          this.renderTabContent();
        }
      });

      this.tabContent.appendChild(card);
    });
  }

  saveState() {
    if (window.api && window.api.saveState) {
      window.api.saveState(this.state);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new WardrobeController();
});
