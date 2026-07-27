/* ==========================================================================
   MATERI & MODUL PELATIHAN — Data layer.
   Pure data + a fetch-style accessor. No rendering, no DOM, no HTML here.
   Swap the body of fetchMateri() for a real `fetch('/api/materi')` later —
   every caller already treats it as an async source, so nothing else changes.
   ========================================================================== */

export const materiData = [
    { id: 'konsep-hots', category: 'hots', title: 'Konsep HOTS dalam IPA', desc: 'Memahami dasar berpikir tingkat tinggi dan penerapannya dalam pembelajaran IPA SMP.', duration: '30 menit', materiCount: 4, progress: 100, dateAdded: '2026-05-02' },
    { id: 'taksonomi-bloom', category: 'hots', title: 'Taksonomi Bloom Revisi', desc: 'Mengenal tingkatan kognitif C1-C6 sebagai dasar penyusunan soal HOTS.', duration: '25 menit', materiCount: 3, progress: 100, dateAdded: '2026-05-10' },
    { id: 'stimulus-budaya-aceh', category: 'budaya', title: 'Menyusun Stimulus Berbasis Budaya Aceh', desc: 'Teknik mengangkat kearifan lokal Aceh menjadi stimulus kontekstual soal IPA.', duration: '40 menit', materiCount: 5, progress: 60, dateAdded: '2026-06-01', lastOpened: true },
    { id: 'kopi-gayo', category: 'budaya', title: 'Pemanfaatan Kopi Gayo sebagai Stimulus IPA', desc: 'Mengangkat proses budidaya dan pengolahan Kopi Gayo sebagai konteks pembelajaran Kimia dan Biologi.', duration: '35 menit', materiCount: 4, progress: 0, dateAdded: '2026-06-08' },
    { id: 'rumoh-aceh', category: 'budaya', title: 'Rumah Aceh sebagai Konteks Pembelajaran', desc: 'Menggunakan struktur dan filosofi Rumoh Aceh sebagai konteks Fisika bangunan tahan gempa.', duration: '30 menit', materiCount: 3, progress: 0, dateAdded: '2026-06-12' },
    { id: 'mangrove-aceh', category: 'budaya', title: 'Ekosistem Mangrove Aceh', desc: 'Mengaitkan ekosistem mangrove pesisir Aceh dengan materi keseimbangan lingkungan.', duration: '35 menit', materiCount: 4, progress: 20, dateAdded: '2026-06-18' },
    { id: 'soal-c4', category: 'soal', title: 'Penyusunan Soal C4', desc: 'Menyusun soal level Analisis (C4) berbasis stimulus kontekstual.', duration: '45 menit', materiCount: 5, progress: 100, dateAdded: '2026-04-20' },
    { id: 'soal-c5', category: 'soal', title: 'Penyusunan Soal C5', desc: 'Menyusun soal level Evaluasi (C5) yang menuntut penilaian argumentatif siswa.', duration: '45 menit', materiCount: 5, progress: 45, dateAdded: '2026-05-25' },
    { id: 'soal-c6', category: 'soal', title: 'Penyusunan Soal C6', desc: 'Menyusun soal level Kreasi (C6) yang mendorong siswa merancang solusi baru.', duration: '50 menit', materiCount: 5, progress: 0, dateAdded: '2026-07-02' },
    { id: 'validasi-soal', category: 'soal', title: 'Validasi Butir Soal', desc: 'Memvalidasi kesesuaian soal dengan indikator dan kaidah penulisan.', duration: '30 menit', materiCount: 3, progress: 0, dateAdded: '2026-07-10' },
    { id: 'analisis-kualitas-soal', category: 'soal', title: 'Analisis Kualitas Soal', desc: 'Menganalisis tingkat kesukaran dan daya beda butir soal yang telah disusun.', duration: '30 menit', materiCount: 3, progress: 0, dateAdded: '2026-07-15' }
];

export const materiCategoryMeta = {
    hots: { label: 'HOTS', thumbClass: 'module-card__thumb--hots', icon: 'brain' },
    budaya: { label: 'Budaya Aceh', thumbClass: 'module-card__thumb--budaya', icon: 'landmark' },
    soal: { label: 'Penyusunan Soal', thumbClass: 'module-card__thumb--soal', icon: 'file-edit' }
};

export const materiCategoryOrder = ['hots', 'budaya', 'soal'];

export const materiOverallProgress = { completed: 12, total: 18, percent: 67 };

/**
 * Future backend: replace the body with
 *   return fetch('/api/materi').then(function (res) { return res.json(); });
 * Callers already treat this as async, so no other file needs to change.
 */
export function fetchMateri() {
    var token = localStorage.getItem('token');
    return fetch('http://localhost:5001/api/materi', {
        headers: { 'Authorization': 'Bearer ' + token }
    }).then(function (res) {
        return res.json();
    });
}
