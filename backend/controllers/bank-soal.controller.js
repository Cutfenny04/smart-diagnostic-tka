const pool = require('../config/db');

// Ubah judul jadi slug (misal "Kopi Gayo" -> "kopi-gayo")
function toSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
}

// GET /api/bank-soal - ambil semua paket soal (bisa difilter ?status=published)
async function getAllPaketSoal(req, res) {
  try {
    const { status } = req.query;
    let sql = `SELECT 
         id, slug, title, subject, grade,
         hots_level AS hotsLevel, stimulus,
         wordwall_url AS wordwallUrl, status,
         created_at AS createdAt
       FROM paket_soal`;
    const params = [];

    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    sql += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(sql, params);
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal mengambil data bank soal' });
  }
}

// GET /api/bank-soal/:slug - ambil 1 paket soal detail
async function getPaketSoalBySlug(req, res) {
  try {
    const { slug } = req.params;
    const [rows] = await pool.query(
      `SELECT 
         id, slug, title, subject, grade,
         hots_level AS hotsLevel, stimulus,
         wordwall_url AS wordwallUrl, status,
         created_at AS createdAt
       FROM paket_soal
       WHERE slug = ?`,
      [slug]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Paket soal tidak ditemukan' });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal mengambil detail paket soal' });
  }
}

// POST /api/bank-soal - tambah paket soal baru
async function createPaketSoal(req, res) {
  try {
    const { title, subject, grade, hotsLevel, stimulus, wordwallUrl, status } = req.body;

    if (!title || !subject || !grade || !hotsLevel || !stimulus) {
      return res.status(400).json({ message: 'Judul, bidang, jenjang, level HOTS, dan stimulus wajib diisi' });
    }

    const slug = toSlug(title);
    const finalStatus = status === 'published' ? 'published' : 'draft';

    const [result] = await pool.query(
      `INSERT INTO paket_soal (slug, title, subject, grade, hots_level, stimulus, wordwall_url, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [slug, title, subject, grade, hotsLevel, stimulus, wordwallUrl || null, finalStatus]
    );

    return res.status(201).json({ message: 'Paket soal berhasil ditambahkan', id: result.insertId, slug });
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Paket soal dengan judul serupa sudah ada' });
    }
    return res.status(500).json({ message: 'Gagal menambahkan paket soal' });
  }
}

// PUT /api/bank-soal/:slug - update paket soal
async function updatePaketSoal(req, res) {
  try {
    const { slug } = req.params;
    const { title, subject, grade, hotsLevel, stimulus, wordwallUrl, status } = req.body;

    const [existing] = await pool.query('SELECT id FROM paket_soal WHERE slug = ?', [slug]);
    if (existing.length === 0) {
      return res.status(404).json({ message: 'Paket soal tidak ditemukan' });
    }

    await pool.query(
      `UPDATE paket_soal 
       SET title = ?, subject = ?, grade = ?, hots_level = ?, stimulus = ?, wordwall_url = ?, status = ?
       WHERE slug = ?`,
      [title, subject, grade, hotsLevel, stimulus, wordwallUrl || null, status, slug]
    );

    return res.json({ message: 'Paket soal berhasil diperbarui' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal memperbarui paket soal' });
  }
}

// DELETE /api/bank-soal/:slug - hapus paket soal
async function deletePaketSoal(req, res) {
  try {
    const { slug } = req.params;

    const [result] = await pool.query('DELETE FROM paket_soal WHERE slug = ?', [slug]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Paket soal tidak ditemukan' });
    }

    return res.json({ message: 'Paket soal berhasil dihapus' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal menghapus paket soal' });
  }
}

module.exports = {
  getAllPaketSoal,
  getPaketSoalBySlug,
  createPaketSoal,
  updatePaketSoal,
  deletePaketSoal,
};