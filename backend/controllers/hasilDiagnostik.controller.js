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

// Roadmap item #16 (2026-08-22): sebelumnya score/correctCount/totalQuestions
// dari req.body disimpan mentah-mentah tanpa dicek sama sekali -- guru (atau
// siapapun dengan token valid) bisa POST langsung ke endpoint ini dan kirim
// score: 500, atau correctCount lebih besar dari totalQuestions, atau
// totalQuestions yang tidak sesuai jumlah soal asli di paket itu, dan semua
// itu akan tersimpan apa adanya lalu ikut menghitung Rata-rata/Nilai
// Tertinggi di Dashboard Hasil. Skor TETAP dihitung di client (arsitektur ini
// sengaja tidak diubah -- lihat catatan scope soal.controller.js, itu
// keputusan yang sudah ada), tapi backend sekarang menolak nilai yang secara
// matematis mustahil, alih-alih mempercayai apa pun yang dikirim React.
function validateHasil({ score, correctCount, wrongCount, totalQuestions }, realTotalQuestions) {
  if (!Number.isFinite(score) || score < 0 || score > 100) {
    return 'score harus angka antara 0 dan 100';
  }
  if (!Number.isInteger(correctCount) || correctCount < 0) {
    return 'correctCount harus bilangan bulat tidak negatif';
  }
  if (!Number.isInteger(totalQuestions) || totalQuestions <= 0) {
    return 'totalQuestions harus bilangan bulat positif';
  }
  if (correctCount > totalQuestions) {
    return 'correctCount tidak boleh lebih besar dari totalQuestions';
  }
  if (wrongCount !== undefined && (!Number.isInteger(wrongCount) || wrongCount < 0 || correctCount + wrongCount > totalQuestions)) {
    return 'wrongCount tidak konsisten dengan correctCount/totalQuestions';
  }
  if (totalQuestions !== realTotalQuestions) {
    return `totalQuestions tidak sesuai jumlah soal asli paket ini (seharusnya ${realTotalQuestions})`;
  }
  // Rumus persis sama seperti yang dipakai NonTkaGame.jsx menghitung score
  // di client (Math.round(correctCount/total*100)) -- kalau score yang
  // dikirim tidak cocok dengan correctCount/totalQuestions, berarti
  // dimanipulasi (mis. score: 500 walau correctCount cuma 1 dari 30).
  const expectedScore = Math.round((correctCount / totalQuestions) * 100);
  if (score !== expectedScore) {
    return `score tidak konsisten dengan correctCount/totalQuestions (seharusnya ${expectedScore})`;
  }
  return null;
}

// POST /api/hasil-diagnostik -- dipanggil NonTkaGame.jsx begitu guru
// menyelesaikan seluruh soal Non-TKA. Skor dihitung di client (lihat catatan
// scope di soal.controller.js), di sini divalidasi dulu sebelum disimpan.
async function create(req, res) {
  try {
    const { paketId, score, correctCount, wrongCount, totalQuestions, startedAt, completedAt } = req.body;

    if (!paketId || score === undefined || correctCount === undefined || totalQuestions === undefined) {
      return res.status(400).json({ message: 'paketId, score, correctCount, dan totalQuestions wajib diisi' });
    }

    const { rows: soalCountRows } = await pool.query('SELECT COUNT(*) FROM soal WHERE paket_id = $1', [paketId]);
    const realTotalQuestions = Number(soalCountRows[0].count);

    const numericScore = Number(score);
    const numericCorrectCount = Number(correctCount);
    const numericWrongCount = wrongCount === undefined ? undefined : Number(wrongCount);
    const numericTotalQuestions = Number(totalQuestions);

    const errorMessage = validateHasil(
      { score: numericScore, correctCount: numericCorrectCount, wrongCount: numericWrongCount, totalQuestions: numericTotalQuestions },
      realTotalQuestions
    );
    if (errorMessage) {
      return res.status(400).json({ message: errorMessage });
    }

    const { rows } = await pool.query(
      `INSERT INTO hasil_diagnostik (paket_id, guru_id, score, correct_count, wrong_count, total_questions, started_at, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        paketId,
        req.user.id,
        numericScore,
        numericCorrectCount,
        numericWrongCount ?? Math.max(numericTotalQuestions - numericCorrectCount, 0),
        numericTotalQuestions,
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
      [req.user.id]
    );
    return res.json(rows.map(toApiShape));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

module.exports = { create, list };
