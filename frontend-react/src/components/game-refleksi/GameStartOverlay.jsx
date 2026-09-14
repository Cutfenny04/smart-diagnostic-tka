/* ==========================================================================
   GAME START OVERLAY — JELAJAH BUDAYA ACEH
   ========================================================================== */

import React from 'react';
import { Play, Sparkles, Compass, MousePointer, Smartphone } from 'lucide-react';
import { GAME_MASCOTS } from '../../data/gameRefleksiData';

function GameStartOverlay({ onStart }) {
  return (
    <div className="zuma-overlay zuma-overlay--start" role="dialog" aria-modal="true">
      <div className="zuma-modal-card zuma-modal-card--start">
        <div className="zuma-modal__ornament-top" aria-hidden="true">
          <span>🌿</span>
          <span className="ornament-divider">❖</span>
          <span>💎</span>
          <span className="ornament-divider">❖</span>
          <span>🌿</span>
        </div>

        {/* Maskot Anak Aceh */}
        <div className="zuma-mascot-greeting">
          <img
            src={GAME_MASCOTS.welcome}
            alt="Maskot Anak Aceh"
            className="zuma-mascot-greeting__img"
          />
          <div className="zuma-mascot-greeting__bubble">
            <span className="zuma-bubble__tag">Kearifan Aceh</span>
            <p className="zuma-bubble__text">
              "Takat Kelereng mengasah ketelitian dan kesabaran, seperti merangkai ornamen Pinto Aceh!"
            </p>
          </div>
        </div>

        <span className="zuma-modal__eyebrow">
          <Compass size={14} /> Permainan Refleksi Budaya Aceh
        </span>

        <h2 className="zuma-modal__title">Takat Kelereng</h2>

        <p className="zuma-modal__desc">
          Jelajahi keindahan seni, arsitektur, dan kearifan nilai luhur Aceh melalui
          permainan menembak kelereng permata 3D. Cocokkan warna permata yang sama
          dan temukan titik refleksi budaya di sepanjang perjalanan.
        </p>

        <div className="zuma-guide-box">
          <div className="zuma-guide-item">
            <MousePointer size={16} className="zuma-guide-icon" />
            <div>
              <strong>Desktop:</strong> Gerakkan mouse untuk membidik, <strong>Klik Kiri</strong> untuk menembak, <strong>Spasi</strong> untuk tukar permata, <strong>Esc</strong> untuk jeda.
            </div>
          </div>
          <div className="zuma-guide-item">
            <Smartphone size={16} className="zuma-guide-icon" />
            <div>
              <strong>Mobile / Tablet:</strong> Sentuh tombol di layar untuk membidik, menembak, dan menukar permata.
            </div>
          </div>
        </div>

        <button
          type="button"
          className="btn-zuma-primary btn-zuma--lg"
          onClick={onStart}
          autoFocus
        >
          <Play size={20} />
          <span>MULAI PERJALANAN</span>
        </button>
      </div>
    </div>
  );
}

export default GameStartOverlay;
