import { API_BASE_URL, authHeaders, handleAuthResponse } from '../services/api';

/* Butir soal satu paket Non-TKA, urut order_number -- dipakai NonTkaGame.jsx. */
export async function fetchSoalByPaket(paketId) {
  const headers = await authHeaders();
  return fetch(`${API_BASE_URL}/api/soal?paketId=${paketId}`, { headers }).then(handleAuthResponse);
}
