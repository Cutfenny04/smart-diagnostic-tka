/* ==========================================================================
   DASHBOARD HASIL — Data prototype (sama persis isinya dengan
   frontend/assets/data/hasil.js versi lama).

   Ini adalah data PROTOTYPE untuk simulasi tampilan hasil diagnostik.
   Website tidak mengambil hasil dari Wordwall, tidak menghitung skor, dan
   tidak menyimpan hasil siswa secara nyata — lihat PIVOT_PLAN.md §Batasan
   Sistem. Struktur setiap entri HANYA:
     { id, studentName, materi, date, score, status }

   Swap the body of fetchHasil() for a real `fetch('/api/hasil')` later —
   caller sudah menganggapnya sebagai sumber async.
   ========================================================================== */

const hasilData = [
  { id: 'hasil-01', studentName: 'Ahmad Fauzan', materi: 'Kopi Gayo', date: '2026-07-20', score: 85, status: 'Tuntas' },
  { id: 'hasil-02', studentName: 'Cut Nadia Putri', materi: 'Tari Saman', date: '2026-07-20', score: 78, status: 'Tuntas' },
  { id: 'hasil-03', studentName: 'Muhammad Rizki', materi: 'Kopi Gayo', date: '2026-07-19', score: 65, status: 'Belum Tuntas' },
  { id: 'hasil-04', studentName: 'Putri Maharani', materi: 'Hutan Leuser', date: '2026-07-19', score: 92, status: 'Tuntas' },
  { id: 'hasil-05', studentName: 'Teuku Ridho', materi: 'Museum Tsunami Aceh', date: '2026-07-18', score: 70, status: 'Belum Tuntas' },
  { id: 'hasil-06', studentName: 'Aulia Rahman', materi: 'Garam Tradisional Aceh', date: '2026-07-18', score: 88, status: 'Tuntas' },
  { id: 'hasil-07', studentName: 'Siti Khadijah', materi: 'Padi Aceh', date: '2026-07-17', score: 60, status: 'Belum Tuntas' },
  { id: 'hasil-08', studentName: 'Reza Pratama', materi: 'Tari Saman', date: '2026-07-17', score: 81, status: 'Tuntas' },
  { id: 'hasil-09', studentName: 'Nurul Fadillah', materi: 'Hutan Leuser', date: '2026-07-16', score: 74, status: 'Belum Tuntas' },
  { id: 'hasil-10', studentName: 'Fajar Setiawan', materi: 'Museum Tsunami Aceh', date: '2026-07-16', score: 95, status: 'Tuntas' },
  { id: 'hasil-11', studentName: 'Dinda Amelia', materi: 'Kopi Gayo', date: '2026-07-15', score: 68, status: 'Belum Tuntas' },
  { id: 'hasil-12', studentName: 'Hafiz Maulana', materi: 'Garam Tradisional Aceh', date: '2026-07-15', score: 90, status: 'Tuntas' },
];

/**
 * Future backend: ganti body dengan
 *   return fetch(`${API_BASE_URL}/api/hasil`, { headers: authHeaders() }).then(handleAuthResponse);
 * Caller sudah menganggap ini sebagai sumber async, jadi tidak ada file lain yang perlu berubah.
 */
export function fetchHasil() {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(hasilData), 700);
  });
}
