/* ==========================================================================
   DASHBOARD HOME — statistik, aktivitas terbaru, dan progress belajar
   dibaca dari GET /api/dashboard/hasil (dashboardHasilData.js), endpoint
   yang sama dipakai HasilDiagnostik.jsx (Dashboard Hasil). Ini SENGAJA
   dipersatukan (bukan lagi 3 fetch + hitung composite terpisah) supaya
   "Progress Pelatihan" tidak pernah lagi menampilkan angka berbeda di dua
   halaman -- lihat backend/config/progressWeights.js untuk rumus & bobotnya.
   Satu-satunya yang masih statis (disengaja, per permintaan user):
   `announcements` -- belum ada sumber data pengumuman asli.
   ========================================================================== */
import { fetchDashboardHasil } from './dashboardHasilData';
import { computeMateriProgressByCategory, materiCategoryMeta } from './materiData';
import { formatRelativeTime } from '../utils/relativeTime';

export const dashboardGreeting = {
  message:
    'Teruslah mengasah kemampuan berpikir tingkat tinggi (HOTS) peserta didik Anda melalui pembelajaran IPA yang membumi pada kearifan budaya Aceh.',
};

export const quickAccessItems = [
  { href: '/materi/panduan-penggunaan', icon: 'file-text', title: 'Panduan Penggunaan', desc: 'Pelajari cara menggunakan Smart Diagnostic dari login hingga hasil pelatihan.' },
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

const ACTIVITY_ICON = { materi: 'book-open', non_tka: 'activity', tka: 'puzzle' };

function activityIcon(item) {
  if (item.type === 'materi') return item.text.startsWith('Menyelesaikan') ? 'check-circle' : 'book-open';
  return ACTIVITY_ICON[item.type];
}

/* Alur Pelatihan guru (Revisi 10, permintaan user 2026-08-22 item #2): guru
   sering tidak tahu "sekarang saya harus klik apa" begitu login. 4 tahap ini
   memetakan urutan yang diminta user (Login->Materi->Modul Wordwall->Buat
   Soal Wordwall->Publish->Play URL->Bank Soal TKA->Coba TKA->Non-TKA->
   Progress) ke 4 langkah yang PUNYA data nyata untuk dilacak. Sub-langkah
   yang terjadi di luar situs ini (bikin/publish soal langsung di
   Wordwall.net, memainkan aktivitas TKA) SENGAJA ditandai `trackable:false`
   dan tidak pernah diberi centang -- kita tidak punya cara sahih memverifikasi
   itu terjadi (belum ada integrasi Wordwall, lihat Fase 14), jadi jangan
   pura-pura tahu. Status tiap tahap dipakai juga untuk menentukan CTA
   "Lanjutkan Pelatihan" di hero Dashboard. */
function computeTrainingFlow(data) {
  const materiDone = data.materi.total > 0 && data.materi.completed >= data.materi.total;
  // "completed" cuma menghitung materi yang progress-nya 100 -- guru yang
  // baru membuka 1 materi (progress 1-99) harus tetap kelihatan 'sedang',
  // bukan 'belum', jadi cek list mentahnya, bukan cuma count yang selesai.
  const materiStarted = data.materi.list.some((m) => m.progress > 0);
  const materiStatus = materiDone ? 'selesai' : materiStarted ? 'sedang' : 'belum';

  const tkaRegistered = data.tka.total > 0;
  const tkaStatus = data.tka.published > 0 ? 'selesai' : tkaRegistered ? 'sedang' : 'belum';

  const nonTkaStatus = data.nonTka.totalAttempts > 0 ? 'selesai' : 'belum';

  const stages = [
    {
      id: 'materi',
      order: 1,
      title: 'Pelajari Materi & Modul',
      ctaLabel: 'Lanjutkan ke Materi',
      href: '/materi',
      status: materiStatus,
      note: `${data.materi.completed} dari ${data.materi.total} materi selesai`,
      subSteps: [
        { label: 'Baca Panduan Penggunaan Smart Diagnostic TKA (PDF)', trackable: false },
        { label: 'Pelajari materi pelatihan HOTS & Budaya Aceh', trackable: true, done: materiStarted },
        { label: 'Baca Modul Panduan Wordwall (PDF)', trackable: false },
      ],
    },
    {
      id: 'tka',
      order: 2,
      title: 'Buat & Daftarkan Aktivitas TKA',
      ctaLabel: 'Lanjutkan ke Bank Soal TKA',
      href: '/bank-soal',
      status: tkaStatus,
      note: tkaRegistered
        ? `${data.tka.total} aktivitas terdaftar, ${data.tka.published} published`
        : 'Belum ada aktivitas TKA terdaftar',
      subSteps: [
        { label: 'Buat soal & publish langsung di Wordwall.net', trackable: false },
        { label: 'Salin Play URL, lalu daftarkan ke Bank Soal TKA di sini', trackable: true, done: tkaRegistered },
        { label: 'Coba mainkan aktivitas TKA yang sudah didaftarkan', trackable: false },
      ],
    },
    {
      id: 'non_tka',
      order: 3,
      title: 'Kerjakan Latihan Smart Diagnostic',
      ctaLabel: 'Lanjutkan ke Smart Diagnostic',
      href: '/smart-diagnostic',
      status: nonTkaStatus,
      note: `${data.nonTka.totalAttempts} latihan Non-TKA dikerjakan`,
      subSteps: [
        { label: 'Pilih paket Non-TKA & kerjakan hingga selesai', trackable: true, done: data.nonTka.totalAttempts > 0 },
      ],
    },
    {
      id: 'progress',
      order: 4,
      title: 'Lihat Progress Pelatihan',
      ctaLabel: 'Lihat Progress Anda',
      href: '/hasil-diagnostik',
      status: 'info',
      note: 'Pantau seluruh capaian Anda di Dashboard Hasil',
      subSteps: [],
    },
  ];

  const currentStage = stages.find((s) => s.status === 'belum' || s.status === 'sedang') || stages[stages.length - 1];

  return { stages, currentStage };
}

/* Kartu "Lanjutkan Pelatihan" (item #3 roadmap 2026-08-22): berbeda dari CTA
   generik di hero (yang cuma menunjuk TAHAP), ini menunjuk MATERI SPESIFIK
   yang sedang/belum dipelajari guru -- supaya guru langsung tahu judul modul
   mana yang harus dibuka, bukan cuma "lanjut ke Materi" yang masih ambigu
   kalau ada >1 modul belum selesai. Prioritas: materi yang sudah "sedang"
   dipelajari (dan paling baru dibuka), baru materi yang "belum" (urutan
   created_at, dari materiList). Kalau SEMUA materi sudah selesai, jatuh ke
   tahap aktif berikutnya dari computeTrainingFlow (TKA/Non-TKA/Progress) --
   tidak ada progress per-item yang sahih di level itu, jadi `percent` null. */
function computeResumeItem(data, currentStage) {
  const list = data.materi.list;
  const inProgress = list
    .filter((m) => m.status === 'sedang')
    .sort((a, b) => new Date(b.lastOpened || 0) - new Date(a.lastOpened || 0));
  const notStarted = list.filter((m) => m.status === 'belum');
  const target = inProgress[0] || notStarted[0];

  if (target) {
    const meta = materiCategoryMeta[target.category] || { label: target.category, icon: 'book-open' };
    return {
      eyebrow: meta.label,
      title: target.title,
      percent: target.progress,
      href: `/materi/${target.id}`,
      icon: meta.icon,
    };
  }

  const STAGE_ICON = { tka: 'landmark', non_tka: 'activity', progress: 'bar-chart-3' };
  return {
    eyebrow: 'Tahap Berikutnya',
    title: currentStage.title,
    percent: null,
    href: currentStage.href,
    icon: STAGE_ICON[currentStage.id] || 'target',
  };
}

export async function fetchDashboardData() {
  const data = await fetchDashboardHasil();

  const stats = [
    { id: 'materi', icon: 'book-open', label: 'Total Materi Dipelajari', value: data.materi.completed, unit: `/${data.materi.total} Modul` },
    { id: 'soal', icon: 'landmark', label: 'Paket TKA Saya Kelola', value: data.tka.total, unit: 'Paket' },
    { id: 'diagnostic', icon: 'activity', label: 'Smart Diagnostic Selesai', value: data.nonTka.totalAttempts, unit: 'Sesi' },
    { id: 'progress', icon: 'target', label: 'Progress Pelatihan', value: data.progress.overall, unit: '%', isProgress: true },
  ];

  const recentActivity = data.recentActivity
    .slice(0, 6)
    .map((item) => ({ icon: activityIcon(item), text: item.text, time: formatRelativeTime(item.timestamp) }));

  // Breakdown per kategori materi (hots/budaya/soal) dihitung dari daftar
  // materi yang sama persis dipakai server buat progress.materi -- reuse
  // helper materiData.js supaya rumusnya tidak diduplikasi.
  const learningProgress = [
    ...computeMateriProgressByCategory(data.materi.list).map((c) => ({ label: c.label, percent: c.percent })),
    { label: 'Smart Diagnostic', percent: data.progress.nonTka },
  ];

  const { stages: trainingFlow, currentStage } = computeTrainingFlow(data);
  const resumeItem = computeResumeItem(data, currentStage);

  return {
    greeting: dashboardGreeting,
    stats,
    quickAccess: quickAccessItems,
    recentActivity,
    announcements,
    learningProgress,
    trainingFlow,
    currentStage,
    resumeItem,
  };
}
