// Roadmap item #13 (2026-08-22): tandai sesi Non-TKA yang diselesaikan
// terlalu cepat untuk jadi percobaan serius (kasus nyata: 30 soal dalam 28
// detik, skor 3%) -- lihat feedback_data_changes memory soal kasus ini.
// Keputusan user (AskUserQuestion): threshold < 3 detik/soal, label
// "perlu_ditinjau" (BUKAN "tidak valid"/"tidak selesai" -- sesi tetap
// tercatat lengkap, ini murni indikator, TIDAK mengecualikan sesi dari
// Rata-rata Nilai/Nilai Tertinggi). Satu konstanta di sini supaya gampang
// diubah kalau tim USK kasih aturan resmi nanti.
const FAST_SESSION_THRESHOLD_SEC_PER_QUESTION = 3;

function computeSessionQuality({ startedAt, completedAt, totalQuestions }) {
  if (!startedAt || !completedAt || !totalQuestions) return 'normal';
  const durationSec = (new Date(completedAt) - new Date(startedAt)) / 1000;
  const secPerQuestion = durationSec / totalQuestions;
  return secPerQuestion < FAST_SESSION_THRESHOLD_SEC_PER_QUESTION ? 'perlu_ditinjau' : 'normal';
}

module.exports = { FAST_SESSION_THRESHOLD_SEC_PER_QUESTION, computeSessionQuality };
