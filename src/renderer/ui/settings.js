// src/renderer/ui/settings.js
// Settings controller for monitor selection, size, hunger speed, audio, and autostart

class SettingsController {
  constructor() {
    this.closeBtn = document.getElementById('closeBtn');
    this.monitorSelect = document.getElementById('monitorSelect');
    this.scaleSelect = document.getElementById('scaleSelect');
    this.menuScaleSelect = document.getElementById('menuScaleSelect');
    this.hungerSpeedSelect = document.getElementById('hungerSpeedSelect');
    this.volumeSlider = document.getElementById('volumeSlider');
    this.volumeVal = document.getElementById('volumeVal');
    this.muteCheck = document.getElementById('muteCheck');
    this.startWindowsCheck = document.getElementById('startWindowsCheck');
    this.dndCheck = document.getElementById('dndCheck');
    this.resetBtn = document.getElementById('resetBtn');

    this.state = null;
    this.init();
  }

  async init() {
    this.closeBtn.addEventListener('click', () => {
      window.api.closeWindow('settings');
    });

    // 1. Load state
    const { state } = await window.api.loadState();
    this.state = state;
    const s = this.state.settings || {};

    // 2. Load displays
    const displays = await window.api.getDisplays();
    this.monitorSelect.innerHTML = '';
    displays.forEach((d) => {
      const opt = document.createElement('option');
      opt.value = d.index;
      opt.textContent = `${d.label} ${d.isPrimary ? '★ Primary' : ''}`;
      if (d.index === s.monitorIndex) opt.selected = true;
      this.monitorSelect.appendChild(opt);
    });

    this.monitorSelect.addEventListener('change', (e) => {
      const idx = parseInt(e.target.value, 10);
      this.state.settings.monitorIndex = idx;
      window.api.setMonitor(idx);
      this.saveState();
    });

    // 3. Bunny Scale
    this.scaleSelect.value = (s.bunnyScale || 2.5).toString();
    this.scaleSelect.addEventListener('change', (e) => {
      this.state.settings.bunnyScale = parseFloat(e.target.value);
      this.saveState();
    });

    // Menu / HUD Size Scale
    this.menuScaleSelect.value = (s.menuScale || 1.0).toString();
    this.menuScaleSelect.addEventListener('change', (e) => {
      this.state.settings.menuScale = parseFloat(e.target.value);
      this.saveState();
    });

    // 4. Hunger Speed
    this.hungerSpeedSelect.value = s.hungerSpeed || 'normal';
    this.hungerSpeedSelect.addEventListener('change', (e) => {
      this.state.settings.hungerSpeed = e.target.value;
      this.saveState();
    });

    // 5. Volume Slider
    const vol = s.volume !== undefined ? s.volume : 0.6;
    this.volumeSlider.value = vol;
    this.volumeVal.textContent = `${Math.round(vol * 100)}%`;
    this.volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.state.settings.volume = val;
      this.volumeVal.textContent = `${Math.round(val * 100)}%`;
      this.saveState();
    });

    // 6. Mute Checkbox
    this.muteCheck.checked = Boolean(s.isMuted);
    this.muteCheck.addEventListener('change', (e) => {
      this.state.settings.isMuted = e.target.checked;
      this.saveState();
    });

    // 7. Start with Windows
    this.startWindowsCheck.checked = Boolean(s.startWithWindows);
    this.startWindowsCheck.addEventListener('change', (e) => {
      this.state.settings.startWithWindows = e.target.checked;
      window.api.setStartWithWindows(e.target.checked);
      this.saveState();
    });

    // 8. Do Not Disturb
    this.dndCheck.checked = Boolean(s.doNotDisturb);
    this.dndCheck.addEventListener('change', (e) => {
      this.state.settings.doNotDisturb = e.target.checked;
      this.saveState();
    });

    // 9. Reset Save Data
    this.resetBtn.addEventListener('click', async () => {
      if (confirm('Are you sure you want to reset all progress, coins, and customizations? This cannot be undone.')) {
        await window.api.resetState();
        alert('Save data reset to defaults.');
        window.location.reload();
      }
    });
  }

  saveState() {
    if (window.api && window.api.saveState) {
      window.api.saveState(this.state);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new SettingsController();
});
