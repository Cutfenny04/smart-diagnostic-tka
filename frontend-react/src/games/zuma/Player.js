/* ==========================================================================
   PLAYER / LAUNCHER MODEL — KARAKTER BUDAYA ACEH
   Mengelola bidikan rotasi 360°, preview kelereng aktif & kelereng cadangan,
   serta vektor lintasan peluru tembakan.
   ========================================================================== */

import { ZUMA_CONFIG } from './gameConfig.js';
import { createDiv } from './utils.js';

export class Player {
  constructor({ x = 550, y = 400 } = {}) {
    this.X = x;
    this.Y = y;
    this.rotate = 0;
    this.parent = null;

    // Kelereng aktif di ujung tembak
    this.Marble = createDiv(['marble-1']);

    // Kelereng cadangan berikutnya
    this.NextMarbleList = [
      createDiv(['marble-2', 'marble-2-left']),
      createDiv(['marble-2', 'marble-2-center']),
      createDiv(['marble-2', 'marble-2-right']),
    ];

    // Elemen visual launcher karakter Aceh
    this.DOM = createDiv(
      ['player', 'player--aceh'],
      [this.Marble, ...this.NextMarbleList]
    );

    this.updateTransform();
  }

  updateTransform() {
    this.DOM.style.transform = `translate(calc(${this.X}px - 50%), calc(${this.Y}px - 50%)) rotate(${this.rotate}deg)`;
  }

  lookAt(targetScreenX, targetScreenY) {
    if (!this.DOM) return this;
    const rect = this.DOM.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return this.lookAtVector(targetScreenX - centerX, targetScreenY - centerY);
  }

  lookAtVector(vx, vy) {
    // Sudut rotasi 360 derajat mengikuti koordinat kursor / sentuhan
    this.rotate = (Math.atan2(vy, vx) * 180) / Math.PI + 90;
    this.updateTransform();
    return this;
  }

  appendTo(parent) {
    this.parent = parent;
    if (this.parent) {
      this.parent.appendChild(this.DOM);
    }
    return this;
  }

  setMarbleColor(color) {
    if (this.Marble) {
      this.Marble.style.backgroundColor = color || 'transparent';
      this.Marble.setAttribute('data-color', color || '');
    }
    return this;
  }

  setNextMarbleColor(color) {
    this.NextMarbleList.forEach((dom) => {
      if (dom) {
        dom.style.backgroundColor = color || 'transparent';
        dom.setAttribute('data-color', color || '');
      }
    });
    return this;
  }

  getVector() {
    const innerRotate = this.rotate - 90;
    const rad = (innerRotate * Math.PI) / 180;
    const speed = ZUMA_CONFIG.shootSpeed || 30;
    return {
      x: Math.cos(rad) * speed,
      y: Math.sin(rad) * speed,
    };
  }
}
