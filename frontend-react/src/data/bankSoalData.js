import { API_BASE_URL, authHeaders, handleAuthResponse } from '../services/api';

/* Revisi 8: Bank Soal jadi bacaan bersama untuk semua guru (tidak ada lagi
   create/edit/delete dari sisi guru -- lihat PIVOT_PLAN.md §B1). */
export function fetchPaketSoal() {
  return fetch(`${API_BASE_URL}/api/paket-soal`, { headers: authHeaders() }).then(handleAuthResponse);
}
