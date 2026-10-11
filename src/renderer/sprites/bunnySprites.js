const { PALETTES } = require('./palette');
const { AccessoryRenderer } = require('./accessories');

class BunnySpriteGenerator {
  /**
   * Generates a 32x32 canvas for a specific state, frame, direction, and appearance.
   * @param {Object} options
   * @param {string} options.state - 'idle', 'walk', 'sit', 'groom', 'sleep', 'hop', 'eat', 'sad', 'happy', 'dangling'
   * @param {number} options.frameIndex - current animation frame index
   * @param {number} options.direction - 1 for right, -1 for left
   * @param {Object} options.appearance - { furColor, earStyle, eyeColor, blush }
   * @param {Object} options.equipped - { head, face, neck, back, held }
   * @param {string} options.terrain - 'grassy', 'icy'
   * @returns {{ canvas: HTMLCanvasElement, anchors: Object }}
   */
  static renderFrame({ state = 'idle', frameIndex = 0, direction = 1, appearance = {}, equipped = null, terrain = 'grassy' }) {
    const canvas = (typeof document !== 'undefined')
      ? document.createElement('canvas')
      : { width: 32, height: 32, getContext: () => ({ fillRect: () => {}, drawImage: () => {}, translate: () => {}, scale: () => {} }) };
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.imageSmoothingEnabled = false;

    const fur = PALETTES.fur[appearance.furColor] || PALETTES.fur.white;
    const eyeColor = PALETTES.eyes[appearance.eyeColor] || PALETTES.eyes.ruby;
    const earStyle = appearance.earStyle || 'upright';
    const hasBlush = appearance.blush !== false;
    const isSpotted = appearance.furColor === 'spotted';

    // Animation state variables
    let headOffsetY = 0;
    let bodyOffsetY = 0;
    let headOffsetX = 0;
    let earAngle = 0; // -1, 0, 1
    let eyeType = 'normal'; // 'normal', 'blink', 'happy', 'sleep', 'sad', 'wide'
    let mouthType = 'dot'; // 'dot', 'chew_open', 'chew_closed', 'smile', 'open'
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
      case 'idle':
        // Gentle breathing cycle (0, 1)
        headOffsetY = (frameIndex % 2 === 1) ? 1 : 0;
        bodyOffsetY = (frameIndex % 2 === 1) ? 0 : 0;
        eyeType = (frameIndex % 8 === 7) ? 'blink' : 'normal';
        break;

      case 'walk':
        if (terrain === 'icy') {
          // 4-frame dynamic ice skating glide animation
          const sStep = frameIndex % 4;
          if (sStep === 0) {
            // Push off back skate, glide forward on front skate with smooth forward lean
            headOffsetY = 0; headOffsetX = 1; footOffsetL = -2; footOffsetR = 2; earAngle = 1;
          } else if (sStep === 1) {
            // Full extension gliding stroke
            headOffsetY = 1; headOffsetX = 1; footOffsetL = -1; footOffsetR = 3; earAngle = 2;
          } else if (sStep === 2) {
            // Alternate skate: push off front skate, glide on back skate
            headOffsetY = 0; headOffsetX = -1; footOffsetL = 2; footOffsetR = -2; earAngle = -1;
          } else {
            // Extended gliding stroke on alternate skate
            headOffsetY = 1; headOffsetX = -1; footOffsetL = 3; footOffsetR = -1; earAngle = -2;
          }
        } else {
          // 4 frame walk cycle
          const wStep = frameIndex % 4;
          if (wStep === 0) {
            headOffsetY = 0; footOffsetL = -1; footOffsetR = 1; earAngle = 1;
          } else if (wStep === 1) {
            headOffsetY = 1; footOffsetL = 0; footOffsetR = 0; earAngle = 0;
          } else if (wStep === 2) {
            headOffsetY = 0; footOffsetL = 1; footOffsetR = -1; earAngle = -1;
          } else {
            headOffsetY = -1; footOffsetL = 0; footOffsetR = 0; earAngle = 0;
          }
        }
        break;

      case 'sit':
        headOffsetY = 2;
        bodyOffsetY = 1;
        eyeType = (frameIndex % 6 === 5) ? 'blink' : 'normal';
        break;

      case 'groom':
        headOffsetY = 1;
        groomStep = frameIndex % 4;
        eyeType = 'happy';
        mouthType = 'smile';
        break;

      case 'sleep':
        isCurled = true;
        headOffsetY = 3;
        bodyOffsetY = 2;
        eyeType = 'sleep';
        break;

      case 'hop':
        const hStep = frameIndex % 3;
        if (hStep === 0) {
          isSquash = true;
          headOffsetY = 2;
          bodyOffsetY = 1;
        } else if (hStep === 1) {
          isStretch = true;
          headOffsetY = -4;
          bodyOffsetY = -3;
          eyeType = 'happy';
        } else {
          headOffsetY = 0;
          bodyOffsetY = 0;
        }
        break;

      case 'eat':
        const eStep = frameIndex % 2;
        headOffsetY = 2;
        mouthType = eStep === 0 ? 'chew_open' : 'chew_closed';
        eyeType = 'happy';
        break;

      case 'sad':
        headOffsetY = 2;
        earAngle = -2;
        eyeType = 'sad';
        break;

      case 'happy':
        headOffsetY = (frameIndex % 2 === 1) ? -2 : 0;
        eyeType = 'happy';
        mouthType = 'smile';
        earAngle = 1;
        break;

      case 'dangling':
        isDangling = true;
        headOffsetY = -1;
        bodyOffsetY = 0;
        eyeType = 'wide';
        mouthType = 'open';
        footOffsetL = 2;
        footOffsetR = 2;
        break;

      default:
        headOffsetY = 0;
    }

    // Anchors for accessories (relative to 32x32 origin)
    const baseHeadX = 17 + headOffsetX;
    const baseHeadY = 16 + headOffsetY;
    const baseBodyX = 15;
    const baseBodyY = 22 + bodyOffsetY;

    // Helper functions for pixel drawing
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

    // 1. Draw Tail (behind body, left side if facing right)
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

    // 2. Draw Ears (behind head)
    const earY = baseHeadY - 9;
    const leftEarX = baseHeadX - 4 + earAngle;
    const rightEarX = baseHeadX + 2 + earAngle;

    if (earStyle === 'upright' || (earStyle === 'derpy' && !isCurled)) {
      // Left ear (upright)
      rect(leftEarX, earY + 2, 3, 7, fur.base);
      rect(leftEarX + 1, earY + 3, 1, 5, fur.innerEar);
      p(leftEarX + 1, earY + 1, fur.base);
      p(leftEarX + 1, earY, fur.outline);
      p(leftEarX, earY + 1, fur.outline);
      p(leftEarX + 2, earY + 1, fur.outline);
      rect(leftEarX - 1, earY + 2, 1, 7, fur.outline);
      rect(leftEarX + 3, earY + 2, 1, 7, fur.outline);

      // Right ear
      if (earStyle === 'upright') {
        rect(rightEarX, earY + 2, 3, 7, fur.base);
        rect(rightEarX + 1, earY + 3, 1, 5, fur.innerEar);
        p(rightEarX + 1, earY + 1, fur.base);
        p(rightEarX + 1, earY, fur.outline);
        p(rightEarX, earY + 1, fur.outline);
        p(rightEarX + 2, earY + 1, fur.outline);
        rect(rightEarX - 1, earY + 2, 1, 7, fur.outline);
        rect(rightEarX + 3, earY + 2, 1, 7, fur.outline);
      } else {
        // Derpy: right ear flops downward
        rect(rightEarX + 1, baseHeadY - 3, 4, 3, fur.base);
        rect(rightEarX + 3, baseHeadY, 3, 4, fur.base);
        rect(rightEarX + 4, baseHeadY + 1, 1, 3, fur.innerEar);
        rect(rightEarX + 6, baseHeadY, 1, 5, fur.outline);
        rect(rightEarX + 2, baseHeadY + 4, 4, 1, fur.outline);
      }
    } else if (earStyle === 'floppy' || isCurled) {
      // Floppy ears draping along cheek
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

    // 3. Draw Body
    const bodyW = isSquash ? 16 : (isStretch ? 10 : 13);
    const bodyH = isSquash ? 8 : (isStretch ? 12 : 10);
    const bodyLeft = baseBodyX - Math.floor(bodyW / 2);
    const bodyTop = baseBodyY - Math.floor(bodyH / 2);

    rect(bodyLeft, bodyTop, bodyW, bodyH, fur.base);
    rect(bodyLeft + 1, bodyTop + bodyH - 2, bodyW - 2, 2, fur.shadow);

    // Spotted patch on body
    if (isSpotted) {
      rect(bodyLeft + 2, bodyTop + 2, 5, 4, fur.patch);
      rect(bodyLeft + 3, bodyTop + 5, 3, 2, fur.patchShadow);
    }

    // Body outline
    rect(bodyLeft - 1, bodyTop + 1, 1, bodyH - 2, fur.outline);
    rect(bodyLeft + bodyW, bodyTop + 1, 1, bodyH - 2, fur.outline);
    rect(bodyLeft + 1, bodyTop + bodyH, bodyW - 2, 1, fur.outline);

    // 4. Draw Feet / Paws
    if (isDangling) {
      // Dangling long legs
      rect(baseBodyX - 4, baseBodyY + 4 + footOffsetL, 2, 5, fur.base);
      rect(baseBodyX + 2, baseBodyY + 4 + footOffsetR, 2, 5, fur.base);
      rect(baseBodyX - 5, baseBodyY + 8 + footOffsetL, 4, 2, fur.shadow);
      rect(baseBodyX + 1, baseBodyY + 8 + footOffsetR, 4, 2, fur.shadow);
      p(baseBodyX - 4, baseBodyY + 10 + footOffsetL, fur.outline);
      p(baseBodyX + 2, baseBodyY + 10 + footOffsetR, fur.outline);
    } else if (!isCurled) {
      // Normal / walking feet
      const footY = 27 + bodyOffsetY;
      // Back foot (left)
      rect(baseBodyX - 6 + footOffsetL, footY, 4, 2, fur.shadow);
      p(baseBodyX - 7 + footOffsetL, footY + 1, fur.outline);
      rect(baseBodyX - 6 + footOffsetL, footY + 2, 4, 1, fur.outline);

      // Front foot (right)
      rect(baseBodyX + 2 + footOffsetR, footY, 5, 2, fur.base);
      rect(baseBodyX + 3 + footOffsetR, footY + 1, 4, 1, fur.shadow);
      rect(baseBodyX + 2 + footOffsetR, footY + 2, 5, 1, fur.outline);
      p(baseBodyX + 7 + footOffsetR, footY + 1, fur.outline);

      if (terrain === 'icy') {
        // Small Ice Skates on feet
        const backFootX = baseBodyX - 6 + footOffsetL;
        const frontFootX = baseBodyX + 2 + footOffsetR;

        // Dark boot straps across paws
        rect(backFootX + 1, footY, 2, 1, '#334155');
        rect(frontFootX + 1, footY, 2, 1, '#334155');

        // Blade stanchions (mounts connecting sole to blade)
        p(backFootX + 1, footY + 2, '#64748b');
        p(backFootX + 3, footY + 2, '#64748b');
        p(frontFootX + 1, footY + 2, '#64748b');
        p(frontFootX + 4, footY + 2, '#64748b');

        // Shiny steel ice skate runner blades
        rect(backFootX - 1, footY + 3, 6, 1, '#94a3b8');
        p(backFootX + 1, footY + 3, '#ffffff'); // glint highlight
        p(backFootX + 4, footY + 2, '#cbd5e1'); // curved toe pick

        rect(frontFootX - 1, footY + 3, 7, 1, '#94a3b8');
        p(frontFootX + 2, footY + 3, '#ffffff'); // glint highlight
        p(frontFootX + 5, footY + 2, '#cbd5e1'); // curved toe pick
      }
    }

    // 5. Draw Head
    const headW = 14;
    const headH = 11;
    const headLeft = baseHeadX - 7;
    const headTop = baseHeadY - 5;

    rect(headLeft, headTop, headW, headH, fur.base);
    // Head highlight & shadow
    rect(headLeft + 2, headTop, headW - 4, 1, fur.highlight);
    rect(headLeft + 1, headTop + headH - 1, headW - 2, 1, fur.shadow);

    // Spotted patch over eye
    if (isSpotted) {
      rect(headLeft + 1, headTop + 2, 5, 5, fur.patch);
    }

    // Head outline
    rect(headLeft - 1, headTop + 2, 1, headH - 4, fur.outline);
    rect(headLeft + headW, headTop + 2, 1, headH - 4, fur.outline);
    rect(headLeft + 2, headTop - 1, headW - 4, 1, fur.outline);
    p(headLeft, headTop + 1, fur.outline);
    p(headLeft + headW - 1, headTop + 1, fur.outline);

    // 6. Face Details (Eyes, Nose, Cheeks, Mouth)
    const eyeY = baseHeadY - 1;
    const leftEyeX = baseHeadX - 3;
    const rightEyeX = baseHeadX + 3;

    if (eyeType === 'normal') {
      // 2x2 cute glossy eyes
      rect(leftEyeX, eyeY, 2, 2, eyeColor);
      p(leftEyeX, eyeY, '#ffffff'); // eye reflection
      rect(rightEyeX, eyeY, 2, 2, eyeColor);
      p(rightEyeX, eyeY, '#ffffff');
    } else if (eyeType === 'blink') {
      // Closed line eye
      rect(leftEyeX, eyeY + 1, 2, 1, fur.outline);
      rect(rightEyeX, eyeY + 1, 2, 1, fur.outline);
    } else if (eyeType === 'happy') {
      // ^ ^ happy squint eyes
      p(leftEyeX, eyeY + 1, fur.outline);
      p(leftEyeX + 1, eyeY, fur.outline);
      p(leftEyeX + 2, eyeY + 1, fur.outline);
      p(rightEyeX, eyeY + 1, fur.outline);
      p(rightEyeX + 1, eyeY, fur.outline);
      p(rightEyeX + 2, eyeY + 1, fur.outline);
    } else if (eyeType === 'sleep') {
      // Peaceful _ _ eyes
      rect(leftEyeX - 1, eyeY + 1, 3, 1, fur.outline);
      rect(rightEyeX, eyeY + 1, 3, 1, fur.outline);
    } else if (eyeType === 'sad') {
      // Droopy sad eyes with blue tear
      rect(leftEyeX, eyeY, 2, 2, eyeColor);
      rect(rightEyeX, eyeY, 2, 2, eyeColor);
      p(rightEyeX + 2, eyeY + 2, PALETTES.effects.tear);
      p(rightEyeX + 2, eyeY + 3, PALETTES.effects.tear);
    } else if (eyeType === 'wide') {
      // Big shocked eyes o o
      rect(leftEyeX - 1, eyeY - 1, 3, 3, eyeColor);
      p(leftEyeX, eyeY, '#ffffff');
      rect(rightEyeX, eyeY - 1, 3, 3, eyeColor);
      p(rightEyeX + 1, eyeY, '#ffffff');
    }

    // Nose
    const noseX = baseHeadX;
    const noseY = baseHeadY + 2;
    p(noseX, noseY, fur.nose);

    // Mouth
    if (mouthType === 'chew_open') {
      rect(noseX - 1, noseY + 2, 3, 2, '#85203b');
      p(noseX, noseY + 2, '#ff8fa3'); // tongue
    } else if (mouthType === 'chew_closed') {
      rect(noseX - 1, noseY + 2, 3, 1, fur.outline);
    } else if (mouthType === 'smile') {
      p(noseX - 1, noseY + 2, fur.outline);
      p(noseX, noseY + 2, fur.outline);
      p(noseX + 1, noseY + 1, fur.outline);
    } else if (mouthType === 'open') {
      rect(noseX - 1, noseY + 2, 2, 2, '#85203b');
    }

    // Cheeks / Blush
    if (hasBlush) {
      p(leftEyeX - 2, eyeY + 2, PALETTES.blush);
      p(leftEyeX - 1, eyeY + 2, PALETTES.blush);
      p(rightEyeX + 2, eyeY + 2, PALETTES.blush);
      p(rightEyeX + 3, eyeY + 2, PALETTES.blush);
    }

    // Grooming paws animation
    if (state === 'groom') {
      const pawY = baseHeadY + 1;
      if (groomStep === 0 || groomStep === 2) {
        rect(baseHeadX + 1, pawY - 1, 3, 2, fur.base);
        p(baseHeadX + 2, pawY, fur.outline);
      } else {
        rect(baseHeadX + 2, pawY - 3, 2, 3, fur.base);
        p(baseHeadX + 3, pawY - 1, fur.outline);
      }
    }

    // Calculate dynamic anchor positions for layered accessories
    const anchors = {
      head: { x: baseHeadX, y: headTop },
      face: { x: baseHeadX, y: eyeY },
      neck: { x: baseHeadX, y: headTop + headH },
      back: { x: baseBodyX - 4, y: baseBodyY - 1 },
      held: { x: baseHeadX + 7, y: baseBodyY }
    };

    // If equipped accessories provided, draw them onto the frame before any flipping
    if (equipped && typeof AccessoryRenderer !== 'undefined') {
      AccessoryRenderer.renderAccessories(ctx, equipped, anchors, 1, frameIndex);
    }

    // If facing left (-1), flip the entire composite canvas (bunny + clothes) horizontally
    if (direction === -1) {
      const flippedCanvas = (typeof document !== 'undefined')
        ? document.createElement('canvas')
        : { width: 32, height: 32, getContext: () => ({ fillRect: () => {}, drawImage: () => {}, translate: () => {}, scale: () => {} }) };
      flippedCanvas.width = 32;
      flippedCanvas.height = 32;
      const fCtx = flippedCanvas.getContext('2d');
      if (fCtx) {
        fCtx.imageSmoothingEnabled = false;
        if (typeof fCtx.translate === 'function') fCtx.translate(32, 0);
        if (typeof fCtx.scale === 'function') fCtx.scale(-1, 1);
        if (typeof fCtx.drawImage === 'function') fCtx.drawImage(canvas, 0, 0);
      }

      // Adjust anchors for flipped orientation
      anchors.head.x = 32 - anchors.head.x;
      anchors.face.x = 32 - anchors.face.x;
      anchors.neck.x = 32 - anchors.neck.x;
      anchors.back.x = 32 - anchors.back.x;
      anchors.held.x = 32 - anchors.held.x;

      return { canvas: flippedCanvas, anchors };
    }

    return { canvas, anchors };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BunnySpriteGenerator };
}
