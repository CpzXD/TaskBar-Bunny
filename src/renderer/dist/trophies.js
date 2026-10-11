(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

  // src/shared/constants.js
  var require_constants = __commonJS({
    "src/shared/constants.js"(exports, module) {
      var HUNGER_SPEED_FACTORS = {
        relaxed: 0.5,
        // ~60 min per carrot
        normal: 1,
        // ~30 min per carrot
        fast: 2
        // ~15 min per carrot
      };
      var FOODS = {
        carrot: {
          id: "carrot",
          name: "Crunchy Carrot",
          hungerRestore: 35,
          hungerBonus: 35,
          happinessBonus: 10,
          cost: 10,
          color: "#ff8822",
          description: "A bunny classic. Rich in beta-carotene!",
          acquire: "Grows free in your taskbar garden, or buy in the Shop."
        },
        lettuce: {
          id: "lettuce",
          name: "Crisp Lettuce",
          hungerRestore: 20,
          hungerBonus: 20,
          happinessBonus: 5,
          cost: 5,
          color: "#76c442",
          description: "Refreshing and light green leaves.",
          acquire: "Buy in the Shop with coins earned from bunny care."
        },
        apple: {
          id: "apple",
          name: "Sweet Apple Slice",
          hungerRestore: 40,
          hungerBonus: 40,
          happinessBonus: 20,
          cost: 18,
          color: "#ee4444",
          description: "A juicy, sweet midday treat.",
          acquire: "Buy in the Shop with coins earned from achievements."
        },
        clover: {
          id: "clover",
          name: "Lucky Four-Leaf Clover",
          hungerRestore: 15,
          hungerBonus: 15,
          happinessBonus: 35,
          cost: 25,
          color: "#28bb67",
          description: "Guaranteed to bring bunny smiles.",
          acquire: "Buy in the Shop with coins earned from daily care."
        },
        strawberry: {
          id: "strawberry",
          name: "Ripe Strawberry",
          hungerRestore: 45,
          hungerBonus: 45,
          happinessBonus: 30,
          cost: 30,
          color: "#ff3366",
          description: "Fragrant, juicy, and delightfully sweet.",
          acquire: "Premium delicacy available in the Shop."
        }
      };
      var FUR_COLORS = {
        white: { id: "white", name: "Snow White", base: "#fdfbf7", shadow: "#e0dcd3", innerEar: "#ffb5cb" },
        brown: { id: "brown", name: "Chestnut Brown", base: "#b5794c", shadow: "#83522d", innerEar: "#df9487" },
        gray: { id: "gray", name: "Cloud Gray", base: "#abb0b8", shadow: "#7d848f", innerEar: "#e8afbd" },
        black: { id: "black", name: "Midnight Charcoal", base: "#3d3c45", shadow: "#24232b", innerEar: "#b48197" },
        pink: { id: "pink", name: "Pastel Sakura", base: "#fcd3de", shadow: "#e2a3b4", innerEar: "#ff85a9" },
        golden: { id: "golden", name: "Caramel Honey", base: "#ebb768", shadow: "#c48f43", innerEar: "#f5b5a8" },
        spotted: { id: "spotted", name: "Dutch Patch", base: "#fdfbf7", shadow: "#dedbd4", patch: "#704627", innerEar: "#ffb5cb" }
      };
      var EYE_COLORS = {
        ruby: { id: "ruby", name: "Ruby Pink", color: "#e64980" },
        black: { id: "black", name: "Deep Onyx", color: "#1a1921" },
        blue: { id: "blue", name: "Sky Blue", color: "#339af0" },
        green: { id: "green", name: "Emerald Green", color: "#40c057" },
        amber: { id: "amber", name: "Golden Amber", color: "#f59f00" }
      };
      var EAR_STYLES = {
        upright: { id: "upright", name: "Perky Upright" },
        floppy: { id: "floppy", name: "Floppy Lop" },
        derpy: { id: "derpy", name: "One Up One Down" }
      };
      var ACCESSORIES = {
        head: [
          { id: "none", name: "None", tier: "common", price: 0 },
          { id: "party_hat", name: "Party Cone", tier: "common", price: 20 },
          { id: "beanie", name: "Winter Beanie", tier: "common", price: 30 },
          { id: "cowboy_hat", name: "Sheriff Stetson", tier: "rare", price: 60 },
          { id: "wizard_hat", name: "Sorcerer Hat", tier: "rare", price: 80 },
          { id: "flower_crown", name: "Floral Crown", tier: "rare", price: 70 },
          { id: "headphones", name: "Gamer Headset", tier: "rare", price: 90 },
          { id: "golden_crown", name: "Royal Crown", tier: "epic", price: 150 },
          { id: "bunny_ears_headband", name: "Bunny Headband (Joke)", tier: "epic", price: 180 }
        ],
        face: [
          { id: "none", name: "None", tier: "common", price: 0 },
          { id: "glasses", name: "Smart Glasses", tier: "common", price: 25 },
          { id: "sunglasses", name: "Cool Shades", tier: "rare", price: 50 },
          { id: "monocle", name: "Fancy Monocle", tier: "rare", price: 65 },
          { id: "mustache", name: "Gentleman Mustache", tier: "epic", price: 85 }
        ],
        neck: [
          { id: "none", name: "None", tier: "common", price: 0 },
          { id: "red_scarf", name: "Cozy Red Scarf", tier: "common", price: 25 },
          { id: "bowtie", name: "Dapper Bow Tie", tier: "common", price: 35 },
          { id: "bell_collar", name: "Golden Bell Collar", tier: "rare", price: 60 },
          { id: "flower_lei", name: "Tropical Lei", tier: "rare", price: 70 }
        ],
        back: [
          { id: "none", name: "None", tier: "common", price: 0 },
          { id: "backpack", name: "Little Explorer Bag", tier: "common", price: 35 },
          { id: "cape", name: "Hero Cape", tier: "rare", price: 75 },
          { id: "angel_wings", name: "Fairy Wings", tier: "epic", price: 140 }
        ],
        held: [
          { id: "none", name: "None", tier: "common", price: 0 },
          { id: "balloon", name: "Heart Balloon", tier: "common", price: 30 },
          { id: "flag", name: "Cheering Flag", tier: "common", price: 40 },
          { id: "lollipop", name: "Rainbow Swirl", tier: "rare", price: 60 },
          { id: "wand", name: "Star Wand", tier: "epic", price: 120 }
        ],
        den: [
          { id: "default", name: "Cozy Burrow", tier: "common", price: 0, description: "Warm wooden burrow with thatched moss roof." },
          { id: "festive", name: "Festive Christmas Den", tier: "epic", price: 80, description: "Snowy gingerbread roof, twinkling holiday lights & wreath!", rewardFrom: "level_5" }
        ]
      };
      var ACHIEVEMENTS2 = [
        // Treat feeding tiers
        { id: "first_carrot", name: "First Crunch", description: "Feed your bunny for the first time.", rewardCoins: 20, rewardXp: 30 },
        { id: "fed_25", name: "Carrot Connoisseur", description: "Feed 25 treats to your bunny.", rewardCoins: 50, rewardXp: 60 },
        { id: "fed_100", name: "Feast Master", description: "Feed 100 treats to your bunny.", rewardCoins: 150, rewardXp: 200 },
        { id: "fed_250", name: "Banquet Host", description: "Feed 250 treats to your bunny.", rewardCoins: 250, rewardXp: 300 },
        { id: "fed_500", name: "The Bunny Gourmet", description: "Feed 500 treats to your bunny.", rewardCoins: 400, rewardXp: 500 },
        { id: "fed_1000", name: "Endless Harvest", description: "Feed 1,000 treats to your bunny.", rewardCoins: 750, rewardXp: 1e3 },
        { id: "fed_2500", name: "Carrot Legend", description: "Feed 2,500 treats to your bunny.", rewardCoins: 1500, rewardXp: 2e3 },
        { id: "fed_5000", name: "Infinite Feeder", description: "Feed 5,000 treats to your bunny.", rewardCoins: 3e3, rewardXp: 4e3 },
        // Petting affection tiers
        { id: "pet_50", name: "True Affection", description: "Pet your bunny 50 times.", rewardCoins: 40, rewardXp: 50 },
        { id: "pet_200", name: "Fluffy Bestie", description: "Pet your bunny 200 times.", rewardCoins: 100, rewardXp: 150 },
        { id: "pet_500", name: "Gentle Companion", description: "Pet your bunny 500 times.", rewardCoins: 200, rewardXp: 250 },
        { id: "pet_1000", name: "Soul Bond", description: "Pet your bunny 1,000 times.", rewardCoins: 400, rewardXp: 500 },
        { id: "pet_2500", name: "Endless Affection", description: "Pet your bunny 2,500 times.", rewardCoins: 800, rewardXp: 1e3 },
        { id: "pet_5000", name: "Fluff Master", description: "Pet your bunny 5,000 times.", rewardCoins: 1500, rewardXp: 2e3 },
        { id: "pet_10000", name: "Mythical Cuddler", description: "Pet your bunny 10,000 times.", rewardCoins: 3e3, rewardXp: 5e3 },
        // Level milestones
        { id: "level_5", name: "Growing Up", description: "Reach Bunny Level 5.", rewardCoins: 80, rewardXp: 100, rewardItem: { category: "den", id: "festive", name: "Festive Christmas Den \u{1F384}" } },
        { id: "level_10", name: "Legendary Bunny", description: "Reach Bunny Level 10.", rewardCoins: 200, rewardXp: 300 },
        { id: "level_20", name: "Grand Rabbit", description: "Reach Bunny Level 20.", rewardCoins: 400, rewardXp: 600 },
        { id: "level_30", name: "Elder Bunny", description: "Reach Bunny Level 30.", rewardCoins: 600, rewardXp: 900 },
        { id: "level_50", name: "Celestial Bunny", description: "Reach Bunny Level 50.", rewardCoins: 1e3, rewardXp: 1500 },
        { id: "level_100", name: "Eternal Fluff Legend", description: "Reach Bunny Level 100.", rewardCoins: 2500, rewardXp: 4e3 },
        // Styling & Garden
        { id: "first_harvest", name: "Green Thumb", description: "Harvest your first homegrown crop.", rewardCoins: 30, rewardXp: 40 },
        { id: "fashion_pioneer", name: "Fashion Pioneer", description: "Equip any accessory in the Shop.", rewardCoins: 35, rewardXp: 45 },
        { id: "three_presets", name: "Stylist Guru", description: "Save all 3 outfit presets in the Shop.", rewardCoins: 75, rewardXp: 90 },
        { id: "cosmetics_5", name: "Trendsetter", description: "Unlock 5 accessories in the Shop.", rewardCoins: 120, rewardXp: 150 },
        { id: "cosmetics_12", name: "Wardrobe Royalty", description: "Unlock 12 accessories in the Shop.", rewardCoins: 300, rewardXp: 400 }
      ];
      var DEFAULT_STATE = {
        version: 1,
        bunny: {
          name: "Barnaby",
          furColor: "white",
          earStyle: "upright",
          eyeColor: "ruby",
          blush: true,
          equipped: {
            head: "none",
            face: "none",
            neck: "none",
            back: "none",
            held: "none"
          },
          hunger: 85,
          happiness: 90,
          level: 1,
          xp: 0,
          totalCarrotsFed: 0,
          totalPetCount: 0,
          outfitPresets: [
            { name: "Preset 1", head: "none", face: "none", neck: "none", back: "none", held: "none" },
            { name: "Preset 2", head: "none", face: "none", neck: "none", back: "none", held: "none" },
            { name: "Preset 3", head: "none", face: "none", neck: "none", back: "none", held: "none" }
          ]
        },
        extraBunnies: [],
        inventory: {
          coins: 50,
          foods: {
            carrot: 5,
            lettuce: 3,
            apple: 1,
            clover: 1,
            strawberry: 1
          },
          unlockedCosmetics: [
            "head:party_hat",
            "face:glasses",
            "neck:red_scarf"
          ],
          unlockedTerrains: ["grassy"]
        },
        garden: {
          plots: [
            { id: 1, planted: true, plantedAt: Date.now() - 6e4, growDurationMs: 12e4, ready: false }
          ]
        },
        settings: {
          bunnyScale: 2.5,
          menuScale: 1,
          monitorIndex: 0,
          volume: 0.6,
          isMuted: false,
          hungerSpeed: "normal",
          roamingArea: "cozy",
          floorMode: "taskbar",
          menuPosition: null,
          startWithWindows: false,
          doNotDisturb: false,
          denSkin: "default",
          activeTerrain: "grassy"
        },
        achievements: {
          unlocked: []
        },
        meta: {
          lastSaved: Date.now(),
          lastLoginDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
          loginStreak: 1
        }
      };
      var TERRAINS = {
        grassy: {
          id: "grassy",
          name: "Lush Meadow",
          tier: "common",
          price: 0,
          crops: ["carrot", "strawberry", "lettuce"],
          description: "Fresh green meadow with tiny daisies. Grows carrots, strawberries, and crisp cabbage!"
        },
        icy: {
          id: "icy",
          name: "Frosty Ice Rink",
          tier: "epic",
          price: 500,
          crops: ["apple", "clover"],
          description: "Glistening frozen lake! Barnaby ice skates and glides, occasionally slipping over (30-40s). Collect sweet apples & clovers!"
        }
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = {
          HUNGER_SPEED_FACTORS,
          FOODS,
          FUR_COLORS,
          EYE_COLORS,
          EAR_STYLES,
          ACCESSORIES,
          TERRAINS,
          ACHIEVEMENTS: ACHIEVEMENTS2,
          DEFAULT_STATE
        };
      }
    }
  });

  // src/renderer/ui/trophies.js
  var { ACHIEVEMENTS } = require_constants();
  var TrophiesController = class {
    constructor() {
      this.closeBtn = document.getElementById("closeBtn");
      this.trophiesContainer = document.getElementById("trophiesContainer");
      this.unlockedCountEl = document.getElementById("unlockedCount");
      this.totalCountEl = document.getElementById("totalCount");
      this.overviewPctEl = document.getElementById("overviewPct");
      this.overviewFillEl = document.getElementById("overviewFill");
      this.state = null;
      this.init();
    }
    async init() {
      if (this.closeBtn) {
        this.closeBtn.addEventListener("click", () => {
          if (window.api && window.api.closeWindow) {
            window.api.closeWindow("trophies");
          }
        });
      }
      try {
        const { state } = await window.api.loadState();
        this.state = state;
        this.render();
      } catch (err) {
        console.error("[Trophies] Could not load state:", err);
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
      const maxLevel = Math.max(1, ...allBunnies.map((b) => b.level || 1));
      const unlockedCosmeticsCount = (this.state?.inventory?.unlockedCosmetics || []).length;
      let current = 0;
      let max = 1;
      if (ach.id.startsWith("fed_")) {
        max = parseInt(ach.id.replace("fed_", ""), 10) || 25;
        current = Math.min(max, totalFed);
      } else if (ach.id === "first_carrot") {
        max = 1;
        current = Math.min(1, totalFed);
      } else if (ach.id.startsWith("pet_")) {
        max = parseInt(ach.id.replace("pet_", ""), 10) || 50;
        current = Math.min(max, totalPet);
      } else if (ach.id.startsWith("level_")) {
        max = parseInt(ach.id.replace("level_", ""), 10) || 5;
        current = Math.min(max, maxLevel);
      } else if (ach.id.startsWith("cosmetics_")) {
        max = parseInt(ach.id.replace("cosmetics_", ""), 10) || 5;
        current = Math.min(max, unlockedCosmeticsCount);
      } else if (ach.id === "first_harvest") {
        max = 1;
        current = this.state?.garden?.plots?.some((p) => p.ready || p.plantedAt) ? 1 : 0;
      } else if (ach.id === "fashion_pioneer") {
        max = 1;
        const hasEquipped = allBunnies.some((b) => Object.values(b.equipped || {}).some((v) => v && v !== "none"));
        current = hasEquipped ? 1 : 0;
      } else if (ach.id === "three_presets") {
        max = 3;
        const savedCount = (bunny.outfitPresets || []).filter(
          (p) => p.saved || Object.entries(p).some(([k, v]) => k !== "name" && v && v !== "none")
        ).length;
        current = Math.min(max, savedCount);
      } else {
        max = 1;
        current = isUnlocked ? 1 : 0;
      }
      if (isUnlocked) current = max;
      const pct = isUnlocked ? 100 : Math.min(100, Math.round(current / max * 100));
      return { isUnlocked, current, max, pct };
    }
    render() {
      if (!this.state || !this.trophiesContainer) return;
      this.trophiesContainer.innerHTML = "";
      const unlockedList = this.state.achievements?.unlocked || [];
      const totalCount = ACHIEVEMENTS.length;
      const unlockedCount = ACHIEVEMENTS.filter((a) => unlockedList.includes(a.id)).length;
      const overallPct = Math.round(unlockedCount / totalCount * 100);
      if (this.unlockedCountEl) this.unlockedCountEl.textContent = unlockedCount;
      if (this.totalCountEl) this.totalCountEl.textContent = totalCount;
      if (this.overviewPctEl) this.overviewPctEl.textContent = `${overallPct}%`;
      if (this.overviewFillEl) this.overviewFillEl.style.width = `${overallPct}%`;
      for (const ach of ACHIEVEMENTS) {
        const { isUnlocked, current, max, pct } = this.getAchievementProgress(ach);
        const card = document.createElement("div");
        card.className = `achievement-card ${isUnlocked ? "unlocked" : ""}`;
        card.innerHTML = `
        <div class="ach-header">
          <div class="ach-icon">${isUnlocked ? "\u{1F3C6}" : "\u{1F512}"}</div>
          <div class="ach-info">
            <div class="ach-title">${ach.name}</div>
            <div class="ach-desc">${ach.description}</div>
            ${ach.rewardItem ? `<div class="ach-cosmetic-reward" style="margin-top: 5px;">\u{1F381} Reward: ${ach.rewardItem.name} ${isUnlocked ? "(Unlocked! \u2728)" : ""}</div>` : ""}
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
          <div class="ach-progress-text">${isUnlocked ? "Completed! \u2728" : `${current} / ${max} (${pct}%)`}</div>
        </div>
      `;
        this.trophiesContainer.appendChild(card);
      }
    }
  };
  window.addEventListener("DOMContentLoaded", () => {
    new TrophiesController();
  });
})();
//# sourceMappingURL=trophies.js.map
