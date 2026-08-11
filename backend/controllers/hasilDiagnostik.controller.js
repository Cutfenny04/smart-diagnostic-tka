const pool = require('../config/db');

// DB pakai snake_case, frontend mengharapkan camelCase -- pola yang sama
// dengan paketSoal.controller.js/soal.controller.js. Ikut join ke
// paket_soal supaya frontend (HasilDiagnostik.jsx) tidak perlu fetch kedua
// kali cuma untuk tahu judul/tipe/bidang paket yang dikerjakan.
function toApiShape(row) {
  return {
    id: row.id,
    paketId: row.paket_id,
    paketTitle: row.paket_title,
    paketType: row.paket_type,
    paketSubject: row.paket_subject,
    score: Number(row.score),
    correctCount: row.correct_count,
    wrongCount: row.wrong_count,
    totalQuestions: row.total_questions,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    createdAt: row.created_at,
  };
}

// POST /api/hasil-diagnostik -- dipanggil NonTkaGame.jsx begitu guru
// menyelesaikan seluruh soal Non-TKA. Skor dihitung di client (lihat catatan
// scope di soal.controller.js), di sini cuma disimpan apa adanya.
async function create(req, res) {
  try {
    const { paketId, score, correctCount, wrongCount, totalQuestions, startedAt, completedAt } = req.body;

    if (!paketId || score === undefined || correctCount === undefined || totalQuestions === undefined) {
      return res.status(400).json({ message: 'paketId, score, correctCount, dan totalQuestions wajib diisi' });
    }

    const { rows } = await pool.query(
      `INSERT INTO hasil_diagnostik (paket_id, guru_id, score, correct_count, wrong_count, total_questions, started_at, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        paketId,
        req.guru.id,
        score,
        correctCount,
        wrongCount ?? Math.max(totalQuestions - correctCount, 0),
        totalQuestions,
        startedAt || null,
        completedAt || null,
      ]
    );

    return res.status(201).json(toApiShape(rows[0]));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

// GET /api/hasil-diagnostik -- riwayat latihan milik guru yang login saja
// (beda dari paket_soal yang bacaan bersama -- hasil diagnostik itu
// aktivitas pribadi tiap guru, dipakai HasilDiagnostik.jsx).
async function list(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT h.*, p.title AS paket_title, p.type AS paket_type, p.subject AS paket_subject
       FROM hasil_diagnostik h
       LEFT JOIN paket_soal p ON p.id = h.paket_id
       WHERE h.guru_id = $1
       ORDER BY h.created_at DESC`,
      [req.guru.id]
    );
    return res.json(rows.map(toApiShape));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

module.exports = { create, list };
