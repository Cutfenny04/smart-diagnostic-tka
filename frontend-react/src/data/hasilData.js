import { API_BASE_URL, authHeaders, handleAuthResponse } from '../services/api';

/* Revisi 8 Fase 6 (PIVOT_PLAN.md §C): riwayat hasil diagnostik guru yang
   login, dari hasil_diagnostik lewat backend -- bukan lagi data dummy. */
export function fetchHasil() {
  return fetch(`${API_BASE_URL}/api/hasil-diagnostik`, { headers: authHeaders() }).then(handleAuthResponse);
}

/* Dipanggil NonTkaGame.jsx begitu seluruh soal selesai dijawab. */
export function saveHasil(hasil) {
  return fetch(`${API_BASE_URL}/api/hasil-diagnostik`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(hasil),
  }).then(handleAuthResponse);
}
