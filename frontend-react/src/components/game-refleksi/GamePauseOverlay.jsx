/* ==========================================================================
   GAME PAUSE OVERLAY
   ========================================================================== */

import React from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';

function GamePauseOverlay({ onResume, onRestart, onExit }) {
  return (
    <div className="zuma-overlay zuma-overlay--pause" role="dialog" aria-modal="true">
      <div className="zuma-modal-card zuma-modal-card--pause">
        <div className="zuma-modal__ornament-top" aria-hidden="true">
          <span>🌿</span>
          <span className="ornament-divider">❖</span>
          <span>🌿</span>
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

          <button
            type="button"
            className="btn-zuma-tertiary"
            onClick={onExit}
          >
            <Home size={18} />
            <span>Keluar ke Halaman Utama</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GamePauseOverlay;
