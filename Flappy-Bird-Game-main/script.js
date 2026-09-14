/* ==========================================================================
   FLAPPY ACEH - GAME ENGINE
   Tema: Petualangan Burung Rangkong di Tanah Rencong
   ========================================================================== */

(function () {
    'use strict';

    // Game States
    const STATE_START = 'START';
    const STATE_PLAYING = 'PLAYING';
    const STATE_GAMEOVER = 'GAMEOVER';

    let gameState = STATE_START;

    // Physics & Balance Variables (Disesuaikan untuk Burung yang Lebih Besar)
    const GRAVITY = 0.44;
    const FLAP_STRENGTH = -8.7;
    const PIPE_SPEED = 3.2;
    const PIPE_SPAWN_INTERVAL = 112; // in frame ticks (~1.85s)
    const PIPE_GAP_PERCENT = 39; // % of viewport height (lebih lapang untuk badan burung lebih besar)

    // Parallax Background Scrolling Variables
    const BG_SPEED_PLAY = 1.3; // saat bermain
    const BG_SPEED_IDLE = 0.45; // saat menu awal (cinematic drift)
    let bgX = 0;

    let birdY = window.innerHeight * 0.4;
    let birdVelocity = 0;
    let birdRotation = 0;
    let currentScore = 0;
    let highScore = parseInt(localStorage.getItem('flappy_aceh_high_score') || '0', 10);
    let isMuted = localStorage.getItem('flappy_aceh_muted') === 'true';

    let gameLoopId = null;
    let frameCount = 0;
    let pipes = [];
    let flapTimeout = null;
    let lastGameOverTime = 0;

    // DOM Elements
    const backgroundEl = document.querySelector('.background');
    const birdWrapper = document.getElementById('bird-wrapper');
    const birdImg = document.getElementById('bird-1');
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const currentScoreEl = document.getElementById('current-score');
    const highScoreEl = document.getElementById('high-score');
    const startBestScoreEl = document.getElementById('start-best-score');
    const finalScoreEl = document.getElementById('final-score');
    const finalBestScoreEl = document.getElementById('final-best-score');
    const motivationTextEl = document.getElementById('motivation-text');
    const btnStart = document.getElementById('btn-start');
    const btnRestart = document.getElementById('btn-restart');
    const soundToggleBtn = document.getElementById('sound-toggle');
    const soundIcon = document.getElementById('sound-icon');

    // Audio Elements (Gunakan path sounds/ yang bebas dari issue spasi URL peramban)
    const soundPoint = new Audio('sounds/point.mp3');
    soundPoint.preload = 'auto';
    const soundDie = new Audio('sounds/die.mp3');
    soundDie.preload = 'auto';
    const soundFlap = new Audio('sounds/terbang.mp3');
    soundFlap.preload = 'auto';
    const soundFlapWav = new Audio('sounds/terbang.wav');
    soundFlapWav.preload = 'auto';

    // Pastikan status audio default tidak muted kecuali disengaja
    if (localStorage.getItem('flappy_aceh_muted') === null) {
        localStorage.setItem('flappy_aceh_muted', 'false');
        isMuted = false;
    }

    // Web Audio API & Audio Unlocker
    let audioCtx = null;
    let audioUnlocked = false;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        return audioCtx;
    }

    // Buka proteksi autoplay browser pada interaksi pertama pengguna
    function unlockAudio() {
        if (audioUnlocked) return;
        audioUnlocked = true;

        try {
            const ctx = getAudioContext();
            if (ctx && ctx.state === 'suspended') {
                ctx.resume();
            }
        } catch (e) {}

        // Pancing Audio HTML5 agar diizinkan memutar suara oleh browser
        try {
            soundPoint.play().then(() => {
                soundPoint.pause();
                soundPoint.currentTime = 0;
            }).catch(() => {});
        } catch (e) {}

        try {
            soundDie.play().then(() => {
                soundDie.pause();
                soundDie.currentTime = 0;
            }).catch(() => {});
        } catch (e) {}

        try {
            soundFlap.play().then(() => {
                soundFlap.pause();
                soundFlap.currentTime = 0;
            }).catch(() => {});
        } catch (e) {}

        try {
            soundFlapWav.play().then(() => {
                soundFlapWav.pause();
                soundFlapWav.currentTime = 0;
            }).catch(() => {});
        } catch (e) {}
    }

    // Memutar sound effect terbang (terbang.mp3 / wav) setiap kali burung mengepakkan sayap / diklik
    function playFlapSound() {
        if (isMuted) return;

        // 1. Putar berkas audio asli terbang.mp3 dengan teknik cloneNode untuk latensi instan & respons cepat
        try {
            const snd = soundFlap.cloneNode();
            snd.volume = 1.0;
            const playPromise = snd.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    try {
                        const sndWav = soundFlapWav.cloneNode();
                        sndWav.volume = 1.0;
                        sndWav.play().catch(() => {
                            soundFlap.currentTime = 0;
                            soundFlap.play().catch(() => {});
                        });
                    } catch (err2) {
                        soundFlap.currentTime = 0;
                        soundFlap.play().catch(() => {});
                    }
                });
            }
        } catch (e) {
            try {
                soundFlap.currentTime = 0;
                soundFlap.play().catch(() => {});
            } catch (err) {}
        }
    }

    // Memutar suara point setiap kali melewati rintangan dengan jernih & lantang
    function playPointSound(score = 1) {
        if (isMuted) return;

        // 1. Putar file point.mp3 menggunakan cloneNode untuk latensi 0ms & polyphony
        try {
            const snd = soundPoint.cloneNode();
            snd.volume = 1.0;
            const playPromise = snd.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    soundPoint.currentTime = 0;
                    soundPoint.play().catch(() => {});
                });
            }
        } catch (e) {
            try {
                soundPoint.currentTime = 0;
                soundPoint.play().catch(() => {});
            } catch (err) {}
        }

        // 2. Tambahan kilau nada harmonik tradisional jika Web Audio aktif
        try {
            const ctx = getAudioContext();
            if (ctx && ctx.state === 'running') {
                const pentatonicScale = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
                const baseFreq = pentatonicScale[(score - 1) % pentatonicScale.length];
                const now = ctx.currentTime;

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(baseFreq * 1.5, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 0.015);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now);
                osc.stop(now + 0.32);
            }
        } catch (e) {}
    }

    // Floating +1 Score Popup and Badge Pulse
    function showScorePopup(birdRect) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = '+1';
        popup.style.left = (birdRect.right - 12) + 'px';
        popup.style.top = (birdRect.top - 20) + 'px';
        document.body.appendChild(popup);

        setTimeout(() => {
            if (popup.parentNode) popup.remove();
        }, 700);

        const scoreBadge = document.querySelector('.score-badge');
        if (scoreBadge) {
            scoreBadge.classList.remove('pulse');
            void scoreBadge.offsetWidth;
            scoreBadge.classList.add('pulse');
        }
    }

    function playDieSound() {
        if (isMuted) return;
        try {
            soundDie.currentTime = 0;
            soundDie.play().catch(() => {});
        } catch (e) {}
    }

    function updateSoundUI() {
        soundIcon.textContent = isMuted ? '🔇' : '🔊';
        localStorage.setItem('flappy_aceh_muted', isMuted ? 'true' : 'false');
    }

    // Toggle Sound
    soundToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isMuted = !isMuted;
        updateSoundUI();
    });

    // Initialize High Score display
    function updateHighScoreUI() {
        highScoreEl.textContent = highScore;
        startBestScoreEl.textContent = highScore;
        finalBestScoreEl.textContent = highScore;
    }

    // Wing flap sprite animation
    function triggerWingFlap() {
        birdImg.src = 'images/burung2.png';
        if (flapTimeout) clearTimeout(flapTimeout);
        flapTimeout = setTimeout(() => {
            birdImg.src = 'images/burung.png';
        }, 160);
    }

    // Player Jump / Flap
    function flap() {
        if (gameState !== STATE_PLAYING) return;
        birdVelocity = FLAP_STRENGTH;
        birdRotation = -22;
        triggerWingFlap();
        playFlapSound();
    }

    // Start Game
    function startGame() {
        unlockAudio();
        // Clear old pipes
        clearPipes();

        // Reset state & score
        gameState = STATE_PLAYING;
        currentScore = 0;
        currentScoreEl.textContent = '0';
        frameCount = 0;

        // Reset bird position
        birdY = window.innerHeight * 0.35;
        birdVelocity = FLAP_STRENGTH;
        birdRotation = -20;
        triggerWingFlap();
        playFlapSound();

        // Hide modals
        startScreen.classList.remove('active');
        gameOverScreen.classList.remove('active');

        // Start game loop
        if (gameLoopId) cancelAnimationFrame(gameLoopId);
        gameLoopId = requestAnimationFrame(gameLoop);
    }

    // Spawn Obstacles (Pilar Arsitektur Aceh)
    function spawnPipePair() {
        const minTop = window.innerHeight * 0.12;
        const maxTop = window.innerHeight * 0.48;
        const topPipeHeight = Math.floor(Math.random() * (maxTop - minTop)) + minTop;
        const gapHeight = (window.innerHeight * PIPE_GAP_PERCENT) / 100;
        const bottomPipeTop = topPipeHeight + gapHeight;
        const bottomPipeHeight = window.innerHeight - bottomPipeTop;

        const startX = window.innerWidth + 10;

        // Top Pipe
        const topPipe = document.createElement('div');
        topPipe.className = 'pipe_sprite pipe_top';
        topPipe.style.left = startX + 'px';
        topPipe.style.top = '0px';
        topPipe.style.height = topPipeHeight + 'px';
        document.body.appendChild(topPipe);

        // Bottom Pipe
        const bottomPipe = document.createElement('div');
        bottomPipe.className = 'pipe_sprite pipe_bottom';
        bottomPipe.style.left = startX + 'px';
        bottomPipe.style.top = bottomPipeTop + 'px';
        bottomPipe.style.height = bottomPipeHeight + 'px';
        bottomPipe.dataset.scored = 'false';
        document.body.appendChild(bottomPipe);

        pipes.push({
            x: startX,
            topEl: topPipe,
            bottomEl: bottomPipe,
            scored: false
        });
    }

    // Clear all pipes
    function clearPipes() {
        pipes.forEach(pipe => {
            if (pipe.topEl && pipe.topEl.parentNode) pipe.topEl.remove();
            if (pipe.bottomEl && pipe.bottomEl.parentNode) pipe.bottomEl.remove();
        });
        pipes = [];
    }

    // Trigger Game Over
    function gameOver() {
        gameState = STATE_GAMEOVER;
        lastGameOverTime = Date.now();
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
            gameLoopId = null;
        }

        playDieSound();

        // Update High Score if needed
        if (currentScore > highScore) {
            highScore = currentScore;
            localStorage.setItem('flappy_aceh_high_score', highScore.toString());
            updateHighScoreUI();
        }

        // Show Game Over UI
        finalScoreEl.textContent = currentScore;
        finalBestScoreEl.textContent = highScore;

        // Culturally motivated quotes
        if (currentScore === 0) {
            motivationTextEl.textContent = 'Bek putoh asaa!';
        } else if (currentScore < 5) {
            motivationTextEl.textContent = 'Gèt thatt!';
        } else if (currentScore < 15) {
            motivationTextEl.textContent = 'Brat that jagooo!';
        } else {
            motivationTextEl.textContent = 'Hana pat lawannn!';
        }

        gameOverScreen.classList.add('active');
    }

    // Main Game Loop
    function gameLoop() {
        if (gameState !== STATE_PLAYING) return;

        frameCount++;

        // 0. Background Parallax Scrolling
        bgX -= BG_SPEED_PLAY;
        if (bgX <= -100000) bgX = 0;
        backgroundEl.style.backgroundPosition = `${bgX}px bottom`;

        // 1. Bird Physics Update
        birdVelocity += GRAVITY;
        birdY += birdVelocity;

        // Smooth rotation based on velocity
        if (birdVelocity < 0) {
            birdRotation = Math.max(-28, birdRotation - 3);
        } else {
            birdRotation = Math.min(75, birdRotation + 3.2);
        }

        birdWrapper.style.top = birdY + 'px';
        birdWrapper.style.transform = `rotate(${birdRotation}deg)`;

        const birdRect = birdWrapper.getBoundingClientRect();
        // Fair inset hitbox for the bird's visual body (Rangkong torso & beak focus)
        const hitboxMarginX = birdRect.width * 0.24;
        const hitboxMarginY = birdRect.height * 0.22;
        const birdHitbox = {
            left: birdRect.left + hitboxMarginX,
            right: birdRect.right - hitboxMarginX,
            top: birdRect.top + hitboxMarginY,
            bottom: birdRect.bottom - hitboxMarginY
        };

        // 2. Ceiling & Ground Collision Checks
        const groundHeight = 18;
        if (birdHitbox.top <= 0 || birdHitbox.bottom >= (window.innerHeight - groundHeight)) {
            gameOver();
            return;
        }

        // 3. Pipe Spawning
        if (frameCount % PIPE_SPAWN_INTERVAL === 0) {
            spawnPipePair();
        }

        // 4. Pipe Movement, Scoring, & Collisions
        for (let i = pipes.length - 1; i >= 0; i--) {
            const pipe = pipes[i];
            pipe.x -= PIPE_SPEED;

            pipe.topEl.style.left = pipe.x + 'px';
            pipe.bottomEl.style.left = pipe.x + 'px';

            const topRect = pipe.topEl.getBoundingClientRect();
            const bottomRect = pipe.bottomEl.getBoundingClientRect();

            // Check collision with top pipe
            if (
                birdHitbox.right > topRect.left &&
                birdHitbox.left < topRect.right &&
                birdHitbox.top < topRect.bottom
            ) {
                gameOver();
                return;
            }

            // Check collision with bottom pipe
            if (
                birdHitbox.right > bottomRect.left &&
                birdHitbox.left < bottomRect.right &&
                birdHitbox.bottom > bottomRect.top
            ) {
                gameOver();
                return;
            }

            // Check score passing tepat saat poros tengah burung melintasi garis tengah rintangan
            const pipeCenterX = pipe.x + (topRect.width / 2);
            const birdCenterX = (birdHitbox.left + birdHitbox.right) / 2;
            if (!pipe.scored && pipeCenterX <= birdCenterX) {
                pipe.scored = true;
                currentScore++;
                currentScoreEl.textContent = currentScore;
                playPointSound(currentScore);
                showScorePopup(birdRect);

                if (currentScore > highScore) {
                    highScore = currentScore;
                    highScoreEl.textContent = highScore;
                }
            }

            // Remove offscreen pipes
            if (pipe.x < -100) {
                pipe.topEl.remove();
                pipe.bottomEl.remove();
                pipes.splice(i, 1);
            }
        }

        gameLoopId = requestAnimationFrame(gameLoop);
    }

    // Handle universal action inputs (Keyboard, Click, Touch)
    function handleActionInput(e) {
        unlockAudio();

        // Prevent default for game keys/touches so page doesn't scroll or zoom
        if (e && e.type === 'keydown') {
            const validKeys = [' ', 'ArrowUp', 'KeyW', 'Enter'];
            if (!validKeys.includes(e.key) && !validKeys.includes(e.code)) return;
            e.preventDefault();
        }

        if (gameState === STATE_START) {
            startGame();
        } else if (gameState === STATE_PLAYING) {
            flap();
        } else if (gameState === STATE_GAMEOVER) {
            // Prevent immediate accidental restart on death click
            if (Date.now() - lastGameOverTime > 400) {
                startGame();
            }
        }
    }

    // Button click listeners
    btnStart.addEventListener('click', (e) => {
        e.stopPropagation();
        startGame();
    });

    btnRestart.addEventListener('click', (e) => {
        e.stopPropagation();
        startGame();
    });

    // Global Input Listeners
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });
    window.addEventListener('keydown', handleActionInput);

    // Screen click / tap anywhere to play/flap
    window.addEventListener('mousedown', (e) => {
        // Ignore clicks on HUD buttons or interactive elements
        if (e.target.closest('.hud-btn') || e.target.closest('.btn-primary')) return;
        handleActionInput(e);
    });

    // Touch screen support for mobile/tablet
    window.addEventListener('touchstart', (e) => {
        if (e.target.closest('.hud-btn') || e.target.closest('.btn-primary')) return;
        e.preventDefault(); // prevent double click or scroll
        handleActionInput(e);
    }, { passive: false });

    // Window resize handler: adjust bird position if outside bounds
    window.addEventListener('resize', () => {
        if (gameState === STATE_START) {
            birdY = window.innerHeight * 0.4;
            birdWrapper.style.top = birdY + 'px';
        }
    });

    // Gentle idle bobbing animation on start screen & ambient background drift
    let idleAngle = 0;
    function idleAnimation() {
        if (gameState === STATE_START) {
            bgX -= BG_SPEED_IDLE;
            if (bgX <= -100000) bgX = 0;
            backgroundEl.style.backgroundPosition = `${bgX}px bottom`;

            idleAngle += 0.04;
            const offsetY = Math.sin(idleAngle) * 9;
            birdWrapper.style.top = (window.innerHeight * 0.4 + offsetY) + 'px';
            birdWrapper.style.transform = `rotate(${Math.sin(idleAngle) * 6}deg)`;
        }
        requestAnimationFrame(idleAnimation);
    }

    // Initialize Game on Load
    updateHighScoreUI();
    updateSoundUI();
    idleAnimation();

})();
