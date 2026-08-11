import { API_BASE_URL, authHeaders, handleAuthResponse } from '../services/api';

/* Data guru yang sedang login sungguhan, dari GET /api/auth/me -- bukan
   lagi data prototype statis. Tabel `guru` cuma punya nama/email/tanggal
   daftar (lihat backend/sql), jadi field seperti sekolah/mata pelajaran
   yang dulu ditampilkan di sini dihapus, bukan diisi placeholder baru. */
export function fetchProfil() {
  return fetch(`${API_BASE_URL}/api/auth/me`, { headers: authHeaders() }).then(handleAuthResponse);
}
