const express = require('express');
const cors = require('cors');
require('dotenv').config();

const materiRoutes = require('./routes/materi.routes');
const paketSoalRoutes = require('./routes/paketSoal.routes');
const soalRoutes = require('./routes/soal.routes');
const hasilDiagnostikRoutes = require('./routes/hasilDiagnostik.routes');
const wordwallRoutes = require('./routes/wordwall.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

// Temuan audit 2026-08-20 (roadmap item #7): cors() tanpa opsi mengizinkan
// SEMUA origin. Dibatasi lewat CORS_ORIGIN (daftar origin dipisah koma) --
// TAPI kalau env var ini belum diset (mis. Railway production belum
// dikonfigurasi), sengaja fallback ke perilaku lama (izinkan semua) supaya
// deploy ini TIDAK langsung memutus akses frontend production begitu saja.
// Set CORS_ORIGIN di Railway ke domain Vercel asli (mis.
// "https://smart-diagnostic-tka.vercel.app") begitu sempat, baru
// pembatasan ini benar-benar berlaku di production.
const corsOriginEnv = (process.env.CORS_ORIGIN || '').trim();
const allowedOrigins = corsOriginEnv ? corsOriginEnv.split(',').map((s) => s.trim()).filter(Boolean) : null;

app.use(cors(
  allowedOrigins
    ? {
        origin(origin, callback) {
          // origin kosong = request non-browser (curl, server-to-server) -- selalu izinkan.
          if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
          return callback(new Error('Origin tidak diizinkan oleh CORS'));
        },
      }
    : undefined
));
app.use(express.json()); // supaya bisa baca req.body dalam format JSON

// Route dasar buat cek server hidup
app.get('/', (req, res) => {
  res.send('Backend Platform Pelatihan Guru aktif 🚀');
});

app.use('/api/materi', materiRoutes);

// Semua route paket soal (Bank Soal) ada di prefix /api/paket-soal
app.use('/api/paket-soal', paketSoalRoutes);

// Butir soal (dipakai game Non-TKA) ada di prefix /api/soal
app.use('/api/soal', soalRoutes);

// Hasil diagnostik (riwayat latihan guru) ada di prefix /api/hasil-diagnostik
app.use('/api/hasil-diagnostik', hasilDiagnostikRoutes);

// Utilitas cek embed Wordwall ada di prefix /api/wordwall
app.use('/api/wordwall', wordwallRoutes);

// Ringkasan agregat Dashboard Hasil ada di prefix /api/dashboard
app.use('/api/dashboard', dashboardRoutes);

// Error handler global -- sebelumnya tidak ada sama sekali, jadi error yang
// nyasar ke sini (mis. CORS di atas menolak origin lewat callback(new
// Error(...))) jatuh ke default Express: HTML mentah berisi stack trace
// LENGKAP termasuk path file server, kebocoran informasi ke siapapun yang
// kirim request dengan header Origin sembarangan. Wajib ada 4 parameter
// (err, req, res, next) supaya Express mengenalinya sebagai error handler,
// walau `next` tidak dipakai.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Terjadi kesalahan pada server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
