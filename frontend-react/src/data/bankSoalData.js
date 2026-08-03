import { API_BASE_URL, authHeaders, handleAuthResponse } from '../services/api';

export function fetchPaketSoal() {
  return fetch(`${API_BASE_URL}/api/paket-soal`, { headers: authHeaders() }).then(handleAuthResponse);
}

/* Resolve null kalau tidak ditemukan (bukan reject) -- dipakai DetailSoal
   mode Edit supaya bisa bedakan "belum selesai fetch" vs "id tidak ada". */
export function fetchPaketById(id) {
  return fetch(`${API_BASE_URL}/api/paket-soal/${id}`, { headers: authHeaders() }).then((response) => {
    if (response.status === 404) return null;
    return handleAuthResponse(response);
  });
}

export function savePaket(paket) {
  const isEdit = Boolean(paket.id);
  const url = `${API_BASE_URL}/api/paket-soal${isEdit ? '/' + paket.id : ''}`;

  return fetch(url, {
    method: isEdit ? 'PUT' : 'POST',
    headers: authHeaders(),
    body: JSON.stringify(paket),
  }).then(handleAuthResponse);
}

/* Hapus satu paket, lalu resolve dengan daftar paket terbaru -- caller
   langsung render ulang dari hasil ini. */
export function deletePaket(id) {
  return fetch(`${API_BASE_URL}/api/paket-soal/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
    .then(handleAuthResponse)
    .then(fetchPaketSoal);
}
