import { useCallback, useEffect, useRef, useState } from 'react';

const MUTE_KEY = 'nonTkaGame.muted';

/* Efek suara game Non-TKA (redesign 2026-08-15). Tidak ada file .mp3/.wav
   yang tersedia di project ini -- daripada menambah aset audio dari sumber
   luar (risiko lisensi, ukuran bundle), nada pendek disintesis langsung di
   browser lewat Web Audio API (osilator + gain envelope). AudioContext baru
   dibuat saat dipakai pertama kali (selalu dari dalam event klik, jadi tidak
   kena blokir autoplay browser). Preferensi mute disimpan di localStorage
   supaya tidak menyala ulang tiap kali guru buka game baru di kelas. */
export function useGameSounds() {
  const ctxRef = useRef(null);
  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch {
      /* localStorage tidak tersedia -- preferensi mute cukup untuk sesi ini saja */
    }
  }, [muted]);

  function getCtx() {
    if (!ctxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      ctxRef.current = new AudioCtx();
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
    return ctxRef.current;
  }

  const playTone = useCallback((freqs, { duration = 0.16, type = 'sine', gain = 0.09, stagger = 0.07 } = {}) => {
    if (muted) return;
    const ctx = getCtx();
    if (!ctx) return;
    freqs.forEach((freq, i) => {
      const start = ctx.currentTime + i * stagger;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(gain, start + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    });
  }, [muted]);

  const playClick = useCallback(
    () => playTone([420], { duration: 0.08, gain: 0.06 }),
    [playTone]
  );
  const playCorrect = useCallback(
    () => playTone([523.25, 659.25, 783.99], { duration: 0.22, gain: 0.08 }), // C5-E5-G5
    [playTone]
  );
  const playIncorrect = useCallback(
    () => playTone([220, 196], { duration: 0.22, type: 'triangle', gain: 0.08, stagger: 0.09 }), // A3 -> G3
    [playTone]
  );
  const playComplete = useCallback(
    () => playTone([523.25, 659.25, 783.99, 1046.5], { duration: 0.3, gain: 0.09, stagger: 0.1 }), // C5-E5-G5-C6
    [playTone]
  );

  return {
    muted,
    toggleMuted: () => setMuted((m) => !m),
    playClick,
    playCorrect,
    playIncorrect,
    playComplete,
  };
}
