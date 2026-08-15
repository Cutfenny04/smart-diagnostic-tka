const supabaseAdmin = require('../config/supabaseAdmin');

// Middleware Auth baru (Fase 3 migrasi ke Supabase Auth) -- dipakai semua
// route fitur (materi, paketSoal, hasilDiagnostik, soal, wordwall).
// auth.middleware.js lama TIDAK dihapus, masih dipakai auth.routes.js untuk
// endpoint /me dan /password yang jalan di atas tabel `guru` lama (backup
// sampai cutover selesai, lihat riwayat migrasi Auth).
//
// Verifikasi lewat supabaseAdmin.auth.getUser(token) (bukan jsonwebtoken)
// supaya tidak perlu urus JWKS/algoritma signing Supabase sendiri -- Supabase
// yang memvalidasi token ke servernya.
async function verifySupabaseToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan, silakan login' });
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    return res.status(403).json({ message: 'Token tidak valid atau sudah kedaluwarsa' });
  }

  req.user = { id: data.user.id, email: data.user.email };
  next();
}

module.exports = verifySupabaseToken;
