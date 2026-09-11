/* ==========================================================================
   ZUMA GAME ENGINE — BUDAYA ACEH (MODULAR ES6)
   Mempertahankan 100% perilaku gameplay Zuma asli (movement, collision,
   matching, gap retraction, combo chain), dengan rendering prosedural
   Dark 3D Jewel bermotif Aceh, integrasi Game Score, dan Reflection Points.
   ========================================================================== */

import { ZUMA_CONFIG } from './gameConfig.js';
import { Marble } from './Marble.js';
import { Player } from './Player.js';
import { OneFrameTime, createDiv, createElementNS } from './utils.js';

export class Zuma {
  constructor(options = {}) {
    this.width = options.width || ZUMA_CONFIG.width;
    this.height = options.height || ZUMA_CONFIG.height;
    this.AllMarbleLength = options.allMarbleLength || ZUMA_CONFIG.allMarbleLength;
    this.InitMarbleLength = options.initMarbleLength || ZUMA_CONFIG.initMarbleLength;
    this.reflectionPoints = options.reflectionPoints || ZUMA_CONFIG.reflectionPoints;

    this.updateScore = options.updateScore || null;
    this.updateFinal = options.updateFinal || null;
    this.onReflectionTrigger = options.onReflectionTrigger || null;
    this.onProgressUpdate = options.onProgressUpdate || null;

    // Canvas rendering untuk kelereng 3D
    this.Canvas = document.createElement('canvas');
    this.Container = createDiv(['container', 'zuma-container'], [this.Canvas]);

    // Jalur SVG
    this.Path = createElementNS('path', {});
    this.Path.setAttributeNS(null, 'd', options.path || ZUMA_CONFIG.path);

    const svg = createElementNS('svg', {
      x: '0px',
      y: '0px',
      width: `${this.width}px`,
      height: `${this.height}px`,
      viewBox: `0 0 ${this.width} ${this.height}`,
    });
    svg.appendChild(this.Path);

    this.PathLength = this.Path.getTotalLength();
    const startHolePos = this.Path.getPointAtLength(0);
    const finalHolePos = this.Path.getPointAtLength(this.PathLength);

    // Gerbang portal masuk & keluar bernuansa ornamen Aceh
    const startHole = createDiv(['start-hole', 'start-hole--aceh']);
    const finalHole = createDiv(['final-hole', 'final-hole--aceh']);
    startHole.style.left = `${startHolePos.x}px`;
    startHole.style.top = `${startHolePos.y}px`;
    finalHole.style.left = `${finalHolePos.x}px`;
    finalHole.style.top = `${finalHolePos.y}px`;

    this.Container.appendChild(startHole);
    this.Container.appendChild(finalHole);

    // Konfigurasi ukuran Canvas & Container
    this.Canvas.width = this.width * (window.devicePixelRatio || 1);
    this.Canvas.height = this.height * (window.devicePixelRatio || 1);
    this.Container.style.width = `${this.width}px`;
    this.Container.style.height = `${this.height}px`;
    this.Container.style.transform = `scale(${options.scale || ZUMA_CONFIG.scale || 1})`;

    // Player launcher
    this.Player = new Player(options.playerPos || ZUMA_CONFIG.playerPos);
    this.Player.appendTo(this.Container);

    // State internal gameplay
    this.moveSpeed = ZUMA_CONFIG.baseSpeed;
    this.autoAddMarbleCount = 0;
    this.clearedMarbleCount = 0;
    this.marbleDataList = [];
    this.marbleBoomList = [];
    this.marbleColorCount = {};
    this.moveTimes = 0;
    this.isStart = false;
    this._isInit = false;
    this._isFinal = false;
    this.animId = null;

    this.checkDeleteAfterTouchData = {};
    this.playerMarble = {
      now: null,
      next: null,
    };
    this._score = 0;

    // Checkpoint refleksi yang sudah terpanggil
    this.triggeredReflections = {};

    this.colorList = [...ZUMA_CONFIG.colors];
    this.colorList.forEach((color) => {
      this.marbleColorCount[color] = 0;
    });
  }

  get isInit() {
    return this._isInit;
  }

  set isFinal(val) {
    this._isFinal = val;
    if (this._isFinal && this.updateFinal) {
      this.updateFinal(true, this._score);
    }
  }

  get isFinal() {
    return this._isFinal;
  }

  set score(val) {
    this._score = Math.max(0, val);
    if (this.updateScore) {
      this.updateScore(this._score);
    }
  }

  get score() {
    return this._score;
  }

  start() {
    if (this.isFinal) return this;
    this.isStart = true;
    this.time = new Date().getTime();
    if (!this.animId) {
      this.animId = requestAnimationFrame(() => this.animation());
    }
    return this;
  }

  stop() {
    this.isStart = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    return this;
  }

  reset() {
    this.stop();
    this._isInit = false;
    this.isFinal = false;
    this.autoAddMarbleCount = 0;
    this.clearedMarbleCount = 0;
    this.score = 0;
    this.moveSpeed = ZUMA_CONFIG.baseSpeed;
    this.colorList = [...ZUMA_CONFIG.colors];
    this.marbleDataList.length = 0;
    this.marbleBoomList.length = 0;
    this.checkDeleteAfterTouchData = {};
    this.triggeredReflections = {};
    this.playerMarble.now = null;
    this.playerMarble.next = null;

    this.Player.setMarbleColor('').setNextMarbleColor('');
    Object.keys(this.marbleColorCount).forEach((color) => {
      this.marbleColorCount[color] = 0;
    });

    const ctx = this.Canvas.getContext('2d');
    ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

    return this;
  }

  setScale(scale) {
    if (this.Container) {
      this.Container.style.transform = `scale(${scale || 1})`;
    }
    return this;
  }

  destroy() {
    this.stop();
    this.reset();
    if (this.parent && this.Container && this.Container.parentNode === this.parent) {
      this.parent.removeChild(this.Container);
    }
    this.parent = null;
  }

  appendTo(parent) {
    this.parent = parent;
    if (this.parent) {
      this.parent.appendChild(this.Container);
    }
    return this;
  }

  switchMarble() {
    if (!this.isStart || this.isFinal || !this.isInit) {
      return this;
    }
    if (this.Player && this.playerMarble.now && this.playerMarble.next) {
      const temp = this.playerMarble.now;
      this.playerMarble.now = this.playerMarble.next;
      this.playerMarble.next = temp;

      this.Player.setMarbleColor(this.playerMarble.now.Color).setNextMarbleColor(
        this.playerMarble.next.Color
      );
    }
    return this;
  }

  attack() {
    if (
      !this.isStart ||
      this.isFinal ||
      !this.isInit ||
      !this.Player ||
      !this.playerMarble.now ||
      !this.playerMarble.next
    ) {
      return this;
    }
    const vector = this.Player.getVector();
    this.marbleBoomList.push({
      marble: this.playerMarble.now,
      speed: vector,
    });
    this.playerMarble.now.setPosition(this.Player.X, this.Player.Y);
    this.playerMarble.now = this.playerMarble.next;
    this.playerMarble.next = this.createMarble();

    this.Player.setMarbleColor(this.playerMarble.now.Color).setNextMarbleColor(
      this.playerMarble.next.Color
    );
    return this;
  }

  lookAt(x, y) {
    if (this.Player) {
      this.Player.lookAt(x, y);
    }
    return this;
  }

  lookAtVector(x, y) {
    if (this.Player) {
      this.Player.lookAtVector(x, y);
    }
    return this;
  }

  getPlayerRotate() {
    return this.Player ? this.Player.rotate : 0;
  }

  init() {
    const innerTime = new Date().getTime();
    if (this.marbleDataList.length >= this.InitMarbleLength && this.isStart) {
      this._isInit = true;
      this.moveSpeed = 20;
      this.moveTimes = this.moveSpeed;
      this.playerMarble.now = this.createMarble();
      this.playerMarble.next = this.createMarble();
      this.Player.setMarbleColor(this.playerMarble.now.Color).setNextMarbleColor(
        this.playerMarble.next.Color
      );
      return this;
    }
    if (innerTime - this.time < OneFrameTime * 4) {
      return this;
    }
    this.time = innerTime;
    this.unshiftMarble();
    return this;
  }

  checkReflectionCheckpoint() {
    if (!this.onReflectionTrigger || !this.reflectionPoints || !this.reflectionPoints.length) {
      return;
    }
    const progress = this.clearedMarbleCount / this.AllMarbleLength;
    if (this.onProgressUpdate) {
      this.onProgressUpdate(progress, this.clearedMarbleCount, this.AllMarbleLength);
    }

    for (const point of this.reflectionPoints) {
      if (!this.triggeredReflections[point.id] && progress >= point.progress) {
        this.triggeredReflections[point.id] = true;
        // Pause game dan buka modal refleksi
        this.stop();
        this.onReflectionTrigger(point.id, point);
        break;
      }
    }
  }

  moveMoveMarbleData() {
    const firstMarble = this.marbleDataList[0];
    if (!firstMarble) {
      return;
    }

    // Jika kelereng terdepan masuk ke lubang akhir
    if (firstMarble.percent >= 0.99) {
      this.score -= ZUMA_CONFIG.scoreRules.holePenalty;
      this.removeMarbleFromDataList(firstMarble.marble);
    }

    const moveNum = Marble.Size / this.moveSpeed;
    firstMarble.percent += moveNum / this.PathLength;
    const pos = this.Path.getPointAtLength(firstMarble.percent * this.PathLength);
    firstMarble.marble.setPosition(pos.x, pos.y);

    let prevMarble = firstMarble;
    const deleteList = [];

    for (let i = 1; i < this.marbleDataList.length; i++) {
      const marbleData = this.marbleDataList[i];
      if (marbleData.percent >= 0.99) {
        this.score -= ZUMA_CONFIG.scoreRules.holePenalty;
        this.removeMarbleFromDataList(marbleData.marble, i);
        continue;
      }
      const overlap = prevMarble.marble.overlap(marbleData.marble);
      if (overlap > 0 || prevMarble.percent > marbleData.percent) {
        // Periksa apakah kelereng mundur menyentuh kelereng warna sama
        if (this.checkDeleteAfterTouchData[marbleData.marble.ID]) {
          delete this.checkDeleteAfterTouchData[marbleData.marble.ID];
          if (marbleData.marble.Color === prevMarble.marble.Color) {
            const list = this.getNeerSameMarble(marbleData.marble);
            if (list.length >= 3) {
              deleteList.push(...list);
            }
          }
        }
        if (prevMarble.percent > marbleData.percent) {
          marbleData.percent = prevMarble.percent + Marble.Size / this.PathLength;
        } else {
          marbleData.percent += overlap / this.PathLength;
        }
      } else if (overlap < -5 && marbleData.percent > prevMarble.percent) {
        if (overlap < -Marble.Size) {
          this.checkDeleteAfterTouchData[marbleData.marble.ID] = true;
        }
        const backMoveNum = (Marble.Size / this.moveSpeed) * 4;
        marbleData.percent -= backMoveNum / this.PathLength;
      }
      const p = this.Path.getPointAtLength(marbleData.percent * this.PathLength);
      marbleData.marble.setPosition(p.x, p.y);
      prevMarble = marbleData;
    }

    if (deleteList.length > 0) {
      // Bonus combo eliminasi beruntun
      this.score += ZUMA_CONFIG.scoreRules.chainBonus + deleteList.length * ZUMA_CONFIG.scoreRules.matchBase;
      this.clearedMarbleCount += deleteList.length;
      deleteList.forEach((m) => {
        this.removeMarbleFromDataList(m);
      });
      this.checkReflectionCheckpoint();
    }
  }

  moveMoveMarbleBoom() {
    if (!this.marbleBoomList.length) {
      return;
    }
    const marbleDataList = this.marbleDataList;
    const deleteData = [];

    this.marbleBoomList.forEach((data) => {
      data.marble.setPosition(data.marble.x + data.speed.x, data.marble.y + data.speed.y);
      for (let i = 0; i < marbleDataList.length; i++) {
        const marbleData = marbleDataList[i];
        const overlap = data.marble.overlap(marbleData.marble);
        if (overlap > 5) {
          if (data.marble.Color === marbleData.marble.Color) {
            const sameList = this.getNeerSameMarble(marbleData.marble);
            if (sameList.length >= 2) {
              const matchedCount = sameList.length + 1;
              const bonus = matchedCount >= 4 ? ZUMA_CONFIG.scoreRules.comboMultiplier * 2 : ZUMA_CONFIG.scoreRules.comboMultiplier;
              this.score += matchedCount * ZUMA_CONFIG.scoreRules.matchBase + bonus;
              this.clearedMarbleCount += matchedCount;

              sameList.forEach((m) => {
                this.removeMarbleFromDataList(m);
              });
              deleteData.push({ ...data, isMove: false });
              this.checkReflectionCheckpoint();
              return;
            }
          }
          this.addMarbleToNeer(data.marble, marbleData);
          deleteData.push({ ...data, isMove: true });
          return;
        }
      }
      if (Math.abs(data.marble.x) > this.width || Math.abs(data.marble.y) > this.height) {
        deleteData.push({ ...data, isMove: false });
      }
    });

    deleteData.forEach((d) => {
      const idx = this.marbleBoomList.findIndex((item) => item.marble.ID === d.marble.ID);
      if (idx !== -1) {
        this.marbleBoomList.splice(idx, 1);
      }
      if (!d.isMove && this.marbleColorCount[d.marble.Color] !== undefined) {
        this.marbleColorCount[d.marble.Color]--;
      }
    });
  }

  removeMarbleFromDataList(marble, index = this.marbleDataList.findIndex((d) => d.marble.ID === marble.ID)) {
    if (index !== -1) {
      delete this.checkDeleteAfterTouchData[marble.ID];
      this.marbleDataList.splice(index, 1);
      if (this.marbleColorCount[marble.Color] !== undefined) {
        this.marbleColorCount[marble.Color]--;
      }
    }
    return this;
  }

  addMarbleToNeer(marble, target) {
    const index = this.marbleDataList.findIndex((d) => d.marble.ID === target.marble.ID);
    if (index === -1) return this;
    const oneMarblePercent = Marble.Size / this.PathLength;
    const prevPos = this.Path.getPointAtLength((target.percent - oneMarblePercent) * this.PathLength);
    const nextPos = this.Path.getPointAtLength((target.percent + oneMarblePercent) * this.PathLength);
    const prevGap = Math.pow(prevPos.x - marble.x, 2) + Math.pow(prevPos.y - marble.y, 2);
    const nextGap = Math.pow(nextPos.x - marble.x, 2) + Math.pow(nextPos.y - marble.y, 2);

    if (prevGap < nextGap) {
      this.marbleDataList.splice(index, 0, {
        marble,
        percent: target.percent - oneMarblePercent / 2,
      });
    } else {
      this.marbleDataList.splice(index + 1, 0, {
        marble,
        percent: target.percent + oneMarblePercent / 2,
      });
    }
    return this;
  }

  createMarble() {
    const marble = new Marble({ color: this.getColor() });
    if (this.marbleColorCount[marble.Color] !== undefined) {
      this.marbleColorCount[marble.Color]++;
    }
    return marble;
  }

  unshiftMarble() {
    const marble = this.createMarble();
    this.marbleDataList.unshift({
      marble,
      percent: 0,
    });
    this.autoAddMarbleCount++;
    return this;
  }

  getColor() {
    const index = ~~(Math.random() * this.colorList.length);
    const color = this.colorList[index];
    if (this.marbleColorCount[color] || this.colorList.length === 1 || !this.isInit) {
      return color;
    }
    this.colorList.splice(index, 1);
    return this.getColor();
  }

  getNeerSameMarble(marble) {
    const index = this.marbleDataList.findIndex((ele) => ele.marble.ID === marble.ID);
    if (index === -1) return [marble];
    const neerList = [marble];

    // Cek ke arah depan rantai
    let checkMarble = marble;
    for (let i = index + 1; i < this.marbleDataList.length; i++) {
      const nowMarble = this.marbleDataList[i].marble;
      if (nowMarble.Color === checkMarble.Color && nowMarble.overlap(checkMarble) > Marble.Size / -10) {
        checkMarble = nowMarble;
        neerList.push(nowMarble);
      } else {
        break;
      }
    }

    // Cek ke arah belakang rantai
    checkMarble = marble;
    for (let i = index - 1; i >= 0; i--) {
      const nowMarble = this.marbleDataList[i].marble;
      if (nowMarble.Color === checkMarble.Color && nowMarble.overlap(checkMarble) > Marble.Size / -10) {
        checkMarble = nowMarble;
        neerList.push(nowMarble);
      } else {
        break;
      }
    }
    return neerList;
  }

  /* ==========================================================================
     RENDERING PROSEDURAL 3D JEWEL MARBLE DENGAN MOTIF ACEH
     Tahapan rendering:
     1. Base color
     2. 3D Radial gradient (spherical volume)
     3. Specular highlight (pantulan kilau atas-kiri)
     4. Ambient shadow (kedalaman dasar)
     5. Emas / Cincin rim tipis (pembatas tegas saat berhimpitan)
     6. Motif ukiran halus Aceh di tengah bola (tanpa merusak identitas warna)
     ========================================================================== */
  drawJewelMarble(ctx, x, y, r, color) {
    const style = ZUMA_CONFIG.jewelStyles[color] || {
      highlight: '#FFFFFF',
      mid: color,
      dark: '#111111',
    };

    ctx.save();

    // 1 & 2: Radial Gradient 3D Sphere
    const grad = ctx.createRadialGradient(x - r * 0.32, y - r * 0.32, r * 0.08, x, y, r);
    grad.addColorStop(0, style.highlight);
    grad.addColorStop(0.35, style.mid);
    grad.addColorStop(0.85, color);
    grad.addColorStop(1, style.dark);

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // 3: Specular Glint (Kilau cermin atas-kiri)
    ctx.beginPath();
    ctx.ellipse(x - r * 0.32, y - r * 0.32, r * 0.28, r * 0.16, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fill();

    // 4 & 5: Cincin Rim Emas Tipis (Membantu batas antar kelereng jelas)
    ctx.beginPath();
    ctx.arc(x, y, r - 0.5, 0, Math.PI * 2);
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = 'rgba(230, 185, 90, 0.55)';
    ctx.stroke();

    // 6: Motif Aceh Halus (Ornamen Pucuk Rebung / Pinto Aceh emas semi-transparan)
    // Didesain halus dengan opacity ~0.35 agar identitas warna kelereng tetap prima!
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(255, 235, 175, 0.38)';
    ctx.fillStyle = 'rgba(255, 235, 175, 0.22)';

    const motifSize = r * 0.38;
    ctx.beginPath();
    // Gambar ornamen intan 4 sisi berujung melengkung
    ctx.moveTo(x, y - motifSize);
    ctx.quadraticCurveTo(x + motifSize * 0.5, y - motifSize * 0.5, x + motifSize, y);
    ctx.quadraticCurveTo(x + motifSize * 0.5, y + motifSize * 0.5, x, y + motifSize);
    ctx.quadraticCurveTo(x - motifSize * 0.5, y + motifSize * 0.5, x - motifSize, y);
    ctx.quadraticCurveTo(x - motifSize * 0.5, y - motifSize * 0.5, x, y - motifSize);
    ctx.closePath();
    ctx.stroke();

    // Titik pusat permata
    ctx.beginPath();
    ctx.arc(x, y, r * 0.09, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 245, 200, 0.65)';
    ctx.fill();

    ctx.restore();
  }

  drawCanvas() {
    const ctx = this.Canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const r = (Marble.Size / 2) * dpr;

    ctx.clearRect(0, 0, this.Canvas.width, this.Canvas.height);

    // Render kelereng di atas lintasan
    this.marbleDataList.forEach((item) => {
      this.drawJewelMarble(ctx, item.marble.x * dpr, item.marble.y * dpr, r, item.marble.Color);
    });

    // Render kelereng peluru yang sedang melayang
    this.marbleBoomList.forEach((item) => {
      this.drawJewelMarble(ctx, item.marble.x * dpr, item.marble.y * dpr, r, item.marble.Color);
    });
  }

  animation() {
    if (!this.isStart) {
      this.animId = null;
      return;
    }
    this.animId = requestAnimationFrame(() => this.animation());

    if (!this.isInit) {
      this.init().moveMoveMarbleData();
      this.drawCanvas();
      return;
    }

    const innerTime = new Date().getTime();
    if (innerTime - this.time < OneFrameTime) {
      return;
    }
    this.time = innerTime;

    if (this.moveTimes === this.moveSpeed && this.autoAddMarbleCount < this.AllMarbleLength) {
      this.unshiftMarble();
      this.moveTimes = 0;
    }

    this.moveMoveMarbleBoom();
    this.moveMoveMarbleData();
    this.drawCanvas();
    this.moveTimes++;

    // Selesai jika seluruh kelereng telah keluar dan rantai bersih
    if (this.autoAddMarbleCount >= this.AllMarbleLength && this.marbleDataList.length === 0) {
      this.isFinal = true;
    }
  }
}
