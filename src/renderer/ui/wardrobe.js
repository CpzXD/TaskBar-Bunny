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
    this.bunnyNameInput = document.getElementById('bunnyNameInput');
    this.saveNameBtn = document.getElementById('saveNameBtn');
    this.bunnySelectEl = document.getElementById('bunnySelect');
    this.closeBtn = document.getElementById('closeBtn');

    this.state = null;
    this.selectedBunnyIndex = 0;
    this.bunnySelectBound = false;
    this.activeTab = 'base';
    this.previewFrame = 0;
    this.previewTimer = 0;

    this.init();
  }

  getCurrentBunny() {
    if (!this.state) return null;
    if (this.selectedBunnyIndex === 0) return this.state.bunny;
    if (this.state.extraBunnies && this.state.extraBunnies[this.selectedBunnyIndex - 1]) {
      return this.state.extraBunnies[this.selectedBunnyIndex - 1];
    }
    return this.state.bunny;
  }

  handleSaveName(nameVal = null) {
    const currentBunny = this.getCurrentBunny();
    if (!currentBunny) return;
    const val = (nameVal !== null ? nameVal : (this.bunnyNameInput ? this.bunnyNameInput.value : '')).trim();
    if (!val) return;
    if (currentBunny.name !== val) {
      currentBunny.name = val;
      soundEngine.playCoin();
      this.saveState();
      this.updateHeaderInfo();
      this.renderTabContent();
    }
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

    if (this.saveNameBtn) {
      this.saveNameBtn.addEventListener('click', () => {
        this.handleSaveName();
      });
    }

    if (this.bunnyNameInput) {
      this.bunnyNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.handleSaveName();
          this.bunnyNameInput.blur();
        }
      });
      this.bunnyNameInput.addEventListener('blur', () => {
        this.handleSaveName();
      });
    }

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
      // If a new companion bunny was just added, auto-select it
      const prevExtraCount = (this.state && this.state.extraBunnies) ? this.state.extraBunnies.length : 0;
      const newExtraCount = (newState && newState.extraBunnies) ? newState.extraBunnies.length : 0;
      if (newExtraCount > prevExtraCount) {
        this.selectedBunnyIndex = newExtraCount;
      }
      this.state = newState;
      this.syncAudioSettings();
      this.updateHeaderInfo();
      this.renderTabContent();
    });
  }

  updateHeaderInfo() {
    if (!this.state) return;
    const currentBunny = this.getCurrentBunny();
    const currentName = currentBunny ? (currentBunny.name || 'Barnaby') : 'Barnaby';

    if (this.bunnyNameInput && document.activeElement !== this.bunnyNameInput) {
      this.bunnyNameInput.value = currentName;
    }
    this.coinCountEl.textContent = this.state.inventory.coins || 0;

    if (this.bunnySelectEl) {
      if (this.state.extraBunnies && this.state.extraBunnies.length > 0) {
        this.bunnySelectEl.style.display = 'inline-block';
        this.bunnySelectEl.innerHTML = '';

        const primaryOpt = document.createElement('option');
        primaryOpt.value = '0';
        primaryOpt.textContent = `1. ${this.state.bunny.name || 'Barnaby'}`;
        this.bunnySelectEl.appendChild(primaryOpt);

        this.state.extraBunnies.forEach((eb, idx) => {
          const opt = document.createElement('option');
          opt.value = `${idx + 1}`;
          opt.textContent = `${idx + 2}. ${eb.name || 'Companion'}`;
          this.bunnySelectEl.appendChild(opt);
        });

        this.bunnySelectEl.value = String(this.selectedBunnyIndex);
        if (!this.bunnySelectBound) {
          this.bunnySelectBound = true;
          this.bunnySelectEl.addEventListener('change', (e) => {
            this.selectedBunnyIndex = parseInt(e.target.value, 10);
            this.updateHeaderInfo();
            this.renderTabContent();
          });
        }
      } else {
        this.bunnySelectEl.style.display = 'none';
      }
    }
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

    const currentBunny = this.getCurrentBunny();
    if (!currentBunny) return;

    // Generate 32x32 frame
    const appearance = {
      furColor: currentBunny.furColor,
      earStyle: currentBunny.earStyle,
      eyeColor: currentBunny.eyeColor,
      blush: currentBunny.blush
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
      currentBunny.equipped || {},
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
    const b = this.getCurrentBunny();
    if (!b) return;
    const container = document.createElement('div');
    container.className = 'base-controls';

    // 0. Bunny Name
    const nameRow = document.createElement('div');
    nameRow.className = 'base-row';
    nameRow.innerHTML = `
      <label>Bunny Name:</label>
      <div style="display: flex; gap: 6px; align-items: center;">
        <input type="text" id="tabNameInput" class="bunny-name-input" maxlength="16" value="${b.name || 'Barnaby'}" style="font-size: 13px; width: 130px; padding: 4px 8px;">
        <button class="item-btn btn-equip" id="tabSaveNameBtn" style="width: auto; padding: 4px 10px; cursor: pointer;">Save</button>
      </div>
    `;
    const tabInput = nameRow.querySelector('#tabNameInput');
    const tabSaveBtn = nameRow.querySelector('#tabSaveNameBtn');
    tabSaveBtn.addEventListener('click', () => {
      this.handleSaveName(tabInput.value);
    });
    tabInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleSaveName(tabInput.value);
        tabInput.blur();
      }
    });
    tabInput.addEventListener('blur', () => {
      this.handleSaveName(tabInput.value);
    });
    container.appendChild(nameRow);

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
      b.furColor = e.target.value;
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
      b.earStyle = e.target.value;
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
      b.eyeColor = e.target.value;
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
      b.blush = e.target.checked;
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

    const currentBunny = this.getCurrentBunny();
    const appearance = {
      furColor: currentBunny?.furColor || 'white',
      earStyle: currentBunny?.earStyle || 'upright',
      eyeColor: currentBunny?.eyeColor || 'ruby',
      blush: currentBunny?.blush !== false
    };

    // Render base bunny frame in idle pose
    const { canvas: frameCanvas, anchors } = BunnySpriteGenerator.renderFrame({
      state: 'idle',
      frameIndex: 0,
      direction: 1,
      appearance
    });

    const frameCtx = frameCanvas.getContext('2d');
    frameCtx.imageSmoothingEnabled = false;

    if (itemId !== 'none') {
      AccessoryRenderer.renderAccessories(
        frameCtx,
        { [category]: itemId },
        anchors,
        1,
        0
      );
    }

    // Draw the 32x32 sprite scaled onto the canvas (64x64)
    ctx.drawImage(frameCanvas, 0, 0, canvas.width, canvas.height);

    // For 'none', draw an unmistakable cancel indicator in the top right
    if (itemId === 'none') {
      ctx.strokeStyle = '#ef4444';
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.lineWidth = 2;
      const cx = canvas.width - 12;
      const cy = 12;
      const r = 7;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy + 5);
      ctx.lineTo(cx + 5, cy - 5);
      ctx.stroke();
    }
  }

  renderAccessoriesCategory(category) {
    const currentBunny = this.getCurrentBunny();
    if (!currentBunny) return;
    if (!currentBunny.equipped) currentBunny.equipped = {};
    const items = ACCESSORIES[category] || [];
    const equippedId = currentBunny.equipped[category] || 'none';
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
          <canvas class="item-preview-canvas" width="64" height="64"></canvas>
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
          currentBunny.equipped[category] = 'none';
          soundEngine.playHop();
        } else if (isUnlocked) {
          currentBunny.equipped[category] = item.id;
          soundEngine.playHop();
        } else {
          // Buy item
          if (this.state.inventory.coins >= item.price) {
            this.state.inventory.coins -= item.price;
            this.state.inventory.unlockedCosmetics.push(`${category}:${item.id}`);
            currentBunny.equipped[category] = item.id;
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
