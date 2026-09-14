/* ==========================================================================
   GAME SELECTION HUB — FITUR GAME REFLEKSI BUDAYA ACEH
   Pintu gerbang interaktif untuk memilih antara:
   1. Takat Kelereng (Zuma Heritage Engine)
   2. Melingka di Tanoh Rencong (Flappy Rangkong Engine)
   Dilengkapi maskot anak Aceh interaktif dengan balon dialog budaya.
   ========================================================================== */

import React, { useState } from 'react';
import { Sparkles, Trophy, Compass, ArrowRight, Lightbulb, Play, Star } from 'lucide-react';
import { GAME_MASCOTS, GAMES_INFO } from '../../data/gameRefleksiData';
import './GameSelectionHub.css';

const MASCOT_TRIVIA = [
  'Saleum Teuka rakan guru! Mari segarkan pikiran dengan permainan refleksi budaya Aceh. Mau menembak kelereng permata atau terbang bersama Burung Rangkong?',
  'Tahukah kamu? Burung Rangkong adalah lambang ketangguhan, kesetiaan, dan penjaga ekosistem alam rimba Aceh yang lestari!',
  'Permainan Takat Kelereng melatih fokus dan strategi, selaras dengan filosofi ketelitian arsitektur Rumoh Aceh tahan bencana!',
  'Dalam falsafah budaya Aceh, bermain adalah sarana mengasah kesabaran, meuradab (kesopanan), dan semangat pantang menyerah!',
];

function GameSelectionHub({ onSelectGame }) {
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [hoveredGame, setHoveredGame] = useState(null);

  // Ambil rekor tertinggi flappy jika ada
  const flappyHighScore = parseInt(localStorage.getItem('flappy_aceh_high_score') || '0', 10);

  const handleNextTrivia = () => {
    setTriviaIndex((prev) => (prev + 1) % MASCOT_TRIVIA.length);
  };

  return (
    <div className="game-hub">
      {/* Banner Utama */}
      <section className="game-hub__hero">
        <div className="game-hub__hero-content">
          <div className="game-hub__eyebrow">
            <Sparkles size={15} />
            <span>WAHANA EDUTAINMENT BUDAYA ACEH</span>
          </div>
          <h1 className="game-hub__title">Game Refleksi Budaya Aceh</h1>
          <p className="game-hub__subtitle">
            Segarkan pikiran, asah ketangkasan, dan hayati nilai kearifan lokal Serambi Mekkah
            melalui dua pilihan permainan edukatif interaktif.
          </p>
        </div>

        {/* Maskot Budaya Aceh Interaktif */}
        <aside className="game-hub__mascot-card" onClick={handleNextTrivia} title="Klik untuk tips & fakta budaya!">
          <div className="game-hub__mascot-figure">
            <img
              src={
                hoveredGame === 'flappy'
                  ? GAME_MASCOTS.happy
                  : hoveredGame === 'zuma'
                  ? GAME_MASCOTS.thinking
                  : GAME_MASCOTS.welcome
              }
              alt="Maskot Edukasi Aceh"
              className="game-hub__mascot-img"
            />
            <span className="game-hub__mascot-badge">
              <Sparkles size={12} /> Pemandu Refleksi
            </span>
          </div>

          <div className="game-hub__mascot-bubble">
            <div className="game-hub__bubble-header">
              <span className="game-hub__bubble-name">Agam (Maskot Aceh)</span>
              <span className="game-hub__bubble-hint">
                <Lightbulb size={12} /> Klik untuk fakta budaya
              </span>
            </div>
            <p className="game-hub__bubble-text">"{MASCOT_TRIVIA[triviaIndex]}"</p>
          </div>
        </aside>
      </section>

      {/* Grid 2 Pilihan Game */}
      <section className="game-hub__grid" aria-label="Pilihan Permainan Refleksi">
        {/* KARTU 1: TAKAT KELERENG */}
        <article
          className={`game-card game-card--zuma ${hoveredGame === 'zuma' ? 'is-hovered' : ''}`}
          onMouseEnter={() => setHoveredGame('zuma')}
          onMouseLeave={() => setHoveredGame(null)}
        >
          <div className="game-card__media">
            <img
              src="/assets/assets bank soal non tka/rumoh-aceh-ilustrasi.png"
              alt="Ilustrasi Rumoh Aceh dan Kelereng Permata"
              className="game-card__img"
            />
            <div className="game-card__media-overlay" />
            <div className="game-card__media-badge game-card__media-badge--moss">
              <Compass size={14} /> Strategi & Refleksi
            </div>
            <div className="game-card__media-icon" aria-hidden="true"></div>
          </div>

          <div className="game-card__body">
            <div className="game-card__header">
              <h2 className="game-card__title">Takat Kelereng</h2>
              <span className="game-card__subtitle">
                Permainan Refleksi Kelereng Permata Warisan Rencong
              </span>
            </div>

            <p className="game-card__desc">
              Tembak dan cocokkan deretan kelereng permata sebelum mencapai gerbang akhir.
              Temukan titik singgah refleksi nilai arsitektur Rumoh Aceh dan kearifan tradisi leluhur.
            </p>

            <ul className="game-card__tags" aria-label="Karakteristik Game">
              <li className="game-tag">
                <span>Puzzle Menembak 3D</span>
              </li>
              <li className="game-tag">
                <span>2 Titik Refleksi Nilai</span>
              </li>
              <li className="game-tag">
                <span>Skor & Konsentrasi</span>
              </li>
            </ul>

            <button
              type="button"
              className="game-card__btn game-card__btn--zuma"
              onClick={() => onSelectGame('zuma')}
            >
              <span>Mainkan Takat Kelereng</span>
              <ArrowRight size={18} className="game-card__btn-arrow" />
            </button>
          </div>
        </article>

        {/* KARTU 2: MELINGKA DI TANOH RENCONG */}
        <article
          className={`game-card game-card--flappy ${hoveredGame === 'flappy' ? 'is-hovered' : ''}`}
          onMouseEnter={() => setHoveredGame('flappy')}
          onMouseLeave={() => setHoveredGame(null)}
        >
          <div className="game-card__media game-card__media--flappy">
            <img
              src="/assets/flappy-bird/images/background.jpg"
              alt="Latar Masjid Baiturrahman"
              className="game-card__img game-card__img--bg"
            />
            <div className="game-card__media-overlay" />
            <img
              src="/assets/flappy-bird/images/burung.png"
              alt="Burung Rangkong Aceh"
              className="game-card__bird-preview"
            />
            <div className="game-card__media-badge game-card__media-badge--gold">
              <Sparkles size={14} /> Ketangkasan & Refleks
            </div>
            {flappyHighScore > 0 && (
              <div className="game-card__high-badge" title="Rekor Tertinggi">
                <Trophy size={13} /> {flappyHighScore} Poin
              </div>
            )}
            <div className="game-card__media-icon" aria-hidden="true"></div>
          </div>

          <div className="game-card__body">
            <div className="game-card__header">
              <h2 className="game-card__title">Melingka di Tanoh Rencong</h2>
              <span className="game-card__subtitle">
                Petualangan Burung Rangkong Menembus Pilar Megah Aceh
              </span>
            </div>

            <p className="game-card__desc">
              Bantu Burung Rangkong terbang melintasi pilar-pilar arsitektur megah bernuansa Serambi Mekkah.
              Uji ketenangan ritme, kecepatan refleks, dan capai rekor penerbangan terjauh!
            </p>

            <ul className="game-card__tags" aria-label="Karakteristik Game">
              <li className="game-tag">
                <span>Burung Rangkong Budaya</span>
              </li>
              <li className="game-tag">
                <span>Rekor Tertinggi</span>
              </li>
            </ul>

            <button
              type="button"
              className="game-card__btn game-card__btn--flappy"
              onClick={() => onSelectGame('flappy')}
            >
              <span>Mulai Melingka</span>
              <ArrowRight size={18} className="game-card__btn-arrow" />
            </button>
          </div>
        </article>
      </section>
    </div>
  );
}

export default GameSelectionHub;
