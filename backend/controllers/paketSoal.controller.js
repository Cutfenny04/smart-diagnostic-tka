const pool = require('../config/db');

// DB pakai snake_case (hots_level, wordwall_url, created_at), tapi frontend
// (assets/js/bank-soal.js, detail-soal.js, smart-diagnostic.js) sudah dibangun
// mengharapkan camelCase (hotsLevel, wordwallUrl, createdAt) -- map di sini
// supaya tidak ada satu pun file frontend yang perlu diubah.
//
// Revisi 8 (lihat PIVOT_PLAN.md §B3): paket_soal.guru_id di-rename jadi
// created_by_guru_id (audit saja, bukan kepemilikan), dan tambah `type`
// (TKA/NON_TKA). Bank soal sekarang bacaan bersama untuk semua guru --
// list/getById TIDAK lagi difilter per akun (lihat perubahan di bawah).
function toApiShape(row) {
  return {
    id: row.id,
    createdByGuruId: row.created_by_guru_id,
    title: row.title,
    type: row.type,
    subject: row.subject,
    grade: row.grade,
    hotsLevel: row.hots_level,
    stimulus: row.stimulus,
    thumbnail: row.thumbnail,
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

// LIST - bank soal bersama, semua guru melihat paket yang sama (Revisi 8,
// tidak lagi difilter per akun). ?status=published dipakai Smart Diagnostic;
// ?type=TKA|NON_TKA opsional untuk filter jenis paket.
async function list(req, res) {
  try {
    const { status, type } = req.query;
    let sql = 'SELECT * FROM paket_soal WHERE 1=1';
    const params = [];

    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }
    if (type) {
      params.push(type);
      sql += ` AND type = $${params.length}`;
    }
    sql += ' ORDER BY created_at DESC';

    const { rows } = await pool.query(sql, params);
    return res.json(rows.map(toApiShape));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

// GET ONE - dipakai detail-soal.html mode Edit, dan halaman detail read-only
async function getById(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM paket_soal WHERE id = $1',
      [req.params.id]
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

// CREATE - Revisi 8 Fase 7A (PIVOT_PLAN.md §A/§B): guru CUMA boleh membuat
// paket TKA (aktivitas Wordwall yang mereka buat sendiri, lalu didaftarkan
// ke sini). Non-TKA tetap eksklusif milik tim dev lewat
// scripts/import_soal_non_tka.js -- `type` di sini SENGAJA di-hardcode
// 'TKA', bukan diambil dari req.body, supaya guru tidak bisa membuat paket
// Non-TKA lewat request yang dimanipulasi. created_by_guru_id dicatat untuk
// audit saja, bukan kepemilikan (paket yang sudah dibuat tetap
// terlihat/terkelola oleh semua guru, konsisten dengan bank soal bersama).
async function create(req, res) {
  try {
    const errorMessage = validatePaket(req.body);
    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const { title, subject, grade, hotsLevel, stimulus, wordwallUrl, status } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO paket_soal (created_by_guru_id, title, type, subject, grade, hots_level, stimulus, wordwall_url, status)
       VALUES ($1, $2, 'TKA', $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [req.user.id, title, subject, grade, hotsLevel, stimulus, wordwallUrl || null, status || 'draft']
    );

    return res.status(201).json(toApiShape(rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

// UPDATE - hanya boleh untuk paket bertipe TKA. Dicek di server (bukan cuma
// disembunyikan di UI) supaya guru tidak bisa mengubah paket Non-TKA lewat
// request API yang dimanipulasi langsung -- lihat PIVOT_PLAN.md §B1.
async function update(req, res) {
  try {
    const errorMessage = validatePaket(req.body);
    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const { rows: existing } = await pool.query(
      'SELECT id, type FROM paket_soal WHERE id = $1',
      [req.params.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Paket soal tidak ditemukan' });
    }
    if (existing[0].type !== 'TKA') {
      return res.status(403).json({ message: 'Paket Non-TKA tidak bisa diubah lewat sini' });
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

// DELETE - sama seperti update, cuma boleh untuk paket bertipe TKA.
async function remove(req, res) {
  try {
    const { rows: existing } = await pool.query(
      'SELECT id, type FROM paket_soal WHERE id = $1',
      [req.params.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Paket soal tidak ditemukan' });
    }
    if (existing[0].type !== 'TKA') {
      return res.status(403).json({ message: 'Paket Non-TKA tidak bisa dihapus lewat sini' });
    }

    await pool.query('DELETE FROM paket_soal WHERE id = $1', [req.params.id]);
    return res.json({ message: 'Paket soal berhasil dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

module.exports = { list, getById, create, update, remove };
