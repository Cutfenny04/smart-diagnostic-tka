/* Konfigurasi bobot komposit "Progress Pelatihan" -- BELUM angka resmi dari
   klien. Ini SATU-SATUNYA tempat bobot & target TKA didefinisikan; dipakai
   oleh dashboard.controller.js (GET /api/dashboard/hasil), yang jadi single
   source of truth untuk semua halaman (Dashboard utama & Dashboard Hasil
   sama-sama membaca `progress.overall` dari endpoint itu, bukan menghitung
   sendiri-sendiri). Kalau klien kasih angka resmi, cukup ubah nilai di sini
   -- jangan hardcode ulang bobot di controller atau di frontend manapun. */
const PROGRESS_WEIGHTS = {
  materi: 0.4,
  nonTka: 0.3,
  tka: 0.3,
};

// Placeholder jumlah aktivitas TKA yang dianggap "penuh" (100%) buat 1 guru
// -- dipilih 3 karena itu jumlah TKA resmi (Kimia/Biologi/Fisika) yang jadi
// acuan platform saat ini. Ganti kalau klien kasih angka resmi.
const TKA_TARGET_COUNT = 3;

function computeTkaPercent(tkaCount) {
  return Math.min(100, Math.round((tkaCount / TKA_TARGET_COUNT) * 100));
}

// materiPercent/nonTkaPercent: 0-100. tkaCount: jumlah aktivitas TKA guru
// (dikonversi ke persen internal lewat computeTkaPercent -- lihat catatan
// di dashboard.controller.js soal kenapa persen TKA tidak dikirim ke UI).
function computeOverallProgress({ materiPercent, nonTkaPercent, tkaCount }) {
  const tkaPercent = computeTkaPercent(tkaCount);
  return Math.round(
    materiPercent * PROGRESS_WEIGHTS.materi +
      nonTkaPercent * PROGRESS_WEIGHTS.nonTka +
      tkaPercent * PROGRESS_WEIGHTS.tka
  );
}

module.exports = { PROGRESS_WEIGHTS, TKA_TARGET_COUNT, computeTkaPercent, computeOverallProgress };
