/* ==========================================================================
   GAME REFLEKSI BUDAYA ACEH — REACT PAGE WRAPPER
   Menyediakan pilihan 2 wahana game interaktif:
   1. Takat Kelereng (Zuma Heritage Engine)
   2. Melingka di Tanoh Rencong (Flappy Bird Aceh Engine)
   Terintegrasi penuh dengan GameSelectionHub dan maskot budaya Aceh.
   ========================================================================== */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Zuma } from '../games/zuma/ZumaGame';
import { ZUMA_CONFIG } from '../games/zuma/gameConfig';
import { mobileCheck } from '../games/zuma/utils';
import { REFLECTION_POINTS } from '../data/gameRefleksiData';
import GameSelectionHub from '../components/game-refleksi/GameSelectionHub';
import FlappyBirdGame from '../components/game-refleksi/flappy/FlappyBirdGame';
import GameStartOverlay from '../components/game-refleksi/GameStartOverlay';
import GamePauseOverlay from '../components/game-refleksi/GamePauseOverlay';
import GameReflectionOverlay from '../components/game-refleksi/GameReflectionOverlay';
import GameFinishOverlay from '../components/game-refleksi/GameFinishOverlay';
import GameMobileControls from '../components/game-refleksi/GameMobileControls';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { Star, Pause, ArrowLeft } from 'lucide-react';
import './GameRefleksi.css';

function GameRefleksi() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Ambil mode game dari query parameter (?game=zuma atau ?game=flappy)
  const gameParam = searchParams.get('game');
  const activeGame = ['zuma', 'flappy'].includes(gameParam) ? gameParam : null;

  // Title dokumen dinamis
  const pageTitle =
    activeGame === 'flappy'
      ? 'Melingka di Tanoh Rencong - Game Refleksi Budaya Aceh'
      : activeGame === 'zuma'
      ? 'Takat Kelereng - Game Refleksi Budaya Aceh'
      : 'Game Refleksi Budaya Aceh - Smart Diagnostic TKA';

  useDocumentTitle(pageTitle);

  // Breadcrumb dinamis
  const breadcrumbText =
    activeGame === 'flappy'
      ? 'Game Refleksi / Melingka di Tanoh Rencong'
      : activeGame === 'zuma'
      ? 'Game Refleksi / Takat Kelereng'
      : 'Game Refleksi Budaya Aceh';

  // State Zuma Game
  const containerRef = useRef(null);
  const zumaRef = useRef(null);

  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'paused' | 'reflection' | 'finished'
  const [score, setScore] = useState(0);
  const [progressRatio, setProgressRatio] = useState(0);
  const [activeReflection, setActiveReflection] = useState(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Navigasi Pilihan Game
  const handleSelectGame = useCallback((gameId) => {
    if (gameId) {
      setSearchParams({ game: gameId });
    } else {
      setSearchParams({});
    }
  }, [setSearchParams]);

  const handleBackToHub = useCallback(() => {
    if (zumaRef.current && zumaRef.current.isStart) {
      zumaRef.current.stop();
    }
    setSearchParams({});
  }, [setSearchParams]);

  // Inisialisasi Zuma Engine (Hanya aktif jika activeGame === 'zuma')
  useEffect(() => {
    if (activeGame !== 'zuma') return;

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

    function handleMouseMove(e) {
      if (!game || !game.isStart) return;
      game.lookAt(e.pageX, e.pageY);
    }

    function handleClick(e) {
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
  }, [activeGame]);

  // Handlers Aksi Zuma
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
    <Layout breadcrumb={breadcrumbText}>
      {/* 1. TAMPILAN UTAMA: GAME SELECTION HUB (PILIHAN 2 GAME) */}
      {!activeGame && <GameSelectionHub onSelectGame={handleSelectGame} />}

      {/* 2. GAME 2: MELINGKA DI TANOH RENCONG (FLAPPY BIRD ACEH) */}
      {activeGame === 'flappy' && <FlappyBirdGame onBackToHub={handleBackToHub} />}

      {/* 3. GAME 1: TAKAT KELERENG (ZUMA HERITAGE ENGINE) */}
      {activeGame === 'zuma' && (
        <div className="game-refleksi-page">
          {/* HUD Game Atas */}
          <header className="zuma-hud" aria-label="Status Permainan Takat Kelereng">
            <div className="zuma-hud__left">
              <button
                type="button"
                className="zuma-hud__btn-back"
                onClick={handleBackToHub}
                title="Kembali ke Pilihan Game"
              >
                <ArrowLeft size={16} />
                <span className="btn-text-desktop">Pilihan Game</span>
              </button>

              <span className="zuma-hud__icon">💎</span>
              <div className="zuma-hud__title-wrap">
                <h1 className="zuma-hud__title">TAKAT KELERENG</h1>
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
            <div className="zuma-stage">
              <div ref={containerRef} className="zuma-canvas-anchor" />

              {/* Kontrol Mobile */}
              {isMobileDevice && gameState === 'playing' && (
                <GameMobileControls
                  onShoot={handleMobileShoot}
                  onSwitch={handleMobileSwitch}
                  onPause={handlePauseGame}
                  onAimVector={handleMobileAimVector}
                />
              )}

              {/* Overlays */}
              {gameState === 'start' && <GameStartOverlay onStart={handleStartGame} />}
              {gameState === 'paused' && (
                <GamePauseOverlay
                  onResume={handleResumeGame}
                  onRestart={handleRestartGame}
                  onBackToHub={handleBackToHub}
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
                  onBackToHub={handleBackToHub}
                  onExit={handleExitGame}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default GameRefleksi;
