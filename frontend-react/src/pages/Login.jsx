import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import InlineError from '../components/InlineError';
import { friendlyErrorMessage } from '../services/api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Login.css';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useDocumentTitle('Masuk - Smart Diagnostic TKA | Pelatihan HOTS IPA Budaya Aceh');

  // Entrance animation: sama seperti body.classList.add('loaded') di login.js,
  // tapi dibersihkan lagi saat komponen unmount (pindah halaman) supaya class
  // ini tidak "bocor" ke halaman lain.
  useEffect(() => {
    const timer = setTimeout(() => {
      document.body.classList.add('loaded');
    }, 150);
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('loaded');
    };
  }, []);

  // Animasi partikel/daun/cahaya di background canvas (persis logic dari login.js)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationId;

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', handleResize);

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }
      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 60;
        this.size = Math.random() * 3 + 1;
        this.speedY = -(Math.random() * 0.25 + 0.1);
        this.speedX = Math.random() * 0.2 - 0.1;
        this.alpha = Math.random() * 0.2 + 0.05;
        this.color = Math.random() > 0.65 ? '247, 244, 213' : '131, 153, 88';
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y < -50 || this.x < -50 || this.x > width + 50) this.reset();
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        grad.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
        grad.addColorStop(1, `rgba(${this.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Leaf {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }
      reset() {
        this.x = Math.random() * width;
        this.y = -40 - Math.random() * 100;
        this.size = Math.random() * 10 + 5;
        this.speedY = Math.random() * 0.25 + 0.15;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() * 0.005 - 0.0025;
        this.swingSpeed = Math.random() * 0.008 + 0.003;
        this.swingStep = Math.random() * 100;
        const roll = Math.random();
        if (roll < 0.5) this.color = '131, 153, 88';
        else if (roll < 0.8) this.color = '10, 51, 35';
        else this.color = '211, 150, 140';
        this.alpha = Math.random() * 0.18 + 0.08;
      }
      update() {
        this.y += this.speedY;
        this.swingStep += this.swingSpeed;
        this.x += this.speedX + Math.sin(this.swingStep) * 0.25;
        this.rotation += this.rotationSpeed;
        if (this.y > height + 50 || this.x < -50 || this.x > width + 50) this.reset();
      }
      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size * 0.45, -this.size * 0.2, 0, this.size);
        ctx.quadraticCurveTo(-this.size * 0.45, -this.size * 0.2, 0, -this.size);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    class LightRay {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.width = Math.random() * 100 + 60;
        this.opacity = Math.random() * 0.012 + 0.004;
        this.pulseSpeed = Math.random() * 0.002 + 0.0008;
        this.pulseStep = Math.random() * 100;
      }
      update() {
        this.pulseStep += this.pulseSpeed;
      }
      draw() {
        const currentOpacity = this.opacity + Math.sin(this.pulseStep) * 0.003;
        ctx.save();
        ctx.globalAlpha = Math.max(0.001, currentOpacity);
        const grad = ctx.createLinearGradient(this.x, 0, this.x + this.width, height);
        grad.addColorStop(0, 'rgba(247, 244, 213, 0.25)');
        grad.addColorStop(0.6, 'rgba(131, 153, 88, 0.05)');
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

    const particles = Array.from({ length: 18 }, () => new Particle());
    const leaves = Array.from({ length: 8 }, () => new Leaf());
    const rays = Array.from({ length: 3 }, () => new LightRay());

    function animate() {
      ctx.clearRect(0, 0, width, height);
      rays.forEach((r) => { r.update(); r.draw(); });
      particles.forEach((p) => { p.update(); p.draw(); });
      leaves.forEach((l) => { l.update(); l.draw(); });
      animationId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Parallax lembut mengikuti gerakan mouse (persis logic dari login.js)
  useEffect(() => {
    let targetX = 0;
    let targetY = 0;
    let normMouseX = 0;
    let normMouseY = 0;
    let rafId;

    function handleMouseMove(e) {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    }
    window.addEventListener('mousemove', handleMouseMove);

    function updateParallax() {
      normMouseX += (targetX - normMouseX) * 0.05;
      normMouseY += (targetY - normMouseY) * 0.05;

      const layerImg1 = document.querySelector('.bg-photo-layer--1');
      const layerImg2 = document.querySelector('.bg-photo-layer--2');
      const blob1 = document.querySelector('.blob-1');
      const blob2 = document.querySelector('.blob-2');
      const blob3 = document.querySelector('.blob-3');
      const loginFrame = document.querySelector('.login-frame');
      const heroMainMsg = document.querySelector('.hero-main-msg');

      if (layerImg1) layerImg1.style.transform = `scale(1.04) translate(${normMouseX * 6}px, ${normMouseY * 6}px)`;
      if (layerImg2) layerImg2.style.transform = `scale(1.04) translate(${normMouseX * -10}px, ${normMouseY * -10}px)`;
      if (blob1) blob1.style.transform = `translate(${normMouseX * 15}px, ${normMouseY * 15}px)`;
      if (blob2) blob2.style.transform = `translate(${normMouseX * -18}px, ${normMouseY * -18}px)`;
      if (blob3) blob3.style.transform = `translate(${normMouseX * 8}px, ${normMouseY * -8}px)`;
      if (loginFrame && window.innerWidth > 768) {
        loginFrame.style.transform = `translate(${normMouseX * -5}px, ${normMouseY * -5}px)`;
      } else if (loginFrame) {
        loginFrame.style.transform = 'none';
      }
      if (heroMainMsg) heroMainMsg.style.transform = `translate(${normMouseX * 8}px, ${normMouseY * 8}px)`;

      rafId = requestAnimationFrame(updateParallax);
    }
    updateParallax();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  function handleRipple(e) {
    const container = e.currentTarget.querySelector('.btn-ripple-container');
    if (!container) return;
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const rect = e.currentTarget.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;
    container.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let isValid = true;
    const emailValue = email.trim();
    const passwordValue = password.trim();

    if (emailValue === '') {
      setEmailError('Email tidak boleh kosong.');
      isValid = false;
    } else if (!EMAIL_REGEX.test(emailValue.toLowerCase())) {
      setEmailError('Format email tidak valid (nama@sekolah.sch.id).');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (passwordValue === '') {
      setPasswordError('Password tidak boleh kosong.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!isValid) return;

    setIsSubmitting(true);
    setFormError('');

    try {
      // signInWithPassword() tidak throw untuk kredensial salah -- errornya
      // dikembalikan lewat field `error`, bukan exception (beda dari fetch()
      // ke /api/auth/login yang lama). Lihat catatan migrasi Auth: NIP dipakai
      // sebagai password di Supabase Auth, email tetap jadi username. Tapi
      // panggilan ini TETAP bisa throw untuk kegagalan lain (network down,
      // dsb) -- roadmap item #14: dibungkus try/catch supaya tombol tidak
      // macet diam di "Memverifikasi..." kalau itu terjadi.
      const { error } = await supabase.auth.signInWithPassword({
        email: emailValue,
        password: passwordValue,
      });

      if (error) {
        setPasswordError('Email atau password salah.');
        setIsSubmitting(false);
        return;
      }

      // Sesi disimpan & dikelola supabase-js sendiri (lihat AuthContext, Fase
      // 5) -- tidak perlu lagi menulis token manual ke localStorage di sini.
      // 'guru' (nama utk sapaan Topbar/Dashboard) juga belum diisi di sini --
      // itu baru datang dari tabel profiles di Fase 6 (Migrasikan Profile).
      navigate('/dashboard');
    } catch (err) {
      setFormError(friendlyErrorMessage(err));
      setIsSubmitting(false);
    }
  }

  return (
    <div className="login-wrapper">
      {/* BACKGROUND DYNAMIC ANIMATIONS */}
      <div className="bg-animation-container">
        <canvas ref={canvasRef} id="animation-canvas" />
        <div
          className="bg-photo-layer bg-photo-layer--1"
          style={{ backgroundImage: "url('/assets/logo/bc-login.jpg')" }}
        />
        <div
          className="bg-photo-layer bg-photo-layer--2"
          style={{ backgroundImage: "url('/assets/logo/bc2-login.jpg')" }}
        />
        <div className="bg-color-overlay" />
        <div className="glow-blob blob-1" />
        <div className="glow-blob blob-2" />
        <div className="glow-blob blob-3" />
        <div className="noise-overlay" />
      </div>

      {/* LEFT SECTION: Login Card Column */}
      <section className="login-section" aria-label="Area Login">
        <div className="login-frame">
          <div className="login-card-arch" aria-hidden="true" />
          <img src="/assets/logo/logo-usk.png" alt="Logo Universitas Syiah Kuala" className="login-card-arch__logo" />

          <div className="login-card">
            <div className="card-ornament ornament-top-right" aria-hidden="true" />
            <div className="card-ornament ornament-bottom-left" aria-hidden="true" />

            <div className="card-brand-header">
              <span className="sub-brand">SMART DIAGNOSTIC TKA</span>
              <h1 className="card-title">Masuk</h1>
              <p className="card-subtitle">Silakan masuk menggunakan akun guru yang telah diberikan.</p>
            </div>

            <form id="loginForm" noValidate onSubmit={handleSubmit}>
                <div className={`input-group${emailError ? ' has-error' : ''}`}>
                  <label htmlFor="email" className="input-label">Email</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="nama@sekolah.sch.id"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (e.target.value.trim() !== '') setEmailError('');
                      }}
                    />
                    <span className="focus-border" />
                  </div>
                  <span className="error-message">{emailError}</span>
                </div>

                <div className={`input-group${passwordError ? ' has-error' : ''}`}>
                  <label htmlFor="password" className="input-label">Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      placeholder="Masukkan password Anda"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (e.target.value.trim() !== '') setPasswordError('');
                      }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? (
                        <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                    <span className="focus-border" />
                  </div>
                  <span className="error-message">{passwordError}</span>
                </div>

                <div className="checkbox-group">
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                    />
                    <span className="checkmark" />
                    <span className="checkbox-text">Tampilkan password</span>
                  </label>
                </div>

                <InlineError message={formError} />

                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isSubmitting}
                  onClick={handleRipple}
                >
                  <span className="btn-ripple-container" />
                  <span className="btn-text">{isSubmitting ? 'Memverifikasi...' : 'Masuk'}</span>
                  {!isSubmitting && <span className="btn-arrow" />}
                </button>
              </form>
          </div>
        </div>
      </section>

      {/* RIGHT SECTION: Hero Sidebar */}
      <section className="hero-section" aria-label="Informasi Platform">
        <div className="hero-content">
          <div className="hero-brand">
            <span className="hero-brand-name">SMART DIAGNOSTIC TKA</span>
          </div>

          <div className="hero-main-msg">
            <h2 className="hero-welcome">Selamat Datang</h2>
            <div className="hero-title-group">
              <span className="hero-subtitle">Platform Pelatihan HOTS IPA</span>
              <span className="hero-subtitle highlight">Berbasis Budaya Aceh</span>
            </div>

            <div className="aceh-divider" aria-hidden="true">
              <div className="divider-line" />
              <div className="divider-ornament">
                <svg viewBox="0 0 100 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 15 Q30 5, 50 15 Q70 25, 90 15" stroke="currentColor" strokeWidth="2" fill="none" />
                  <path d="M10 15 Q30 25, 50 15 Q70 5, 90 15" stroke="currentColor" strokeWidth="2" fill="none" />
                  <circle cx="50" cy="15" r="4" fill="currentColor" />
                </svg>
              </div>
              <div className="divider-line" />
            </div>

            <blockquote className="hero-quote">
              <p>&quot;Belajar, Berkolaborasi, dan Tingkatkan Kompetensi Guru melalui Smart Diagnostic TKA.&quot;</p>
            </blockquote>
          </div>

          <div className="feature-icons-footer">
            <div className="feature-icon-item">
              <span className="feature-icon-item__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
              </span>
              <span className="feature-icon-item__label">Materi &amp; Modul<br />Pelatihan</span>
            </div>
            <div className="feature-icon-item">
              <span className="feature-icon-item__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 22h18" />
                  <path d="M6 18v-7M10 18v-7M14 18v-7M18 18v-7" />
                  <path d="M12 2 2 8h20L12 2z" />
                </svg>
              </span>
              <span className="feature-icon-item__label">Bank Stimulus<br />Budaya Aceh</span>
            </div>
            <div className="feature-icon-item">
              <span className="feature-icon-item__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="8" y="2" width="8" height="4" rx="1" />
                  <path d="M9 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3" />
                  <path d="M9 12h6M9 16h6M9 8h1" />
                </svg>
              </span>
              <span className="feature-icon-item__label">Bank Soal<br />HOTS IPA</span>
            </div>
            <div className="feature-icon-item">
              <span className="feature-icon-item__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </span>
              <span className="feature-icon-item__label">Smart<br />Diagnostic</span>
            </div>
            <div className="feature-icon-item">
              <span className="feature-icon-item__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 3v18h18" />
                  <rect x="7" y="12" width="3" height="6" />
                  <rect x="12" y="8" width="3" height="10" />
                  <rect x="17" y="4" width="3" height="14" />
                </svg>
              </span>
              <span className="feature-icon-item__label">Dashboard Hasil<br />Diagnostik</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
