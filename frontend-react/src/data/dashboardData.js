/* ==========================================================================
   DASHBOARD HOME — Data prototype (sama persis isinya dengan
   frontend/assets/data/dashboard.js versi lama). Nanti tinggal diganti
   fetchDashboardData() dengan fetch ke /api/dashboard sungguhan.
   ========================================================================== */

export const dashboardGreeting = {
  name: 'Ibu Fenny',
  message:
    'Teruslah mengasah kemampuan berpikir tingkat tinggi (HOTS) peserta didik Anda melalui pembelajaran IPA yang membumi pada kearifan budaya Aceh.',
};

export const dashboardStats = [
  { id: 'materi', icon: 'book-open', label: 'Total Materi Dipelajari', value: 18, unit: '/24 Modul' },
  { id: 'soal', icon: 'landmark', label: 'Paket Soal Dikelola', value: 15, unit: 'Paket' },
  { id: 'diagnostic', icon: 'activity', label: 'Smart Diagnostic Selesai', value: 5, unit: 'Sesi' },
  { id: 'progress', icon: 'target', label: 'Progress Pelatihan', value: 72, unit: '%', isProgress: true },
];

export const quickAccessItems = [
  { href: '/materi', icon: 'book-open', title: 'Materi & Modul', desc: 'Video, PDF, dan artikel pelatihan HOTS IPA.' },
  { href: '/bank-soal', icon: 'landmark', title: 'Bank Soal Berbasis Budaya Aceh', desc: 'Kelola paket soal budaya Aceh yang terhubung Wordwall.' },
  { href: '/smart-diagnostic', icon: 'activity', title: 'Smart Diagnostic', desc: 'Uji kompetensi penyusunan soal HOTS Anda.' },
  { href: '/hasil-diagnostik', icon: 'bar-chart-3', title: 'Dashboard Hasil', desc: 'Grafik dan rekomendasi capaian pelatihan.' },
  { href: '/profil', icon: 'user-circle', title: 'Profil', desc: 'Kelola data diri, sekolah, dan kata sandi.' },
];

export const recentActivity = [
  { icon: 'check-circle', text: 'Menyelesaikan Modul HOTS: Fotosintesis & Ekosistem Hutan Leuser', time: '2 jam yang lalu' },
  { icon: 'file-plus', text: 'Menambahkan paket soal baru berbasis stimulus Kopi Gayo', time: 'Kemarin, 15.40' },
  { icon: 'activity', text: 'Menyelesaikan sesi Smart Diagnostic Fisika', time: '2 hari yang lalu' },
  { icon: 'download', text: 'Mengunduh modul Kimia: Reaksi dalam Kehidupan Sehari-hari', time: '3 hari yang lalu' },
];

export const announcements = [
  { status: 'important', badgeLabel: 'Penting', date: '20 Jul 2026', title: 'Jadwal Pelatihan Tahap 2 — Batch Agustus 2026', desc: 'Pendaftaran ulang paling lambat 1 Agustus 2026 melalui koordinator MGMP IPA.' },
  { status: 'new', badgeLabel: 'Baru', date: '15 Jul 2026', title: 'Update Modul Baru: IPA Terpadu — Energi Terbarukan', desc: 'Modul kini tersedia di halaman Materi & Modul Pelatihan.' },
  { status: 'info', badgeLabel: 'Info', date: '10 Jul 2026', title: 'Workshop Mendatang: Menyusun Stimulus Kontekstual Budaya Aceh', desc: 'Sesi daring bersama fasilitator USK, jadwal menyusul.' },
];

export const learningProgress = [
  { label: 'Modul HOTS', percent: 80 },
  { label: 'Bank Soal Budaya Aceh', percent: 60 },
  { label: 'Smart Diagnostic', percent: 100 },
];

export function fetchDashboardData() {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve({
        greeting: dashboardGreeting,
        stats: dashboardStats,
        quickAccess: quickAccessItems,
        recentActivity,
        announcements,
        learningProgress,
      });
    }, 500);
  });
}
