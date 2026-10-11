// src/renderer/ui/wardrobe.js
// Interactive wardrobe logic, live animated preview, and cosmetic inventory management

const { ACCESSORIES, FUR_COLORS, EAR_STYLES, EYE_COLORS } = require('../../shared/constants');
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
    this.updateHeaderInfo();
    this.renderTabContent();

    // Start preview animation loop
    this.startPreviewLoop();

    // Listen for state syncs
    window.api.onStateUpdate((newState) => {
      this.state = newState;
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
          <div class="item-title">${item.name}</div>
          <span class="item-tier tier-${item.tier}">${item.tier}</span>
        </div>
        <div style="font-size: 11px; color: #64748b; margin: 4px 0;">
          ${isUnlocked ? (isEquipped ? 'Currently Wearing' : 'Owned') : `Price: 🪙 ${item.price}`}
        </div>
        <div>
          ${
            isEquipped
              ? `<button class="item-btn btn-unequip">Unequip</button>`
              : (isUnlocked
                  ? `<button class="item-btn btn-equip">Equip</button>`
                  : `<button class="item-btn btn-buy">Buy 🪙 ${item.price}</button>`)
          }
        </div>
      `;

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
          <div class="preset-title">${p.name || `Preset ${idx + 1}`}</div>
          <div style="font-size: 11px; color: #64748b;">${itemsDesc}</div>
        </div>
        <div class="preset-actions">
          <button class="btn-preset btn-save-preset">Save Current</button>
          <button class="btn-preset btn-load-preset">Load</button>
        </div>
      `;

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
