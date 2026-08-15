/* ==========================================================================
   API CONFIG — single source of truth for the backend's base URL.
   Sama seperti frontend/assets/js/api-config.js: auto-pakai localhost saat
   development, dan URL production (Railway) saat di-deploy.
   ========================================================================== */

import { supabase } from './supabaseClient';

const PRODUCTION_API_BASE_URL = 'https://resilient-manifestation-production-6f44.up.railway.app';

const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const API_BASE_URL = isLocal ? 'http://localhost:5000' : PRODUCTION_API_BASE_URL;

/* Header standar untuk request yang butuh login. Fase 5: token diambil
   langsung dari sesi Supabase yang sedang aktif (getSession() otomatis
   me-refresh kalau access token sudah kedaluwarsa tapi refresh token masih
   valid) -- bukan lagi salinan statis di localStorage seperti Fase 4. */
export async function authHeaders() {
  const { data } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${data.session?.access_token ?? ''}`,
  };
}

/* Dipakai setelah fetch() ke endpoint yang butuh login. Kalau token sudah
   tidak valid/kadaluarsa (401/403), sign-out sesi Supabase yang mungkin
   sudah rusak lalu lempar ke halaman login -- dipakai bersama oleh semua
   data layer (materi, bank soal, dst) supaya tidak ada halaman yang blank
   begitu saja. */
export async function handleAuthResponse(response) {
  if (response.status === 401 || response.status === 403) {
    await supabase.auth.signOut();
    window.location.href = '/login';
    throw new Error('Sesi berakhir, silakan login kembali.');
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server.');
  }
  return data;
}
