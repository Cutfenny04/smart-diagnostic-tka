/* ==========================================================================
   MATERI & MODUL PELATIHAN — Data layer.
   Pure data + a fetch-style accessor. No rendering, no DOM, no HTML here.
   Swap the body of fetchMateri() for a real `fetch('/api/materi')` later —
   every caller already treats it as an async source, so nothing else changes.
   ========================================================================== */

export const materiData = [
    { id: 'konsep-hots', category: 'hots', title: 'Konsep HOTS dalam IPA', desc: 'Memahami dasar berpikir tingkat tinggi dan penerapannya dalam pembelajaran IPA SMP.', duration: '30 menit', materiCount: 4, progress: 100, dateAdded: '2026-05-02', topics: ['Apa itu HOTS?', 'Perbedaan LOTS dan HOTS', 'Ciri Soal HOTS dalam IPA', 'Studi Kasus Penerapan HOTS'] },
    { id: 'taksonomi-bloom', category: 'hots', title: 'Taksonomi Bloom Revisi', desc: 'Mengenal tingkatan kognitif C1-C6 sebagai dasar penyusunan soal HOTS.', duration: '25 menit', materiCount: 3, progress: 100, dateAdded: '2026-05-10', topics: ['Sejarah Taksonomi Bloom', 'Tingkatan Kognitif C1-C6', 'Kata Kerja Operasional per Tingkatan'] },
    { id: 'stimulus-budaya-aceh', category: 'budaya', title: 'Menyusun Stimulus Berbasis Budaya Aceh', desc: 'Teknik mengangkat kearifan lokal Aceh menjadi stimulus kontekstual soal IPA.', duration: '40 menit', materiCount: 5, progress: 60, dateAdded: '2026-06-01', lastOpened: true, topics: ['Mengapa Stimulus Kontekstual Penting', 'Menggali Kearifan Lokal Aceh', 'Menyusun Narasi Stimulus', 'Menghubungkan Stimulus dengan Indikator Soal', 'Contoh Stimulus Budaya Aceh'] },
    { id: 'kopi-gayo', category: 'budaya', title: 'Pemanfaatan Kopi Gayo sebagai Stimulus IPA', desc: 'Mengangkat proses budidaya dan pengolahan Kopi Gayo sebagai konteks pembelajaran Kimia dan Biologi.', duration: '35 menit', materiCount: 4, progress: 0, dateAdded: '2026-06-08', topics: ['Proses Budidaya Kopi Gayo', 'Reaksi Kimia dalam Fermentasi Kopi', 'Kopi Gayo sebagai Konteks Biologi', 'Merancang Soal dari Konteks Kopi Gayo'] },
    { id: 'rumoh-aceh', category: 'budaya', title: 'Rumah Aceh sebagai Konteks Pembelajaran', desc: 'Menggunakan struktur dan filosofi Rumoh Aceh sebagai konteks Fisika bangunan tahan gempa.', duration: '30 menit', materiCount: 3, progress: 0, dateAdded: '2026-06-12', topics: ['Filosofi dan Struktur Rumoh Aceh', 'Prinsip Fisika Bangunan Tahan Gempa', 'Merancang Soal dari Konteks Rumoh Aceh'] },
    { id: 'mangrove-aceh', category: 'budaya', title: 'Ekosistem Mangrove Aceh', desc: 'Mengaitkan ekosistem mangrove pesisir Aceh dengan materi keseimbangan lingkungan.', duration: '35 menit', materiCount: 4, progress: 20, dateAdded: '2026-06-18', topics: ['Ekosistem Mangrove Pesisir Aceh', 'Peran Mangrove dalam Keseimbangan Lingkungan', 'Ancaman terhadap Ekosistem Mangrove', 'Merancang Soal dari Konteks Mangrove'] },
    { id: 'soal-c4', category: 'soal', title: 'Penyusunan Soal C4', desc: 'Menyusun soal level Analisis (C4) berbasis stimulus kontekstual.', duration: '45 menit', materiCount: 5, progress: 100, dateAdded: '2026-04-20', topics: ['Karakteristik Soal C4 (Analisis)', 'Menyusun Stem Soal Analisis', 'Menyusun Opsi Pengecoh', 'Menghubungkan Soal dengan Stimulus', 'Contoh Soal C4 Berbasis Budaya Aceh'] },
    { id: 'soal-c5', category: 'soal', title: 'Penyusunan Soal C5', desc: 'Menyusun soal level Evaluasi (C5) yang menuntut penilaian argumentatif siswa.', duration: '45 menit', materiCount: 5, progress: 45, dateAdded: '2026-05-25', topics: ['Karakteristik Soal C5 (Evaluasi)', 'Menyusun Soal Penilaian Argumentatif', 'Kriteria Penilaian Jawaban Evaluatif', 'Menghindari Bias dalam Soal Evaluasi', 'Contoh Soal C5 Berbasis Budaya Aceh'] },
    { id: 'soal-c6', category: 'soal', title: 'Penyusunan Soal C6', desc: 'Menyusun soal level Kreasi (C6) yang mendorong siswa merancang solusi baru.', duration: '50 menit', materiCount: 5, progress: 0, dateAdded: '2026-07-02', topics: ['Karakteristik Soal C6 (Kreasi)', 'Mendorong Siswa Merancang Solusi', 'Menyusun Rubrik Penilaian Kreasi', 'Menghubungkan Kreasi dengan Konteks Lokal', 'Contoh Soal C6 Berbasis Budaya Aceh'] },
    { id: 'validasi-soal', category: 'soal', title: 'Validasi Butir Soal', desc: 'Memvalidasi kesesuaian soal dengan indikator dan kaidah penulisan.', duration: '30 menit', materiCount: 3, progress: 0, dateAdded: '2026-07-10', topics: ['Kesesuaian Soal dengan Indikator', 'Kaidah Penulisan Soal', 'Checklist Validasi Butir Soal'] },
    { id: 'analisis-kualitas-soal', category: 'soal', title: 'Analisis Kualitas Soal', desc: 'Menganalisis tingkat kesukaran dan daya beda butir soal yang telah disusun.', duration: '30 menit', materiCount: 3, progress: 0, dateAdded: '2026-07-15', topics: ['Tingkat Kesukaran Soal', 'Daya Beda Butir Soal', 'Menafsirkan Hasil Analisis Soal'] }
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
    return new Promise(function (resolve) {
        window.setTimeout(function () {
            resolve(materiData);
        }, 700);
    });
}

/**
 * Satu modul materi berdasarkan id. Dipakai detail-materi.html.
 * Resolve null kalau tidak ditemukan (bukan reject) -- sama seperti
 * fetchPaketById di assets/data/bank-soal.js.
 */
export function fetchMateriById(id) {
    return fetchMateri().then(function (modules) {
        return modules.filter(function (m) { return m.id === id; })[0] || null;
    });
}
