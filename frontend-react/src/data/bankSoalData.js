import { API_BASE_URL, authHeaders, handleAuthResponse } from '../services/api';

/* Revisi 8 Fase 7A (PIVOT_PLAN.md §B1): Bank Soal bacaan bersama untuk
   semua guru, TAPI guru tetap boleh CRUD paket bertipe TKA (aktivitas
   Wordwall yang mereka buat sendiri, lalu didaftarkan ke sini). Non-TKA
   tetap murni read-only -- backend menolak create/update/delete kalau
   target-nya bukan TKA (lihat paketSoal.controller.js), jadi DetailSoal.jsx
   hanya dipakai untuk paket TKA. */
export async function fetchPaketSoal() {
  const headers = await authHeaders();
  return fetch(`${API_BASE_URL}/api/paket-soal`, { headers }).then(handleAuthResponse);
}

/* Resolve null kalau tidak ditemukan (bukan reject) -- dipakai DetailSoal
   mode Edit supaya bisa bedakan "belum selesai fetch" vs "id tidak ada". */
export async function fetchPaketById(id) {
  const headers = await authHeaders();
  return fetch(`${API_BASE_URL}/api/paket-soal/${id}`, { headers }).then((response) => {
    if (response.status === 404) return null;
    return handleAuthResponse(response);
  });
}

export async function savePaket(paket) {
  const isEdit = Boolean(paket.id);
  const url = `${API_BASE_URL}/api/paket-soal${isEdit ? '/' + paket.id : ''}`;
  const headers = await authHeaders();

  return fetch(url, {
    method: isEdit ? 'PUT' : 'POST',
    headers,
    body: JSON.stringify(paket),
  }).then(handleAuthResponse);
}

/* Hapus satu paket TKA, lalu resolve dengan daftar paket terbaru -- caller
   langsung render ulang dari hasil ini. */
export async function deletePaket(id) {
  const headers = await authHeaders();
  return fetch(`${API_BASE_URL}/api/paket-soal/${id}`, {
    method: 'DELETE',
    headers,
  })
    .then(handleAuthResponse)
    .then(fetchPaketSoal);
}
