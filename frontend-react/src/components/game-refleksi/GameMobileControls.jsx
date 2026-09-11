/* ==========================================================================
   GAME MOBILE CONTROLS
   Mengadaptasi kontrol sentuh mobile dari game Zuma asli dengan penanganan
   touch event React yang aman (mencegah default scroll).
   ========================================================================== */

import React, { useRef } from 'react';
import { Pause, RefreshCw, Crosshair } from 'lucide-react';

function GameMobileControls({ onShoot, onSwitch, onPause, onAimVector }) {
  const movePadRef = useRef(null);

  function handleTouchAim(e) {
    if (!movePadRef.current || !onAimVector) return;
    const touch = e.touches[0];
    if (!touch) return;
    const rect = movePadRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    onAimVector(touch.clientX - centerX, touch.clientY - centerY);
  }

  return (
    <div className="zuma-mobile-controls" aria-label="Kontrol Layar Sentuh">
      {/* Tombol Pause di pojok atas */}
      <button
        type="button"
        className="zuma-mobile-btn zuma-mobile-btn--pause"
        onClick={onPause}
        aria-label="Jeda permainan"
      >
        <Pause size={20} />
      </button>

      {/* Kontrol aksi sebelah kiri: Switch & Shoot */}
      <div className="zuma-mobile-actions-left">
        <button
          type="button"
          className="zuma-mobile-btn zuma-mobile-btn--switch"
          onClick={onSwitch}
          aria-label="Tukar warna kelereng"
        >
          <RefreshCw size={22} />
          <span className="btn-mobile-sub">Tukar</span>
        </button>

        <button
          type="button"
          className="zuma-mobile-btn zuma-mobile-btn--shoot"
          onClick={onShoot}
          aria-label="Tembak kelereng"
        >
          <Crosshair size={24} />
          <span className="btn-mobile-sub">Tembak</span>
        </button>
      </div>

      {/* Kontrol bidik sebelah kanan: Touch-to-Aim Pad */}
      <div className="zuma-mobile-actions-right">
        <div
          ref={movePadRef}
          className="zuma-mobile-aimpad"
          onTouchStart={handleTouchAim}
          onTouchMove={handleTouchAim}
          aria-label="Area putar bidikan"
        >
          <span className="aimpad-cross">⊕</span>
          <span className="aimpad-hint">Sentuh / Geser Bidik</span>
        </div>
      </div>
    </div>
  );
}

export default GameMobileControls;
