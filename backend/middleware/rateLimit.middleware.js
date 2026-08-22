const rateLimit = require('express-rate-limit');

// Roadmap item #16 (2026-08-22): rate limiting -- `express-rate-limit` sudah
// ada di package.json tapi belum pernah benar-benar dipakai di mana pun
// sebelum ini. Catatan penting: platform ini TIDAK punya endpoint login di
// backend Express -- login lewat Supabase Auth langsung dari frontend
// (lihat services/supabaseClient.js), jadi "rate limit POST login" dari
// permintaan user tidak berlaku di sini -- itu sudah ditangani Supabase
// sendiri di sisi mereka. Yang benar-benar ada di backend ini dan perlu
// dibatasi: POST /api/paket-soal (buat paket TKA) dan POST
// /api/hasil-diagnostik (submit hasil Non-TKA), ditambah satu limiter umum
// untuk seluruh /api/* sebagai lapisan pertahanan tambahan.
//
// Angka di bawah ini perkiraan wajar untuk skala pemakaian guru individu,
// BUKAN angka resmi dari klien -- gampang diubah di satu tempat ini kalau
// nanti ada kebutuhan berbeda.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak permintaan, silakan coba lagi nanti.' },
});

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Terlalu banyak permintaan, silakan coba lagi nanti.' },
});

module.exports = { apiLimiter, writeLimiter };
