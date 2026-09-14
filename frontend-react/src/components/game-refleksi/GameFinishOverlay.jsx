/* ==========================================================================
   GAME FINISH OVERLAY
   Menampilkan skor arcade hasil permainan (lokal untuk sesi ini) dan
   apresiasi penyelesaian perjalanan jelajah Aceh.
   ========================================================================== */

import React from 'react';
import { Trophy, Star, RotateCcw, LayoutGrid, Home } from 'lucide-react';
import { GAME_MASCOTS } from '../../data/gameRefleksiData';

function GameFinishOverlay({ score, onRestart, onBackToHub, onExit }) {
  return (
    <div className="zuma-overlay zuma-overlay--finish" role="dialog" aria-modal="true">
      <div className="zuma-modal-card zuma-modal-card--finish">
        <div className="zuma-modal__ornament-top" aria-hidden="true">
          <span>🎉</span>
          <span className="ornament-divider">❖</span>
          <span>🏆</span>
          <span className="ornament-divider">❖</span>
          <span>🎉</span>
        </div>

        {/* Maskot Gembira Selebrasi */}
        <div className="zuma-mascot-greeting">
          <img
            src={GAME_MASCOTS.happy}
            alt="Maskot Gembira"
            className="zuma-mascot-greeting__img"
          />
          <div className="zuma-mascot-greeting__bubble">
            <span className="zuma-bubble__tag">Apresiasi Luhur</span>
            <p className="zuma-bubble__text">
              "Luar biasa! Kamu menyelesaikan ekspedisi Takat Kelereng dengan penuh ketekunan!"
            </p>
          </div>
        </div>

        <span className="zuma-modal__eyebrow">
          <Trophy size={16} /> Ekspedisi Takat Kelereng Berhasil
        </span>

        <h2 className="zuma-modal__title">Perjalanan Selesai!</h2>

        <div className="zuma-finish__score-box">
          <span className="zuma-finish__score-label">Skor Jelajah</span>
          <div className="zuma-finish__score-val">
            <Star className="zuma-finish__star-icon" size={28} />
            <span>{score || 0}</span>
          </div>
        </div>

        <p className="zuma-modal__desc">
          Kamu telah berhasil menyelesaikan perjalanan Takat Kelereng Budaya Aceh.
          Semoga refleksi dan nilai-nilai kearifan yang ditemui membawa inspirasi
          serta semangat dalam pembelajaran sehari-hari.
        </p>

        <div className="zuma-modal__actions">
          <button
            type="button"
            className="btn-zuma-primary"
            onClick={onRestart}
            autoFocus
          >
            <RotateCcw size={18} />
            <span>Main Lagi</span>
          </button>

          {onBackToHub && (
            <button
              type="button"
              className="btn-zuma-secondary"
              onClick={onBackToHub}
            >
              <LayoutGrid size={18} />
              <span>Pilihan Game</span>
            </button>
          )}

          <button
            type="button"
            className="btn-zuma-secondary"
            onClick={onExit}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameFinishOverlay;
