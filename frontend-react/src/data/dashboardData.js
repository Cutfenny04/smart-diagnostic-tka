/* ==========================================================================
   DASHBOARD HOME — statistik, aktivitas terbaru, dan progress belajar
   dirakit dari data asli (materi, hasil diagnostik, paket soal), bukan
   dummy lagi. Satu-satunya yang masih statis (disengaja, per permintaan
   user): `announcements` -- belum ada sumber data pengumuman asli.
   ========================================================================== */
import { fetchMateri, computeMateriOverallProgress, computeMateriProgressByCategory } from './materiData';
import { fetchHasil } from './hasilData';
import { fetchPaketSoal } from './bankSoalData';
import { formatRelativeTime } from '../utils/relativeTime';

export const dashboardGreeting = {
  message:
    'Teruslah mengasah kemampuan berpikir tingkat tinggi (HOTS) peserta didik Anda melalui pembelajaran IPA yang membumi pada kearifan budaya Aceh.',
};

export const quickAccessItems = [
  { href: '/materi', icon: 'book-open', title: 'Materi & Modul', desc: 'Video, PDF, dan artikel pelatihan HOTS IPA.' },
  { href: '/bank-soal', icon: 'landmark', title: 'Bank Soal Berbasis Budaya Aceh', desc: 'Jelajahi paket soal budaya Aceh, TKA maupun Non-TKA.' },
  { href: '/smart-diagnostic', icon: 'activity', title: 'Smart Diagnostic', desc: 'Uji kompetensi penyusunan soal HOTS Anda.' },
  { href: '/hasil-diagnostik', icon: 'bar-chart-3', title: 'Dashboard Hasil', desc: 'Grafik dan rekomendasi capaian pelatihan.' },
  { href: '/profil', icon: 'user-circle', title: 'Profil', desc: 'Kelola data diri, sekolah, dan kata sandi.' },
];

// Belum ada sistem pengumuman asli (butuh backend/CMS tersendiri) --
// sengaja dibiarkan statis dulu, per instruksi user.
export const announcements = [
  { status: 'important', badgeLabel: 'Penting', date: '20 Jul 2026', title: 'Jadwal Pelatihan Tahap 2 — Batch Agustus 2026', desc: 'Pendaftaran ulang paling lambat 1 Agustus 2026 melalui koordinator MGMP IPA.' },
  { status: 'new', badgeLabel: 'Baru', date: '15 Jul 2026', title: 'Update Modul Baru: IPA Terpadu — Energi Terbarukan', desc: 'Modul kini tersedia di halaman Materi & Modul Pelatihan.' },
  { status: 'info', badgeLabel: 'Info', date: '10 Jul 2026', title: 'Workshop Mendatang: Menyusun Stimulus Kontekstual Budaya Aceh', desc: 'Sesi daring bersama fasilitator USK, jadwal menyusul.' },
];

/* `userId` = id guru yang login (auth.users.id / profiles.id), dipakai buat
   menghitung "paket TKA yang saya buat sendiri" dari created_by_guru_id. */
export async function fetchDashboardData(userId) {
  const [modules, hasil, paketSoal] = await Promise.all([
    fetchMateri(),
    fetchHasil(),
    fetchPaketSoal(),
  ]);

  const materiProgress = computeMateriOverallProgress(modules);
  const paketDikelola = paketSoal.filter((p) => p.createdByGuruId === userId).length;

  // Cuma paket Non-TKA yang otomatis menghasilkan baris hasil_diagnostik
  // (TKA/Wordwall belum ada integrasi nilai -- lihat PIVOT_PLAN.md §D/Fase
  // 14), jadi "aktivitas Smart Diagnostic" dihitung dari situ.
  const publishedNonTka = paketSoal.filter((p) => p.type === 'NON_TKA' && p.status === 'published');
  // String(...) di kedua sisi WAJIB: hasil_diagnostik.paket_id kolomnya INT
  // (pulang sbg number dari node-pg), sedangkan paket_soal.id BIGINT (pulang
  // sbg string) -- tanpa ini Set.has() selalu false walau ID-nya sama.
  const attemptedPaketIds = new Set(hasil.map((h) => String(h.paketId)));
  const diagnosticPercent = publishedNonTka.length === 0
    ? 0
    : Math.round((publishedNonTka.filter((p) => attemptedPaketIds.has(String(p.id))).length / publishedNonTka.length) * 100);

  // Progress Pelatihan keseluruhan = rata-rata progress belajar materi dan
  // aktivitas Smart Diagnostic -- dua-duanya sumber data asli yang ada saat
  // ini (belum ada tracking terpisah untuk "Modul Wordwall").
  const overallPercent = Math.round((materiProgress.percent + diagnosticPercent) / 2);

  const stats = [
    { id: 'materi', icon: 'book-open', label: 'Total Materi Dipelajari', value: materiProgress.completed, unit: `/${materiProgress.total} Modul` },
    { id: 'soal', icon: 'landmark', label: 'Paket TKA Saya Kelola', value: paketDikelola, unit: 'Paket' },
    { id: 'diagnostic', icon: 'activity', label: 'Smart Diagnostic Selesai', value: hasil.length, unit: 'Sesi' },
    { id: 'progress', icon: 'target', label: 'Progress Pelatihan', value: overallPercent, unit: '%', isProgress: true },
  ];

  const materiActivity = modules
    .filter((m) => m.lastOpened)
    .map((m) => ({
      icon: m.progress >= 100 ? 'check-circle' : 'book-open',
      text: (m.progress >= 100 ? 'Menyelesaikan modul: ' : 'Mempelajari modul: ') + m.title,
      timestamp: m.lastOpened,
    }));

  const diagnosticActivity = hasil.map((h) => ({
    icon: 'activity',
    text: `Menyelesaikan Smart Diagnostic ${h.paketSubject || h.paketTitle} — nilai ${h.score}`,
    timestamp: h.completedAt || h.createdAt,
  }));

  const recentActivity = [...materiActivity, ...diagnosticActivity]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 6)
    .map((item) => ({ icon: item.icon, text: item.text, time: formatRelativeTime(item.timestamp) }));

  const learningProgress = [
    ...computeMateriProgressByCategory(modules).map((c) => ({ label: c.label, percent: c.percent })),
    { label: 'Smart Diagnostic', percent: diagnosticPercent },
  ];

  return {
    greeting: dashboardGreeting,
    stats,
    quickAccess: quickAccessItems,
    recentActivity,
    announcements,
    learningProgress,
  };
}
