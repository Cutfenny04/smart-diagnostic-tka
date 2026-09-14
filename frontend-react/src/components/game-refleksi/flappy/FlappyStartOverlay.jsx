/* ==========================================================================
   FLAPPY START OVERLAY — MELINGKA DI TANOH RENCONG
   Menampilkan layar awal game dengan maskot budaya Aceh, rekor terbaik,
   dan panduan kontrol ramah pengguna.
   ========================================================================== */

import React from 'react';
import { Play, Trophy, Sparkles, Keyboard, MousePointer } from 'lucide-react';
import { GAME_MASCOTS } from '../../../data/gameRefleksiData';

function FlappyStartOverlay({ onStart, highScore = 0 }) {
  return (
    <div className="flappy-overlay flappy-overlay--start" role="dialog" aria-modal="true">
      <div className="flappy-modal-card">
        {/* Ornamen Atas Motif Aceh */}
        <div className="flappy-modal__ornament-top" aria-hidden="true">
          <span>🕌</span>
          <span className="flappy-ornament-divider">❖</span>
          <span>🦅</span>
          <span className="flappy-ornament-divider">❖</span>
          <span>🕌</span>
        </div>

        {/* Maskot Anak Aceh Menyapa */}
        <div className="flappy-mascot-greeting">
          <img
            src={GAME_MASCOTS.welcome}
            alt="Maskot Anak Aceh"
            className="flappy-mascot-greeting__img"
          />
          <div className="flappy-mascot-greeting__bubble">
            <span className="flappy-bubble__tag">Salam Hangat!</span>
            <p className="flappy-bubble__text">
              "Bantu Burung Rangkong melintasi pilar-pilar megah Serambi Mekkah. Jaga ritme kepakan sayapmu!"
            </p>
          </div>
        </div>

        <span className="flappy-modal__eyebrow">
          <Sparkles size={14} /> Ketangkasan & Refleks Budaya Aceh
        </span>

        <h2 className="flappy-modal__title">Melingka di Tanoh Rencong</h2>
        <p className="flappy-modal__desc">
          Petualangan Burung Rangkong terbang melintasi pilar arsitektur bernuansa warisan Aceh.
          Uji ketenangan, konsentrasi, dan ketepatan waktumu!
        </p>

        {/* Panduan Kontrol */}
        <div className="flappy-guide-grid">
          <div className="flappy-guide-item">
            <Keyboard size={18} className="flappy-guide-icon" />
            <div>
              <strong>Spasi / Panah Atas</strong>
              <span>Tekan untuk terbang melompat</span>
            </div>
          </div>
          <div className="flappy-guide-item">
            <MousePointer size={18} className="flappy-guide-icon" />
            <div>
              <strong>Klik Mouse / Sentuh</strong>
              <span>Ketuk di mana saja pada layar</span>
            </div>
          </div>
        </div>

        {/* Rekor Tertinggi */}
        <div className="flappy-best-badge">
          <Trophy size={16} className="flappy-best-icon" />
          <span>Rekor Tertinggi: <strong>{highScore}</strong></span>
        </div>

        <button
          type="button"
          className="btn-flappy-primary"
          onClick={onStart}
          autoFocus
        >
          <Play size={20} />
          <span>MULAI MELINGKA!</span>
        </button>
      </div>
    </div>
  );
}

export default FlappyStartOverlay;
