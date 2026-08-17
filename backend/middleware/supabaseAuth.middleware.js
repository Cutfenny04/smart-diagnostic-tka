const supabaseAdmin = require('../config/supabaseAdmin');

// Middleware Auth (migrasi ke Supabase Auth) -- dipakai semua route fitur
// (materi, paketSoal, hasilDiagnostik, soal, wordwall). Jalur JWT lama
// (auth.middleware.js/auth.controller.js/auth.routes.js, atas tabel `guru`)
// sudah dicabut sepenuhnya -- frontend 100% pakai Supabase Auth sekarang.
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
