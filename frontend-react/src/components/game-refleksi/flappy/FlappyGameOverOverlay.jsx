/* ==========================================================================
   FLAPPY GAME OVER OVERLAY — MELINGKA DI TANOH RENCONG
   Menampilkan skor akhir, rekor tertinggi, reaksi maskot, dan kata motivasi Aceh.
   ========================================================================== */

import React from 'react';
import { RotateCcw, LayoutGrid, Trophy, Star, Sparkles } from 'lucide-react';
import { GAME_MASCOTS } from '../../../data/gameRefleksiData';

function FlappyGameOverOverlay({ score = 0, highScore = 0, isNewHighScore = false, onRestart, onBackToHub }) {
  // Tentukan reaksi maskot dan teks motivasi sesuai capaian skor
  let mascotImg = GAME_MASCOTS.disappointed;
  let quoteTitle = 'Bek putoh asa!';
  let quoteDesc = 'Setiap kepakan sayap adalah proses belajar. Ayo coba lagi dan raih pilar yang lebih jauh!';

  if (isNewHighScore && score > 0) {
    mascotImg = GAME_MASCOTS.happy;
    quoteTitle = 'Hana Pat Lawan! Rekor Baru!';
    quoteDesc = 'Hebat sekali! Kamu berhasil memecahkan rekor penerbangan tertinggi di Tanah Rencong!';
  } else if (score >= 10) {
    mascotImg = GAME_MASCOTS.happy;
    quoteTitle = 'Brat that jago!';
    quoteDesc = 'Ketangkasan dan fokusmu luar biasa menembus pilar-pilar arsitektur Aceh!';
  } else if (score >= 3) {
    mascotImg = GAME_MASCOTS.welcome;
    quoteTitle = 'Gèt that!';
    quoteDesc = 'Irama terbangmu semakin mantap. Sedikit lagi konsentrasi, skor tinggi pasti tercapai!';
  }

  return (
    <div className="flappy-overlay flappy-overlay--gameover" role="dialog" aria-modal="true">
      <div className="flappy-modal-card flappy-modal-card--gameover">
        <div className="flappy-modal__ornament-top" aria-hidden="true">
          <span>✨</span>
          <span className="flappy-ornament-divider">❖</span>
          <span>{isNewHighScore ? '🏆' : '🏁'}</span>
          <span className="flappy-ornament-divider">❖</span>
          <span>✨</span>
        </div>

        {/* Badge Status */}
        <div className={`flappy-gameover-badge ${isNewHighScore ? 'flappy-gameover-badge--gold' : ''}`}>
          {isNewHighScore ? (
            <>
              <Sparkles size={14} /> REKOR BARU TERCIPTA!
            </>
          ) : (
            'PENERBANGAN SELESAI'
          )}
        </div>

        {/* Maskot Reaktif */}
        <div className="flappy-gameover-mascot">
          <img
            src={mascotImg}
            alt="Maskot Reaksi"
            className={`flappy-gameover-mascot__img ${isNewHighScore ? 'flappy-mascot--bounce' : ''}`}
          />
          <div className="flappy-gameover-mascot__quote">
            <h3 className="flappy-quote__title">{quoteTitle}</h3>
            <p className="flappy-quote__text">{quoteDesc}</p>
          </div>
        </div>

        {/* Kotak Hasil Skor */}
        <div className="flappy-result-box">
          <div className="flappy-result-row">
            <span className="flappy-result-label">
              <Star size={16} /> Skor Sesi Ini:
            </span>
            <span className="flappy-result-val">{score}</span>
          </div>
          <div className="flappy-result-row flappy-result-row--highlight">
            <span className="flappy-result-label">
              <Trophy size={16} /> Rekor Tertinggi:
            </span>
            <span className="flappy-result-val flappy-result-val--gold">{highScore}</span>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="flappy-modal__actions">
          <button
            type="button"
            className="btn-flappy-primary"
            onClick={onRestart}
            autoFocus
          >
            <RotateCcw size={18} />
            <span>Terbang Lagi</span>
          </button>

          <button
            type="button"
            className="btn-flappy-secondary"
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

export default FlappyGameOverOverlay;
