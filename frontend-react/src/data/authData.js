/* ==========================================================================
   AUTH — Data layer untuk aksi akun selain login. Fase A (perbaikan Ubah
   Password): sepenuhnya lewat Supabase Auth, bukan lagi /api/auth/password
   (endpoint lama itu masih ada di backend sebagai backup tabel `guru`, tapi
   tidak lagi dipakai frontend).
   ========================================================================== */
import { supabase } from '../services/supabaseClient';

/**
 * Ganti password guru yang sedang login. supabase.auth.updateUser() sendiri
 * tidak minta/verifikasi password lama (cukup modal sesi yang sedang aktif)
 * -- oldPassword di sini sengaja tetap diverifikasi manual lewat
 * signInWithPassword() dulu, supaya guru yang lupa logout di komputer
 * bersama tidak bisa diganti passwordnya orang lain tanpa tahu password
 * lamanya.
 */
export async function changePassword(oldPassword, newPassword) {
  const { data: userData, error: userErr } = await supabase.auth.getUser();
  if (userErr || !userData.user?.email) {
    throw new Error('Sesi berakhir, silakan login kembali.');
  }

  const { error: verifyErr } = await supabase.auth.signInWithPassword({
    email: userData.user.email,
    password: oldPassword,
  });
  if (verifyErr) {
    throw new Error('Password lama salah.');
  }

  const { error: updateErr } = await supabase.auth.updateUser({ password: newPassword });
  if (updateErr) {
    throw new Error(updateErr.message || 'Gagal mengubah password.');
  }
}
