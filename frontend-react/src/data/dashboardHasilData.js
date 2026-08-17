import { API_BASE_URL, authHeaders, handleAuthResponse } from '../services/api';

/* Satu endpoint agregat (backend/controllers/dashboard.controller.js) yang
   menghitung progress materi, performa Non-TKA, dan aktivitas TKA milik
   guru yang login sekaligus -- lihat komentar di controller-nya untuk
   rumus komposit "Progress Pelatihan" (masih placeholder, bukan angka
   final dari klien). */
export async function fetchDashboardHasil() {
  const headers = await authHeaders();
  return fetch(`${API_BASE_URL}/api/dashboard/hasil`, { headers }).then(handleAuthResponse);
}
