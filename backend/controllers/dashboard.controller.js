const pool = require('../config/db');

/* Bobot komposit "Progress Pelatihan" -- BELUM angka resmi dari klien,
   sengaja satu tempat gampang diubah (pola sama seperti PASSING_SCORE di
   utils/scoring.js). Materi/Non-TKA/TKA masing-masing dihitung 0-100 dulu,
   baru dirata-rata berbobot di sini. TKA sengaja TIDAK dikembalikan sebagai
   "persen" ke frontend (lihat computeTkaPercent) -- cuma dipakai internal
   untuk komposit, karena kita tidak punya cara sahih menghitung "berapa
   persen guru sudah menguasai Wordwall". */
const WEIGHT_MATERI = 0.4;
const WEIGHT_NON_TKA = 0.3;
const WEIGHT_TKA = 0.3;

// Placeholder jumlah aktivitas TKA yang dianggap "penuh" (100%) buat 1 guru
// -- dipilih 3 karena itu jumlah TKA resmi (Kimia/Biologi/Fisika) yang jadi
// acuan platform saat ini. Ganti kalau klien kasih angka resmi.
const TKA_TARGET_COUNT = 3;

function computeTkaPercent(tkaCount) {
  return Math.min(100, Math.round((tkaCount / TKA_TARGET_COUNT) * 100));
}

// GET /api/dashboard/hasil -- satu endpoint agregat buat Dashboard Hasil,
// supaya React tidak perlu menembak banyak endpoint + hitung sendiri
// (PIVOT_PLAN §Dashboard Hasil, permintaan user eksplisit "jangan frontend
// melakukan 10 query sendiri"). Semua data di sini personal milik guru yang
// login (guru_id/created_by_guru_id = req.user.id), KECUALI daftar paket
// published yang dipakai sebagai penyebut persentase (bank soal bersama).
async function getHasilSummary(req, res) {
  try {
    const guruId = req.user.id;

    const [materiRes, hasilRes, tkaRes, publishedNonTkaRes] = await Promise.all([
      pool.query(
        `SELECT m.id, m.title, m.category, COALESCE(p.progress, 0) AS progress, p.last_opened
         FROM materi m
         LEFT JOIN progress_materi p ON p.materi_id = m.id AND p.guru_id = $1
         ORDER BY m.created_at`,
        [guruId]
      ),
      pool.query(
        `SELECT h.id, h.paket_id, h.score, h.correct_count, h.total_questions,
                h.started_at, h.completed_at, h.created_at,
                p.title AS paket_title, p.subject AS paket_subject, p.type AS paket_type
         FROM hasil_diagnostik h
         LEFT JOIN paket_soal p ON p.id = h.paket_id
         WHERE h.guru_id = $1
         ORDER BY COALESCE(h.completed_at, h.created_at) ASC`,
        [guruId]
      ),
      pool.query(
        `SELECT id, title, subject, status, wordwall_url, created_at
         FROM paket_soal
         WHERE type = 'TKA' AND created_by_guru_id = $1
         ORDER BY created_at DESC`,
        [guruId]
      ),
      pool.query(`SELECT id, subject FROM paket_soal WHERE type = 'NON_TKA' AND status = 'published'`),
    ]);

    // --- Materi ---
    const materiList = materiRes.rows.map((m) => ({
      id: m.id,
      title: m.title,
      category: m.category,
      progress: m.progress,
      status: m.progress >= 100 ? 'selesai' : m.progress > 0 ? 'sedang' : 'belum',
    }));
    const materiTotal = materiList.length;
    const materiCompleted = materiList.filter((m) => m.status === 'selesai').length;
    const materiPercent = materiTotal === 0 ? 0 : Math.round((materiCompleted / materiTotal) * 100);

    // --- Non-TKA (hasil_diagnostik milik guru ini) ---
    const hasilList = hasilRes.rows.map((h) => ({
      id: h.id,
      paketId: h.paket_id,
      paketTitle: h.paket_title,
      paketSubject: h.paket_subject,
      score: Number(h.score),
      correctCount: h.correct_count,
      totalQuestions: h.total_questions,
      completedAt: h.completed_at || h.created_at,
    }));
    const totalAttempts = hasilList.length;
    const averageScore = totalAttempts === 0
      ? 0
      : Math.round((hasilList.reduce((sum, h) => sum + h.score, 0) / totalAttempts) * 10) / 10;
    const highestScore = totalAttempts === 0 ? 0 : Math.max(...hasilList.map((h) => h.score));

    const subjectMap = new Map();
    hasilList.forEach((h) => {
      const key = h.paketSubject || 'Lainnya';
      if (!subjectMap.has(key)) subjectMap.set(key, []);
      subjectMap.get(key).push(h.score);
    });
    const bySubject = Array.from(subjectMap.entries()).map(([subject, scores]) => ({
      subject,
      attempts: scores.length,
      average: Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10,
    }));

    // Dipakai sebagai penyebut "berapa % paket Non-TKA yang tersedia sudah
    // pernah dicoba guru ini" -- bukan rata-rata nilai (itu urusan averageScore).
    // String(...) di kedua sisi WAJIB: hasil_diagnostik.paket_id kolomnya INT
    // (pulang sbg number dari node-pg), sedangkan paket_soal.id BIGINT
    // (pulang sbg string) -- tanpa ini Set.has() selalu false walau ID-nya
    // sama, karena 4 !== "4".
    const attemptedPaketIds = new Set(hasilList.map((h) => String(h.paketId)));
    const publishedNonTka = publishedNonTkaRes.rows;
    const nonTkaPercent = publishedNonTka.length === 0
      ? 0
      : Math.round((publishedNonTka.filter((p) => attemptedPaketIds.has(String(p.id))).length / publishedNonTka.length) * 100);

    // --- TKA (paket_soal milik guru ini, created_by_guru_id) ---
    const tkaList = tkaRes.rows.map((t) => ({
      id: t.id,
      title: t.title,
      subject: t.subject,
      status: t.status,
      wordwallUrl: t.wordwall_url,
      createdAt: t.created_at,
    }));
    const tkaTotal = tkaList.length;
    const tkaPublished = tkaList.filter((t) => t.status === 'published').length;
    const tkaDraft = tkaTotal - tkaPublished;

    // --- Komposit ---
    const overallPercent = Math.round(
      materiPercent * WEIGHT_MATERI + nonTkaPercent * WEIGHT_NON_TKA + computeTkaPercent(tkaTotal) * WEIGHT_TKA
    );

    // --- Riwayat aktivitas gabungan (materi selesai/sedang + non-tka + tka) ---
    const activity = [
      ...materiRes.rows
        .filter((m) => m.progress > 0)
        .map((m) => ({
          type: 'materi',
          text: (m.progress >= 100 ? 'Menyelesaikan modul: ' : 'Mempelajari modul: ') + m.title,
          timestamp: m.last_opened,
        })),
      ...hasilList.map((h) => ({
        type: 'non_tka',
        text: `Menyelesaikan latihan Non-TKA ${h.paketSubject || h.paketTitle} — nilai ${h.score}`,
        timestamp: h.completedAt,
      })),
      ...tkaList.map((t) => ({
        type: 'tka',
        text: (t.status === 'published' ? 'Menghubungkan Wordwall TKA ' : 'Membuat draft TKA ') + t.subject,
        timestamp: t.createdAt,
      })),
    ]
      .filter((a) => a.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.json({
      progress: { overall: overallPercent, materi: materiPercent, nonTka: nonTkaPercent },
      materi: { total: materiTotal, completed: materiCompleted, list: materiList },
      nonTka: { totalAttempts, averageScore, highestScore, bySubject, history: hasilList.slice().reverse() },
      tka: { total: tkaTotal, published: tkaPublished, draft: tkaDraft, list: tkaList },
      recentActivity: activity,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Gagal mengambil ringkasan Dashboard Hasil' });
  }
}

module.exports = { getHasilSummary };
