(() => {
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    try {
      return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
    } catch (e) {
      throw mod = 0, e;
    }
  };

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
      var BunnySpriteGenerator = class {
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
        module.exports = { BunnySpriteGenerator };
      }
    }
  });

  // src/renderer/sprites/accessories.js
  var require_accessories = __commonJS({
    "src/renderer/sprites/accessories.js"(exports, module) {
      var AccessoryRenderer = class {
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
        module.exports = { AccessoryRenderer };
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

  // src/renderer/bunny/stateMachine.js
  var require_stateMachine = __commonJS({
    "src/renderer/bunny/stateMachine.js"(exports, module) {
      var BunnyStateMachine = class {
        constructor(bunny) {
          this.bunny = bunny;
          this.currentState = "idle";
          this.stateTimer = 0;
          this.stateDuration = 4e3;
          this.frameTimer = 0;
          this.frameIndex = 0;
          this.frameRate = 180;
        }
        setState(newState, customDuration = null) {
          if (this.currentState === newState && newState !== "walk" && newState !== "hop") return;
          this.currentState = newState;
          this.stateTimer = 0;
          this.frameIndex = 0;
          switch (newState) {
            case "idle":
              this.stateDuration = customDuration || 3e3 + Math.random() * 4e3;
              this.frameRate = 350;
              break;
            case "walk":
              this.stateDuration = customDuration || 2500 + Math.random() * 4500;
              this.frameRate = 160;
              break;
            case "sit":
              this.stateDuration = customDuration || 4e3 + Math.random() * 5e3;
              this.frameRate = 400;
              break;
            case "groom":
              this.stateDuration = customDuration || 3e3 + Math.random() * 2500;
              this.frameRate = 220;
              break;
            case "sleep":
              this.stateDuration = customDuration || 1e4 + Math.random() * 15e3;
              this.frameRate = 600;
              break;
            case "hop":
              this.stateDuration = customDuration || 900;
              this.frameRate = 150;
              break;
            case "eat":
              this.stateDuration = customDuration || 3200;
              this.frameRate = 180;
              break;
            case "happy":
              this.stateDuration = customDuration || 2200;
              this.frameRate = 160;
              break;
            case "sad":
              this.stateDuration = customDuration || 5e3;
              this.frameRate = 450;
              break;
            case "dangling":
              this.stateDuration = Infinity;
              this.frameRate = 200;
              break;
            case "falling":
              this.stateDuration = Infinity;
              this.frameRate = 150;
              break;
            default:
              this.stateDuration = 3e3;
              this.frameRate = 200;
          }
        }
        update(deltaTime) {
          this.stateTimer += deltaTime;
          this.frameTimer += deltaTime;
          if (this.frameTimer >= this.frameRate) {
            this.frameTimer -= this.frameRate;
            this.frameIndex++;
          }
          if (this.currentState === "walk") {
            this.bunny.updateWalk(deltaTime);
          } else if (this.currentState === "hop") {
            this.bunny.updateHop(deltaTime);
          } else if (this.currentState === "falling") {
            this.bunny.updateFalling(deltaTime);
          } else if (this.currentState === "eat") {
            this.bunny.updateEating(deltaTime);
          }
          if (this.bunny.isDoNotDisturb) {
            if (this.currentState !== "sleep" && this.currentState !== "sit") {
              this.setState("sit", 2e4);
            }
            return;
          }
          if (this.currentState !== "eat" && this.currentState !== "dangling" && this.currentState !== "falling") {
            const nearestFood = this.bunny.findNearestFood();
            if (nearestFood) {
              const approachDirection = nearestFood.x > this.bunny.x ? 1 : -1;
              const walkTargetX = nearestFood.x - approachDirection * 10;
              const walkTargetY = this.bunny.groundY;
              const distX = Math.abs(this.bunny.x - walkTargetX);
              const distY = Math.abs(this.bunny.y - walkTargetY);
              if (distX > 3 || distY > 3) {
                this.bunny.targetX = walkTargetX;
                this.bunny.targetY = walkTargetY;
                this.bunny.direction = approachDirection;
                if (this.currentState !== "walk") {
                  this.setState("walk", 8e3);
                }
                return;
              } else {
                this.bunny.x = walkTargetX;
                this.bunny.y = walkTargetY;
                this.bunny.direction = approachDirection;
                this.bunny.currentEatingFood = nearestFood;
                this.setState("eat", 3200);
                return;
              }
            }
          }
          if (this.stateTimer >= this.stateDuration) {
            this.chooseNextState();
          }
        }
        chooseNextState() {
          const hour = (/* @__PURE__ */ new Date()).getHours();
          const isNight = hour >= 23 || hour < 7;
          const isSulky = this.bunny.needs.isSulky();
          const isHungry = this.bunny.needs.isHungry();
          if (isNight || isSulky) {
            if (Math.random() < 0.7) {
              this.setState("sleep");
              return;
            }
          }
          if (isHungry && Math.random() < 0.5) {
            this.setState("sad");
            return;
          }
          const roll = Math.random();
          if (roll < 0.45) {
            const margin = 80;
            const minX = margin;
            const maxX = Math.max(minX + 100, this.bunny.screenWidth - margin);
            this.bunny.targetX = minX + Math.random() * (maxX - minX);
            this.bunny.targetY = this.bunny.groundY;
            this.bunny.direction = this.bunny.targetX > this.bunny.x ? 1 : -1;
            this.setState("walk");
          } else if (roll < 0.65) {
            this.setState("sit");
          } else if (roll < 0.8) {
            this.setState("groom");
          } else if (roll < 0.9) {
            this.bunny.startHop();
            this.setState("hop");
          } else {
            this.setState("idle");
          }
        }
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = { BunnyStateMachine };
      }
    }
  });

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
          FOODS: FOODS2,
          FUR_COLORS,
          EYE_COLORS,
          EAR_STYLES,
          ACCESSORIES,
          ACHIEVEMENTS: ACHIEVEMENTS2,
          DEFAULT_STATE
        };
      }
    }
  });

  // src/renderer/bunny/needs.js
  var require_needs = __commonJS({
    "src/renderer/bunny/needs.js"(exports, module) {
      var { HUNGER_SPEED_FACTORS, FOODS: FOODS2 } = require_constants();
      var BunnyNeeds = class {
        constructor(bunnyData = {}, settings = {}) {
          this.hunger = bunnyData.hunger !== void 0 ? bunnyData.hunger : 85;
          this.happiness = bunnyData.happiness !== void 0 ? bunnyData.happiness : 90;
          this.level = bunnyData.level || 1;
          this.xp = bunnyData.xp || 0;
          this.hungerSpeed = settings.hungerSpeed || "normal";
          this.lastDrainTime = Date.now();
          this.lastPassiveCarrotTime = Date.now();
          this.passiveCarrotIntervalMs = 5 * 60 * 1e3;
        }
        update(onLevelUp, onPassiveCarrot) {
          const now = Date.now();
          const elapsedSec = (now - this.lastDrainTime) / 1e3;
          const factor = HUNGER_SPEED_FACTORS[this.hungerSpeed] || 1;
          const drainPerSec = 30 / 1800 * factor;
          if (elapsedSec >= 1) {
            this.hunger = Math.max(0, this.hunger - drainPerSec * elapsedSec);
            this.lastDrainTime = now;
            if (this.hunger < 20) {
              this.happiness = Math.max(10, this.happiness - 0.01 * elapsedSec);
            }
          }
          if (now - this.lastPassiveCarrotTime >= this.passiveCarrotIntervalMs) {
            this.lastPassiveCarrotTime = now;
            if (onPassiveCarrot) onPassiveCarrot();
          }
        }
        feed(foodId) {
          const food = FOODS2[foodId] || FOODS2.carrot;
          const prevHunger = this.hunger;
          this.hunger = Math.min(100, this.hunger + food.hungerRestore);
          this.happiness = Math.min(100, this.happiness + food.happinessBonus);
          const xpGained = Math.round(food.hungerRestore * 0.8 + food.happinessBonus * 0.5);
          return {
            hungerRestored: this.hunger - prevHunger,
            happinessGained: food.happinessBonus,
            xpGained
          };
        }
        pet() {
          this.happiness = Math.min(100, this.happiness + 2);
          const xpGained = 2;
          return { happiness: this.happiness, xpGained };
        }
        addXp(amount, onLevelUp) {
          this.xp += amount;
          const requiredXp = this.level * 100;
          if (this.xp >= requiredXp) {
            this.xp -= requiredXp;
            this.level += 1;
            if (onLevelUp) onLevelUp(this.level);
          }
        }
        isHungry() {
          return this.hunger < 35;
        }
        isSulky() {
          return this.hunger < 15;
        }
        isHappy() {
          return this.happiness >= 75 && this.hunger >= 50;
        }
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = { BunnyNeeds };
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

  // src/renderer/bunny/bunny.js
  var require_bunny = __commonJS({
    "src/renderer/bunny/bunny.js"(exports, module) {
      var { BunnySpriteGenerator } = require_bunnySprites();
      var { AccessoryRenderer } = require_accessories();
      var { ItemSprites: ItemSprites2 } = require_itemSprites();
      var { BunnyStateMachine } = require_stateMachine();
      var { BunnyNeeds } = require_needs();
      var { soundEngine: soundEngine2 } = require_soundEngine();
      var Bunny2 = class {
        constructor(initialData = {}, settings = {}, screenWidth = 1920, screenHeight = 180) {
          this.screenWidth = screenWidth;
          this.screenHeight = screenHeight;
          this.scale = settings.bunnyScale || 2.5;
          this.isDoNotDisturb = Boolean(settings.doNotDisturb);
          this.roamingArea = settings.roamingArea || "cozy";
          this.floorMode = settings.floorMode || "taskbar";
          this.appearance = {
            furColor: initialData.furColor || "white",
            earStyle: initialData.earStyle || "upright",
            eyeColor: initialData.eyeColor || "ruby",
            blush: initialData.blush !== false
          };
          this.equipped = initialData.equipped || {
            head: "none",
            face: "none",
            neck: "none",
            back: "none",
            held: "none"
          };
          this.needs = new BunnyNeeds(initialData, settings);
          this.baseSpriteSize = 32;
          this.width = this.baseSpriteSize * this.scale;
          this.height = this.baseSpriteSize * this.scale;
          this.taskbarOverlap = 0;
          this.taskbarFloorY = this.screenHeight - this.taskbarOverlap - 12;
          this.customGroundY = initialData.customGroundY && this.floorMode === "free" ? initialData.customGroundY : null;
          this.groundY = this.floorMode === "free" && this.customGroundY ? this.customGroundY : this.taskbarFloorY;
          this.x = Math.max(100, Math.min(screenWidth - 100, screenWidth / 2));
          this.y = this.groundY;
          this.vx = 0;
          this.vy = 0;
          this.targetX = this.x;
          this.targetY = this.y;
          this.direction = 1;
          this.isDragging = false;
          this.dragOffsetX = 0;
          this.dragOffsetY = 0;
          this.currentEatingFood = null;
          this.eatCrunchTimer = 0;
          this.particles = [];
          this.stateMachine = new BunnyStateMachine(this);
          this.stateMachine.setState("idle");
          this.totalPetCount = initialData.totalPetCount || 0;
          this.totalCarrotsFed = initialData.totalCarrotsFed || 0;
        }
        resize(newWidth, newHeight, taskbarOverlap = 0) {
          this.screenWidth = newWidth;
          this.screenHeight = newHeight;
          this.taskbarOverlap = taskbarOverlap;
          this.taskbarFloorY = this.screenHeight - this.taskbarOverlap - 12;
          if (this.floorMode === "free" && this.customGroundY) {
            this.groundY = Math.min(this.taskbarFloorY, Math.max(50, this.customGroundY));
          } else {
            this.groundY = this.taskbarFloorY;
          }
          if (!this.isDragging && this.y >= this.groundY - 10) {
            this.y = this.groundY;
          }
          this.x = Math.max(40, Math.min(this.screenWidth - 40, this.x));
        }
        getRoamingHeight() {
          const area = this.roamingArea || "cozy";
          switch (area) {
            case "taskbar":
              return 40;
            case "cozy":
              return 220;
            case "desk":
              return 450;
            case "full":
              return Math.max(100, this.screenHeight - 100);
            default:
              return 220;
          }
        }
        update(deltaTime, worldFoods = [], onLevelUp, onPassiveCarrot) {
          this.worldFoods = worldFoods;
          this.needs.update(onLevelUp, onPassiveCarrot);
          this.stateMachine.update(deltaTime);
          this.updateParticles(deltaTime);
        }
        updateWalk(deltaTime) {
          const distX = this.targetX - this.x;
          if (Math.abs(distX) < 3) {
            this.x = this.targetX;
            this.y = this.groundY;
            this.stateMachine.setState("idle");
            return;
          }
          const isHungry = this.needs.isHungry();
          const speed = (isHungry ? 22 : 45) * (deltaTime / 1e3);
          if (Math.abs(distX) > 1) {
            this.direction = distX > 0 ? 1 : -1;
          }
          this.x += (distX > 0 ? 1 : -1) * Math.min(Math.abs(distX), speed);
          this.y = this.groundY;
          const halfW = this.width / 2;
          this.x = Math.max(halfW, Math.min(this.screenWidth - halfW, this.x));
        }
        startHop() {
          this.vy = -3.8;
          soundEngine2.playHop();
          this.addParticle(this.x, this.y, 0, -0.5, "star");
        }
        updateHop(deltaTime) {
          const gravity = 0.012 * deltaTime;
          this.vy += gravity;
          this.y += this.vy * (deltaTime / 16.6);
          const hopSpeed = 24 * (deltaTime / 1e3);
          this.x += this.direction * hopSpeed;
          const halfW = this.width / 2;
          this.x = Math.max(halfW, Math.min(this.screenWidth - halfW, this.x));
          if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.vy = 0;
            this.stateMachine.setState("idle", 1200);
          }
        }
        updateFalling(deltaTime) {
          const gravity = 0.018 * deltaTime;
          this.vy += gravity;
          this.y += this.vy * (deltaTime / 16.6);
          if (this.y >= this.groundY) {
            this.y = this.groundY;
            if (Math.abs(this.vy) > 1.8) {
              this.vy = -this.vy * 0.35;
              soundEngine2.playHop();
            } else {
              this.vy = 0;
              soundEngine2.playHop();
              this.stateMachine.setState("idle", 1500);
            }
          }
        }
        updateEating(deltaTime) {
          if (!this.currentEatingFood) {
            this.stateMachine.setState("idle");
            return;
          }
          this.eatCrunchTimer += deltaTime;
          if (this.eatCrunchTimer >= 380) {
            this.eatCrunchTimer = 0;
            soundEngine2.playCrunch();
            for (let i = 0; i < 3; i++) {
              const vx = (Math.random() - 0.5) * 1.5;
              const vy = -Math.random() * 1.5;
              this.addParticle(this.x + this.direction * 12, this.y - 10, vx, vy, "crumb");
            }
          }
          if (this.stateMachine.stateTimer >= this.stateMachine.stateDuration) {
            const foodId = this.currentEatingFood.id;
            const res = this.needs.feed(foodId);
            this.totalCarrotsFed++;
            for (let i = 0; i < 4; i++) {
              const vx = (Math.random() - 0.5) * 1.2;
              const vy = -1 - Math.random() * 1.5;
              this.addParticle(this.x + vx * 10, this.y - 25, vx, vy, "heart");
            }
            if (this.onFoodEaten) {
              this.onFoodEaten(this.currentEatingFood);
            }
            this.currentEatingFood = null;
            this.stateMachine.setState("happy", 2e3);
          }
        }
        findNearestFood() {
          if (!this.worldFoods || this.worldFoods.length === 0) return null;
          let closest = null;
          let minDistance = Infinity;
          for (const food of this.worldFoods) {
            const dist = Math.hypot(this.x - food.x, this.y - food.y);
            if (dist < minDistance) {
              minDistance = dist;
              closest = food;
            }
          }
          return closest;
        }
        // --- Interactions ---
        startDrag(mouseX, mouseY) {
          this.isDragging = true;
          this.dragOffsetX = this.x - mouseX;
          this.dragOffsetY = this.y - mouseY;
          this.stateMachine.setState("dangling");
        }
        updateDrag(mouseX, mouseY) {
          if (!this.isDragging) return;
          this.x = mouseX + this.dragOffsetX;
          this.y = mouseY + this.dragOffsetY;
          const halfW = this.width / 2;
          this.x = Math.max(halfW, Math.min(this.screenWidth - halfW, this.x));
          this.y = Math.min(this.taskbarFloorY, Math.max(35, this.y));
        }
        endDrag() {
          if (!this.isDragging) return;
          this.isDragging = false;
          this.vy = 0;
          if (this.floorMode === "free") {
            if (this.y >= this.taskbarFloorY - 60) {
              this.groundY = this.taskbarFloorY;
              this.customGroundY = null;
            } else {
              this.groundY = Math.max(50, Math.min(this.taskbarFloorY, this.y));
              this.customGroundY = this.groundY;
            }
          } else {
            this.groundY = this.taskbarFloorY;
            this.customGroundY = null;
          }
          this.targetY = this.groundY;
          this.stateMachine.setState("falling");
        }
        pet(mouseX, mouseY) {
          this.totalPetCount++;
          this.needs.pet();
          soundEngine2.playPet();
          for (let i = 0; i < 3; i++) {
            const vx = (Math.random() - 0.5) * 1.5;
            const vy = -1.2 - Math.random() * 1.2;
            this.addParticle(this.x + vx * 12, this.y - 28, vx, vy, "heart");
          }
          this.stateMachine.setState("happy", 2200);
        }
        doubleClick() {
          this.startHop();
          this.stateMachine.setState("hop");
        }
        addParticle(x, y, vx, vy, type) {
          this.particles.push({
            x,
            y,
            vx,
            vy,
            type,
            alpha: 1,
            life: 0,
            maxLife: type === "heart" ? 1200 : type === "star" ? 1e3 : 700
          });
        }
        updateParticles(deltaTime) {
          for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life += deltaTime;
            p.x += p.vx * (deltaTime / 16.6);
            p.y += p.vy * (deltaTime / 16.6);
            if (p.type === "crumb") {
              p.vy += 0.08;
            }
            p.alpha = Math.max(0, 1 - p.life / p.maxLife);
            if (p.life >= p.maxLife) {
              this.particles.splice(i, 1);
            }
          }
        }
        drawParticles(ctx) {
          for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            const px = Math.floor(p.x);
            const py = Math.floor(p.y);
            if (p.type === "heart") {
              ctx.fillStyle = "#ff4d6d";
              ctx.fillRect(px - 3, py - 3, 2, 2);
              ctx.fillRect(px + 1, py - 3, 2, 2);
              ctx.fillRect(px - 4, py - 1, 8, 3);
              ctx.fillRect(px - 2, py + 2, 4, 2);
              ctx.fillRect(px - 1, py + 4, 2, 1);
            } else if (p.type === "crumb") {
              ctx.fillStyle = "#ed8936";
              ctx.fillRect(px, py, 2, 2);
            } else if (p.type === "star") {
              ctx.fillStyle = "#ffd166";
              ctx.fillRect(px - 1, py - 2, 3, 5);
              ctx.fillRect(px - 2, py - 1, 5, 3);
            } else if (p.type === "zzz") {
              ctx.fillStyle = "#74c0fc";
              ctx.font = "bold 11px monospace";
              ctx.fillText("z", px, py);
            }
            ctx.restore();
          }
        }
        isPointInside(px, py) {
          const halfW = this.width * 0.5 / 2;
          const left = this.x - halfW;
          const right = this.x + halfW;
          const top = this.y - this.height * 0.75;
          const bottom = this.y;
          return px >= left && px <= right && py >= top && py <= bottom;
        }
        draw(ctx) {
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          const stateName = this.needs.isHungry() && this.stateMachine.currentState === "idle" ? "sad" : this.stateMachine.currentState;
          const { canvas: frameCanvas, anchors } = BunnySpriteGenerator.renderFrame({
            state: stateName,
            frameIndex: this.stateMachine.frameIndex,
            direction: this.direction,
            appearance: this.appearance
          });
          const frameCtx = frameCanvas.getContext("2d");
          frameCtx.imageSmoothingEnabled = false;
          AccessoryRenderer.renderAccessories(
            frameCtx,
            this.equipped,
            anchors,
            this.direction,
            this.stateMachine.frameIndex
          );
          const drawX = Math.floor(this.x - this.width / 2);
          const drawY = Math.floor(this.y - this.height);
          ctx.drawImage(frameCanvas, drawX, drawY, this.width, this.height);
          if (this.stateMachine.currentState === "sleep") {
            if (this.stateMachine.frameIndex % 3 === 0) {
              ItemSprites2.drawThoughtBubble(ctx, this.x, drawY - 4, "sleep");
            }
          } else if (this.needs.isHungry() && this.stateMachine.currentState !== "eat") {
            ItemSprites2.drawThoughtBubble(ctx, this.x, drawY - 4, "carrot");
          }
          this.drawParticles(ctx);
          ctx.restore();
        }
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = { Bunny: Bunny2 };
      }
    }
  });

  // src/renderer/garden/garden.js
  var require_garden = __commonJS({
    "src/renderer/garden/garden.js"(exports, module) {
      var { ItemSprites: ItemSprites2 } = require_itemSprites();
      var { soundEngine: soundEngine2 } = require_soundEngine();
      var CarrotGarden2 = class {
        constructor(gardenData = {}, onHarvestCallback) {
          this.plots = gardenData.plots || [
            { id: 1, planted: true, plantedAt: Date.now() - 3e4, growDurationMs: 9e4, ready: false }
          ];
          this.onHarvest = onHarvestCallback;
          this.x = gardenData.x || 360;
          this.y = 168;
          this.width = 36;
          this.height = 24;
          this.animationFrame = 0;
          this.lastCanvasWidth = 1200;
          if (!gardenData.x) {
            this.randomizePosition(1200);
          }
        }
        randomizePosition(canvasWidth) {
          if (canvasWidth && canvasWidth > 400) {
            this.lastCanvasWidth = canvasWidth;
          }
          const width = this.lastCanvasWidth || 1200;
          const minX = 320;
          const maxX = Math.max(minX + 80, width - 70);
          this.x = Math.floor(Math.random() * (maxX - minX)) + minX;
        }
        update(deltaTime) {
          this.animationFrame++;
          const now = Date.now();
          for (const plot of this.plots) {
            if (plot.planted && !plot.ready) {
              if (now - plot.plantedAt >= (plot.growDurationMs || 9e4)) {
                plot.ready = true;
              }
            }
          }
        }
        getPlotStage(plot) {
          if (!plot.planted) return -1;
          if (plot.ready) return 3;
          const progress = (Date.now() - plot.plantedAt) / (plot.growDurationMs || 9e4);
          if (progress < 0.33) return 0;
          if (progress < 0.66) return 1;
          return 2;
        }
        plantSeed() {
          const emptyPlot = this.plots.find((p) => !p.planted);
          if (emptyPlot) {
            emptyPlot.planted = true;
            emptyPlot.plantedAt = Date.now();
            emptyPlot.growDurationMs = 9e4;
            emptyPlot.ready = false;
            this.randomizePosition(this.lastCanvasWidth);
            return true;
          }
          return false;
        }
        harvest(plotId) {
          const plot = this.plots.find((p) => p.id === plotId && p.ready);
          if (plot) {
            plot.planted = false;
            plot.ready = false;
            soundEngine2.playCoin();
            setTimeout(() => {
              plot.planted = true;
              plot.plantedAt = Date.now();
              plot.ready = false;
              this.randomizePosition(this.lastCanvasWidth);
            }, 1500);
            const reward = {
              carrots: 2 + Math.floor(Math.random() * 2),
              // 2-3 carrots
              coins: 15,
              xp: 25
            };
            if (this.onHarvest) {
              this.onHarvest(reward);
            }
            return reward;
          }
          return null;
        }
        isPointInside(px, py) {
          return px >= this.x - this.width / 2 && px <= this.x + this.width / 2 && py >= this.y - this.height && py <= this.y + 6;
        }
        draw(ctx) {
          if (ctx && ctx.canvas && ctx.canvas.width) {
            this.lastCanvasWidth = ctx.canvas.width;
          }
          const plot = this.plots[0];
          if (!plot) return;
          const stage = this.getPlotStage(plot);
          ItemSprites2.drawGardenPlot(ctx, this.x, this.y, Math.max(0, stage), this.animationFrame);
          if (plot.ready) {
            ctx.save();
            ctx.font = "bold 9px sans-serif";
            ctx.fillStyle = "#ffcc00";
            ctx.textAlign = "center";
            const bounce = Math.floor(this.animationFrame / 8) % 2 === 0 ? 0 : -2;
            ctx.fillText("CLICK!", this.x, this.y - 20 + bounce);
            ctx.restore();
          }
        }
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = { CarrotGarden: CarrotGarden2 };
      }
    }
  });

  // src/renderer/ui/hud.js
  var require_hud = __commonJS({
    "src/renderer/ui/hud.js"(exports, module) {
      var { ItemSprites: ItemSprites2 } = require_itemSprites();
      var { FOODS: FOODS2 } = require_constants();
      var { soundEngine: soundEngine2 } = require_soundEngine();
      var HUD2 = class {
        constructor(app) {
          this.app = app;
          this.isDrawerOpen = false;
          this.selectedFoodToDrop = null;
          this.notifications = [];
          this.bagBtn = {
            x: 36,
            y: 154,
            width: 44,
            height: 24
          };
          this.customPos = null;
          this.canvasWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
          this.canvasHeight = typeof window !== "undefined" ? window.innerHeight : 1080;
          this.foodKeys = ["carrot", "lettuce", "apple", "clover", "strawberry"];
        }
        get scale() {
          return this.app.state?.settings?.menuScale || 1;
        }
        // Position bag button and clamp within screen
        layout(canvasHeight, taskbarOverlap = 0) {
          this.canvasHeight = canvasHeight;
          this.canvasWidth = this.app && this.app.canvas && this.app.canvas.width || (typeof window !== "undefined" ? window.innerWidth : 1920);
          this.taskbarOverlap = taskbarOverlap;
          const s = this.scale;
          const bottom = canvasHeight - taskbarOverlap;
          this.bagBtn.width = Math.round(54 * s);
          this.bagBtn.height = Math.round(28 * s);
          if (this.customPos && Number.isFinite(this.customPos.x) && Number.isFinite(this.customPos.y)) {
            this.bagBtn.x = this.customPos.x;
            this.bagBtn.y = this.customPos.y;
          } else if (this.app.state?.settings?.menuPosition && Number.isFinite(this.app.state.settings.menuPosition.x)) {
            this.bagBtn.x = this.app.state.settings.menuPosition.x;
            this.bagBtn.y = this.app.state.settings.menuPosition.y;
          } else {
            this.bagBtn.x = Math.round(18 + this.bagBtn.width / 2);
            this.bagBtn.y = bottom - Math.round(this.bagBtn.height / 2) - 8;
          }
          this.clampMenuPosition();
        }
        clampMenuPosition() {
          const halfW = this.bagBtn.width / 2;
          const halfH = this.bagBtn.height / 2;
          const margin = 10;
          const maxW = this.canvasWidth || (typeof window !== "undefined" ? window.innerWidth : 1920);
          const maxH = (this.canvasHeight || (typeof window !== "undefined" ? window.innerHeight : 1080)) - this.taskbarOverlap;
          this.bagBtn.x = Math.max(margin + halfW, Math.min(maxW - margin - halfW, this.bagBtn.x));
          this.bagBtn.y = Math.max(margin + halfH, Math.min(maxH - margin - halfH, this.bagBtn.y));
        }
        setMenuPosition(x, y) {
          this.bagBtn.x = x;
          this.bagBtn.y = y;
          this.clampMenuPosition();
          this.customPos = { x: this.bagBtn.x, y: this.bagBtn.y };
        }
        resetMenuPosition() {
          this.customPos = null;
          if (this.app.state?.settings) {
            this.app.state.settings.menuPosition = null;
          }
          this.layout(this.canvasHeight, this.taskbarOverlap);
        }
        toggleDrawer() {
          this.isDrawerOpen = !this.isDrawerOpen;
          soundEngine2.playHop();
        }
        showNotification(text, subtext = "", duration = 4e3, icon = "\u{1F955}") {
          this.notifications.push({
            text,
            subtext,
            icon,
            timer: 0,
            duration,
            alpha: 1
          });
        }
        update(deltaTime) {
          for (let i = this.notifications.length - 1; i >= 0; i--) {
            const n = this.notifications[i];
            n.timer += deltaTime;
            if (n.timer >= n.duration) {
              this.notifications.splice(i, 1);
            } else if (n.timer >= n.duration - 800) {
              n.alpha = Math.max(0, (n.duration - n.timer) / 800);
            }
          }
        }
        getDrawerBounds() {
          if (!this.isDrawerOpen) return null;
          const s = this.scale;
          const width = Math.round(270 * s);
          const height = Math.round(76 * s);
          const maxW = this.canvasWidth || (typeof window !== "undefined" ? window.innerWidth : 1920);
          const maxH = (this.canvasHeight || (typeof window !== "undefined" ? window.innerHeight : 1080)) - this.taskbarOverlap;
          let drawerY;
          if (this.bagBtn.y - this.bagBtn.height / 2 - height - 8 >= 10) {
            drawerY = this.bagBtn.y - this.bagBtn.height / 2 - height - Math.round(6 * s);
          } else {
            drawerY = this.bagBtn.y + this.bagBtn.height / 2 + Math.round(6 * s);
          }
          let drawerX = Math.round(this.bagBtn.x - width / 2);
          drawerX = Math.max(10, Math.min(maxW - width - 10, drawerX));
          drawerY = Math.max(10, Math.min(maxH - height - 10, drawerY));
          return {
            x: drawerX,
            y: drawerY,
            width,
            height
          };
        }
        getButtonAt(px, py) {
          if (px >= this.bagBtn.x - this.bagBtn.width / 2 && px <= this.bagBtn.x + this.bagBtn.width / 2 && py >= this.bagBtn.y - this.bagBtn.height / 2 && py <= this.bagBtn.y + this.bagBtn.height / 2) {
            return { type: "bag" };
          }
          if (this.isDrawerOpen) {
            const db = this.getDrawerBounds();
            if (px >= db.x && px <= db.x + db.width && py >= db.y && py <= db.y + db.height) {
              const s = this.scale;
              const slotW = Math.round(38 * s);
              const slotH = Math.round(36 * s);
              const slotGap = Math.round(44 * s);
              const startX = db.x + Math.round(8 * s);
              const startY = db.y + Math.round(6 * s);
              for (let i = 0; i < this.foodKeys.length; i++) {
                const fx = startX + i * slotGap;
                if (px >= fx && px <= fx + slotW && py >= startY && py <= startY + slotH) {
                  return { type: "food", foodId: this.foodKeys[i] };
                }
              }
              const btnY = db.y + Math.round(45 * s);
              const btnH = Math.round(22 * s);
              const btn1W = Math.round(52 * s);
              const btn2W = Math.round(52 * s);
              const btn3W = Math.round(46 * s);
              const gap = Math.round(4 * s);
              const wx = db.x + Math.round(8 * s);
              if (px >= wx && px <= wx + btn1W && py >= btnY && py <= btnY + btnH) {
                return { type: "open-wardrobe" };
              }
              const sx = wx + btn1W + gap;
              if (px >= sx && px <= sx + btn2W && py >= btnY && py <= btnY + btnH) {
                return { type: "open-settings" };
              }
              const qx = sx + btn2W + gap;
              if (px >= qx && px <= qx + btn3W && py >= btnY && py <= btnY + btnH) {
                return { type: "quit-app" };
              }
              return { type: "drawer-bg" };
            }
          }
          return null;
        }
        isPointInside(px, py) {
          if (this.getButtonAt(px, py)) return true;
          return false;
        }
        draw(ctx, inventory, coins, level, hunger, happiness) {
          ctx.save();
          ctx.imageSmoothingEnabled = false;
          const s = this.scale;
          const bx = Math.floor(this.bagBtn.x - this.bagBtn.width / 2);
          const by = Math.floor(this.bagBtn.y - this.bagBtn.height / 2);
          ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
          ctx.strokeStyle = "#fcd34d";
          ctx.lineWidth = Math.max(1.5, Math.round(2 * s));
          ctx.beginPath();
          ctx.roundRect(bx, by, this.bagBtn.width, this.bagBtn.height, Math.round(8 * s));
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#f59e0b";
          const gx = bx + Math.round(5 * s);
          const gy = by + Math.round(this.bagBtn.height / 2);
          ctx.beginPath();
          ctx.arc(gx, gy - Math.round(4 * s), Math.max(1, Math.round(1.2 * s)), 0, Math.PI * 2);
          ctx.arc(gx, gy, Math.max(1, Math.round(1.2 * s)), 0, Math.PI * 2);
          ctx.arc(gx, gy + Math.round(4 * s), Math.max(1, Math.round(1.2 * s)), 0, Math.PI * 2);
          ctx.fill();
          ItemSprites2.drawFood(ctx, "carrot", bx + Math.round(16 * s), by + Math.round(14 * s), Math.round(16 * s));
          ctx.fillStyle = "#4a2810";
          ctx.font = `bold ${Math.max(10, Math.round(11 * s))}px sans-serif`;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          ctx.fillText(`${inventory.foods.carrot || 0}`, bx + Math.round(27 * s), by + Math.round(14 * s));
          if (this.isDrawerOpen) {
            const db = this.getDrawerBounds();
            ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
            ctx.strokeStyle = "#e2e8f0";
            ctx.lineWidth = Math.max(1.5, Math.round(2 * s));
            ctx.beginPath();
            ctx.roundRect(db.x, db.y, db.width, db.height, Math.round(10 * s));
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#cbd5e1";
            const handleW = Math.round(28 * s);
            const handleH = Math.max(2.5, Math.round(3 * s));
            ctx.beginPath();
            ctx.roundRect(db.x + Math.round((db.width - handleW) / 2), db.y + Math.round(2.5 * s), handleW, handleH, 2);
            ctx.fill();
            const slotW = Math.round(38 * s);
            const slotH = Math.round(36 * s);
            const slotGap = Math.round(44 * s);
            const startX = db.x + Math.round(8 * s);
            const startY = db.y + Math.round(6 * s);
            for (let i = 0; i < this.foodKeys.length; i++) {
              const key = this.foodKeys[i];
              const fx = startX + i * slotGap;
              const count = inventory.foods[key] || 0;
              const isSelected = this.selectedFoodToDrop === key;
              ctx.fillStyle = isSelected ? "#ffedd5" : "#f8fafc";
              ctx.strokeStyle = isSelected ? "#f97316" : "#cbd5e1";
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.roundRect(fx, startY, slotW, slotH, Math.round(6 * s));
              ctx.fill();
              ctx.stroke();
              ItemSprites2.drawFood(ctx, key, fx + Math.round(slotW / 2), startY + Math.round(15 * s), Math.round(16 * s));
              ctx.fillStyle = count > 0 ? "#1e293b" : "#94a3b8";
              ctx.font = `bold ${Math.max(8, Math.round(9 * s))}px sans-serif`;
              ctx.textAlign = "center";
              ctx.fillText(`x${count}`, fx + Math.round(slotW / 2), startY + Math.round(29 * s));
            }
            const btnY = db.y + Math.round(45 * s);
            const btnH = Math.round(22 * s);
            const btn1W = Math.round(52 * s);
            const btn2W = Math.round(52 * s);
            const btn3W = Math.round(46 * s);
            const gap = Math.round(4 * s);
            const wx = db.x + Math.round(8 * s);
            const sx = wx + btn1W + gap;
            const qx = sx + btn2W + gap;
            ctx.fillStyle = "#fce7f3";
            ctx.strokeStyle = "#f472b6";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(wx, btnY, btn1W, btnH, Math.round(4 * s));
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#9d174d";
            ctx.font = `bold ${Math.max(9, Math.round(10 * s))}px sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("\u{1F457} Closet", wx + Math.round(btn1W / 2), btnY + Math.round(btnH / 2));
            ctx.fillStyle = "#f1f5f9";
            ctx.strokeStyle = "#94a3b8";
            ctx.beginPath();
            ctx.roundRect(sx, btnY, btn2W, btnH, Math.round(4 * s));
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#334155";
            ctx.fillText("\u2699\uFE0F Setup", sx + Math.round(btn2W / 2), btnY + Math.round(btnH / 2));
            ctx.fillStyle = "#fee2e2";
            ctx.strokeStyle = "#fca5a5";
            ctx.beginPath();
            ctx.roundRect(qx, btnY, btn3W, btnH, Math.round(4 * s));
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#b91c1c";
            ctx.fillText("\u2715 Exit", qx + Math.round(btn3W / 2), btnY + Math.round(btnH / 2));
            const coinY = btnY + Math.round(btnH / 2);
            const coinX = qx + btn3W + Math.round(12 * s);
            ctx.fillStyle = "#ffd700";
            ctx.beginPath();
            ctx.arc(coinX, coinY, Math.round(5 * s), 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#b45309";
            ctx.font = `bold ${Math.max(9, Math.round(10 * s))}px sans-serif`;
            ctx.textAlign = "left";
            ctx.fillText(`${coins || 0}g`, coinX + Math.round(8 * s), coinY);
            ctx.fillStyle = "#4f46e5";
            ctx.font = `bold ${Math.max(9, Math.round(10 * s))}px sans-serif`;
            ctx.textAlign = "right";
            ctx.fillText(`Lv.${level || 1}`, db.x + db.width - Math.round(8 * s), coinY);
          }
          if (this.selectedFoodToDrop) {
            ctx.save();
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.strokeStyle = "#ff8800";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(14, 18, 175, 22, 6);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#c2410c";
            ctx.font = "bold 10px sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(`Click taskbar to drop ${FOODS2[this.selectedFoodToDrop]?.name || "treat"}!`, 22, 29);
            ctx.restore();
          }
          let notifY = 22;
          for (const notif of this.notifications) {
            ctx.save();
            ctx.globalAlpha = notif.alpha;
            const nw = 280;
            const nh = 36;
            const nx = Math.floor((ctx.canvas.width - nw) / 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.96)";
            ctx.strokeStyle = "#f59e0b";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(nx, notifY, nw, nh, 8);
            ctx.fill();
            ctx.stroke();
            ctx.font = "16px sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(notif.icon, nx + 10, notifY + 18);
            ctx.fillStyle = "#1e293b";
            ctx.font = "bold 11px sans-serif";
            ctx.fillText(notif.text, nx + 34, notifY + 12);
            if (notif.subtext) {
              ctx.fillStyle = "#64748b";
              ctx.font = "9px sans-serif";
              ctx.fillText(notif.subtext, nx + 34, notifY + 25);
            }
            ctx.restore();
            notifY += 42;
          }
          ctx.restore();
        }
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = { HUD: HUD2 };
      }
    }
  });

  // src/renderer/engine/inputManager.js
  var require_inputManager = __commonJS({
    "src/renderer/engine/inputManager.js"(exports, module) {
      var { soundEngine: soundEngine2 } = require_soundEngine();
      var InputManager2 = class {
        constructor(app) {
          this.app = app;
          this.isMouseDown = false;
          this.mouseDownX = 0;
          this.mouseDownY = 0;
          this.mouseDownTime = 0;
          this.isDragging = false;
          this.isInteractiveHover = false;
          this.lastClickTime = 0;
          this.dragTarget = null;
          this.draggedFood = null;
          this.dragFoodOffsetX = 0;
          this.dragFoodOffsetY = 0;
          this.pendingFoodSlot = null;
          this.dragMenuOffsetX = 0;
          this.dragMenuOffsetY = 0;
          this.menuDragStartX = 0;
          this.menuDragStartY = 0;
          this.bindEvents();
        }
        bindEvents() {
          window.addEventListener("mousemove", (e) => this.onMouseMove(e));
          window.addEventListener("mousedown", (e) => this.onMouseDown(e));
          window.addEventListener("mouseup", (e) => this.onMouseUp(e));
          window.addEventListener("mouseleave", () => this.onMouseLeave());
          window.addEventListener("contextmenu", (e) => {
            if (this.app.hud && this.app.hud.selectedFoodToDrop) {
              e.preventDefault();
              this.app.hud.selectedFoodToDrop = null;
            }
          });
        }
        findFoodAt(px, py) {
          if (!this.app.worldFoods) return null;
          for (let i = this.app.worldFoods.length - 1; i >= 0; i--) {
            const food = this.app.worldFoods[i];
            const dist = Math.hypot(food.x - px, food.y - 4 - py);
            if (dist <= 20) {
              return food;
            }
          }
          return null;
        }
        checkInteractivity(px, py) {
          if (this.isDragging) return true;
          if (this.findFoodAt(px, py)) return true;
          if (this.app.bunny && this.app.bunny.isPointInside(px, py)) return true;
          if (this.app.hud && this.app.hud.isPointInside(px, py)) return true;
          if (this.app.garden && this.app.garden.isPointInside(px, py)) return true;
          if (this.app.hud && this.app.hud.selectedFoodToDrop) {
            return true;
          }
          return false;
        }
        updateMouseIgnoreState(isInteractive) {
          if (isInteractive !== this.isInteractiveHover) {
            this.isInteractiveHover = isInteractive;
            if (window.api && window.api.setIgnoreMouseEvents) {
              if (isInteractive) {
                window.api.setIgnoreMouseEvents(false);
              } else {
                window.api.setIgnoreMouseEvents(true, { forward: true });
              }
            }
          }
        }
        onMouseMove(e) {
          const px = e.clientX;
          const py = e.clientY;
          this.lastMouseX = px;
          this.lastMouseY = py;
          const isInteractive = this.checkInteractivity(px, py);
          this.updateMouseIgnoreState(isInteractive);
          if (this.findFoodAt(px, py)) {
            document.body.style.cursor = "grab";
          } else if (this.app.bunny && this.app.bunny.isPointInside(px, py)) {
            document.body.style.cursor = "pointer";
          } else if (this.app.hud) {
            const btn = this.app.hud.getButtonAt(px, py);
            if (btn) {
              if (btn.type === "bag" || btn.type === "drawer-bg") {
                document.body.style.cursor = "grab";
              } else {
                document.body.style.cursor = "pointer";
              }
            } else {
              document.body.style.cursor = "default";
            }
          } else {
            document.body.style.cursor = "default";
          }
          if (!this.isMouseDown) return;
          const dist = Math.hypot(px - this.mouseDownX, py - this.mouseDownY);
          if (this.dragTarget === "food" && this.draggedFood) {
            if (dist > 3) this.isDragging = true;
            if (this.isDragging) {
              document.body.style.cursor = "grabbing";
              this.draggedFood.x = px + this.dragFoodOffsetX;
              this.draggedFood.y = py + this.dragFoodOffsetY;
              this.draggedFood.isGrounded = false;
              this.draggedFood.vy = 0;
              if (this.app.bunny) {
                this.app.bunny.direction = this.draggedFood.x > this.app.bunny.x ? 1 : -1;
              }
            }
            return;
          }
          if (this.dragTarget === "drawer-food" && this.pendingFoodSlot) {
            if (dist > 8) {
              if (this.app.inventory.foods[this.pendingFoodSlot] > 0) {
                this.app.inventory.foods[this.pendingFoodSlot]--;
                const groundY = this.app.bunny ? this.app.bunny.groundY : this.app.groundY;
                const newFood = {
                  id: this.pendingFoodSlot,
                  x: px,
                  y: py,
                  vy: 0,
                  groundY,
                  isGrounded: false
                };
                this.app.worldFoods.push(newFood);
                this.dragTarget = "food";
                this.draggedFood = newFood;
                this.dragFoodOffsetX = 0;
                this.dragFoodOffsetY = 0;
                this.isDragging = true;
                this.pendingFoodSlot = null;
                soundEngine2.playHop();
                this.app.saveState();
              }
            }
            return;
          }
          if (this.dragTarget === "menu" && this.app.hud) {
            if (dist > 4) this.isDragging = true;
            if (this.isDragging) {
              document.body.style.cursor = "move";
              this.app.hud.setMenuPosition(px + this.dragMenuOffsetX, py + this.dragMenuOffsetY);
            }
            return;
          }
          if (this.dragTarget === "bunny" && this.app.bunny) {
            if (dist > 5) {
              if (!this.isDragging) {
                this.isDragging = true;
                this.app.bunny.startDrag(px, py);
              }
              this.app.bunny.updateDrag(px, py);
            }
          }
        }
        onMouseDown(e) {
          this.isMouseDown = true;
          this.mouseDownX = e.clientX;
          this.mouseDownY = e.clientY;
          this.mouseDownTime = Date.now();
          this.isDragging = false;
          const px = e.clientX;
          const py = e.clientY;
          const food = this.findFoodAt(px, py);
          if (food) {
            this.dragTarget = "food";
            this.draggedFood = food;
            this.dragFoodOffsetX = food.x - px;
            this.dragFoodOffsetY = food.y - py;
            return;
          }
          if (this.app.bunny && this.app.bunny.isPointInside(px, py)) {
            this.dragTarget = "bunny";
            return;
          }
          if (this.app.hud) {
            const btn = this.app.hud.getButtonAt(px, py);
            if (btn) {
              if (btn.type === "food") {
                this.dragTarget = "drawer-food";
                this.pendingFoodSlot = btn.foodId;
                return;
              } else if (btn.type === "bag" || btn.type === "drawer-bg") {
                this.dragTarget = "menu";
                this.dragMenuOffsetX = this.app.hud.bagBtn.x - px;
                this.dragMenuOffsetY = this.app.hud.bagBtn.y - py;
                this.menuDragStartX = px;
                this.menuDragStartY = py;
                return;
              }
            }
          }
          this.dragTarget = null;
        }
        onMouseUp(e) {
          const px = e.clientX;
          const py = e.clientY;
          const now = Date.now();
          const clickDuration = now - this.mouseDownTime;
          document.body.style.cursor = "default";
          if (this.dragTarget === "food" && this.draggedFood) {
            const food = this.draggedFood;
            this.draggedFood = null;
            this.dragTarget = null;
            this.isDragging = false;
            this.isMouseDown = false;
            if (this.app.bunny && this.app.bunny.isPointInside(px, py)) {
              this.app.bunny.needs.feed(food.id);
              this.app.bunny.totalCarrotsFed++;
              soundEngine2.playCrunch();
              for (let i = 0; i < 4; i++) {
                const vx = (Math.random() - 0.5) * 1.5;
                const vy = -1 - Math.random() * 1.5;
                this.app.bunny.addParticle(this.app.bunny.x + vx * 10, this.app.bunny.y - 25, vx, vy, "heart");
              }
              this.app.bunny.stateMachine.setState("happy", 2200);
              this.app.removeWorldFood(food);
              this.app.checkAchievements();
              this.app.saveState();
              return;
            }
            food.vy = 1.2;
            food.groundY = this.app.bunny ? this.app.bunny.groundY : this.app.groundY;
            const db = this.app.hud ? this.app.hud.getDrawerBounds() : null;
            if (this.app.hud && this.app.hud.isDrawerOpen && db) {
              if (food.x >= db.x - 20 && food.x <= db.x + db.width + 20) {
                food.x = db.x + db.width + 50 < this.app.canvas.width - 40 ? db.x + db.width + 40 + Math.random() * 40 : db.x - 50 - Math.random() * 40;
              }
            }
            food.x = Math.max(40, Math.min(this.app.canvas.width - 40, food.x));
            food.isGrounded = false;
            soundEngine2.playHop();
            if (this.app.bunny && this.app.bunny.stateMachine.currentState !== "dangling") {
              this.app.bunny.targetX = food.x;
              this.app.bunny.targetY = food.y;
              this.app.bunny.direction = food.x > this.app.bunny.x ? 1 : -1;
              this.app.bunny.stateMachine.setState("walk", 6e3);
            }
            return;
          }
          if (this.dragTarget === "menu") {
            const wasDragging = this.isDragging;
            this.dragTarget = null;
            this.isDragging = false;
            this.isMouseDown = false;
            if (wasDragging) {
              if (this.app.state && this.app.state.settings && this.app.hud) {
                this.app.state.settings.menuPosition = {
                  x: Math.round(this.app.hud.bagBtn.x),
                  y: Math.round(this.app.hud.bagBtn.y)
                };
                this.app.saveState();
              }
              return;
            } else {
              if (clickDuration < 400 && this.app.hud) {
                const btn = this.app.hud.getButtonAt(px, py);
                if (btn && btn.type === "bag") {
                  this.app.hud.toggleDrawer();
                }
              }
              return;
            }
          }
          if (this.dragTarget === "bunny" && this.app.bunny) {
            if (this.isDragging) {
              this.app.bunny.endDrag();
              this.isDragging = false;
              this.isMouseDown = false;
              this.dragTarget = null;
              if (this.app.bunny.floorMode === "free") {
                this.app.saveState();
              }
              return;
            }
          }
          this.isDragging = false;
          this.isMouseDown = false;
          this.dragTarget = null;
          this.pendingFoodSlot = null;
          if (clickDuration < 400) {
            this.handleClick(px, py, now);
          }
        }
        handleClick(px, py, now) {
          if (this.app.hud && this.app.hud.selectedFoodToDrop) {
            const foodId = this.app.hud.selectedFoodToDrop;
            this.app.dropFood(foodId, px, py);
            this.app.hud.selectedFoodToDrop = null;
            return;
          }
          const food = this.findFoodAt(px, py);
          if (food) {
            if (this.app.bunny) {
              this.app.bunny.targetX = food.x - (food.x > this.app.bunny.x ? 1 : -1) * 10;
              this.app.bunny.targetY = this.app.bunny.groundY;
              this.app.bunny.direction = food.x > this.app.bunny.x ? 1 : -1;
              this.app.bunny.stateMachine.setState("walk", 6e3);
              soundEngine2.playHop();
            }
            return;
          }
          if (this.app.hud) {
            const btn = this.app.hud.getButtonAt(px, py);
            if (btn) {
              if (btn.type === "bag") {
                this.app.hud.toggleDrawer();
                return;
              } else if (btn.type === "food") {
                if (this.app.inventory.foods[btn.foodId] > 0) {
                  const margin = 80;
                  const dropX = Math.floor(Math.random() * (this.app.canvas.width - margin * 2)) + margin;
                  const dropY = this.app.bunny ? this.app.bunny.y : 30;
                  this.app.dropFood(btn.foodId, dropX, dropY);
                  this.app.hud.selectedFoodToDrop = null;
                }
                return;
              } else if (btn.type === "open-wardrobe") {
                if (window.api) window.api.openWardrobe();
                return;
              } else if (btn.type === "open-settings") {
                if (window.api) window.api.openSettings();
                return;
              } else if (btn.type === "quit-app") {
                if (this.app) this.app.saveState();
                if (window.api) window.api.quitApp();
                return;
              }
              return;
            }
          }
          if (this.app.garden && this.app.garden.isPointInside(px, py)) {
            this.app.garden.harvest(1);
            return;
          }
          if (this.app.bunny && this.app.bunny.isPointInside(px, py)) {
            const isDoubleClick = now - this.lastClickTime < 320;
            this.lastClickTime = now;
            if (isDoubleClick) {
              this.app.bunny.doubleClick();
            } else {
              this.app.bunny.pet(px, py);
            }
            return;
          }
        }
        onMouseLeave() {
          if (this.isDragging && this.app.bunny && this.dragTarget === "bunny") {
            this.app.bunny.endDrag();
          }
          if (this.draggedFood) {
            this.draggedFood.isGrounded = false;
            this.draggedFood.vy = 1;
            this.draggedFood.x = Math.max(90, Math.min(this.app.canvas.width - 40, this.draggedFood.x));
            this.draggedFood = null;
          }
          this.isDragging = false;
          this.isMouseDown = false;
          this.dragTarget = null;
          this.pendingFoodSlot = null;
          this.updateMouseIgnoreState(false);
        }
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = { InputManager: InputManager2 };
      }
    }
  });

  // src/renderer/engine/gameLoop.js
  var require_gameLoop = __commonJS({
    "src/renderer/engine/gameLoop.js"(exports, module) {
      var GameLoop2 = class {
        constructor(updateFn, renderFn) {
          this.update = updateFn;
          this.render = renderFn;
          this.isRunning = false;
          this.lastTime = 0;
          this.targetFps = 30;
          this.frameInterval = 1e3 / this.targetFps;
          this.animationFrameId = null;
          this.isIdle = false;
        }
        start() {
          if (this.isRunning) return;
          this.isRunning = true;
          this.lastTime = performance.now();
          this.loop = this.loop.bind(this);
          this.animationFrameId = requestAnimationFrame(this.loop);
        }
        stop() {
          this.isRunning = false;
          if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
          }
        }
        setIdleMode(isIdle) {
          this.isIdle = isIdle;
          this.targetFps = isIdle ? 8 : 30;
          this.frameInterval = 1e3 / this.targetFps;
        }
        loop(currentTime) {
          if (!this.isRunning) return;
          const delta = currentTime - this.lastTime;
          if (delta >= this.frameInterval) {
            const clampedDelta = Math.min(delta, 100);
            this.lastTime = currentTime - delta % this.frameInterval;
            this.update(clampedDelta);
            this.render();
          }
          this.animationFrameId = requestAnimationFrame(this.loop);
        }
      };
      if (typeof module !== "undefined" && module.exports) {
        module.exports = { GameLoop: GameLoop2 };
      }
    }
  });

  // src/renderer/app.js
  var { Bunny } = require_bunny();
  var { CarrotGarden } = require_garden();
  var { HUD } = require_hud();
  var { InputManager } = require_inputManager();
  var { GameLoop } = require_gameLoop();
  var { soundEngine } = require_soundEngine();
  var { ItemSprites } = require_itemSprites();
  var { ACHIEVEMENTS, FOODS } = require_constants();
  var TaskbarBunnyApp = class {
    constructor() {
      this.canvas = document.getElementById("gameCanvas");
      this.ctx = this.canvas.getContext("2d");
      this.state = null;
      this.bunny = null;
      this.garden = null;
      this.hud = null;
      this.input = null;
      this.loop = null;
      this.worldFoods = [];
      this.taskbarOverlap = 0;
      this.butterfly = null;
      this.randomEventTimer = 0;
      this.autoSaveTimer = 0;
      this.init();
    }
    // Y coordinate of the floor: just above the taskbar, whatever its height
    get groundY() {
      return this.canvas.height - this.taskbarOverlap - 12;
    }
    async init() {
      this.handleResize();
      window.addEventListener("resize", () => this.handleResize());
      try {
        const layout = await window.api.getLayout();
        this.taskbarOverlap = layout && layout.taskbarOverlap || 0;
      } catch (err) {
        console.error("[Renderer] Could not read taskbar layout:", err);
      }
      window.api.onLayoutUpdate((layout) => {
        this.taskbarOverlap = layout && layout.taskbarOverlap || 0;
        this.applyLayout();
      });
      const { state, offlineSummary } = await window.api.loadState();
      this.state = state;
      if (this.state.settings) {
        soundEngine.setVolume(this.state.settings.volume ?? 0.6);
        soundEngine.setMuted(Boolean(this.state.settings.isMuted));
      }
      this.bunny = new Bunny(
        this.state.bunny,
        this.state.settings,
        this.canvas.width,
        this.canvas.height
      );
      this.bunny.onFoodEaten = (eatenFood) => {
        this.removeWorldFood(eatenFood);
        this.checkAchievements();
        this.saveState();
      };
      this.garden = new CarrotGarden(this.state.garden, (reward) => {
        this.inventory.foods.carrot = (this.inventory.foods.carrot || 0) + reward.carrots;
        this.inventory.coins = (this.inventory.coins || 0) + reward.coins;
        this.bunny.needs.addXp(reward.xp, (newLv) => this.onLevelUp(newLv));
        this.hud.showNotification(`+${reward.carrots} Carrots harvested!`, `+${reward.coins} Coins`, 3500, "\u{1F955}");
        this.checkAchievements();
        this.saveState();
      });
      this.hud = new HUD(this);
      this.input = new InputManager(this);
      this.applyLayout();
      if (offlineSummary) {
        this.handleOfflineSummary(offlineSummary);
      }
      window.api.onOfflineSummary((summary) => this.handleOfflineSummary(summary));
      window.api.onStateUpdate((updatedState) => {
        this.syncState(updatedState);
      });
      window.api.onTrayAction((action) => {
        if (action === "feed-carrot") {
          const dropX = Math.max(95, this.bunny ? this.bunny.x + this.bunny.direction * 35 : 120);
          this.dropFood("carrot", dropX, 40);
        }
      });
      this.loop = new GameLoop(
        (dt) => this.update(dt),
        () => this.render()
      );
      this.loop.start();
    }
    get inventory() {
      return this.state.inventory;
    }
    handleResize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.applyLayout();
    }
    applyLayout() {
      if (this.bunny) {
        this.bunny.resize(this.canvas.width, this.canvas.height, this.taskbarOverlap);
      }
      if (this.garden) {
        this.garden.y = this.groundY;
        if (!this.garden.x || this.garden.x < 320) {
          this.garden.randomizePosition(this.canvas.width);
        }
      }
      if (this.hud) {
        this.hud.layout(this.canvas.height, this.taskbarOverlap);
      }
      for (const food of this.worldFoods) {
        food.groundY = this.groundY;
      }
    }
    handleOfflineSummary(summary) {
      if (!summary || summary.elapsedMinutes < 2) return;
      const msg = `Away for ${summary.elapsedMinutes} mins`;
      let sub = "";
      if (summary.carrotsGrown > 0) {
        sub += `\u{1F955} ${summary.carrotsGrown} carrots ready! `;
      }
      if (summary.streakBonus > 0) {
        sub += `\u{1F381} +${summary.streakBonus} streak coins!`;
      }
      this.hud.showNotification(msg, sub || "Barnaby missed you!", 5e3, "\u{1F430}");
    }
    dropFood(foodId, x, y) {
      if (!this.inventory.foods[foodId] || this.inventory.foods[foodId] <= 0) {
        this.hud.showNotification(`No ${FOODS[foodId]?.name || "food"} left!`, "Plant in garden or wait for passive earn", 3e3, "\u274C");
        return;
      }
      this.inventory.foods[foodId]--;
      const groundY = this.bunny ? this.bunny.groundY : this.groundY;
      const db = this.hud ? this.hud.getDrawerBounds() : null;
      let safeX = x;
      if (this.hud && this.hud.isDrawerOpen && db) {
        if (safeX >= db.x - 20 && safeX <= db.x + db.width + 20) {
          safeX = db.x + db.width + 50 < this.canvas.width - 40 ? db.x + db.width + 40 + Math.random() * 40 : db.x - 50 - Math.random() * 40;
        }
      }
      safeX = Math.max(40, Math.min(this.canvas.width - 40, safeX));
      this.worldFoods.push({
        id: foodId,
        x: safeX,
        y: Math.min(y, groundY - 10),
        vy: 1.5,
        groundY,
        isGrounded: false
      });
      soundEngine.playHop();
      this.saveState();
    }
    removeWorldFood(target) {
      const idx = this.worldFoods.indexOf(target);
      if (idx !== -1) {
        this.worldFoods.splice(idx, 1);
      }
    }
    onLevelUp(newLevel) {
      soundEngine.playLevelUp();
      this.inventory.coins = (this.inventory.coins || 0) + 50;
      this.hud.showNotification(`LEVEL UP! Now Level ${newLevel}!`, "+50 Coins awarded", 5e3, "\u2B50");
      for (let i = 0; i < 8; i++) {
        const vx = (Math.random() - 0.5) * 3;
        const vy = -1.5 - Math.random() * 2;
        this.bunny.addParticle(this.bunny.x, this.bunny.y - 20, vx, vy, "star");
      }
      this.checkAchievements();
      this.saveState();
    }
    onPassiveCarrot() {
      this.inventory.foods.carrot = (this.inventory.foods.carrot || 0) + 1;
      this.hud.showNotification("+1 Passive Carrot!", "Earned by keeping bunny company", 3e3, "\u{1F955}");
      this.saveState();
    }
    checkAchievements() {
      if (!this.state.achievements) this.state.achievements = { unlocked: [] };
      const unlocked = this.state.achievements.unlocked;
      const check = (id, condition) => {
        if (!unlocked.includes(id) && condition) {
          unlocked.push(id);
          const ach = ACHIEVEMENTS.find((a) => a.id === id);
          if (ach) {
            soundEngine.playLevelUp();
            this.inventory.coins += ach.rewardCoins;
            this.bunny.needs.addXp(ach.rewardXp, (lv) => this.onLevelUp(lv));
            this.hud.showNotification(`\u{1F3C6} Achievement Unlocked!`, `${ach.name}: ${ach.description}`, 5e3, "\u{1F3C6}");
          }
        }
      };
      check("first_carrot", this.bunny.totalCarrotsFed >= 1);
      check("fed_25", this.bunny.totalCarrotsFed >= 25);
      check("fed_100", this.bunny.totalCarrotsFed >= 100);
      check("pet_50", this.bunny.totalPetCount >= 50);
      check("pet_200", this.bunny.totalPetCount >= 200);
      check("first_harvest", this.state.garden?.plots?.some((p) => p.ready || p.plantedAt));
      check("level_5", this.bunny.needs.level >= 5);
      check("level_10", this.bunny.needs.level >= 10);
    }
    update(deltaTime) {
      for (const food of this.worldFoods) {
        const db = this.hud ? this.hud.getDrawerBounds() : null;
        const minX = this.hud && this.hud.isDrawerOpen && db ? db.x + db.width + 25 : 95;
        if (food.x < minX) {
          food.x = minX + 20 + Math.random() * 60;
        }
        if (!food.isGrounded) {
          food.vy += 0.35;
          food.y += food.vy;
          if (food.y >= food.groundY) {
            food.y = food.groundY;
            if (food.vy > 1.2) {
              food.vy = -food.vy * 0.3;
            } else {
              food.vy = 0;
              food.isGrounded = true;
            }
          }
        }
      }
      if (this.garden) {
        this.garden.update(deltaTime);
      }
      if (this.bunny) {
        this.bunny.update(
          deltaTime,
          this.worldFoods,
          (newLv) => this.onLevelUp(newLv),
          () => this.onPassiveCarrot()
        );
      }
      if (this.hud) {
        this.hud.update(deltaTime);
      }
      this.updateRandomEvents(deltaTime);
      if (this.loop && this.bunny) {
        const isDormant = (this.bunny.stateMachine.currentState === "sleep" || this.bunny.stateMachine.currentState === "sit") && this.worldFoods.length === 0 && this.bunny.particles.length === 0 && !this.input.isMouseDown && !this.butterfly;
        this.loop.setIdleMode(isDormant);
      }
      this.autoSaveTimer += deltaTime;
      if (this.autoSaveTimer >= 3e4) {
        this.autoSaveTimer = 0;
        this.saveState();
      }
    }
    updateRandomEvents(deltaTime) {
      this.randomEventTimer += deltaTime;
      if (this.randomEventTimer >= 35e3 && !this.butterfly) {
        this.randomEventTimer = 0;
        const roll = Math.random();
        if (roll < 0.4) {
          this.butterfly = {
            x: Math.random() < 0.5 ? 20 : this.canvas.width - 20,
            y: this.groundY - 48 - Math.random() * 50,
            vx: Math.random() < 0.5 ? 1.2 : -1.2,
            vy: -0.4,
            life: 0,
            color: ["#ffb7b2", "#b5ead7", "#e2f0cb", "#c7ceea"][Math.floor(Math.random() * 4)]
          };
        } else if (roll < 0.7) {
          if (this.bunny && this.bunny.stateMachine.currentState === "idle") {
            soundEngine.playSneeze();
            this.bunny.addParticle(this.bunny.x, this.bunny.y - 15, 0, -1, "star");
          }
        } else {
          this.inventory.coins = (this.inventory.coins || 0) + 10;
          soundEngine.playCoin();
          this.hud.showNotification("Lucky! Found 10 Coins!", "Barnaby noticed something shiny", 3500, "\u{1FA99}");
          this.saveState();
        }
      }
      if (this.butterfly) {
        this.butterfly.life += deltaTime;
        this.butterfly.x += this.butterfly.vx * (deltaTime / 16.6);
        this.butterfly.y += Math.sin(this.butterfly.life / 200) * 0.8;
        if (this.butterfly.x < -20 || this.butterfly.x > this.canvas.width + 20 || this.butterfly.life > 18e3) {
          this.butterfly = null;
        }
      }
    }
    render() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.garden) {
        this.garden.draw(this.ctx);
      }
      if (this.butterfly) {
        this.ctx.save();
        this.ctx.fillStyle = this.butterfly.color;
        const bx = Math.floor(this.butterfly.x);
        const by = Math.floor(this.butterfly.y);
        const flap = Math.floor(this.butterfly.life / 100) % 2 === 0 ? 0 : 2;
        this.ctx.fillRect(bx - 3, by - 2 - flap, 3, 4);
        this.ctx.fillRect(bx + 1, by - 2 - flap, 3, 4);
        this.ctx.fillStyle = "#333333";
        this.ctx.fillRect(bx, by - 1, 1, 3);
        this.ctx.restore();
      }
      if (this.bunny) {
        this.bunny.draw(this.ctx);
      }
      if (this.hud && this.bunny) {
        this.hud.draw(
          this.ctx,
          this.inventory,
          this.inventory.coins,
          this.bunny.needs.level,
          this.bunny.needs.hunger,
          this.bunny.needs.happiness
        );
      }
      for (const food of this.worldFoods) {
        const isHovered = this.input && this.input.findFoodAt(this.input.lastMouseX, this.input.lastMouseY) === food;
        const isDragged = this.input && this.input.draggedFood === food;
        if (isHovered || isDragged) {
          this.ctx.save();
          this.ctx.strokeStyle = "#f97316";
          this.ctx.lineWidth = 1.5;
          this.ctx.beginPath();
          this.ctx.arc(food.x, food.y - 4, 11, 0, Math.PI * 2);
          this.ctx.stroke();
          this.ctx.restore();
        }
        if (this.bunny && this.bunny.stateMachine.currentState === "eat" && this.bunny.currentEatingFood === food) {
          const progress = this.bunny.stateMachine.stateTimer / Math.max(1, this.bunny.stateMachine.stateDuration);
          const nibbleSize = Math.max(8, 18 * (1 - progress * 0.5));
          const holdX = this.bunny.x + this.bunny.direction * 10;
          const holdY = this.bunny.y - 12;
          ItemSprites.drawFood(this.ctx, food.id, holdX, holdY, nibbleSize);
        } else {
          ItemSprites.drawFood(this.ctx, food.id, food.x, food.y - 4, 18);
        }
      }
    }
    syncState(updatedState) {
      if (!updatedState) return;
      this.state = updatedState;
      if (this.bunny) {
        this.bunny.appearance = {
          furColor: this.state.bunny.furColor,
          earStyle: this.state.bunny.earStyle,
          eyeColor: this.state.bunny.eyeColor,
          blush: this.state.bunny.blush
        };
        this.bunny.equipped = this.state.bunny.equipped;
        if (this.state.settings) {
          this.bunny.scale = this.state.settings.bunnyScale || 2.5;
          this.bunny.width = this.bunny.baseSpriteSize * this.bunny.scale;
          this.bunny.height = this.bunny.baseSpriteSize * this.bunny.scale;
          this.bunny.isDoNotDisturb = Boolean(this.state.settings.doNotDisturb);
          this.bunny.roamingArea = this.state.settings.roamingArea || "cozy";
          this.bunny.floorMode = this.state.settings.floorMode || "taskbar";
          if (this.bunny.floorMode === "taskbar") {
            this.bunny.groundY = this.bunny.taskbarFloorY;
            this.bunny.customGroundY = null;
          }
          soundEngine.setVolume(this.state.settings.volume ?? 0.6);
          soundEngine.setMuted(Boolean(this.state.settings.isMuted));
        }
      }
      if (this.hud) {
        this.hud.layout(this.canvas.height, this.taskbarOverlap);
      }
    }
    saveState() {
      if (!this.state || !this.bunny) return;
      this.state.bunny.hunger = Math.round(this.bunny.needs.hunger);
      this.state.bunny.happiness = Math.round(this.bunny.needs.happiness);
      this.state.bunny.level = this.bunny.needs.level;
      this.state.bunny.xp = this.bunny.needs.xp;
      this.state.bunny.totalCarrotsFed = this.bunny.totalCarrotsFed;
      this.state.bunny.totalPetCount = this.bunny.totalPetCount;
      this.state.bunny.equipped = this.bunny.equipped;
      this.state.bunny.furColor = this.bunny.appearance.furColor;
      this.state.bunny.earStyle = this.bunny.appearance.earStyle;
      this.state.bunny.eyeColor = this.bunny.appearance.eyeColor;
      this.state.bunny.blush = this.bunny.appearance.blush;
      this.state.bunny.customGroundY = this.bunny.floorMode === "free" && this.bunny.customGroundY ? Math.round(this.bunny.customGroundY) : null;
      if (this.garden) {
        this.state.garden.plots = this.garden.plots;
        this.state.garden.x = this.garden.x;
      }
      if (window.api && window.api.saveState) {
        window.api.saveState(this.state);
      }
    }
  };
  window.addEventListener("DOMContentLoaded", () => {
    window.appInstance = new TaskbarBunnyApp();
  });
})();
//# sourceMappingURL=app.js.map
