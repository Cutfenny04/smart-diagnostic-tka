/* ==========================================================================
   GAME REFLECTION OVERLAY — CHECKPOINT REFLEKSI BUDAYA ACEH
   Bukan kuis akademik / tanpa benar-salah. Murni perenungan nilai budaya.
   ========================================================================== */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { GAME_MASCOTS } from '../../data/gameRefleksiData';

function GameReflectionOverlay({ pointData, onContinue }) {
  const [selectedOptionId, setSelectedOptionId] = useState(null);

  if (!pointData) return null;

  return (
    <div className="zuma-overlay zuma-overlay--reflection" role="dialog" aria-modal="true">
      <div className="zuma-modal-card zuma-modal-card--reflection">
        <div className="zuma-modal__ornament-top" aria-hidden="true">
          <span>✨</span>
          <span className="ornament-divider">❖</span>
          <span>🏛️</span>
          <span className="ornament-divider">❖</span>
          <span>✨</span>
        </div>

        {/* Maskot Refleksi */}
        <div className="zuma-mascot-greeting">
          <img
            src={GAME_MASCOTS.thinking}
            alt="Maskot Refleksi"
            className="zuma-mascot-greeting__img"
          />
          <div className="zuma-mascot-greeting__bubble">
            <span className="zuma-bubble__tag">Ruang Perenungan</span>
            <p className="zuma-bubble__text">
              "Mari hayati nilai luhur di balik setiap jejak kearifan budaya tanah rencong."
            </p>
          </div>
        </div>

        <span className="zuma-modal__eyebrow">
          {pointData.checkpointLabel || 'Titik Refleksi Budaya'}
        </span>

        <h2 className="zuma-modal__title">{pointData.title}</h2>

        {pointData.context && (
          <p className="zuma-reflection__context">{pointData.context}</p>
        )}

        <p className="zuma-reflection__question">{pointData.question}</p>

        <div className="zuma-reflection__options">
          {pointData.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                className={`zuma-reflection__option-card ${
                  isSelected ? 'is-selected' : ''
                }`}
                onClick={() => setSelectedOptionId(opt.id)}
              >
                <span className="zuma-reflection__radio">
                  {isSelected ? <CheckCircle size={18} /> : <span className="radio-circle" />}
                </span>
                <span className="zuma-reflection__option-label">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {selectedOptionId && (
          <div className="zuma-reflection__feedback animate-fade-in">
            <p>{pointData.appreciation || 'Terima kasih atas refleksinya!'}</p>
          </div>
        )}

        <div className="zuma-modal__actions">
          <button
            type="button"
            className="btn-zuma-primary"
            disabled={!selectedOptionId}
            onClick={() => onContinue(selectedOptionId)}
          >
            <span>Lanjutkan Perjalanan</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameReflectionOverlay;
