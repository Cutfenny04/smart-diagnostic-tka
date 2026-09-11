/* ==========================================================================
   GAME REFLEKSI BUDAYA ACEH — REACT PAGE WRAPPER
   Menghubungkan Zuma Engine dengan siklus hidup React, overlay interaktif,
   dan sistem navigasi platform Smart Diagnostic TKA.
   ========================================================================== */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Zuma } from '../games/zuma/ZumaGame';
import { ZUMA_CONFIG } from '../games/zuma/gameConfig';
import { mobileCheck } from '../games/zuma/utils';
import { REFLECTION_POINTS } from '../data/gameRefleksiData';
import GameStartOverlay from '../components/game-refleksi/GameStartOverlay';
import GamePauseOverlay from '../components/game-refleksi/GamePauseOverlay';
import GameReflectionOverlay from '../components/game-refleksi/GameReflectionOverlay';
import GameFinishOverlay from '../components/game-refleksi/GameFinishOverlay';
import GameMobileControls from '../components/game-refleksi/GameMobileControls';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Star, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import './GameRefleksi.css';

function GameRefleksi() {
  useDocumentTitle('Game Refleksi Budaya Aceh - Smart Diagnostic TKA');
  const navigate = useNavigate();

  const containerRef = useRef(null);
  const zumaRef = useRef(null);

  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'paused' | 'reflection' | 'finished'
  const [score, setScore] = useState(0);
  const [progressRatio, setProgressRatio] = useState(0);
  const [activeReflection, setActiveReflection] = useState(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Inisialisasi Zuma Engine
  useEffect(() => {
    const isMobile = mobileCheck();
    setIsMobileDevice(isMobile);

    const game = new Zuma({
      width: ZUMA_CONFIG.width,
      height: ZUMA_CONFIG.height,
      scale: 1,
      reflectionPoints: ZUMA_CONFIG.reflectionPoints,
      updateScore: (newScore) => {
        setScore(newScore);
      },
      updateFinal: (isFinal, finalScore) => {
        if (isFinal) {
          setScore(finalScore);
          setGameState('finished');
        }
      },
      onReflectionTrigger: (checkpointId) => {
        const pointData = REFLECTION_POINTS.find((p) => p.id === checkpointId) || {
          id: checkpointId,
          title: 'Kearifan Budaya Aceh',
          question: 'Nilai luhur apa yang paling menginspirasimu dalam perjalanan ini?',
          options: [
            { id: 'opt-1', label: 'Ketekunan & gotong royong' },
            { id: 'opt-2', label: 'Harmoni dengan alam' },
            { id: 'opt-3', label: 'Kearifan tradisi leluhur' },
          ],
          appreciation: 'Menarik! Yuk lanjutkan perjalanan.',
        };
        setActiveReflection(pointData);
        setGameState('reflection');
      },
      onProgressUpdate: (ratio) => {
        setProgressRatio(Math.min(1, ratio));
      },
    });

    zumaRef.current = game;

    if (containerRef.current) {
      game.appendTo(containerRef.current);
    }

    // Auto-scale handler sesuai ukuran layar pembungkus
    function handleResize() {
      if (!containerRef.current || !game) return;
      const rect = containerRef.current.getBoundingClientRect();
      const availableWidth = rect.width || window.innerWidth;
      const availableHeight = Math.min(window.innerHeight * 0.8, 760);

      const scaleX = (availableWidth - 24) / ZUMA_CONFIG.width;
      const scaleY = (availableHeight - 24) / ZUMA_CONFIG.height;
      const finalScale = Math.min(Math.max(scaleX, 0.35), Math.max(scaleY, 0.35), 1);

      game.setScale(finalScale);
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    // Event mouse desktop
    function handleMouseMove(e) {
      if (!game || !game.isStart) return;
      game.lookAt(e.pageX, e.pageY);
    }

    function handleClick(e) {
      // Hanya tembak jika sedang fase playing dan bukan mengklik tombol kontrol
      if (!game || !game.isStart) return;
      if (e.target.closest('button') || e.target.closest('.zuma-overlay') || e.target.closest('.zuma-mobile-controls')) {
        return;
      }
      game.attack();
    }

    function handleKeyDown(e) {
      if (!game) return;
      if (e.code === 'Space') {
        e.preventDefault();
        game.switchMarble();
      } else if (e.code === 'Escape') {
        if (game.isStart && !game.isFinal) {
          game.stop();
          setGameState('paused');
        }
      }
    }

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('click', handleClick);
      window.addEventListener('keydown', handleKeyDown);
    }

    // Clean Unmount (memastikan tidak ada kebocoran proses di background)
    return () => {
      window.removeEventListener('resize', handleResize);
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('click', handleClick);
        window.removeEventListener('keydown', handleKeyDown);
      }
      game.destroy();
      zumaRef.current = null;
    };
  }, []);

  // Handlers Aksi Game
  const handleStartGame = useCallback(() => {
    setGameState('playing');
    if (zumaRef.current) {
      zumaRef.current.start();
    }
  }, []);

  const handlePauseGame = useCallback(() => {
    if (zumaRef.current && zumaRef.current.isStart) {
      zumaRef.current.stop();
      setGameState('paused');
    }
  }, []);

  const handleResumeGame = useCallback(() => {
    setGameState('playing');
    if (zumaRef.current) {
      zumaRef.current.start();
    }
  }, []);

  const handleRestartGame = useCallback(() => {
    setScore(0);
    setProgressRatio(0);
    setActiveReflection(null);
    setGameState('playing');
    if (zumaRef.current) {
      zumaRef.current.reset().start();
    }
  }, []);

  const handleContinueFromReflection = useCallback(() => {
    setActiveReflection(null);
    setGameState('playing');
    if (zumaRef.current) {
      zumaRef.current.start();
    }
  }, []);

  const handleExitGame = useCallback(() => {
    if (zumaRef.current) {
      zumaRef.current.stop();
    }
    navigate('/dashboard');
  }, [navigate]);

  // Handler kontrol mobile
  const handleMobileShoot = useCallback(() => {
    if (zumaRef.current && zumaRef.current.isStart) {
      zumaRef.current.attack();
    }
  }, []);

  const handleMobileSwitch = useCallback(() => {
    if (zumaRef.current && zumaRef.current.isStart) {
      zumaRef.current.switchMarble();
    }
  }, []);

  const handleMobileAimVector = useCallback((vx, vy) => {
    if (zumaRef.current && zumaRef.current.isStart) {
      zumaRef.current.lookAtVector(vx, vy);
    }
  }, []);

  return (
    <Layout breadcrumb="Game Refleksi Budaya Aceh">
      <div className="game-refleksi-page">
        {/* HUD Game Atas */}
        <header className="zuma-hud" aria-label="Status Permainan">
          <div className="zuma-hud__left">
            <span className="zuma-hud__icon">🌿</span>
            <div className="zuma-hud__title-wrap">
              <h1 className="zuma-hud__title">JELAJAH BUDAYA ACEH</h1>
              <span className="zuma-hud__subtitle">Permainan Refleksi Kelereng Permata</span>
            </div>
          </div>

          <div className="zuma-hud__center">
            <div className="zuma-hud__progress-wrap" title={`Progres: ${Math.round(progressRatio * 100)}%`}>
              <span className="zuma-hud__progress-label">Progres Jelajah</span>
              <div className="zuma-hud__progress-bar">
                <div
                  className="zuma-hud__progress-fill"
                  style={{ width: `${Math.round(progressRatio * 100)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="zuma-hud__right">
            <div className="zuma-hud__score-badge" title="Skor permainan sesi ini">
              <Star className="zuma-hud__star-icon" size={16} />
              <span className="zuma-hud__score-text">{score}</span>
            </div>

            {gameState === 'playing' && (
              <button
                type="button"
                className="zuma-hud__btn-pause"
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
        <div className="zuma-viewport" tabIndex={0}>
          {/* Layer Latar Belakang & Efek */}
          <div className="zuma-stage">
            {/* Kontainer Engine Canvas Zuma */}
            <div ref={containerRef} className="zuma-canvas-anchor" />

            {/* Kontrol Mobile (Tampil di layar sentuh) */}
            {isMobileDevice && gameState === 'playing' && (
              <GameMobileControls
                onShoot={handleMobileShoot}
                onSwitch={handleMobileSwitch}
                onPause={handlePauseGame}
                onAimVector={handleMobileAimVector}
              />
            )}

            {/* Overlays Sesuai Status Game */}
            {gameState === 'start' && <GameStartOverlay onStart={handleStartGame} />}
            {gameState === 'paused' && (
              <GamePauseOverlay
                onResume={handleResumeGame}
                onRestart={handleRestartGame}
                onExit={handleExitGame}
              />
            )}
            {gameState === 'reflection' && activeReflection && (
              <GameReflectionOverlay
                pointData={activeReflection}
                onContinue={handleContinueFromReflection}
              />
            )}
            {gameState === 'finished' && (
              <GameFinishOverlay
                score={score}
                onRestart={handleRestartGame}
                onExit={handleExitGame}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default GameRefleksi;
