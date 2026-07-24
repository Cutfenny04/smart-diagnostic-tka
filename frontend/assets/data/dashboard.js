/* ==========================================================================
   DASHBOARD HOME — Data layer.
   Pure data + fetch-style accessors. No rendering, no DOM, no HTML here.
   Swap the body of fetchDashboardData() for a real API call later — every
   caller already treats it as an async source, so nothing else changes.
   ========================================================================== */

export const dashboardGreeting = {
    name: 'Ibu Fenny',
    message: 'Teruslah mengasah kemampuan berpikir tingkat tinggi (HOTS) peserta didik Anda melalui pembelajaran IPA yang membumi pada kearifan budaya Aceh.'
};

export const dashboardStats = [
    { id: 'materi', icon: 'book-open', label: 'Total Materi Dipelajari', value: 18, unit: '/24 Modul' },
    { id: 'soal', icon: 'pencil-line', label: 'Soal HOTS Dibuat', value: 32, unit: 'Soal' },
    { id: 'diagnostic', icon: 'activity', label: 'Smart Diagnostic Selesai', value: 5, unit: 'Sesi' },
    { id: 'progress', icon: 'target', label: 'Progress Pelatihan', value: 72, unit: '%', isProgress: true }
];

export const quickAccessItems = [
    { href: 'materi.html', icon: 'book-open', title: 'Materi &amp; Modul', desc: 'Video, PDF, dan artikel pelatihan HOTS IPA.' },
    { href: 'bank-stimulus.html', icon: 'landmark', title: 'Bank Stimulus', desc: 'Konteks budaya Aceh untuk menyusun soal HOTS.' },
    { href: 'bank-soal.html', icon: 'puzzle', title: 'Bank Soal HOTS', desc: 'Katalog soal interaktif level C4-C6.' },
    { href: 'smart-diagnostic.html', icon: 'activity', title: 'Smart Diagnostic', desc: 'Uji kompetensi penyusunan soal HOTS Anda.' },
    { href: 'hasil-diagnostik.html', icon: 'bar-chart-3', title: 'Dashboard Hasil', desc: 'Grafik dan rekomendasi capaian pelatihan.' },
    { href: 'profil.html', icon: 'user-circle', title: 'Profil', desc: 'Kelola data diri, sekolah, dan kata sandi.' }
];

export const recentActivity = [
    { icon: 'check-circle', text: 'Menyelesaikan Modul HOTS: <strong>Fotosintesis &amp; Ekosistem Hutan Leuser</strong>', time: '2 jam yang lalu' },
    { icon: 'file-plus', text: 'Membuat 10 soal HOTS baru berbasis stimulus <strong>Kopi Gayo</strong>', time: 'Kemarin, 15.40' },
    { icon: 'activity', text: 'Menyelesaikan sesi <strong>Smart Diagnostic Fisika</strong>', time: '2 hari yang lalu' },
    { icon: 'download', text: 'Mengunduh modul <strong>Kimia: Reaksi dalam Kehidupan Sehari-hari</strong>', time: '3 hari yang lalu' }
];

export const announcements = [
    { status: 'important', badgeLabel: 'Penting', date: '20 Jul 2026', title: 'Jadwal Pelatihan Tahap 2 &mdash; Batch Agustus 2026', desc: 'Pendaftaran ulang paling lambat 1 Agustus 2026 melalui koordinator MGMP IPA.' },
    { status: 'new', badgeLabel: 'Baru', date: '15 Jul 2026', title: 'Update Modul Baru: IPA Terpadu &mdash; Energi Terbarukan', desc: 'Modul kini tersedia di halaman Materi &amp; Modul Pelatihan.' },
    { status: 'info', badgeLabel: 'Info', date: '10 Jul 2026', title: 'Workshop Mendatang: Menyusun Stimulus Kontekstual Budaya Aceh', desc: 'Sesi daring bersama fasilitator USK, jadwal menyusul.' }
];

export const learningProgress = [
    { label: 'Modul HOTS', percent: 80 },
    { label: 'Stimulus Budaya', percent: 60 },
    { label: 'Smart Diagnostic', percent: 100 }
];

/**
 * Future backend: replace the body with
 *   return fetch('/api/dashboard').then(function (res) { return res.json(); });
 * Callers already treat this as async, so no other file needs to change.
 */
export function fetchDashboardData() {
    return new Promise(function (resolve) {
        window.setTimeout(function () {
            resolve({
                greeting: dashboardGreeting,
                stats: dashboardStats,
                quickAccess: quickAccessItems,
                recentActivity: recentActivity,
                announcements: announcements,
                learningProgress: learningProgress
            });
        }, 500);
    });
}
