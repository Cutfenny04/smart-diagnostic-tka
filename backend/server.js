const express = require('express');
const cors = require('cors');
require('dotenv').config();

const materiRoutes = require('./routes/materi.routes');
const paketSoalRoutes = require('./routes/paketSoal.routes');
const soalRoutes = require('./routes/soal.routes');
const hasilDiagnostikRoutes = require('./routes/hasilDiagnostik.routes');
const wordwallRoutes = require('./routes/wordwall.routes');

const app = express();

app.use(cors());        // supaya frontend (beda origin) bisa akses backend ini
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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
