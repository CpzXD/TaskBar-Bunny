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
          happinessBonus: 10,
          cost: 10,
          color: "#ff8822",
          description: "A bunny classic. Rich in beta-carotene!"
        },
        lettuce: {
          id: "lettuce",
          name: "Crisp Lettuce",
          hungerRestore: 20,
          happinessBonus: 5,
          cost: 5,
          color: "#76c442",
          description: "Refreshing and light green leaves."
        },
        apple: {
          id: "apple",
          name: "Sweet Apple Slice",
          hungerRestore: 40,
          happinessBonus: 20,
          cost: 18,
          color: "#ee4444",
          description: "A juicy, sweet midday treat."
        },
        clover: {
          id: "clover",
          name: "Lucky Four-Leaf Clover",
          hungerRestore: 15,
          happinessBonus: 35,
          cost: 25,
          color: "#28bb67",
          description: "Guaranteed to bring bunny smiles."
        },
        strawberry: {
          id: "strawberry",
          name: "Ripe Strawberry",
          hungerRestore: 45,
          happinessBonus: 30,
          cost: 30,
          color: "#ff3366",
          description: "Fragrant and delightfully sweet."
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
        ]
      };
      var ACHIEVEMENTS2 = [
        { id: "first_carrot", name: "First Crunch", description: "Feed your bunny for the first time.", rewardCoins: 20, rewardXp: 30 },
        { id: "fed_25", name: "Carrot Connoisseur", description: "Feed 25 treats to your bunny.", rewardCoins: 50, rewardXp: 60 },
        { id: "fed_100", name: "Feast Master", description: "Feed 100 treats to your bunny.", rewardCoins: 150, rewardXp: 200 },
        { id: "pet_50", name: "True Affection", description: "Pet your bunny 50 times.", rewardCoins: 40, rewardXp: 50 },
        { id: "pet_200", name: "Fluffy Bestie", description: "Pet your bunny 200 times.", rewardCoins: 100, rewardXp: 150 },
        { id: "first_harvest", name: "Green Thumb", description: "Harvest your first homegrown carrot.", rewardCoins: 30, rewardXp: 40 },
        { id: "fashion_pioneer", name: "Fashion Pioneer", description: "Equip any accessory in the Wardrobe.", rewardCoins: 25, rewardXp: 35 },
        { id: "three_presets", name: "Stylist Guru", description: "Save all 3 outfit presets.", rewardCoins: 60, rewardXp: 75 },
        { id: "level_5", name: "Growing Up", description: "Reach Bunny Level 5.", rewardCoins: 80, rewardXp: 100 },
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
          doNotDisturb: false
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
          FOODS,
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

  // src/renderer/sprites/bunnySprites.js
  var require_bunnySprites = __commonJS({
    "src/renderer/sprites/bunnySprites.js"(exports, module) {
      var { PALETTES } = require_palette();
      var BunnySpriteGenerator2 = class {
        /**
         * Generates a 32x32 canvas for a specific state, frame, direction, and appearance.
         * @param {Object} options
         * @param {string} options.state - 'idle', 'walk', 'sit', 'groom', 'sleep', 'hop', 'eat', 'sad', 'happy', 'dangling'
         * @param {number} options.frameIndex - current animation frame index
         * @param {number} options.direction - 1 for right, -1 for left
         * @param {Object} options.appearance - { furColor, earStyle, eyeColor, blush }
         * @returns {{ canvas: HTMLCanvasElement, anchors: Object }}
         */
        static renderFrame({ state = "idle", frameIndex = 0, direction = 1, appearance = {} }) {
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

  // src/renderer/ui/wardrobe.js
  var { ACCESSORIES, FUR_COLORS, EAR_STYLES, EYE_COLORS, ACHIEVEMENTS } = require_constants();
  var { BunnySpriteGenerator } = require_bunnySprites();
  var { AccessoryRenderer } = require_accessories();
  var { soundEngine } = require_soundEngine();
  var WardrobeController = class {
    constructor() {
      this.previewCanvas = document.getElementById("previewCanvas");
      this.previewCtx = this.previewCanvas.getContext("2d");
      this.tabContent = document.getElementById("tabContent");
      this.tabsBar = document.getElementById("tabsBar");
      this.coinCountEl = document.getElementById("coinCount");
      this.bunnyNameEl = document.getElementById("bunnyName");
      this.closeBtn = document.getElementById("closeBtn");
      this.state = null;
      this.activeTab = "base";
      this.previewFrame = 0;
      this.previewTimer = 0;
      this.init();
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
        this.state = newState;
        this.syncAudioSettings();
        this.updateHeaderInfo();
        this.renderTabContent();
      });
    }
    updateHeaderInfo() {
      if (!this.state) return;
      this.bunnyNameEl.textContent = this.state.bunny.name || "Barnaby";
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
      const appearance = {
        furColor: this.state.bunny.furColor,
        earStyle: this.state.bunny.earStyle,
        eyeColor: this.state.bunny.eyeColor,
        blush: this.state.bunny.blush
      };
      const { canvas: frameCanvas, anchors } = BunnySpriteGenerator.renderFrame({
        state: "idle",
        frameIndex: this.previewFrame,
        direction: 1,
        appearance
      });
      const frameCtx = frameCanvas.getContext("2d");
      frameCtx.imageSmoothingEnabled = false;
      AccessoryRenderer.renderAccessories(
        frameCtx,
        this.state.bunny.equipped,
        anchors,
        1,
        this.previewFrame
      );
      this.previewCtx.drawImage(frameCanvas, 0, 0, 96, 96);
    }
    renderTabContent() {
      if (!this.state) return;
      this.tabContent.innerHTML = "";
      if (this.activeTab === "base") {
        this.renderBaseCustomization();
      } else if (this.activeTab === "presets") {
        this.renderPresets();
      } else if (this.activeTab === "achievements") {
        this.renderAchievements();
      } else {
        this.renderAccessoriesCategory(this.activeTab);
      }
    }
    renderBaseCustomization() {
      const b = this.state.bunny;
      const container = document.createElement("div");
      container.className = "base-controls";
      const furRow = document.createElement("div");
      furRow.className = "base-row";
      furRow.innerHTML = `
      <label>Fur Coat:</label>
      <select id="furSelect">
        ${Object.values(FUR_COLORS).map((f) => `<option value="${f.id}" ${b.furColor === f.id ? "selected" : ""}>${f.name}</option>`).join("")}
      </select>
    `;
      furRow.querySelector("select").addEventListener("change", (e) => {
        this.state.bunny.furColor = e.target.value;
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
        this.state.bunny.earStyle = e.target.value;
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
        this.state.bunny.eyeColor = e.target.value;
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
        this.state.bunny.blush = e.target.checked;
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
      if (itemId === "none") {
        ctx.strokeStyle = "#cbd5e1";
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
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = 32;
      tempCanvas.height = 32;
      const tCtx = tempCanvas.getContext("2d");
      tCtx.imageSmoothingEnabled = false;
      const anchors = {
        head: { x: 16, y: 22 },
        face: { x: 16, y: 15 },
        neck: { x: 16, y: 15 },
        back: { x: 17, y: 14 },
        held: { x: 14, y: 20 }
      };
      if (category === "held" && itemId === "balloon") {
        anchors.held = { x: 15, y: 24 };
      } else if (category === "back" && itemId === "cape") {
        anchors.back = { x: 18, y: 12 };
      }
      AccessoryRenderer.renderAccessories(tCtx, { [category]: itemId }, anchors, 1, 0);
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
    }
    renderAccessoriesCategory(category) {
      const items = ACCESSORIES[category] || [];
      const equippedId = this.state.bunny.equipped[category] || "none";
      const unlockedList = this.state.inventory.unlockedCosmetics || [];
      for (const item of items) {
        const isEquipped = equippedId === item.id;
        const isUnlocked = item.price === 0 || unlockedList.includes(`${category}:${item.id}`);
        const card = document.createElement("div");
        card.className = `item-card ${isEquipped ? "equipped" : ""} ${item.tier}`;
        card.innerHTML = `
        <div class="item-header">
          <div class="item-title"></div>
          <span class="item-tier tier-${item.tier}">${item.tier}</span>
        </div>
        <div class="item-visual-wrap">
          <canvas class="item-preview-canvas" width="48" height="48"></canvas>
        </div>
        <div style="font-size: 11px; color: #64748b; margin: 2px 0; text-align: center;">
          ${isUnlocked ? isEquipped ? "Currently Wearing" : "Owned" : `Price: <span class="coin-icon"></span> ${item.price}`}
        </div>
        <div>
          ${isEquipped ? `<button class="item-btn btn-unequip">Unequip</button>` : isUnlocked ? `<button class="item-btn btn-equip">Equip</button>` : `<button class="item-btn btn-buy">Buy <span class="coin-icon"></span> ${item.price}</button>`}
        </div>
      `;
        card.querySelector(".item-title").textContent = item.name;
        const previewCanvas = card.querySelector(".item-preview-canvas");
        this.renderItemIcon(previewCanvas, category, item.id);
        const btn = card.querySelector(".item-btn");
        btn.addEventListener("click", () => {
          if (isEquipped) {
            this.state.bunny.equipped[category] = "none";
            soundEngine.playHop();
          } else if (isUnlocked) {
            this.state.bunny.equipped[category] = item.id;
            soundEngine.playHop();
          } else {
            if (this.state.inventory.coins >= item.price) {
              this.state.inventory.coins -= item.price;
              this.state.inventory.unlockedCosmetics.push(`${category}:${item.id}`);
              this.state.bunny.equipped[category] = item.id;
              soundEngine.playCoin();
              this.updateHeaderInfo();
            } else {
              alert("Not enough coins! Keep your bunny happy to earn more coins.");
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
