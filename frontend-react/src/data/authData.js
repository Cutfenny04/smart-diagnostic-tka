/* ==========================================================================
   AUTH — Data layer untuk aksi akun selain login/register (sama persis
   kontraknya dengan frontend/assets/data/auth.js versi lama).

   Sengaja TIDAK memakai handleAuthResponse dari services/api.js: kalau sesi
   kadaluarsa persis saat guru sedang isi form ganti password, halaman ini
   harus tetap menampilkan pesan error dari server di form, bukan langsung
   redirect paksa ke login.
   ========================================================================== */
import { API_BASE_URL, authHeaders } from '../services/api';

async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan pada server.');
  }
  return data;
}

/**
 * Ganti password guru yang sedang login. Reject dengan pesan dari server
 * (mis. "Password lama salah") kalau gagal -- caller menampilkannya di form.
 */
export function changePassword(oldPassword, newPassword) {
  return fetch(`${API_BASE_URL}/api/auth/password`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ oldPassword, newPassword }),
  }).then(handleResponse);
}
