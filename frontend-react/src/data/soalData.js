import { API_BASE_URL, authHeaders, handleAuthResponse } from '../services/api';

/* Butir soal satu paket Non-TKA, urut order_number -- dipakai NonTkaGame.jsx. */
export function fetchSoalByPaket(paketId) {
  return fetch(`${API_BASE_URL}/api/soal?paketId=${paketId}`, { headers: authHeaders() }).then(handleAuthResponse);
}
