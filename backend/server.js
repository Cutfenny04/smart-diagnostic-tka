const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());        // supaya frontend (beda origin) bisa akses backend ini
app.use(express.json()); // supaya bisa baca req.body dalam format JSON

// Route dasar buat cek server hidup
app.get('/', (req, res) => {
  res.send('Backend Platform Pelatihan Guru aktif 🚀');
});

// Semua route auth ada di prefix /api/auth
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
