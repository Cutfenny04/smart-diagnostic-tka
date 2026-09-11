/* ==========================================================================
   MARBLE MODEL
   Mengelola data kelereng, posisi koordinat, dan kalkulasi jarak tumpang tindih.
   ========================================================================== */

import { ZUMA_CONFIG } from './gameConfig.js';
import { createDiv } from './utils.js';

export class Marble {
  constructor({ color = '#8B1E2D' } = {}) {
    this.ID = `${(~~(Math.random() * 1000000000))
      .toString(16)
      .toLocaleUpperCase()}`;
    this.Color = color;
    this.x = 0;
    this.y = 0;

    // Elemen DOM untuk preview player atau fallback
    this.DOM = createDiv(['marble']);
    this.DOM.style.backgroundColor = this.Color;
    this.DOM.style.width = `${Marble.Size}px`;
    this.DOM.style.height = `${Marble.Size}px`;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  // Menghitung overlap jarak fisik antara dua kelereng
  overlap(otherMarble) {
    if (!otherMarble) return 0;
    const dx = this.x - otherMarble.x;
    const dy = this.y - otherMarble.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return Marble.Size - dist;
  }
}

Marble.Size = ZUMA_CONFIG.marbleSize;
