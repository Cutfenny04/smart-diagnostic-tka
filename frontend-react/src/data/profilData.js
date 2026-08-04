/* ==========================================================================
   PROFIL — Data prototype (sama persis isinya dengan
   frontend/assets/data/profil.js versi lama). View-only, tidak ada alur edit.

   Future backend: ganti body fetchProfil() dengan
     return fetch(`${API_BASE_URL}/api/profil`, { headers: authHeaders() }).then(handleAuthResponse);
   Caller sudah menganggap ini sebagai sumber async, jadi tidak ada file lain yang perlu berubah.
   ========================================================================== */

const profilData = {
  name: 'Cut Meutia, S.Pd.',
  role: 'Guru IPA',
  email: 'cut.meutia@smpn1acehbesar.sch.id',
  school: 'SMP Negeri 1 Aceh Besar',
  subject: 'Ilmu Pengetahuan Alam (IPA)',
  grade: 'Kelas VII - IX',
  joinDate: '2023-07-01',
};

export function fetchProfil() {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(profilData), 500);
  });
}
