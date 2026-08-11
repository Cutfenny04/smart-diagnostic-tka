const pool = require('../config/db');

// DB pakai snake_case, frontend (NonTkaGame.jsx) mengharapkan camelCase --
// map di sini seperti pola yang sama di paketSoal.controller.js.
function toApiShape(row) {
  return {
    id: row.id,
    paketId: row.paket_id,
    question: row.question,
    stimulus: row.stimulus,
    image: row.image,
    options: row.options,
    correctAnswer: row.correct_answer,
    explanation: row.explanation,
    gameType: row.game_type,
    orderNumber: row.order_number,
  };
}

// GET /api/soal?paketId=X -- daftar butir soal satu paket, urut order_number.
// Revisi 8 (lihat PIVOT_PLAN.md §C Fase 5): correctAnswer ikut dikirim ke
// client dan divalidasi di browser -- belum ada endpoint submit-jawaban
// server-side tersendiri. Cukup untuk prototipe (guru/siswa tidak dianggap
// berusaha curang lewat devtools); kalau nanti butuh anti-kecurangan lebih
// ketat, pindahkan validasi ke endpoint baru yang tidak mengirim kunci
// jawaban di respons awal.
async function list(req, res) {
  try {
    const { paketId } = req.query;
    if (!paketId) {
      return res.status(400).json({ message: 'paketId wajib diisi' });
    }

    const { rows } = await pool.query(
      'SELECT * FROM soal WHERE paket_id = $1 ORDER BY order_number ASC',
      [paketId]
    );
    return res.json(rows.map(toApiShape));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
}

module.exports = { list };
