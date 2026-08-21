const pool = require('../config/db');

// Fisher-Yates, dipakai shuffleOptions di bawah.
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Temuan user 2026-08-22: distribusi correct_answer di data soal sumber
// SANGAT timpang -- Biologi 26/30 (87%) jawaban benarnya ada di opsi B,
// Fisika 18/30 (60%) juga miring ke B. Kalau ditampilkan apa adanya, guru
// bisa cepat sadar polanya dan asal pilih B tanpa baca soal, merusak nilai
// diagnostiknya. Diacak DI SINI setiap request (bukan mengubah data sumber
// di database -- itu tetap seperti aslinya) supaya:
//   1. Posisi (label A/B/C/D) tetap berurutan seperti biasa di UI, cuma ISI
//      TEKS di tiap label yang diacak ulang.
//   2. correctAnswer ikut disesuaikan ke label baru tempat teks yang benar
//      "mendarat" -- pencocokan pakai INDEX asli, bukan bandingkan teks,
//      supaya tetap benar walau ada 2 opsi dengan teks yang kebetulan sama.
//   3. Berlaku untuk SEMUA mata pelajaran (bukan cuma Biologi) -- Fisika
//      juga timpang meski tidak seekstrim Biologi, dan tidak ada alasan
//      linter berbeda per mapel kalau mekanismenya generik.
function shuffleOptions(options, correctAnswer) {
  const correctIndex = options.findIndex((o) => o.key === correctAnswer);
  const shuffledIndices = shuffle(options.map((_, i) => i));
  const keys = options.map((o) => o.key);
  const newOptions = keys.map((key, i) => ({ key, text: options[shuffledIndices[i]].text }));
  const newCorrectAnswer = keys[shuffledIndices.indexOf(correctIndex)];
  return { options: newOptions, correctAnswer: newCorrectAnswer };
}

// DB pakai snake_case, frontend (NonTkaGame.jsx) mengharapkan camelCase --
// map di sini seperti pola yang sama di paketSoal.controller.js.
function toApiShape(row) {
  const { options, correctAnswer } = shuffleOptions(row.options, row.correct_answer);
  return {
    id: row.id,
    paketId: row.paket_id,
    question: row.question,
    stimulus: row.stimulus,
    image: row.image,
    tableData: row.table_data,
    options,
    correctAnswer,
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
