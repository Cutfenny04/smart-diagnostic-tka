/**
 * SMART DIAGNOSTIC TKA - LOGIN SCRIPT (REVISED)
 * Handles: Page entrances, validations, custom password toggles,
 *          button ripples, soft mouse parallax, and calm canvas background.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialise Entrance Sequencer
    initEntranceSequencer();

    // 2. Initialise Form Controls & Validation
    initFormControls();

    // 3. Initialise Interactive Canvas Animations (Subtle & Natural)
    initBackgroundCanvas();

    // 4. Initialise Mouse Parallax (Very Soft)
    initMouseParallax();
});

/* ==========================================================================
   1. Entrance Sequencer (Triggering Load Animations)
   ========================================================================== */
function initEntranceSequencer() {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 150);
}

/* ==========================================================================
   2. Form Controls & Validation (Email, Password, Ripple)
   ========================================================================== */
function initFormControls() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    
    const passwordToggleBtn = document.getElementById('password-toggle');
    const showPasswordCheck = document.getElementById('show-password-check');
    const submitBtn = document.getElementById('btn-submit');

    // --- Show / Hide Password Logic ---
    let isPasswordVisible = false;

    function setPasswordVisibility(visible) {
        isPasswordVisible = visible;
        if (visible) {
            passwordInput.type = 'text';
            showPasswordCheck.checked = true;
            passwordToggleBtn.innerHTML = `
                <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
            `;
            passwordToggleBtn.setAttribute('aria-label', 'Sembunyikan password');
        } else {
            passwordInput.type = 'password';
            showPasswordCheck.checked = false;
            passwordToggleBtn.innerHTML = `
                <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>
            `;
            passwordToggleBtn.setAttribute('aria-label', 'Tampilkan password');
        }
    }

    // Toggle button click event
    passwordToggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setPasswordVisibility(!isPasswordVisible);
    });

    // Checkbox state change event
    showPasswordCheck.addEventListener('change', () => {
        setPasswordVisibility(showPasswordCheck.checked);
    });

    // --- Validation Utilities ---
    function validateEmail(email) {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(String(email).toLowerCase());
    }

    function showError(inputElement, errorElement, message) {
        const group = inputElement.closest('.input-group');
        group.classList.add('has-error');
        errorElement.textContent = message;
    }

    function clearError(inputElement, errorElement) {
        const group = inputElement.closest('.input-group');
        group.classList.remove('has-error');
        errorElement.textContent = '';
    }

    // Realtime Error Clearing
    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim() !== '') {
            clearError(emailInput, emailError);
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.trim() !== '') {
            clearError(passwordInput, passwordError);
        }
    });

    // --- Submit Action ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        // Email checks
        if (emailValue === '') {
            showError(emailInput, emailError, 'Email tidak boleh kosong.');
            isValid = false;
        } else if (!validateEmail(emailValue)) {
            showError(emailInput, emailError, 'Format email tidak valid (nama@sekolah.sch.id).');
            isValid = false;
        } else {
            clearError(emailInput, emailError);
        }

        // Password checks
        if (passwordValue === '') {
            showError(passwordInput, passwordError, 'Password tidak boleh kosong.');
            isValid = false;
        } else {
            clearError(passwordInput, passwordError);
        }

        if (isValid) {
            // Disable button & show spinner state
            submitBtn.disabled = true;
            const btnText = submitBtn.querySelector('.btn-text');
            const btnArrow = submitBtn.querySelector('.btn-arrow');
            
            btnText.textContent = 'Memverifikasi...';
            if (btnArrow) btnArrow.style.display = 'none';

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1200);
        }
    });

    // --- Button Click Ripple Effect ---
    submitBtn.addEventListener('click', function(e) {
        const rippleContainer = this.querySelector('.btn-ripple-container');
        if (!rippleContainer) return;

        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');

        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        rippleContainer.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

/* ==========================================================================
   3. Canvas Background Animations (Calm & Subtle Elements)
   ========================================================================= */
function initBackgroundCanvas() {
    const canvas = document.getElementById('animation-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // --- Particle Class (Fewer, slower, soft glow) ---
    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * height; // distribute initially
        }
        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 60;
            this.size = Math.random() * 3 + 1; // smaller particles
            this.speedY = -(Math.random() * 0.25 + 0.1); // very slow drift
            this.speedX = Math.random() * 0.2 - 0.1;
            this.alpha = Math.random() * 0.2 + 0.05; // very faint
            // Faint Beige (#F7F4D5) or Moss green (#839958)
            this.color = Math.random() > 0.65 ? '247, 244, 213' : '131, 153, 88';
        }
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            if (this.y < -50 || this.x < -50 || this.x > width + 50) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.beginPath();
            let grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
            grad.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
            grad.addColorStop(1, `rgba(${this.color}, 0)`);
            ctx.fillStyle = grad;
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // --- Leaf Class (Natural, calm drifting leaves) ---
    class Leaf {
        constructor() {
            this.reset();
            this.y = Math.random() * height; // distribute initially
        }
        reset() {
            this.x = Math.random() * width;
            this.y = -40 - Math.random() * 100;
            this.size = Math.random() * 10 + 5;
            this.speedY = Math.random() * 0.25 + 0.15; // very slow descent
            this.speedX = Math.random() * 0.3 - 0.15;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() * 0.005 - 0.0025);
            this.swingSpeed = Math.random() * 0.008 + 0.003;
            this.swingStep = Math.random() * 100;
            // Moss Green (#839958), Dark Green (#0A3323) or Rosy Brown (#D3968C)
            const roll = Math.random();
            if (roll < 0.5) {
                this.color = '131, 153, 88'; // Moss Green
            } else if (roll < 0.8) {
                this.color = '10, 51, 35';   // Dark Green
            } else {
                this.color = '211, 150, 140'; // Rosy Brown
            }
            this.alpha = Math.random() * 0.18 + 0.08;
        }
        update() {
            this.y += this.speedY;
            this.swingStep += this.swingSpeed;
            this.x += this.speedX + Math.sin(this.swingStep) * 0.25;
            this.rotation += this.rotationSpeed;
            if (this.y > height + 50 || this.x < -50 || this.x > width + 50) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
            ctx.beginPath();
            // Draw a smooth double curve leaf shape
            ctx.moveTo(0, -this.size);
            ctx.quadraticCurveTo(this.size * 0.45, -this.size * 0.2, 0, this.size);
            ctx.quadraticCurveTo(-this.size * 0.45, -this.size * 0.2, 0, -this.size);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    // --- Light Ray Class (Subtle sunbeams) ---
    class LightRay {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * width;
            this.width = Math.random() * 100 + 60;
            this.opacity = Math.random() * 0.012 + 0.004; // extremely faint
            this.pulseSpeed = Math.random() * 0.002 + 0.0008;
            this.pulseStep = Math.random() * 100;
        }
        update() {
            this.pulseStep += this.pulseSpeed;
        }
        draw() {
            let currentOpacity = this.opacity + Math.sin(this.pulseStep) * 0.003;
            ctx.save();
            ctx.globalAlpha = Math.max(0.001, currentOpacity);
            
            // Create soft warm beige to transparent gradient ray
            let grad = ctx.createLinearGradient(this.x, 0, this.x + this.width, height);
            grad.addColorStop(0, 'rgba(247, 244, 213, 0.25)'); // Beige
            grad.addColorStop(0.6, 'rgba(131, 153, 88, 0.05)'); // Moss Green
            grad.addColorStop(1, 'rgba(10, 51, 35, 0)');
            
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(this.x, 0);
            ctx.lineTo(this.x + this.width, 0);
            ctx.lineTo(this.x + this.width + 80, height);
            ctx.lineTo(this.x - 80, height);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }
    }

    // Instantiate elements (Reduced amounts for clean minimalist feel)
    const particles = Array.from({ length: 18 }, () => new Particle());
    const leaves = Array.from({ length: 8 }, () => new Leaf());
    const rays = Array.from({ length: 3 }, () => new LightRay());

    // Loop logic
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw rays
        rays.forEach(ray => {
            ray.update();
            ray.draw();
        });

        // Draw particles
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw leaves
        leaves.forEach(leaf => {
            leaf.update();
            leaf.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   4. Mouse Parallax (Very Soft Micro Depth Interaction)
   ========================================================================== */
function initMouseParallax() {
    let normMouseX = 0;
    let normMouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth) - 0.5;
        targetY = (e.clientY / window.innerHeight) - 0.5;
    });

    function updateParallax() {
        normMouseX += (targetX - normMouseX) * 0.05; // slower easing for relaxation
        normMouseY += (targetY - normMouseY) * 0.05;

        const layerImg1 = document.querySelector('.bg-photo-layer--1');
        const layerImg2 = document.querySelector('.bg-photo-layer--2');
        const blob1 = document.querySelector('.blob-1');
        const blob2 = document.querySelector('.blob-2');
        const blob3 = document.querySelector('.blob-3');
        const loginFrame = document.querySelector('.login-frame');
        const heroMainMsg = document.querySelector('.hero-main-msg');

        if (layerImg1) {
            // Max displacement 6px
            layerImg1.style.transform = `scale(1.04) translate(${normMouseX * 6}px, ${normMouseY * 6}px)`;
        }
        if (layerImg2) {
            // Max displacement -10px
            layerImg2.style.transform = `scale(1.04) translate(${normMouseX * -10}px, ${normMouseY * -10}px)`;
        }
        if (blob1) {
            blob1.style.transform = `translate(${normMouseX * 15}px, ${normMouseY * 15}px)`;
        }
        if (blob2) {
            blob2.style.transform = `translate(${normMouseX * -18}px, ${normMouseY * -18}px)`;
        }
        if (blob3) {
            blob3.style.transform = `translate(${normMouseX * 8}px, ${normMouseY * -8}px)`;
        }
        if (loginFrame && window.innerWidth > 768) {
            // Subtle opposite direction shift
            loginFrame.style.transform = `translate(${normMouseX * -5}px, ${normMouseY * -5}px)`;
        } else if (loginFrame) {
            loginFrame.style.transform = 'none';
        }
        if (heroMainMsg) {
            // Subtle movement on text
            heroMainMsg.style.transform = `translate(${normMouseX * 8}px, ${normMouseY * 8}px)`;
        }

        requestAnimationFrame(updateParallax);
    }

    updateParallax();
}
