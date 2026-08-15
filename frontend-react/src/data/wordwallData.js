import { API_BASE_URL, authHeaders, handleAuthResponse } from '../services/api';

/* Cek server-side apakah URL Wordwall boleh di-embed (lihat catatan di
   backend/controllers/wordwall.controller.js) -- dipakai EmbedView di
   SmartDiagnostic.jsx sebelum menampilkan iframe. */
export async function checkWordwallEmbeddable(url) {
  const headers = await authHeaders();
  return fetch(`${API_BASE_URL}/api/wordwall/check-embed?url=${encodeURIComponent(url)}`, {
    headers,
  }).then(handleAuthResponse);
}
