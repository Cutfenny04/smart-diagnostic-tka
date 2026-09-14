/* ==========================================================================
   GAME PAUSE OVERLAY
   ========================================================================== */

import React from 'react';
import { Play, RotateCcw, LayoutGrid, Home } from 'lucide-react';
import { GAME_MASCOTS } from '../../data/gameRefleksiData';

function GamePauseOverlay({ onResume, onRestart, onBackToHub, onExit }) {
  return (
    <div className="zuma-overlay zuma-overlay--pause" role="dialog" aria-modal="true">
      <div className="zuma-modal-card zuma-modal-card--pause">
        <div className="zuma-modal__ornament-top" aria-hidden="true">
          <span>🌿</span>
          <span className="ornament-divider">❖</span>
          <span>⏸️</span>
          <span className="ornament-divider">❖</span>
          <span>🌿</span>
        </div>

        {/* Maskot Berpikir */}
        <div className="zuma-mascot-greeting">
          <img
            src={GAME_MASCOTS.thinking}
            alt="Maskot Berpikir"
            className="zuma-mascot-greeting__img"
          />
          <div className="zuma-mascot-greeting__bubble">
            <span className="zuma-bubble__tag">Refleksi Sejenak</span>
            <p className="zuma-bubble__text">
              "Tarik napas sejenak, amati susunan permata sebelum kembali menembak!"
            </p>
          </div>
        </div>

        <h2 className="zuma-modal__title">Jeda Perjalanan</h2>
        <p className="zuma-modal__desc">
          Permainan sedang dihentikan sementara. Silakan pilih aksi untuk melanjutkan:
        </p>

        <div className="zuma-modal__actions-stacked">
          <button
            type="button"
            className="btn-zuma-primary"
            onClick={onResume}
            autoFocus
          >
            <Play size={18} />
            <span>Lanjut Bermain</span>
          </button>

          <button
            type="button"
            className="btn-zuma-secondary"
            onClick={onRestart}
          >
            <RotateCcw size={18} />
            <span>Mulai Ulang</span>
          </button>

          {onBackToHub && (
            <button
              type="button"
              className="btn-zuma-secondary"
              onClick={onBackToHub}
            >
              <LayoutGrid size={18} />
              <span>Kembali ke Pilihan Game</span>
            </button>
          )}

          <button
            type="button"
            className="btn-zuma-tertiary"
            onClick={onExit}
          >
            <Home size={18} />
            <span>Keluar ke Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GamePauseOverlay;
