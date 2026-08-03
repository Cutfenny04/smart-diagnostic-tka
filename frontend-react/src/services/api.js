/* ==========================================================================
   API CONFIG — single source of truth for the backend's base URL.
   Sama seperti frontend/assets/js/api-config.js: auto-pakai localhost saat
   development, dan URL production (Railway) saat di-deploy.
   ========================================================================== */

const PRODUCTION_API_BASE_URL = 'https://resilient-manifestation-production-6f44.up.railway.app';

const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const API_BASE_URL = isLocal ? 'http://localhost:5000' : PRODUCTION_API_BASE_URL;

/* Header standar untuk request yang butuh login (Bearer token dari localStorage). */
export function authHeaders() {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${window.localStorage.getItem('token')}`,
  };
}

/* Dipakai setelah fetch() ke endpoint yang butuh login. Kalau token sudah
   tidak valid/kadaluarsa (401/403), otomatis bersihkan sesi dan lempar ke
   halaman login -- dipakai bersama oleh semua data layer (materi, bank
   soal, dst) supaya tidak ada halaman yang blank begitu saja. */
export async function handleAuthResponse(response) {
  if (response.status === 401 || response.status === 403) {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('guru');
    window.location.href = '/login';
    throw new Error('Sesi berakhir, silakan login kembali.');
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server.');
  }
  return data;
}

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Email atau password salah.');
  }

  return data;
}
