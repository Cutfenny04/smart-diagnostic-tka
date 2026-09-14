/* ==========================================================================
   FLAPPY BIRD ENGINE — MELINGKA DI TANOH RENCONG
   Tema: Petualangan Burung Rangkong di Tanah Rencong
   Engine React terisolasi dalam kontainer viewport, mendukung audio Web Audio/HTML5,
   deteksi tabrakan presisi, dan integrasi maskot budaya Aceh.
   ========================================================================== */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Pause, Star, Trophy, ArrowLeft } from 'lucide-react';
import FlappyStartOverlay from './FlappyStartOverlay';
import FlappyPauseOverlay from './FlappyPauseOverlay';
import FlappyGameOverOverlay from './FlappyGameOverOverlay';
import './FlappyBirdGame.css';

const SOUND_PATHS = {
  flap: '/assets/flappy-bird/sounds/terbang.mp3',
  flapWav: '/assets/flappy-bird/sounds/terbang.wav',
  point: '/assets/flappy-bird/sounds/point.mp3',
  die: '/assets/flappy-bird/sounds/die.mp3',
};

const BIRD_SPRITES = {
  normal: '/assets/flappy-bird/images/burung.png',
  flap: '/assets/flappy-bird/images/burung2.png',
};

function FlappyBirdGame({ onBackToHub }) {
  const viewportRef = useRef(null);
  const pipesContainerRef = useRef(null);
  const birdWrapperRef = useRef(null);
  const birdImgRef = useRef(null);
  const backgroundRef = useRef(null);

  // States
  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'paused' | 'gameover'
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('flappy_aceh_high_score') || '0', 10);
  });
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('flappy_aceh_muted') === 'true';
  });

  // Game Engine Mutable Refs
  const engineRef = useRef({
    birdY: 200,
    birdVelocity: 0,
    birdRotation: 0,
    bgX: 0,
    frameCount: 0,
    pipes: [],
    loopId: null,
    flapTimeout: null,
    lastGameOverTime: 0,
    audioCtx: null,
    sounds: {},
  });

  // Init Audio Elements
  useEffect(() => {
    const sndFlap = new Audio(SOUND_PATHS.flap);
    sndFlap.preload = 'auto';
    const sndFlapWav = new Audio(SOUND_PATHS.flapWav);
    sndFlapWav.preload = 'auto';
    const sndPoint = new Audio(SOUND_PATHS.point);
    sndPoint.preload = 'auto';
    const sndDie = new Audio(SOUND_PATHS.die);
    sndDie.preload = 'auto';

    engineRef.current.sounds = {
      flap: sndFlap,
      flapWav: sndFlapWav,
      point: sndPoint,
      die: sndDie,
    };

    return () => {
      // Cleanup sounds
      Object.values(engineRef.current.sounds).forEach((s) => {
        try {
          s.pause();
          s.src = '';
        } catch {
          // Ignore cleanup errors
        }
      });
    };
  }, []);

  // Web Audio Context unlocker
  const unlockAudio = useCallback(() => {
    try {
      if (!engineRef.current.audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          engineRef.current.audioCtx = new AudioCtx();
        }
      }
      if (engineRef.current.audioCtx && engineRef.current.audioCtx.state === 'suspended') {
        engineRef.current.audioCtx.resume();
      }
    } catch {
      // Ignore
    }
  }, []);

  const playSound = useCallback((type, currentScoreVal = 1) => {
    if (isMuted) return;
    const { sounds, audioCtx } = engineRef.current;

    if (type === 'flap') {
      try {
        if (sounds.flap) {
          const clone = sounds.flap.cloneNode();
          clone.volume = 0.85;
          clone.play().catch(() => {
            if (sounds.flapWav) {
              const cloneWav = sounds.flapWav.cloneNode();
              cloneWav.volume = 0.85;
              cloneWav.play().catch(() => {});
            }
          });
        }
      } catch {
        // Fallback
      }
    } else if (type === 'point') {
      try {
        if (sounds.point) {
          const clone = sounds.point.cloneNode();
          clone.volume = 0.95;
          clone.play().catch(() => {});
        }
      } catch {
        // Fallback
      }
      // Synth harmonic shimmer
      try {
        if (audioCtx && audioCtx.state === 'running') {
          const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
          const baseFreq = notes[(currentScoreVal - 1) % notes.length];
          const now = audioCtx.currentTime;
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(baseFreq * 1.5, now);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.18, now + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
        }
      } catch {
        // Fallback
      }
    } else if (type === 'die') {
      try {
        if (sounds.die) {
          sounds.die.currentTime = 0;
          sounds.die.volume = 0.9;
          sounds.die.play().catch(() => {});
        }
      } catch {
        // Fallback
      }
    }
  }, [isMuted]);

  // Toggle Sound
  const toggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      localStorage.setItem('flappy_aceh_muted', String(next));
      return next;
    });
  };

  // Wing Flap animation
  const triggerWingFlap = () => {
    if (birdImgRef.current) {
      birdImgRef.current.src = BIRD_SPRITES.flap;
    }
    if (engineRef.current.flapTimeout) {
      clearTimeout(engineRef.current.flapTimeout);
    }
    engineRef.current.flapTimeout = setTimeout(() => {
      if (birdImgRef.current) {
        birdImgRef.current.src = BIRD_SPRITES.normal;
      }
    }, 150);
  };

  // Flap jump action
  const flap = useCallback(() => {
    engineRef.current.birdVelocity = -7.4;
    engineRef.current.birdRotation = -24;
    triggerWingFlap();
    playSound('flap');
  }, [playSound]);

  // Show floating score popup inside viewport
  const showScorePopup = (birdX, birdY) => {
    if (!viewportRef.current) return;
    const popup = document.createElement('div');
    popup.className = 'flappy-score-popup';
    popup.textContent = '+1';
    popup.style.left = `${birdX + 70}px`;
    popup.style.top = `${birdY - 15}px`;
    viewportRef.current.appendChild(popup);

    setTimeout(() => {
      if (popup.parentNode) popup.remove();
    }, 650);
  };

  // Clear all pipes
  const clearPipes = () => {
    const { pipes } = engineRef.current;
    pipes.forEach((p) => {
      if (p.topEl && p.topEl.parentNode) p.topEl.remove();
      if (p.bottomEl && p.bottomEl.parentNode) p.bottomEl.remove();
    });
    engineRef.current.pipes = [];
  };

  // Spawn pipe pair scoped inside pipesContainerRef
  const spawnPipePair = (vWidth, vHeight) => {
    if (!pipesContainerRef.current) return;

    const minTop = Math.floor(vHeight * 0.12);
    const maxTop = Math.floor(vHeight * 0.44);
    const topPipeHeight = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
    const gapHeight = Math.floor(vHeight * 0.38); // 38% of container height for fair passage
    const bottomPipeTop = topPipeHeight + gapHeight;
    const bottomPipeHeight = vHeight - bottomPipeTop;
    const startX = vWidth + 10;
    const pipeWidth = 84;

    const topPipe = document.createElement('div');
    topPipe.className = 'flappy-pipe flappy-pipe--top';
    topPipe.style.left = `${startX}px`;
    topPipe.style.top = '0px';
    topPipe.style.height = `${topPipeHeight}px`;
    topPipe.style.width = `${pipeWidth}px`;
    pipesContainerRef.current.appendChild(topPipe);

    const bottomPipe = document.createElement('div');
    bottomPipe.className = 'flappy-pipe flappy-pipe--bottom';
    bottomPipe.style.left = `${startX}px`;
    bottomPipe.style.top = `${bottomPipeTop}px`;
    bottomPipe.style.height = `${bottomPipeHeight}px`;
    bottomPipe.style.width = `${pipeWidth}px`;
    pipesContainerRef.current.appendChild(bottomPipe);

    engineRef.current.pipes.push({
      x: startX,
      width: pipeWidth,
      topHeight: topPipeHeight,
      bottomTop: bottomPipeTop,
      topEl: topPipe,
      bottomEl: bottomPipe,
      scored: false,
    });
  };

  // Trigger Game Over
  const handleGameOver = useCallback((finalScore) => {
    setGameState('gameover');
    engineRef.current.lastGameOverTime = Date.now();
    if (engineRef.current.loopId) {
      cancelAnimationFrame(engineRef.current.loopId);
      engineRef.current.loopId = null;
    }

    playSound('die');

    if (finalScore > highScore) {
      setHighScore(finalScore);
      setIsNewHighScore(true);
      localStorage.setItem('flappy_aceh_high_score', String(finalScore));
    } else {
      setIsNewHighScore(false);
    }
  }, [highScore, playSound]);

  // Start / Restart Game
  const handleStartGame = useCallback(() => {
    unlockAudio();
    clearPipes();

    const vHeight = viewportRef.current ? viewportRef.current.clientHeight : 560;

    engineRef.current.birdY = Math.floor(vHeight * 0.38);
    engineRef.current.birdVelocity = -6.5;
    engineRef.current.birdRotation = -18;
    engineRef.current.frameCount = 0;

    setScore(0);
    setIsNewHighScore(false);
    setGameState('playing');

    triggerWingFlap();
    playSound('flap');
  }, [unlockAudio, playSound]);

  // Pause Game
  const handlePauseGame = useCallback(() => {
    if (gameState === 'playing') {
      if (engineRef.current.loopId) {
        cancelAnimationFrame(engineRef.current.loopId);
        engineRef.current.loopId = null;
      }
      setGameState('paused');
    }
  }, [gameState]);

  // Resume Game
  const handleResumeGame = useCallback(() => {
    if (gameState === 'paused') {
      setGameState('playing');
    }
  }, [gameState]);

  // Main Game Loop Effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    let isSubscribed = true;

    const loop = () => {
      if (!isSubscribed) return;

      const viewport = viewportRef.current;
      if (!viewport) return;

      const vWidth = viewport.clientWidth;
      const vHeight = viewport.clientHeight;

      const engine = engineRef.current;
      engine.frameCount++;

      // 1. Background Parallax Scrolling
      engine.bgX -= 1.2;
      if (engine.bgX <= -100000) engine.bgX = 0;
      if (backgroundRef.current) {
        backgroundRef.current.style.backgroundPosition = `${engine.bgX}px bottom`;
      }

      // 2. Bird Physics
      const GRAVITY = 0.38;
      engine.birdVelocity += GRAVITY;
      engine.birdY += engine.birdVelocity;

      if (engine.birdVelocity < 0) {
        engine.birdRotation = Math.max(-28, engine.birdRotation - 3.2);
      } else {
        engine.birdRotation = Math.min(75, engine.birdRotation + 3.0);
      }

      const birdWrapper = birdWrapperRef.current;
      if (birdWrapper) {
        birdWrapper.style.top = `${engine.birdY}px`;
        birdWrapper.style.transform = `rotate(${engine.birdRotation}deg)`;
      }

      // Bird Hitbox Dimensions (Local Coordinates)
      const birdX = Math.floor(vWidth * 0.18);
      const birdSize = 90; // Rendered size
      const hitboxMarginX = birdSize * 0.22;
      const hitboxMarginY = birdSize * 0.22;

      const birdHitbox = {
        left: birdX + hitboxMarginX,
        right: birdX + birdSize - hitboxMarginX,
        top: engine.birdY + hitboxMarginY,
        bottom: engine.birdY + birdSize - hitboxMarginY,
      };

      // Ceiling and Ground Collision
      const groundHeight = 16;
      if (birdHitbox.top <= 0 || birdHitbox.bottom >= vHeight - groundHeight) {
        handleGameOver(score);
        return;
      }

      // 3. Pipe Spawning
      const PIPE_INTERVAL = 112; // Frames (~1.86 seconds at 60fps)
      if (engine.frameCount % PIPE_INTERVAL === 0) {
        spawnPipePair(vWidth, vHeight);
      }

      // 4. Pipe Movement & Collision Detection
      const PIPE_SPEED = 2.9;
      let newScoreVal = score;

      for (let i = engine.pipes.length - 1; i >= 0; i--) {
        const pipe = engine.pipes[i];
        pipe.x -= PIPE_SPEED;

        pipe.topEl.style.left = `${pipe.x}px`;
        pipe.bottomEl.style.left = `${pipe.x}px`;

        const pipeHitbox = {
          left: pipe.x + 4,
          right: pipe.x + pipe.width - 4,
          topPipeBottom: pipe.topHeight,
          bottomPipeTop: pipe.bottomTop,
        };

        // Check Top Pipe Collision
        if (
          birdHitbox.right > pipeHitbox.left &&
          birdHitbox.left < pipeHitbox.right &&
          birdHitbox.top < pipeHitbox.topPipeBottom
        ) {
          handleGameOver(score);
          return;
        }

        // Check Bottom Pipe Collision
        if (
          birdHitbox.right > pipeHitbox.left &&
          birdHitbox.left < pipeHitbox.right &&
          birdHitbox.bottom > pipeHitbox.bottomPipeTop
        ) {
          handleGameOver(score);
          return;
        }

        // Check Scoring Trigger
        const pipeCenter = pipe.x + pipe.width / 2;
        const birdCenter = (birdHitbox.left + birdHitbox.right) / 2;

        if (!pipe.scored && pipeCenter <= birdCenter) {
          pipe.scored = true;
          newScoreVal++;
          setScore((s) => {
            const next = s + 1;
            playSound('point', next);
            showScorePopup(birdX, engine.birdY);
            return next;
          });
        }

        // Remove Offscreen Pipes
        if (pipe.x < -100) {
          pipe.topEl.remove();
          pipe.bottomEl.remove();
          engine.pipes.splice(i, 1);
        }
      }

      engine.loopId = requestAnimationFrame(loop);
    };

    engineRef.current.loopId = requestAnimationFrame(loop);

    return () => {
      isSubscribed = false;
      if (engineRef.current.loopId) {
        cancelAnimationFrame(engineRef.current.loopId);
        engineRef.current.loopId = null;
      }
    };
  }, [gameState, score, handleGameOver, playSound]);

  // Idle Bird Float Animation on Start Screen
  useEffect(() => {
    if (gameState !== 'start') return;

    let idleAngle = 0;
    let idleLoopId = null;

    const idle = () => {
      const viewport = viewportRef.current;
      const vHeight = viewport ? viewport.clientHeight : 560;

      // Gentle background drift
      engineRef.current.bgX -= 0.35;
      if (engineRef.current.bgX <= -100000) engineRef.current.bgX = 0;
      if (backgroundRef.current) {
        backgroundRef.current.style.backgroundPosition = `${engineRef.current.bgX}px bottom`;
      }

      idleAngle += 0.045;
      const offsetY = Math.sin(idleAngle) * 8;
      const baseY = vHeight * 0.38;
      engineRef.current.birdY = baseY + offsetY;
      engineRef.current.birdRotation = Math.sin(idleAngle) * 5;

      if (birdWrapperRef.current) {
        birdWrapperRef.current.style.top = `${engineRef.current.birdY}px`;
        birdWrapperRef.current.style.transform = `rotate(${engineRef.current.birdRotation}deg)`;
      }

      idleLoopId = requestAnimationFrame(idle);
    };

    idleLoopId = requestAnimationFrame(idle);

    return () => {
      if (idleLoopId) cancelAnimationFrame(idleLoopId);
    };
  }, [gameState]);

  // Universal Input Handler
  const handleInteraction = useCallback((e) => {
    unlockAudio();

    if (e.type === 'keydown') {
      if ([' ', 'ArrowUp', 'KeyW'].includes(e.code) || [' ', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        if (gameState === 'start') {
          handleStartGame();
        } else if (gameState === 'playing') {
          flap();
        } else if (gameState === 'gameover') {
          if (Date.now() - engineRef.current.lastGameOverTime > 400) {
            handleStartGame();
          }
        }
      } else if (e.code === 'Escape' || e.key === 'Escape') {
        if (gameState === 'playing') {
          handlePauseGame();
        } else if (gameState === 'paused') {
          handleResumeGame();
        }
      }
      return;
    }

    // Pointer / Touch
    if (e.target.closest('button') || e.target.closest('.flappy-overlay') || e.target.closest('.flappy-hud')) {
      return;
    }

    if (gameState === 'start') {
      handleStartGame();
    } else if (gameState === 'playing') {
      flap();
    } else if (gameState === 'gameover') {
      if (Date.now() - engineRef.current.lastGameOverTime > 400) {
        handleStartGame();
      }
    }
  }, [gameState, handleStartGame, flap, handlePauseGame, handleResumeGame, unlockAudio]);

  // Keyboard Global Event Listener
  useEffect(() => {
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [handleInteraction]);

  // Cleanup on Unmount
  useEffect(() => {
    return () => {
      clearPipes();
      if (engineRef.current.loopId) {
        cancelAnimationFrame(engineRef.current.loopId);
      }
    };
  }, []);

  return (
    <div className="flappy-game-container">
      {/* HUD Header Flappy Aceh */}
      <header className="flappy-hud" aria-label="Status Permainan Flappy">
        <div className="flappy-hud__left">
          <button
            type="button"
            className="flappy-hud__btn-back"
            onClick={onBackToHub}
            title="Kembali ke Pilihan Game"
          >
            <ArrowLeft size={16} />
            <span className="btn-text-desktop">Pilihan Game</span>
          </button>

          <div className="flappy-hud__title-wrap">
            <h1 className="flappy-hud__title">MELINGKA DI TANOH RENCONG</h1>
            <span className="flappy-hud__subtitle">Petualangan Burung Rangkong</span>
          </div>
        </div>

        <div className="flappy-hud__right">
          {/* Skor Sekarang */}
          <div className="flappy-hud__badge flappy-hud__badge--score" title="Skor Sesi Ini">
            <Star size={16} className="flappy-hud__icon-gold" />
            <span className="flappy-hud__badge-label">Skor</span>
            <span className="flappy-hud__badge-val">{score}</span>
          </div>

          {/* Rekor Tertinggi */}
          <div className="flappy-hud__badge flappy-hud__badge--high" title="Rekor Tertinggi Kamu">
            <Trophy size={16} className="flappy-hud__icon-gold" />
            <span className="flappy-hud__badge-label">Rekor</span>
            <span className="flappy-hud__badge-val">{highScore}</span>
          </div>

          {/* Tombol Suara */}
          <button
            type="button"
            className="flappy-hud__btn-icon"
            onClick={toggleMute}
            aria-label={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Tombol Jeda */}
          {gameState === 'playing' && (
            <button
              type="button"
              className="flappy-hud__btn-pause"
              onClick={handlePauseGame}
              aria-label="Jeda permainan"
              title="Jeda (Esc)"
            >
              <Pause size={16} />
              <span className="btn-text-desktop">Jeda</span>
            </button>
          )}
        </div>
      </header>

      {/* Viewport Kontainer Game */}
      <div
        ref={viewportRef}
        className="flappy-viewport"
        tabIndex={0}
        onPointerDown={handleInteraction}
      >
        {/* Layer Latar Belakang Parallax */}
        <div ref={backgroundRef} className="flappy-background" />

        {/* Kontainer Rintangan Pilar */}
        <div ref={pipesContainerRef} className="flappy-pipes-container" />

        {/* Burung Rangkong Player */}
        <div ref={birdWrapperRef} className="flappy-bird-wrapper">
          <img
            ref={birdImgRef}
            src={BIRD_SPRITES.normal}
            alt="Burung Rangkong"
            className="flappy-bird-img"
            draggable="false"
          />
        </div>

        {/* Lantai / Ground Ornamen */}
        <div className="flappy-ground-layer" />

        {/* Petunjuk Klik / Sentuh Ringan saat Bermain */}
        {gameState === 'playing' && score === 0 && (
          <div className="flappy-hint-overlay" aria-hidden="true">
            <span className="flappy-hint-pulse">👆 Ketuk / Spasi untuk terbang</span>
          </div>
        )}

        {/* Overlays Sesuai Game State */}
        {gameState === 'start' && (
          <FlappyStartOverlay onStart={handleStartGame} highScore={highScore} />
        )}

        {gameState === 'paused' && (
          <FlappyPauseOverlay
            onResume={handleResumeGame}
            onRestart={handleStartGame}
            onBackToHub={onBackToHub}
          />
        )}

        {gameState === 'gameover' && (
          <FlappyGameOverOverlay
            score={score}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            onRestart={handleStartGame}
            onBackToHub={onBackToHub}
          />
        )}
      </div>
    </div>
  );
}

export default FlappyBirdGame;
