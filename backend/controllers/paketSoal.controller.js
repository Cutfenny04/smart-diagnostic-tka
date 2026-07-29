const pool = require('../config/db');

// DB pakai snake_case (hots_level, wordwall_url, created_at), tapi frontend
// (assets/js/bank-soal.js, detail-soal.js, smart-diagnostic.js) sudah dibangun
// mengharapkan camelCase (hotsLevel, wordwallUrl, createdAt) -- map di sini
// supaya tidak ada satu pun file frontend yang perlu diubah.
function toApiShape(row) {
  return {
    id: row.id,
    title: row.title,
    subject: row.subject,
    grade: row.grade,
    hotsLevel: row.hots_level,
    stimulus: row.stimulus,
    wordwallUrl: row.wordwall_url,
    status: row.status,
    createdAt: row.created_at,
  };
}

// Field wajib untuk Create & Edit -- sama seperti validasi di detail-soal.js
// (Judul, Bidang, Jenjang, HOTS, Stimulus wajib; Wordwall URL wajib jika
// status Published). Divalidasi ulang di server karena validasi di frontend
// saja tidak bisa dipercaya.
function validatePaket(body) {
  const { title, subject, grade, hotsLevel, stimulus, wordwallUrl, status } = body;

  if (!title || !subject || !grade || !hotsLevel || !stimulus) {
    return 'Judul, Bidang, Jenjang, Level HOTS, dan Stimulus wajib diisi';
  }
  if (status === 'published' && !wordwallUrl) {
    return 'Link Wordwall wajib diisi jika status Published';
  }
  return null;
}

// LIST - semua paket milik guru yang login. Smart Diagnostic memanggil ini
// dengan ?status=published untuk hanya menampilkan paket yang sudah publish.
async function list(req, res) {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM paket_soal WHERE guru_id = $1';
    const params = [req.guru.id];

    if (status) {
      sql += ' AND status = $2';
      params.push(status);
    }
    sql += ' ORDER BY created_at DESC';

    const { rows } = await pool.query(sql, params);
    return res.json(rows.map(toApiShape));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

// GET ONE - dipakai detail-soal.html mode Edit
async function getById(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM paket_soal WHERE id = $1 AND guru_id = $2',
      [req.params.id, req.guru.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Paket soal tidak ditemukan' });
    }
    return res.json(toApiShape(rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

// CREATE - dipakai detail-soal.html mode Tambah
async function create(req, res) {
  try {
    const errorMessage = validatePaket(req.body);
    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const { title, subject, grade, hotsLevel, stimulus, wordwallUrl, status } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO paket_soal (guru_id, title, subject, grade, hots_level, stimulus, wordwall_url, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.guru.id, title, subject, grade, hotsLevel, stimulus, wordwallUrl || null, status || 'draft']
    );

    return res.status(201).json(toApiShape(rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

// UPDATE - dipakai detail-soal.html mode Edit
async function update(req, res) {
  try {
    const errorMessage = validatePaket(req.body);
    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const { rows: existing } = await pool.query(
      'SELECT id FROM paket_soal WHERE id = $1 AND guru_id = $2',
      [req.params.id, req.guru.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Paket soal tidak ditemukan' });
    }

    const { title, subject, grade, hotsLevel, stimulus, wordwallUrl, status } = req.body;
    const { rows } = await pool.query(
      `UPDATE paket_soal
       SET title = $1, subject = $2, grade = $3, hots_level = $4, stimulus = $5, wordwall_url = $6, status = $7
       WHERE id = $8
       RETURNING *`,
      [title, subject, grade, hotsLevel, stimulus, wordwallUrl || null, status || 'draft', req.params.id]
    );

    return res.json(toApiShape(rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

// DELETE - dipakai confirm modal "Hapus Paket Soal?" di bank-soal.html
async function remove(req, res) {
  try {
    const result = await pool.query(
      'DELETE FROM paket_soal WHERE id = $1 AND guru_id = $2',
      [req.params.id, req.guru.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Paket soal tidak ditemukan' });
    }
    return res.json({ message: 'Paket soal berhasil dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

module.exports = { list, getById, create, update, remove };
