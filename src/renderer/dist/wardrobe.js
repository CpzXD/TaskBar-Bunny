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
      var FOODS2 = {
        carrot: {
          id: "carrot",
          name: "Crunchy Carrot",
          hungerRestore: 35,
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
          happinessBonus: 30,
          cost: 30,
          color: "#ff3366",
          description: "Fragrant, juicy, and delightfully sweet.",
          acquire: "Premium delicacy available in the Shop."
        }
      };
      var FUR_COLORS2 = {
        white: { id: "white", name: "Snow White", base: "#fdfbf7", shadow: "#e0dcd3", innerEar: "#ffb5cb" },
        brown: { id: "brown", name: "Chestnut Brown", base: "#b5794c", shadow: "#83522d", innerEar: "#df9487" },
        gray: { id: "gray", name: "Cloud Gray", base: "#abb0b8", shadow: "#7d848f", innerEar: "#e8afbd" },
        black: { id: "black", name: "Midnight Charcoal", base: "#3d3c45", shadow: "#24232b", innerEar: "#b48197" },
        pink: { id: "pink", name: "Pastel Sakura", base: "#fcd3de", shadow: "#e2a3b4", innerEar: "#ff85a9" },
        golden: { id: "golden", name: "Caramel Honey", base: "#ebb768", shadow: "#c48f43", innerEar: "#f5b5a8" },
        spotted: { id: "spotted", name: "Dutch Patch", base: "#fdfbf7", shadow: "#dedbd4", patch: "#704627", innerEar: "#ffb5cb" }
      };
      var EYE_COLORS2 = {
        ruby: { id: "ruby", name: "Ruby Pink", color: "#e64980" },
        black: { id: "black", name: "Deep Onyx", color: "#1a1921" },
        blue: { id: "blue", name: "Sky Blue", color: "#339af0" },
        green: { id: "green", name: "Emerald Green", color: "#40c057" },
        amber: { id: "amber", name: "Golden Amber", color: "#f59f00" }
      };
      var EAR_STYLES2 = {
        upright: { id: "upright", name: "Perky Upright" },
        floppy: { id: "floppy", name: "Floppy Lop" },
        derpy: { id: "derpy", name: "One Up One Down" }
      };
      var ACCESSORIES2 = {
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
        { id: "first_carrot", name: "First Crunch", description: "Feed your bunny for the first time.", rewardCoins: 20, rewardXp: 30 },
        { id: "fed_25", name: "Carrot Connoisseur", description: "Feed 25 treats to your bunny.", rewardCoins: 50, rewardXp: 60 },
        { id: "fed_100", name: "Feast Master", description: "Feed 100 treats to your bunny.", rewardCoins: 150, rewardXp: 200 },
        { id: "pet_50", name: "True Affection", description: "Pet your bunny 50 times.", rewardCoins: 40, rewardXp: 50 },
        { id: "pet_200", name: "Fluffy Bestie", description: "Pet your bunny 200 times.", rewardCoins: 100, rewardXp: 150 },
        { id: "first_harvest", name: "Green Thumb", description: "Harvest your first homegrown carrot.", rewardCoins: 30, rewardXp: 40 },
        { id: "fashion_pioneer", name: "Fashion Pioneer", description: "Equip any accessory in the Shop.", rewardCoins: 25, rewardXp: 35 },
        { id: "three_presets", name: "Stylist Guru", description: "Save all 3 outfit presets.", rewardCoins: 60, rewardXp: 75 },
        { id: "level_5", name: "Growing Up", description: "Reach Bunny Level 5.", rewardCoins: 80, rewardXp: 100, rewardItem: { category: "den", id: "festive", name: "Festive Christmas Den \u{1F384}" } },
        { id: "level_10", name: "Legendary Bunny", description: "Reach Bunny Level 10.", rewardCoins: 200, rewardXp: 300 }
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
          ]
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
          denSkin: "default"
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
      if (typeof module !== "undefined" && module.exports) {
        module.exports = {
          HUNGER_SPEED_FACTORS,
          FOODS: FOODS2,
          FUR_COLORS: FUR_COLORS2,
          EYE_COLORS: EYE_COLORS2,
          EAR_STYLES: EAR_STYLES2,
          ACCESSORIES: ACCESSORIES2,
          ACHIEVEMENTS: ACHIEVEMENTS2,
          DEFAULT_STATE
        };
      }
    }
  });

  // src/renderer/sprites/palette.js
  var require_palette = __commonJS({
    "src/renderer/sprites/palette.js"(exports, module) {
      var PALETTES = {
        fur: {
          white: {
            outline: "#2b2633",
            base: "#ffffff",
            shadow: "#d8dee9",
            highlight: "#ffffff",
            innerEar: "#ffb3c6",
            innerEarShadow: "#f092ab",
            nose: "#ff7597"
          },
          brown: {
            outline: "#2b1b17",
            base: "#b5794c",
            shadow: "#804c27",
            highlight: "#cf9263",
            innerEar: "#e8a599",
            innerEarShadow: "#cc8477",
            nose: "#5a341b"
          },
          gray: {
            outline: "#27292d",
            base: "#9aa0a6",
            shadow: "#6e747c",
            highlight: "#bec4cc",
            innerEar: "#f0b1c0",
            innerEarShadow: "#d691a3",
            nose: "#494d54"
          },
          black: {
            outline: "#151419",
            base: "#3a3942",
            shadow: "#222129",
            highlight: "#565561",
            innerEar: "#a37084",
            innerEarShadow: "#7d5263",
            nose: "#1f1e24"
          },
          pink: {
            outline: "#422432",
            base: "#fcc2d7",
            shadow: "#e599b2",
            highlight: "#ffdeeb",
            innerEar: "#ff87a8",
            innerEarShadow: "#e66589",
            nose: "#d6336c"
          },
          golden: {
            outline: "#38250f",
            base: "#f5c069",
            shadow: "#c99238",
            highlight: "#fce29d",
            innerEar: "#fab6ab",
            innerEarShadow: "#d99285",
            nose: "#875114"
          },
          spotted: {
            outline: "#2b1b17",
            base: "#ffffff",
            shadow: "#dcdfe6",
            highlight: "#ffffff",
            patch: "#6e4426",
            patchShadow: "#4d2e18",
            innerEar: "#ffb3c6",
            innerEarShadow: "#f092ab",
            nose: "#4d2e18"
          }
        },
        eyes: {
          ruby: "#e64980",
          black: "#1f1e24",
          blue: "#339af0",
          green: "#40c057",
          amber: "#f59f00"
        },
        blush: "rgba(255, 107, 107, 0.65)",
        effects: {
          heart: "#ff4d6d",
          heartShadow: "#c9184a",
          star: "#ffd166",
          zzz: "#74c0fc",
          tear: "#4dabf7"
        }
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = { PALETTES };
      }
    }
  });

  // src/renderer/sprites/accessories.js
  var require_accessories = __commonJS({
    "src/renderer/sprites/accessories.js"(exports, module) {
      var AccessoryRenderer2 = class {
        /**
         * Draws equipped accessories over the bunny canvas.
         * @param {CanvasRenderingContext2D} ctx - Context of the target 32x32 canvas
         * @param {Object} equipped - { head, face, neck, back, held }
         * @param {Object} anchors - { head: {x,y}, face: {x,y}, neck: {x,y}, back: {x,y}, held: {x,y} }
         * @param {number} direction - 1 for right, -1 for left
         * @param {number} frame - animation frame
         */
        static renderAccessories(ctx, equipped = {}, anchors = {}, direction = 1, frame = 0) {
          if (!anchors || !anchors.head) return;
          const p = (x, y, color) => {
            if (x >= 0 && x < 32 && y >= 0 && y < 32 && color) {
              ctx.fillStyle = color;
              ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
            }
          };
          const rect = (x, y, w, h, color) => {
            if (color) {
              ctx.fillStyle = color;
              ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
            }
          };
          const dir = direction;
          if (equipped.back && equipped.back !== "none") {
            const bx = anchors.back.x;
            const by = anchors.back.y;
            switch (equipped.back) {
              case "backpack":
                rect(bx - 2 * dir, by - 2, 4, 6, "#8b5a2b");
                rect(bx - 1 * dir, by - 1, 2, 2, "#a06a38");
                p(bx - 1 * dir, by + 1, "#ffd700");
                p(bx - 3 * dir, by - 1, "#4a2f18");
                p(bx - 3 * dir, by + 4, "#4a2f18");
                break;
              case "cape":
                const flutter = frame % 2 === 0 ? 0 : 1;
                rect(bx - 4 * dir, by - 1, 3, 7 + flutter, "#e63946");
                rect(bx - 5 * dir, by + 1, 2, 6 + flutter, "#ba181b");
                p(bx - 1 * dir, by - 2, "#ffd700");
                break;
              case "angel_wings":
                const flap = frame % 2 === 0 ? 0 : -1;
                rect(bx - 4 * dir, by - 4 + flap, 3, 5, "#ffffff");
                rect(bx - 6 * dir, by - 5 + flap, 3, 4, "#e0f2fe");
                p(bx - 7 * dir, by - 6 + flap, "#bae6fd");
                p(bx - 5 * dir, by + 1 + flap, "#7dd3fc");
                break;
            }
          }
          if (equipped.neck && equipped.neck !== "none") {
            const nx = anchors.neck.x;
            const ny = anchors.neck.y - 2;
            switch (equipped.neck) {
              case "red_scarf":
                rect(nx - 4, ny, 8, 3, "#e63946");
                rect(nx - 2, ny + 1, 4, 1, "#ff6b6b");
                rect(nx - 5 * dir, ny + 1, 3, 5, "#ba181b");
                rect(nx - 6 * dir, ny + 5, 2, 1, "#ffd166");
                break;
              case "bowtie":
                rect(nx - 3, ny, 2, 3, "#e63946");
                rect(nx + 1, ny, 2, 3, "#e63946");
                rect(nx - 1, ny + 1, 2, 1, "#ffffff");
                break;
              case "bell_collar":
                rect(nx - 4, ny, 8, 2, "#d90429");
                rect(nx - 1, ny + 2, 3, 3, "#ffd700");
                p(nx, ny + 3, "#78350f");
                break;
              case "flower_lei":
                p(nx - 4, ny, "#ff6b6b");
                p(nx - 2, ny + 1, "#ffd166");
                p(nx, ny + 1, "#48bb78");
                p(nx + 2, ny + 1, "#38bdf8");
                p(nx + 4, ny, "#f472b6");
                break;
            }
          }
          if (equipped.face && equipped.face !== "none") {
            const fx = anchors.face.x;
            const fy = anchors.face.y;
            switch (equipped.face) {
              case "glasses":
                rect(fx - 4 * dir, fy - 1, 3, 3, "#1f2937");
                rect(fx + 2 * dir, fy - 1, 3, 3, "#1f2937");
                p(fx - 3 * dir, fy, "#93c5fd");
                p(fx + 3 * dir, fy, "#93c5fd");
                rect(fx - 1 * dir, fy, 2, 1, "#1f2937");
                break;
              case "sunglasses":
                rect(fx - 5 * dir, fy - 1, 10, 3, "#111827");
                p(fx - 3 * dir, fy, "#6b7280");
                p(fx + 2 * dir, fy, "#6b7280");
                break;
              case "monocle":
                rect(fx + 2 * dir, fy - 1, 3, 3, "#d97706");
                p(fx + 3 * dir, fy, "#bae6fd");
                p(fx + 4 * dir, fy + 2, "#d97706");
                p(fx + 3 * dir, fy + 3, "#d97706");
                break;
              case "mustache":
                rect(fx - 3, fy + 3, 6, 2, "#451a03");
                p(fx - 4 * dir, fy + 2, "#451a03");
                p(fx + 4 * dir, fy + 2, "#451a03");
                break;
            }
          }
          if (equipped.head && equipped.head !== "none") {
            const hx = anchors.head.x;
            const hy = anchors.head.y;
            switch (equipped.head) {
              case "party_hat":
                rect(hx - 1, hy - 8, 3, 2, "#fbbf24");
                rect(hx - 2, hy - 6, 4, 3, "#ec4899");
                rect(hx - 3, hy - 3, 6, 3, "#3b82f6");
                rect(hx - 4, hy, 8, 2, "#10b981");
                break;
              case "beanie":
                p(hx, hy - 6, "#ffffff");
                rect(hx - 4, hy - 5, 8, 4, "#dc2626");
                rect(hx - 5, hy - 1, 10, 2, "#ffffff");
                break;
              case "cowboy_hat":
                rect(hx - 3, hy - 6, 6, 4, "#78350f");
                rect(hx - 2, hy - 2, 5, 1, "#f59e0b");
                rect(hx - 6, hy - 1, 13, 2, "#92400e");
                break;
              case "wizard_hat":
                p(hx - 1 * dir, hy - 10, "#fde047");
                rect(hx - 1, hy - 8, 3, 3, "#4338ca");
                rect(hx - 2, hy - 5, 5, 3, "#3730a3");
                p(hx, hy - 4, "#fde047");
                rect(hx - 6, hy - 2, 12, 2, "#312e81");
                break;
              case "flower_crown":
                p(hx - 5, hy - 1, "#f43f5e");
                p(hx - 3, hy - 2, "#fbbf24");
                p(hx - 1, hy - 2, "#38bdf8");
                p(hx + 1, hy - 2, "#a855f7");
                p(hx + 3, hy - 1, "#22c55e");
                p(hx + 5, hy, "#f43f5e");
                break;
              case "headphones":
                rect(hx - 5, hy - 4, 10, 2, "#1f2937");
                rect(hx - 6 * dir, hy - 2, 3, 5, "#ec4899");
                rect(hx + 4 * dir, hy - 2, 3, 5, "#ec4899");
                p(hx - 5 * dir, hy, "#ffffff");
                p(hx + 5 * dir, hy, "#ffffff");
                break;
              case "golden_crown":
                rect(hx - 4, hy - 4, 9, 2, "#f59e0b");
                p(hx - 4, hy - 6, "#fbbf24");
                p(hx, hy - 7, "#fbbf24");
                p(hx + 4, hy - 6, "#fbbf24");
                p(hx - 2, hy - 3, "#ef4444");
                p(hx + 2, hy - 3, "#3b82f6");
                break;
              case "bunny_ears_headband":
                rect(hx - 4, hy - 1, 9, 1, "#111827");
                rect(hx - 3, hy - 7, 2, 6, "#f472b6");
                p(hx - 2, hy - 6, "#ffffff");
                rect(hx + 2, hy - 7, 2, 6, "#f472b6");
                p(hx + 3, hy - 6, "#ffffff");
                break;
            }
          }
          if (equipped.held && equipped.held !== "none") {
            const hx = anchors.held.x;
            const hy = anchors.held.y;
            switch (equipped.held) {
              case "balloon":
                const sway = frame % 2 === 0 ? 0 : 1;
                const bx = hx + 1 * dir + sway;
                const by = hy - 15;
                rect(bx - 3, by, 6, 5, "#ff4d6d");
                p(bx - 2, by - 1, "#ff4d6d");
                p(bx + 1, by - 1, "#ff4d6d");
                p(bx - 2, by + 1, "#ffccd5");
                p(bx, by + 5, "#c9184a");
                p(bx, by + 6, "#94a3b8");
                p(bx, by + 8, "#94a3b8");
                p(hx, hy, "#94a3b8");
                break;
              case "flag":
                rect(hx, hy - 10, 1, 12, "#92400e");
                rect(hx + 1 * dir, hy - 10, 5, 4, "#3b82f6");
                p(hx + 3 * dir, hy - 8, "#ffffff");
                break;
              case "lollipop":
                rect(hx, hy - 2, 1, 5, "#ffffff");
                rect(hx - 2, hy - 6, 5, 4, "#fb7185");
                rect(hx - 1, hy - 5, 3, 2, "#fde047");
                p(hx, hy - 4, "#38bdf8");
                break;
              case "wand":
                rect(hx, hy - 4, 1, 7, "#d97706");
                p(hx, hy - 7, "#fef08a");
                rect(hx - 1, hy - 6, 3, 2, "#eab308");
                p(hx, hy - 5, "#ffffff");
                break;
            }
          }
        }
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = { AccessoryRenderer: AccessoryRenderer2 };
      }
    }
  });

  // src/renderer/sprites/bunnySprites.js
  var require_bunnySprites = __commonJS({
    "src/renderer/sprites/bunnySprites.js"(exports, module) {
      var { PALETTES } = require_palette();
      var { AccessoryRenderer: AccessoryRenderer2 } = require_accessories();
      var BunnySpriteGenerator2 = class {
        /**
         * Generates a 32x32 canvas for a specific state, frame, direction, and appearance.
         * @param {Object} options
         * @param {string} options.state - 'idle', 'walk', 'sit', 'groom', 'sleep', 'hop', 'eat', 'sad', 'happy', 'dangling'
         * @param {number} options.frameIndex - current animation frame index
         * @param {number} options.direction - 1 for right, -1 for left
         * @param {Object} options.appearance - { furColor, earStyle, eyeColor, blush }
         * @param {Object} options.equipped - { head, face, neck, back, held }
         * @returns {{ canvas: HTMLCanvasElement, anchors: Object }}
         */
        static renderFrame({ state = "idle", frameIndex = 0, direction = 1, appearance = {}, equipped = null }) {
          const canvas = document.createElement("canvas");
          canvas.width = 32;
          canvas.height = 32;
          const ctx = canvas.getContext("2d");
          ctx.imageSmoothingEnabled = false;
          const fur = PALETTES.fur[appearance.furColor] || PALETTES.fur.white;
          const eyeColor = PALETTES.eyes[appearance.eyeColor] || PALETTES.eyes.ruby;
          const earStyle = appearance.earStyle || "upright";
          const hasBlush = appearance.blush !== false;
          const isSpotted = appearance.furColor === "spotted";
          let headOffsetY = 0;
          let bodyOffsetY = 0;
          let headOffsetX = 0;
          let earAngle = 0;
          let eyeType = "normal";
          let mouthType = "dot";
          let footOffsetL = 0;
          let footOffsetR = 0;
          let pawsVisible = true;
          let tailOffsetY = 0;
          let isSquash = false;
          let isStretch = false;
          let isCurled = false;
          let isDangling = false;
          let groomStep = 0;
          switch (state) {
            case "idle":
              headOffsetY = frameIndex % 2 === 1 ? 1 : 0;
              bodyOffsetY = frameIndex % 2 === 1 ? 0 : 0;
              eyeType = frameIndex % 8 === 7 ? "blink" : "normal";
              break;
            case "walk":
              const wStep = frameIndex % 4;
              if (wStep === 0) {
                headOffsetY = 0;
                footOffsetL = -1;
                footOffsetR = 1;
                earAngle = 1;
              } else if (wStep === 1) {
                headOffsetY = 1;
                footOffsetL = 0;
                footOffsetR = 0;
                earAngle = 0;
              } else if (wStep === 2) {
                headOffsetY = 0;
                footOffsetL = 1;
                footOffsetR = -1;
                earAngle = -1;
              } else {
                headOffsetY = -1;
                footOffsetL = 0;
                footOffsetR = 0;
                earAngle = 0;
              }
              break;
            case "sit":
              headOffsetY = 2;
              bodyOffsetY = 1;
              eyeType = frameIndex % 6 === 5 ? "blink" : "normal";
              break;
            case "groom":
              headOffsetY = 1;
              groomStep = frameIndex % 4;
              eyeType = "happy";
              mouthType = "smile";
              break;
            case "sleep":
              isCurled = true;
              headOffsetY = 3;
              bodyOffsetY = 2;
              eyeType = "sleep";
              break;
            case "hop":
              const hStep = frameIndex % 3;
              if (hStep === 0) {
                isSquash = true;
                headOffsetY = 2;
                bodyOffsetY = 1;
              } else if (hStep === 1) {
                isStretch = true;
                headOffsetY = -4;
                bodyOffsetY = -3;
                eyeType = "happy";
              } else {
                headOffsetY = 0;
                bodyOffsetY = 0;
              }
              break;
            case "eat":
              const eStep = frameIndex % 2;
              headOffsetY = 2;
              mouthType = eStep === 0 ? "chew_open" : "chew_closed";
              eyeType = "happy";
              break;
            case "sad":
              headOffsetY = 2;
              earAngle = -2;
              eyeType = "sad";
              break;
            case "happy":
              headOffsetY = frameIndex % 2 === 1 ? -2 : 0;
              eyeType = "happy";
              mouthType = "smile";
              earAngle = 1;
              break;
            case "dangling":
              isDangling = true;
              headOffsetY = -1;
              bodyOffsetY = 0;
              eyeType = "wide";
              mouthType = "open";
              footOffsetL = 2;
              footOffsetR = 2;
              break;
            default:
              headOffsetY = 0;
          }
          const baseHeadX = 17;
          const baseHeadY = 16 + headOffsetY;
          const baseBodyX = 15;
          const baseBodyY = 22 + bodyOffsetY;
          const p = (x, y, color) => {
            if (x >= 0 && x < 32 && y >= 0 && y < 32 && color) {
              ctx.fillStyle = color;
              ctx.fillRect(x, y, 1, 1);
            }
          };
          const rect = (x, y, w, h, color) => {
            if (color) {
              ctx.fillStyle = color;
              ctx.fillRect(x, y, w, h);
            }
          };
          if (!isCurled) {
            const tailX = baseBodyX - 8;
            const tailY = baseBodyY - 2 + tailOffsetY;
            rect(tailX + 1, tailY, 3, 4, fur.base);
            rect(tailX, tailY + 1, 1, 2, fur.base);
            rect(tailX + 1, tailY + 3, 3, 1, fur.shadow);
            p(tailX + 1, tailY - 1, fur.outline);
            p(tailX, tailY, fur.outline);
            p(tailX - 1, tailY + 1, fur.outline);
            p(tailX - 1, tailY + 2, fur.outline);
            p(tailX, tailY + 3, fur.outline);
            p(tailX + 1, tailY + 4, fur.outline);
            p(tailX + 2, tailY + 4, fur.outline);
          }
          const earY = baseHeadY - 9;
          const leftEarX = baseHeadX - 4 + earAngle;
          const rightEarX = baseHeadX + 2 + earAngle;
          if (earStyle === "upright" || earStyle === "derpy" && !isCurled) {
            rect(leftEarX, earY + 2, 3, 7, fur.base);
            rect(leftEarX + 1, earY + 3, 1, 5, fur.innerEar);
            p(leftEarX + 1, earY + 1, fur.base);
            p(leftEarX + 1, earY, fur.outline);
            p(leftEarX, earY + 1, fur.outline);
            p(leftEarX + 2, earY + 1, fur.outline);
            rect(leftEarX - 1, earY + 2, 1, 7, fur.outline);
            rect(leftEarX + 3, earY + 2, 1, 7, fur.outline);
            if (earStyle === "upright") {
              rect(rightEarX, earY + 2, 3, 7, fur.base);
              rect(rightEarX + 1, earY + 3, 1, 5, fur.innerEar);
              p(rightEarX + 1, earY + 1, fur.base);
              p(rightEarX + 1, earY, fur.outline);
              p(rightEarX, earY + 1, fur.outline);
              p(rightEarX + 2, earY + 1, fur.outline);
              rect(rightEarX - 1, earY + 2, 1, 7, fur.outline);
              rect(rightEarX + 3, earY + 2, 1, 7, fur.outline);
            } else {
              rect(rightEarX + 1, baseHeadY - 3, 4, 3, fur.base);
              rect(rightEarX + 3, baseHeadY, 3, 4, fur.base);
              rect(rightEarX + 4, baseHeadY + 1, 1, 3, fur.innerEar);
              rect(rightEarX + 6, baseHeadY, 1, 5, fur.outline);
              rect(rightEarX + 2, baseHeadY + 4, 4, 1, fur.outline);
            }
          } else if (earStyle === "floppy" || isCurled) {
            const flopLY = baseHeadY - 2;
            rect(leftEarX - 1, flopLY, 3, 8, fur.base);
            rect(leftEarX, flopLY + 2, 1, 5, fur.innerEar);
            rect(leftEarX - 2, flopLY + 1, 1, 7, fur.outline);
            rect(leftEarX + 2, flopLY + 1, 1, 7, fur.outline);
            p(leftEarX - 1, flopLY + 8, fur.outline);
            p(leftEarX, flopLY + 8, fur.outline);
            const flopRY = baseHeadY - 1;
            rect(rightEarX + 1, flopRY, 3, 8, fur.base);
            rect(rightEarX + 2, flopRY + 2, 1, 5, fur.innerEar);
            rect(rightEarX, flopRY + 1, 1, 7, fur.outline);
            rect(rightEarX + 4, flopRY + 1, 1, 7, fur.outline);
            p(rightEarX + 2, flopRY + 8, fur.outline);
            p(rightEarX + 3, flopRY + 8, fur.outline);
          }
          const bodyW = isSquash ? 16 : isStretch ? 10 : 13;
          const bodyH = isSquash ? 8 : isStretch ? 12 : 10;
          const bodyLeft = baseBodyX - Math.floor(bodyW / 2);
          const bodyTop = baseBodyY - Math.floor(bodyH / 2);
          rect(bodyLeft, bodyTop, bodyW, bodyH, fur.base);
          rect(bodyLeft + 1, bodyTop + bodyH - 2, bodyW - 2, 2, fur.shadow);
          if (isSpotted) {
            rect(bodyLeft + 2, bodyTop + 2, 5, 4, fur.patch);
            rect(bodyLeft + 3, bodyTop + 5, 3, 2, fur.patchShadow);
          }
          rect(bodyLeft - 1, bodyTop + 1, 1, bodyH - 2, fur.outline);
          rect(bodyLeft + bodyW, bodyTop + 1, 1, bodyH - 2, fur.outline);
          rect(bodyLeft + 1, bodyTop + bodyH, bodyW - 2, 1, fur.outline);
          if (isDangling) {
            rect(baseBodyX - 4, baseBodyY + 4 + footOffsetL, 2, 5, fur.base);
            rect(baseBodyX + 2, baseBodyY + 4 + footOffsetR, 2, 5, fur.base);
            rect(baseBodyX - 5, baseBodyY + 8 + footOffsetL, 4, 2, fur.shadow);
            rect(baseBodyX + 1, baseBodyY + 8 + footOffsetR, 4, 2, fur.shadow);
            p(baseBodyX - 4, baseBodyY + 10 + footOffsetL, fur.outline);
            p(baseBodyX + 2, baseBodyY + 10 + footOffsetR, fur.outline);
          } else if (!isCurled) {
            const footY = 27 + bodyOffsetY;
            rect(baseBodyX - 6 + footOffsetL, footY, 4, 2, fur.shadow);
            p(baseBodyX - 7 + footOffsetL, footY + 1, fur.outline);
            rect(baseBodyX - 6 + footOffsetL, footY + 2, 4, 1, fur.outline);
            rect(baseBodyX + 2 + footOffsetR, footY, 5, 2, fur.base);
            rect(baseBodyX + 3 + footOffsetR, footY + 1, 4, 1, fur.shadow);
            rect(baseBodyX + 2 + footOffsetR, footY + 2, 5, 1, fur.outline);
            p(baseBodyX + 7 + footOffsetR, footY + 1, fur.outline);
          }
          const headW = 14;
          const headH = 11;
          const headLeft = baseHeadX - 7;
          const headTop = baseHeadY - 5;
          rect(headLeft, headTop, headW, headH, fur.base);
          rect(headLeft + 2, headTop, headW - 4, 1, fur.highlight);
          rect(headLeft + 1, headTop + headH - 1, headW - 2, 1, fur.shadow);
          if (isSpotted) {
            rect(headLeft + 1, headTop + 2, 5, 5, fur.patch);
          }
          rect(headLeft - 1, headTop + 2, 1, headH - 4, fur.outline);
          rect(headLeft + headW, headTop + 2, 1, headH - 4, fur.outline);
          rect(headLeft + 2, headTop - 1, headW - 4, 1, fur.outline);
          p(headLeft, headTop + 1, fur.outline);
          p(headLeft + headW - 1, headTop + 1, fur.outline);
          const eyeY = baseHeadY - 1;
          const leftEyeX = baseHeadX - 3;
          const rightEyeX = baseHeadX + 3;
          if (eyeType === "normal") {
            rect(leftEyeX, eyeY, 2, 2, eyeColor);
            p(leftEyeX, eyeY, "#ffffff");
            rect(rightEyeX, eyeY, 2, 2, eyeColor);
            p(rightEyeX, eyeY, "#ffffff");
          } else if (eyeType === "blink") {
            rect(leftEyeX, eyeY + 1, 2, 1, fur.outline);
            rect(rightEyeX, eyeY + 1, 2, 1, fur.outline);
          } else if (eyeType === "happy") {
            p(leftEyeX, eyeY + 1, fur.outline);
            p(leftEyeX + 1, eyeY, fur.outline);
            p(leftEyeX + 2, eyeY + 1, fur.outline);
            p(rightEyeX, eyeY + 1, fur.outline);
            p(rightEyeX + 1, eyeY, fur.outline);
            p(rightEyeX + 2, eyeY + 1, fur.outline);
          } else if (eyeType === "sleep") {
            rect(leftEyeX - 1, eyeY + 1, 3, 1, fur.outline);
            rect(rightEyeX, eyeY + 1, 3, 1, fur.outline);
          } else if (eyeType === "sad") {
            rect(leftEyeX, eyeY, 2, 2, eyeColor);
            rect(rightEyeX, eyeY, 2, 2, eyeColor);
            p(rightEyeX + 2, eyeY + 2, PALETTES.effects.tear);
            p(rightEyeX + 2, eyeY + 3, PALETTES.effects.tear);
          } else if (eyeType === "wide") {
            rect(leftEyeX - 1, eyeY - 1, 3, 3, eyeColor);
            p(leftEyeX, eyeY, "#ffffff");
            rect(rightEyeX, eyeY - 1, 3, 3, eyeColor);
            p(rightEyeX + 1, eyeY, "#ffffff");
          }
          const noseX = baseHeadX;
          const noseY = baseHeadY + 2;
          p(noseX, noseY, fur.nose);
          if (mouthType === "chew_open") {
            rect(noseX - 1, noseY + 2, 3, 2, "#85203b");
            p(noseX, noseY + 2, "#ff8fa3");
          } else if (mouthType === "chew_closed") {
            rect(noseX - 1, noseY + 2, 3, 1, fur.outline);
          } else if (mouthType === "smile") {
            p(noseX - 1, noseY + 2, fur.outline);
            p(noseX, noseY + 2, fur.outline);
            p(noseX + 1, noseY + 1, fur.outline);
          } else if (mouthType === "open") {
            rect(noseX - 1, noseY + 2, 2, 2, "#85203b");
          }
          if (hasBlush) {
            p(leftEyeX - 2, eyeY + 2, PALETTES.blush);
            p(leftEyeX - 1, eyeY + 2, PALETTES.blush);
            p(rightEyeX + 2, eyeY + 2, PALETTES.blush);
            p(rightEyeX + 3, eyeY + 2, PALETTES.blush);
          }
          if (state === "groom") {
            const pawY = baseHeadY + 1;
            if (groomStep === 0 || groomStep === 2) {
              rect(baseHeadX + 1, pawY - 1, 3, 2, fur.base);
              p(baseHeadX + 2, pawY, fur.outline);
            } else {
              rect(baseHeadX + 2, pawY - 3, 2, 3, fur.base);
              p(baseHeadX + 3, pawY - 1, fur.outline);
            }
          }
          const anchors = {
            head: { x: baseHeadX, y: headTop },
            face: { x: baseHeadX, y: eyeY },
            neck: { x: baseHeadX, y: headTop + headH },
            back: { x: baseBodyX - 4, y: baseBodyY - 1 },
            held: { x: baseHeadX + 7, y: baseBodyY }
          };
          if (equipped && typeof AccessoryRenderer2 !== "undefined") {
            AccessoryRenderer2.renderAccessories(ctx, equipped, anchors, 1, frameIndex);
          }
          if (direction === -1) {
            const flippedCanvas = document.createElement("canvas");
            flippedCanvas.width = 32;
            flippedCanvas.height = 32;
            const fCtx = flippedCanvas.getContext("2d");
            fCtx.imageSmoothingEnabled = false;
            fCtx.translate(32, 0);
            fCtx.scale(-1, 1);
            fCtx.drawImage(canvas, 0, 0);
            anchors.head.x = 32 - anchors.head.x;
            anchors.face.x = 32 - anchors.face.x;
            anchors.neck.x = 32 - anchors.neck.x;
            anchors.back.x = 32 - anchors.back.x;
            anchors.held.x = 32 - anchors.held.x;
            return { canvas: flippedCanvas, anchors };
          }
          return { canvas, anchors };
        }
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = { BunnySpriteGenerator: BunnySpriteGenerator2 };
      }
    }
  });

  // src/renderer/engine/soundEngine.js
  var require_soundEngine = __commonJS({
    "src/renderer/engine/soundEngine.js"(exports, module) {
      var SoundEngine = class {
        constructor() {
          this.audioCtx = null;
          this.masterGain = null;
          this.volume = 0.6;
          this.isMuted = false;
        }
        init() {
          if (this.audioCtx) return;
          try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioContextClass();
            this.masterGain = this.audioCtx.createGain();
            this.masterGain.gain.value = this.isMuted ? 0 : this.volume;
            this.masterGain.connect(this.audioCtx.destination);
          } catch (err) {
            console.warn("[SoundEngine] AudioContext initialization deferred or unavailable:", err);
          }
        }
        ensureContext() {
          if (!this.audioCtx) {
            this.init();
          }
          if (this.audioCtx && this.audioCtx.state === "suspended") {
            this.audioCtx.resume();
          }
        }
        setVolume(vol) {
          this.volume = Math.max(0, Math.min(1, vol));
          if (this.masterGain && !this.isMuted) {
            this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
          }
        }
        setMuted(muted) {
          this.isMuted = Boolean(muted);
          if (this.masterGain && this.audioCtx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.audioCtx.currentTime);
          }
        }
        // --- Sound Effects ---
        /** Satisfying crisp carrot/veggie chew crunch */
        playCrunch() {
          this.ensureContext();
          if (!this.audioCtx || this.isMuted) return;
          const t = this.audioCtx.currentTime;
          const bufferSize = this.audioCtx.sampleRate * 0.12;
          const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
          }
          const whiteNoise = this.audioCtx.createBufferSource();
          whiteNoise.buffer = noiseBuffer;
          const filter = this.audioCtx.createBiquadFilter();
          filter.type = "bandpass";
          filter.frequency.setValueAtTime(1400, t);
          filter.Q.setValueAtTime(3, t);
          const noiseGain = this.audioCtx.createGain();
          noiseGain.gain.setValueAtTime(0.35, t);
          noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.11);
          whiteNoise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(this.masterGain);
          whiteNoise.start(t);
          const osc = this.audioCtx.createOscillator();
          const oscGain = this.audioCtx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(260, t);
          osc.frequency.exponentialRampToValueAtTime(110, t + 0.1);
          oscGain.gain.setValueAtTime(0.3, t);
          oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
          osc.connect(oscGain);
          oscGain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + 0.12);
        }
        /** Cute springy hop boing */
        playHop() {
          this.ensureContext();
          if (!this.audioCtx || this.isMuted) return;
          const t = this.audioCtx.currentTime;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(220, t);
          osc.frequency.exponentialRampToValueAtTime(560, t + 0.16);
          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + 0.2);
        }
        /** Soft harmonic pet sparkle */
        playPet() {
          this.ensureContext();
          if (!this.audioCtx || this.isMuted) return;
          const t = this.audioCtx.currentTime;
          const freqs = [1046.5, 1318.5];
          freqs.forEach((freq, idx) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const startTime = t + idx * 0.05;
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.18, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.22);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(startTime);
            osc.stop(startTime + 0.25);
          });
        }
        /** Happy celebratory fanfare arpeggio */
        playLevelUp() {
          this.ensureContext();
          if (!this.audioCtx || this.isMuted) return;
          const t = this.audioCtx.currentTime;
          const notes = [523.25, 659.25, 783.99, 1046.5];
          notes.forEach((freq, idx) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const noteTime = t + idx * 0.1;
            osc.type = "triangle";
            osc.frequency.setValueAtTime(freq, noteTime);
            gain.gain.setValueAtTime(0.25, noteTime);
            gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.3);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(noteTime);
            osc.stop(noteTime + 0.35);
          });
        }
        /** High twin chime coin collect */
        playCoin() {
          this.ensureContext();
          if (!this.audioCtx || this.isMuted) return;
          const t = this.audioCtx.currentTime;
          const notes = [987.77, 1318.51];
          notes.forEach((freq, idx) => {
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            const noteTime = t + idx * 0.08;
            osc.type = "sine";
            osc.frequency.setValueAtTime(freq, noteTime);
            gain.gain.setValueAtTime(0.2, noteTime);
            gain.gain.exponentialRampToValueAtTime(0.01, noteTime + 0.25);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(noteTime);
            osc.stop(noteTime + 0.28);
          });
        }
        /** Tiny cute sneeze */
        playSneeze() {
          this.ensureContext();
          if (!this.audioCtx || this.isMuted) return;
          const t = this.audioCtx.currentTime;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(800, t);
          osc.frequency.exponentialRampToValueAtTime(300, t + 0.08);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + 0.12);
        }
      };
      var soundEngine2 = new SoundEngine();
      if (typeof module !== "undefined" && module.exports) {
        module.exports = { soundEngine: soundEngine2, SoundEngine };
      }
    }
  });

  // src/renderer/sprites/itemSprites.js
  var require_itemSprites = __commonJS({
    "src/renderer/sprites/itemSprites.js"(exports, module) {
      var ItemSprites2 = class {
        /**
         * Draw a food item centered at (x, y)
         * @param {CanvasRenderingContext2D} ctx
         * @param {string} foodId - 'carrot', 'lettuce', 'apple', 'clover', 'strawberry'
         * @param {number} x - center x
         * @param {number} y - center y
         * @param {number} size - 16 or 24 px
         */
        static drawFood(ctx, foodId, x, y, size = 16) {
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          const ox = Math.floor(x - size / 2);
          const oy = Math.floor(y - size / 2);
          const p = (dx, dy, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(ox + dx, oy + dy, 1, 1);
          };
          const rect = (dx, dy, w, h, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(ox + dx, oy + dy, w, h);
          };
          switch (foodId) {
            case "carrot":
              p(7, 2, "#48bb78");
              p(8, 1, "#38a169");
              p(9, 2, "#48bb78");
              p(6, 3, "#2f855a");
              p(8, 3, "#38a169");
              p(10, 3, "#2f855a");
              rect(7, 4, 3, 2, "#ed8936");
              rect(6, 6, 4, 2, "#dd6b20");
              rect(6, 8, 3, 2, "#c05621");
              rect(7, 10, 2, 2, "#dd6b20");
              rect(7, 12, 1, 2, "#c05621");
              p(7, 5, "#f6ad55");
              p(7, 7, "#f6ad55");
              p(8, 9, "#7b341e");
              break;
            case "lettuce":
              rect(5, 5, 6, 6, "#48bb78");
              rect(4, 6, 8, 4, "#68d391");
              rect(6, 4, 4, 8, "#9ae6b4");
              p(7, 7, "#ffffff");
              p(7, 8, "#ffffff");
              p(7, 9, "#ffffff");
              p(4, 5, "#2f855a");
              p(11, 5, "#2f855a");
              p(4, 10, "#2f855a");
              p(11, 10, "#2f855a");
              break;
            case "apple":
              rect(5, 5, 6, 6, "#e53e3e");
              rect(6, 4, 4, 1, "#c53030");
              p(7, 2, "#744210");
              p(8, 2, "#48bb78");
              rect(6, 6, 4, 4, "#fff5f5");
              p(7, 8, "#744210");
              break;
            case "clover":
              rect(4, 4, 3, 3, "#38a169");
              rect(9, 4, 3, 3, "#38a169");
              rect(4, 9, 3, 3, "#38a169");
              rect(9, 9, 3, 3, "#38a169");
              p(5, 5, "#9ae6b4");
              p(10, 5, "#9ae6b4");
              p(5, 10, "#9ae6b4");
              p(10, 10, "#9ae6b4");
              p(8, 8, "#276749");
              p(7, 11, "#276749");
              p(6, 13, "#276749");
              break;
            case "strawberry":
              p(6, 3, "#48bb78");
              p(8, 2, "#38a169");
              p(10, 3, "#48bb78");
              rect(5, 4, 6, 2, "#2f855a");
              rect(5, 6, 6, 4, "#e53e3e");
              rect(6, 10, 4, 3, "#c53030");
              rect(7, 13, 2, 1, "#9b2c2c");
              p(6, 7, "#fef08a");
              p(9, 7, "#fef08a");
              p(7, 9, "#fef08a");
              p(8, 11, "#fef08a");
              break;
            default:
              rect(6, 6, 4, 4, "#ffd166");
          }
          ctx.restore();
        }
        /**
         * Draw carrot garden growth plot (24x20)
         * @param {CanvasRenderingContext2D} ctx
         * @param {number} x - center x
         * @param {number} y - bottom y (sits on taskbar)
         * @param {number} stage - 0: seed, 1: sprout, 2: growing, 3: harvest-ready
         * @param {number} frame - animation frame
         */
        static drawGardenPlot(ctx, x, y, stage = 0, frame = 0) {
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          const ox = Math.floor(x - 12);
          const oy = Math.floor(y - 14);
          const rect = (dx, dy, w, h, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(ox + dx, oy + dy, w, h);
          };
          const p = (dx, dy, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(ox + dx, oy + dy, 1, 1);
          };
          rect(2, 10, 20, 4, "#5c3d2e");
          rect(1, 12, 22, 2, "#42281d");
          rect(4, 9, 16, 1, "#785340");
          p(5, 11, "#8f6750");
          p(14, 11, "#8f6750");
          p(18, 12, "#331f17");
          if (stage === 0) {
            rect(11, 8, 2, 2, "#38a169");
            p(11, 7, "#48bb78");
          } else if (stage === 1) {
            p(11, 7, "#38a169");
            rect(10, 6, 3, 1, "#48bb78");
            p(9, 5, "#68d391");
            p(13, 5, "#68d391");
          } else if (stage === 2) {
            rect(11, 4, 2, 5, "#2f855a");
            rect(9, 3, 2, 3, "#38a169");
            rect(13, 3, 2, 3, "#38a169");
            p(8, 2, "#68d391");
            p(15, 2, "#68d391");
          } else if (stage >= 3) {
            rect(10, 6, 4, 3, "#ed8936");
            rect(11, 9, 2, 1, "#dd6b20");
            rect(11, 2, 2, 4, "#2f855a");
            rect(9, 1, 2, 3, "#38a169");
            rect(13, 1, 2, 3, "#38a169");
            p(8, 0, "#68d391");
            p(15, 0, "#68d391");
            const sp = frame % 4 < 2 ? 0 : 1;
            p(6, 4 + sp, "#ffd700");
            p(17, 3 - sp, "#ffd700");
          }
          ctx.restore();
        }
        /**
         * Draw cute thought bubble above bunny
         * @param {CanvasRenderingContext2D} ctx
         * @param {number} x - center x
         * @param {number} y - bottom tip y
         * @param {string} type - 'carrot', 'sleep', 'heart'
         */
        static drawThoughtBubble(ctx, x, y, type = "carrot") {
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          const ox = Math.floor(x - 12);
          const oy = Math.floor(y - 20);
          const rect = (dx, dy, w, h, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(ox + dx, oy + dy, w, h);
          };
          const p = (dx, dy, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(ox + dx, oy + dy, 1, 1);
          };
          rect(3, 1, 18, 12, "#ffffff");
          rect(1, 3, 22, 8, "#ffffff");
          rect(3, 0, 18, 1, "#4a5568");
          rect(3, 13, 18, 1, "#4a5568");
          rect(0, 3, 1, 8, "#4a5568");
          rect(23, 3, 1, 8, "#4a5568");
          p(1, 1, "#4a5568");
          p(2, 2, "#4a5568");
          p(22, 1, "#4a5568");
          p(21, 2, "#4a5568");
          p(1, 12, "#4a5568");
          p(2, 11, "#4a5568");
          p(22, 12, "#4a5568");
          p(21, 11, "#4a5568");
          p(12, 15, "#4a5568");
          p(11, 17, "#4a5568");
          if (type === "carrot") {
            p(11, 3, "#38a169");
            p(13, 3, "#38a169");
            rect(11, 4, 3, 2, "#ed8936");
            rect(12, 6, 2, 2, "#dd6b20");
            p(12, 8, "#c05621");
          } else if (type === "sleep") {
            ctx.fillStyle = "#4299e1";
            ctx.font = "bold 9px monospace";
            ctx.fillText("zZ", ox + 7, oy + 10);
          } else if (type === "heart") {
            rect(10, 5, 2, 2, "#e53e3e");
            rect(13, 5, 2, 2, "#e53e3e");
            rect(9, 7, 7, 2, "#e53e3e");
            rect(10, 9, 5, 1, "#e53e3e");
            p(12, 10, "#e53e3e");
          }
          ctx.restore();
        }
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = { ItemSprites: ItemSprites2 };
      }
    }
  });

  // src/renderer/ui/wardrobe.js
  var { ACCESSORIES, FUR_COLORS, EAR_STYLES, EYE_COLORS, ACHIEVEMENTS, FOODS } = require_constants();
  var { BunnySpriteGenerator } = require_bunnySprites();
  var { AccessoryRenderer } = require_accessories();
  var { soundEngine } = require_soundEngine();
  var { ItemSprites } = require_itemSprites();
  var WardrobeController = class {
    constructor() {
      this.previewCanvas = document.getElementById("previewCanvas");
      this.previewCtx = this.previewCanvas.getContext("2d");
      this.tabContent = document.getElementById("tabContent");
      this.tabsBar = document.getElementById("tabsBar");
      this.coinCountEl = document.getElementById("coinCount");
      this.bunnyNameInput = document.getElementById("bunnyNameInput");
      this.saveNameBtn = document.getElementById("saveNameBtn");
      this.bunnySelectEl = document.getElementById("bunnySelect");
      this.closeBtn = document.getElementById("closeBtn");
      this.state = null;
      this.selectedBunnyIndex = 0;
      this.bunnySelectBound = false;
      this.activeTab = "food";
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
      const val = (nameVal !== null ? nameVal : this.bunnyNameInput ? this.bunnyNameInput.value : "").trim();
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
      if (typeof this.state.settings.volume === "number") {
        soundEngine.setVolume(this.state.settings.volume);
      }
    }
    async init() {
      this.closeBtn.addEventListener("click", () => {
        window.api.closeWindow("wardrobe");
      });
      if (this.saveNameBtn) {
        this.saveNameBtn.addEventListener("click", () => {
          this.handleSaveName();
        });
      }
      if (this.bunnyNameInput) {
        this.bunnyNameInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            this.handleSaveName();
            this.bunnyNameInput.blur();
          }
        });
        this.bunnyNameInput.addEventListener("blur", () => {
          this.handleSaveName();
        });
      }
      this.tabsBar.addEventListener("click", (e) => {
        if (e.target.classList.contains("tab-btn")) {
          document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
          e.target.classList.add("active");
          this.activeTab = e.target.dataset.tab;
          this.renderTabContent();
        }
      });
      const { state } = await window.api.loadState();
      this.state = state;
      this.syncAudioSettings();
      this.updateHeaderInfo();
      this.renderTabContent();
      this.startPreviewLoop();
      window.api.onStateUpdate((newState) => {
        const prevExtraCount = this.state && this.state.extraBunnies ? this.state.extraBunnies.length : 0;
        const newExtraCount = newState && newState.extraBunnies ? newState.extraBunnies.length : 0;
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
      const currentName = currentBunny ? currentBunny.name || "Barnaby" : "Barnaby";
      if (this.bunnyNameInput && document.activeElement !== this.bunnyNameInput) {
        this.bunnyNameInput.value = currentName;
      }
      this.coinCountEl.textContent = this.state.inventory.coins || 0;
      if (this.bunnySelectEl) {
        if (this.state.extraBunnies && this.state.extraBunnies.length > 0) {
          this.bunnySelectEl.style.display = "inline-block";
          this.bunnySelectEl.innerHTML = "";
          const primaryOpt = document.createElement("option");
          primaryOpt.value = "0";
          primaryOpt.textContent = `1. ${this.state.bunny.name || "Barnaby"}`;
          this.bunnySelectEl.appendChild(primaryOpt);
          this.state.extraBunnies.forEach((eb, idx) => {
            const opt = document.createElement("option");
            opt.value = `${idx + 1}`;
            opt.textContent = `${idx + 2}. ${eb.name || "Companion"}`;
            this.bunnySelectEl.appendChild(opt);
          });
          this.bunnySelectEl.value = String(this.selectedBunnyIndex);
          if (!this.bunnySelectBound) {
            this.bunnySelectBound = true;
            this.bunnySelectEl.addEventListener("change", (e) => {
              this.selectedBunnyIndex = parseInt(e.target.value, 10);
              this.updateHeaderInfo();
              this.renderTabContent();
            });
          }
        } else {
          this.bunnySelectEl.style.display = "none";
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
      const appearance = {
        furColor: currentBunny.furColor,
        earStyle: currentBunny.earStyle,
        eyeColor: currentBunny.eyeColor,
        blush: currentBunny.blush
      };
      const { canvas: frameCanvas } = BunnySpriteGenerator.renderFrame({
        state: "idle",
        frameIndex: this.previewFrame,
        direction: 1,
        appearance,
        equipped: currentBunny.equipped || {}
      });
      this.previewCtx.drawImage(frameCanvas, 0, 0, 96, 96);
    }
    renderTabContent() {
      if (!this.state) return;
      this.tabContent.innerHTML = "";
      if (this.activeTab === "food") {
        this.renderFoodShop();
      } else if (this.activeTab === "den") {
        this.renderDenShop();
      } else if (this.activeTab === "base") {
        this.renderBaseCustomization();
      } else if (this.activeTab === "presets") {
        this.renderPresets();
      } else {
        this.renderAccessoriesCategory(this.activeTab);
      }
    }
    renderBaseCustomization() {
      const b = this.getCurrentBunny();
      if (!b) return;
      const container = document.createElement("div");
      container.className = "base-controls";
      const nameRow = document.createElement("div");
      nameRow.className = "base-row";
      nameRow.innerHTML = `
      <label>Bunny Name:</label>
      <div style="display: flex; gap: 6px; align-items: center;">
        <input type="text" id="tabNameInput" class="bunny-name-input" maxlength="16" value="${b.name || "Barnaby"}" style="font-size: 13px; width: 130px; padding: 4px 8px;">
        <button class="item-btn btn-equip" id="tabSaveNameBtn" style="width: auto; padding: 4px 10px; cursor: pointer;">Save</button>
      </div>
    `;
      const tabInput = nameRow.querySelector("#tabNameInput");
      const tabSaveBtn = nameRow.querySelector("#tabSaveNameBtn");
      tabSaveBtn.addEventListener("click", () => {
        this.handleSaveName(tabInput.value);
      });
      tabInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          this.handleSaveName(tabInput.value);
          tabInput.blur();
        }
      });
      tabInput.addEventListener("blur", () => {
        this.handleSaveName(tabInput.value);
      });
      container.appendChild(nameRow);
      const furRow = document.createElement("div");
      furRow.className = "base-row";
      furRow.innerHTML = `
      <label>Fur Coat:</label>
      <select id="furSelect">
        ${Object.values(FUR_COLORS).map((f) => `<option value="${f.id}" ${b.furColor === f.id ? "selected" : ""}>${f.name}</option>`).join("")}
      </select>
    `;
      furRow.querySelector("select").addEventListener("change", (e) => {
        b.furColor = e.target.value;
        this.saveState();
      });
      container.appendChild(furRow);
      const earRow = document.createElement("div");
      earRow.className = "base-row";
      earRow.innerHTML = `
      <label>Ear Style:</label>
      <select id="earSelect">
        ${Object.values(EAR_STYLES).map((e) => `<option value="${e.id}" ${b.earStyle === e.id ? "selected" : ""}>${e.name}</option>`).join("")}
      </select>
    `;
      earRow.querySelector("select").addEventListener("change", (e) => {
        b.earStyle = e.target.value;
        this.saveState();
      });
      container.appendChild(earRow);
      const eyeRow = document.createElement("div");
      eyeRow.className = "base-row";
      eyeRow.innerHTML = `
      <label>Eye Color:</label>
      <select id="eyeSelect">
        ${Object.values(EYE_COLORS).map((ey) => `<option value="${ey.id}" ${b.eyeColor === ey.id ? "selected" : ""}>${ey.name}</option>`).join("")}
      </select>
    `;
      eyeRow.querySelector("select").addEventListener("change", (e) => {
        b.eyeColor = e.target.value;
        this.saveState();
      });
      container.appendChild(eyeRow);
      const blushRow = document.createElement("div");
      blushRow.className = "base-row";
      blushRow.innerHTML = `
      <label>Cheek Blush:</label>
      <input type="checkbox" id="blushCheck" ${b.blush !== false ? "checked" : ""} style="transform: scale(1.3); cursor: pointer;">
    `;
      blushRow.querySelector("input").addEventListener("change", (e) => {
        b.blush = e.target.checked;
        this.saveState();
      });
      container.appendChild(blushRow);
      this.tabContent.appendChild(container);
    }
    renderItemIcon(canvas, category, itemId) {
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      const currentBunny = this.getCurrentBunny();
      const appearance = {
        furColor: currentBunny?.furColor || "white",
        earStyle: currentBunny?.earStyle || "upright",
        eyeColor: currentBunny?.eyeColor || "ruby",
        blush: currentBunny?.blush !== false
      };
      const { canvas: frameCanvas } = BunnySpriteGenerator.renderFrame({
        state: "idle",
        frameIndex: 0,
        direction: 1,
        appearance,
        equipped: itemId !== "none" ? { [category]: itemId } : {}
      });
      ctx.drawImage(frameCanvas, 0, 0, canvas.width, canvas.height);
      if (itemId === "none") {
        ctx.strokeStyle = "#ef4444";
        ctx.fillStyle = "rgba(239, 68, 68, 0.2)";
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
    renderFoodShop() {
      const foods = Object.values(FOODS);
      for (const f of foods) {
        const owned = this.state.inventory.foods && this.state.inventory.foods[f.id] || 0;
        const canAfford = (this.state.inventory.coins || 0) >= f.cost;
        const card = document.createElement("div");
        card.className = "food-card";
        card.innerHTML = `
        <div class="food-header">
          <div class="food-title">${f.name}</div>
          <div class="food-owned-badge">Owned: ${owned}</div>
        </div>
        <div class="item-visual-wrap">
          <canvas class="item-preview-canvas" width="64" height="64"></canvas>
        </div>
        <div class="food-bonuses">
          <span>\u{1F955} +${f.hungerBonus}% Hunger</span>
          <span>\u{1F496} +${f.happinessBonus}% Happy</span>
        </div>
        <div class="food-acquire" title="${f.acquire || f.description}">
          ${f.acquire || f.description}
        </div>
        <div>
          <button class="item-btn btn-buy ${canAfford ? "" : "insufficient-funds"}" ${canAfford ? "" : 'title="Not enough coins"'}>
            Buy <span class="coin-icon"></span> ${f.cost}
          </button>
        </div>
      `;
        const canvas = card.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ItemSprites.drawFood(ctx, f.id, 32, 32, 28);
        const btn = card.querySelector(".btn-buy");
        btn.addEventListener("click", () => {
          if ((this.state.inventory.coins || 0) < f.cost) return;
          this.state.inventory.coins -= f.cost;
          if (!this.state.inventory.foods) this.state.inventory.foods = {};
          this.state.inventory.foods[f.id] = (this.state.inventory.foods[f.id] || 0) + 1;
          soundEngine.playCoin();
          this.saveState();
          this.updateHeaderInfo();
          this.renderTabContent();
        });
        this.tabContent.appendChild(card);
      }
    }
    renderDenShop() {
      const denItems = ACCESSORIES.den || [];
      const currentSkin = this.state.settings?.denSkin || "default";
      const unlockedList = this.state.inventory.unlockedCosmetics || [];
      for (const item of denItems) {
        const isEquipped = currentSkin === item.id;
        const isUnlocked = item.price === 0 || unlockedList.includes(`den:${item.id}`) || item.rewardFrom && this.state.achievements?.unlocked?.includes(item.rewardFrom);
        const canAfford = (this.state.inventory.coins || 0) >= item.price;
        const card = document.createElement("div");
        card.className = `food-card ${isEquipped ? "equipped" : ""}`;
        card.innerHTML = `
        <div class="food-header">
          <div class="food-title">${item.name}</div>
          <span class="item-tier tier-${item.tier}">${item.tier}</span>
        </div>
        <div class="item-visual-wrap" style="height: 72px;">
          <canvas class="item-preview-canvas" width="64" height="64"></canvas>
        </div>
        <div class="food-acquire" style="min-height: 28px;">
          ${item.description || ""}
        </div>
        <div style="font-size: 11px; margin: 2px 0; text-align: center; min-height: 16px;">
          ${isUnlocked ? `<span style="color: #059669; font-weight: 600;">${isEquipped ? "Active Den \u{1F3E1}" : "Unlocked"}</span>` : item.rewardFrom ? '<span style="color: #9333ea; font-size: 10px; font-weight: bold;">Unlock via Level 5 Trophy!</span>' : ""}
        </div>
        <div>
          ${isEquipped ? `<button class="item-btn btn-unequip" disabled style="opacity: 0.8; cursor: default;">In Use</button>` : isUnlocked ? `<button class="item-btn btn-equip">Use Den</button>` : `<button class="item-btn btn-buy ${canAfford ? "" : "insufficient-funds"}" ${canAfford ? "" : 'title="Not enough coins"'}>Buy <span class="coin-icon"></span> ${item.price}</button>`}
        </div>
      `;
        const canvas = card.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        if (item.id === "festive") {
          ctx.fillStyle = "#92400e";
          ctx.fillRect(16, 26, 32, 28);
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.moveTo(12, 26);
          ctx.lineTo(32, 10);
          ctx.lineTo(52, 26);
          ctx.fill();
          ctx.fillStyle = "#1e1b4b";
          ctx.fillRect(26, 36, 12, 18);
          const cArr = ["#ef4444", "#10b981", "#f59e0b", "#3b82f6"];
          for (let li = 0; li < 4; li++) {
            ctx.fillStyle = cArr[li];
            ctx.fillRect(18 + li * 8, 24, 3, 3);
          }
        } else {
          ctx.fillStyle = "#78350f";
          ctx.fillRect(16, 26, 32, 28);
          ctx.fillStyle = "#15803d";
          ctx.beginPath();
          ctx.moveTo(12, 26);
          ctx.lineTo(32, 10);
          ctx.lineTo(52, 26);
          ctx.fill();
          ctx.fillStyle = "#1e1b4b";
          ctx.fillRect(26, 36, 12, 18);
        }
        const btn = card.querySelector(".item-btn");
        if (btn && !btn.disabled) {
          btn.addEventListener("click", () => {
            if (isUnlocked) {
              if (!this.state.settings) this.state.settings = {};
              this.state.settings.denSkin = item.id;
              soundEngine.playHop();
            } else {
              if (!canAfford) return;
              this.state.inventory.coins -= item.price;
              this.state.inventory.unlockedCosmetics.push(`den:${item.id}`);
              if (!this.state.settings) this.state.settings = {};
              this.state.settings.denSkin = item.id;
              soundEngine.playCoin();
              this.updateHeaderInfo();
            }
            this.saveState();
            this.renderTabContent();
          });
        }
        this.tabContent.appendChild(card);
      }
    }
    renderAccessoriesCategory(category) {
      const currentBunny = this.getCurrentBunny();
      if (!currentBunny) return;
      if (!currentBunny.equipped) currentBunny.equipped = {};
      const items = ACCESSORIES[category] || [];
      const equippedId = currentBunny.equipped[category] || "none";
      const unlockedList = this.state.inventory.unlockedCosmetics || [];
      for (const item of items) {
        const isEquipped = equippedId === item.id;
        const isUnlocked = item.price === 0 || unlockedList.includes(`${category}:${item.id}`);
        const canAfford = (this.state.inventory.coins || 0) >= item.price;
        const card = document.createElement("div");
        card.className = `item-card ${isEquipped ? "equipped" : ""} ${item.tier}`;
        card.innerHTML = `
        <div class="item-header">
          <div class="item-title"></div>
          <span class="item-tier tier-${item.tier}">${item.tier}</span>
        </div>
        <div class="item-visual-wrap">
          <canvas class="item-preview-canvas" width="64" height="64"></canvas>
        </div>
        <div style="font-size: 11px; margin: 2px 0; text-align: center; min-height: 16px;">
          ${isUnlocked ? `<span style="color: #059669; font-weight: 600;">${isEquipped ? "Wearing \u2728" : "Owned"}</span>` : ""}
        </div>
        <div>
          ${isEquipped ? `<button class="item-btn btn-unequip">Unequip</button>` : isUnlocked ? `<button class="item-btn btn-equip">Equip</button>` : `<button class="item-btn btn-buy ${canAfford ? "" : "insufficient-funds"}" ${canAfford ? "" : 'title="Not enough coins"'}>Buy <span class="coin-icon"></span> ${item.price}</button>`}
        </div>
      `;
        card.querySelector(".item-title").textContent = item.name;
        const previewCanvas = card.querySelector(".item-preview-canvas");
        this.renderItemIcon(previewCanvas, category, item.id);
        const btn = card.querySelector(".item-btn");
        btn.addEventListener("click", () => {
          if (isEquipped) {
            currentBunny.equipped[category] = "none";
            soundEngine.playHop();
          } else if (isUnlocked) {
            currentBunny.equipped[category] = item.id;
            soundEngine.playHop();
          } else {
            if (!canAfford) return;
            this.state.inventory.coins -= item.price;
            this.state.inventory.unlockedCosmetics.push(`${category}:${item.id}`);
            currentBunny.equipped[category] = item.id;
            soundEngine.playCoin();
            this.updateHeaderInfo();
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
        const card = document.createElement("div");
        card.className = `achievement-card ${isUnlocked ? "unlocked" : ""}`;
        card.innerHTML = `
        <div class="ach-header">
          <div class="ach-icon">${isUnlocked ? "\u{1F3C6}" : "\u{1F512}"}</div>
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
          <div class="ach-progress-text">${isUnlocked ? "Completed! \u2728" : `${current} / ${max} (${pct}%)`}</div>
        </div>
      `;
        card.querySelector(".ach-title").textContent = ach.name;
        card.querySelector(".ach-desc").textContent = ach.description;
        this.tabContent.appendChild(card);
      }
    }
    getAchievementProgress(ach) {
      const isUnlocked = Boolean(this.state.achievements?.unlocked?.includes(ach.id));
      let current = 0;
      let max = 1;
      switch (ach.id) {
        case "first_carrot":
          max = 1;
          current = Math.min(max, this.state.bunny.totalCarrotsFed || 0);
          break;
        case "fed_25":
          max = 25;
          current = Math.min(max, this.state.bunny.totalCarrotsFed || 0);
          break;
        case "fed_100":
          max = 100;
          current = Math.min(max, this.state.bunny.totalCarrotsFed || 0);
          break;
        case "pet_50":
          max = 50;
          current = Math.min(max, this.state.bunny.totalPetCount || 0);
          break;
        case "pet_200":
          max = 200;
          current = Math.min(max, this.state.bunny.totalPetCount || 0);
          break;
        case "first_harvest":
          max = 1;
          current = isUnlocked ? 1 : 0;
          break;
        case "fashion_pioneer":
          max = 1;
          const hasEquipped = Object.values(this.state.bunny.equipped || {}).some((v) => v && v !== "none");
          current = isUnlocked || hasEquipped ? 1 : 0;
          break;
        case "three_presets":
          max = 3;
          const savedCount = (this.state.bunny.outfitPresets || []).filter(
            (p) => Object.entries(p).some(([k, v]) => k !== "name" && v !== "none")
          ).length;
          current = isUnlocked ? 3 : Math.min(max, savedCount);
          break;
        case "level_5":
          max = 5;
          current = Math.min(max, this.state.bunny.level || 1);
          break;
        case "level_10":
          max = 10;
          current = Math.min(max, this.state.bunny.level || 1);
          break;
        default:
          current = isUnlocked ? 1 : 0;
          max = 1;
      }
      const pct = isUnlocked ? 100 : Math.min(100, Math.round(current / max * 100));
      return { isUnlocked, current, max, pct };
    }
    renderPresets() {
      const presets = this.state.bunny.outfitPresets || [
        { name: "Preset 1", head: "none", face: "none", neck: "none", back: "none", held: "none" },
        { name: "Preset 2", head: "none", face: "none", neck: "none", back: "none", held: "none" },
        { name: "Preset 3", head: "none", face: "none", neck: "none", back: "none", held: "none" }
      ];
      presets.forEach((p, idx) => {
        const card = document.createElement("div");
        card.className = "preset-card";
        const itemsDesc = Object.entries(p).filter(([k, v]) => k !== "name" && v !== "none").map(([k, v]) => v).join(", ") || "Default Look";
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
        card.querySelector(".preset-title").textContent = p.name || `Preset ${idx + 1}`;
        card.querySelector(".preset-desc").textContent = itemsDesc;
        card.querySelector(".btn-save-preset").addEventListener("click", () => {
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
        card.querySelector(".btn-load-preset").addEventListener("click", () => {
          const loaded = this.state.bunny.outfitPresets[idx];
          if (loaded) {
            this.state.bunny.equipped.head = loaded.head || "none";
            this.state.bunny.equipped.face = loaded.face || "none";
            this.state.bunny.equipped.neck = loaded.neck || "none";
            this.state.bunny.equipped.back = loaded.back || "none";
            this.state.bunny.equipped.held = loaded.held || "none";
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
  };
  window.addEventListener("DOMContentLoaded", () => {
    new WardrobeController();
  });
})();
//# sourceMappingURL=wardrobe.js.map
