/* ==========================================================================
   FLAPPY PAUSE OVERLAY — MELINGKA DI TANOH RENCONG
   ========================================================================== */

import React from 'react';
import { Play, RotateCcw, LayoutGrid } from 'lucide-react';
import { GAME_MASCOTS } from '../../../data/gameRefleksiData';

function FlappyPauseOverlay({ onResume, onRestart, onBackToHub }) {
  return (
    <div className="flappy-overlay flappy-overlay--pause" role="dialog" aria-modal="true">
      <div className="flappy-modal-card flappy-modal-card--pause">
        <div className="flappy-modal__ornament-top" aria-hidden="true">
          <span>🌿</span>
          <span className="flappy-ornament-divider">❖</span>
          <span>⏸️</span>
          <span className="flappy-ornament-divider">❖</span>
          <span>🌿</span>
        </div>

        {/* Maskot Sedang Berpikir */}
        <div className="flappy-mascot-pause">
          <img
            src={GAME_MASCOTS.thinking}
            alt="Maskot Berpikir"
            className="flappy-mascot-pause__img"
          />
          <p className="flappy-mascot-pause__text">
            "Tarik napas sejenak, tenangkan pikiran sebelum kembali mengarungi angkasa."
          </p>
        </div>

        <h2 className="flappy-modal__title">Penerbangan Dijeda</h2>
        <p className="flappy-modal__desc">
          Burung Rangkong sedang bertengger. Siap melanjutkan petualangan melintasi Tanah Rencong?
        </p>

        <div className="flappy-modal__actions">
          <button
            type="button"
            className="btn-flappy-primary"
            onClick={onResume}
            autoFocus
          >
            <Play size={18} />
            <span>Lanjutkan Terbang</span>
          </button>

          <button
            type="button"
            className="btn-flappy-secondary"
            onClick={onRestart}
          >
            <RotateCcw size={18} />
            <span>Mulai Ulang</span>
          </button>

          <button
            type="button"
            className="btn-flappy-tertiary"
            onClick={onBackToHub}
          >
            <LayoutGrid size={18} />
            <span>Pilihan Game</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlappyPauseOverlay;
