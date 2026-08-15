const pool = require('../config/db');

// GET /api/materi - ambil semua materi + progress guru yang login
async function getAllMateri(req, res) {
  try {
    const guruId = req.user.id; // didapat dari token Supabase (via supabaseAuth.middleware)

    const { rows } = await pool.query(
      `SELECT
         m.id,
         m.title,
         m.deskripsi AS "desc",
         m.category,
         m.duration,
         m.materi_count AS "materiCount",
         m.created_at AS "dateAdded",
         COALESCE(p.progress, 0) AS progress,
         p.last_opened AS "lastOpened"
       FROM materi m
       LEFT JOIN progress_materi p
         ON p.materi_id = m.id AND p.guru_id = $1
       ORDER BY m.created_at DESC`,
      [guruId]
    );

    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal mengambil data materi' });
  }
}

// GET /api/materi/:id - ambil 1 materi detail
async function getMateriById(req, res) {
  try {
    const guruId = req.user.id;
    const { id } = req.params;

    const { rows } = await pool.query(
      `SELECT
         m.id,
         m.title,
         m.deskripsi AS "desc",
         m.category,
         m.duration,
         m.materi_count AS "materiCount",
         m.konten_url AS "kontenUrl",
         COALESCE(p.progress, 0) AS progress
       FROM materi m
       LEFT JOIN progress_materi p
         ON p.materi_id = m.id AND p.guru_id = $1
       WHERE m.id = $2`,
      [guruId, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Materi tidak ditemukan' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal mengambil detail materi' });
  }
}

// POST /api/materi/:id/progress - update progress belajar guru untuk materi ini
async function updateProgress(req, res) {
  try {
    const guruId = req.user.id;
    const { id } = req.params;
    const { progress } = req.body;

    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress harus antara 0-100' });
    }

    // INSERT ... ON CONFLICT: kalau belum ada baris progress, buat baru;
    // kalau sudah ada, update aja (karena guru_id + materi_id itu unik)
    await pool.query(
      `INSERT INTO progress_materi (guru_id, materi_id, progress, last_opened)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (guru_id, materi_id) DO UPDATE SET progress = $3, last_opened = NOW()`,
      [guruId, id, progress]
    );

    return res.json({ message: 'Progress berhasil disimpan' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal menyimpan progress' });
  }
}

module.exports = { getAllMateri, getMateriById, updateProgress };
