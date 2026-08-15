import { API_BASE_URL, authHeaders, handleAuthResponse } from '../services/api';

/* Revisi 8 Fase 6 (PIVOT_PLAN.md §C): riwayat hasil diagnostik guru yang
   login, dari hasil_diagnostik lewat backend -- bukan lagi data dummy. */
export async function fetchHasil() {
  const headers = await authHeaders();
  return fetch(`${API_BASE_URL}/api/hasil-diagnostik`, { headers }).then(handleAuthResponse);
}

/* Dipanggil NonTkaGame.jsx begitu seluruh soal selesai dijawab. */
export async function saveHasil(hasil) {
  const headers = await authHeaders();
  return fetch(`${API_BASE_URL}/api/hasil-diagnostik`, {
    method: 'POST',
    headers,
    body: JSON.stringify(hasil),
  }).then(handleAuthResponse);
}
