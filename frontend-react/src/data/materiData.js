import { API_BASE_URL, authHeaders, handleAuthResponse } from '../services/api';

export const materiCategoryMeta = {
  hots: { label: 'HOTS', thumbClass: 'module-card__thumb--hots', icon: 'brain' },
  budaya: { label: 'Budaya Aceh', thumbClass: 'module-card__thumb--budaya', icon: 'landmark' },
  soal: { label: 'Penyusunan Soal', thumbClass: 'module-card__thumb--soal', icon: 'file-edit' },
};

export const materiCategoryOrder = ['hots', 'budaya', 'soal'];

export async function fetchMateri() {
  const headers = await authHeaders();
  return fetch(`${API_BASE_URL}/api/materi`, { headers }).then(handleAuthResponse);
}

export function fetchMateriById(id) {
  return fetchMateri().then((modules) => modules.filter((m) => String(m.id) === String(id))[0] || null);
}

/* POST progress belajar guru untuk 1 materi (dipanggil DetailMateri.jsx --
   sekali otomatis saat modul dibuka pertama kali, sekali lagi lewat tombol
   "Tandai Selesai"). Backend: materi.controller.js updateProgress(). */
export async function updateMateriProgress(id, progress) {
  const headers = await authHeaders();
  return fetch(`${API_BASE_URL}/api/materi/${id}/progress`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ progress }),
  }).then(handleAuthResponse);
}

/* Dihitung dari daftar modul asli (bukan angka dummy lagi) -- dipakai
   Materi.jsx (progress keseluruhan) dan Dashboard.jsx (kartu statistik +
   Progress Pelatihan). "Selesai" = progress >= 100. */
export function computeMateriOverallProgress(modules) {
  const total = modules.length;
  const completed = modules.filter((m) => m.progress >= 100).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percent };
}

/* Persentase selesai per kategori (hots/budaya/soal) -- dipakai Dashboard.jsx
   untuk "Progress Belajar" (menggantikan 3 baris dummy yang labelnya juga
   sudah tidak cocok dengan materiCategoryMeta yang sebenarnya). */
export function computeMateriProgressByCategory(modules) {
  return materiCategoryOrder.map((cat) => {
    const items = modules.filter((m) => m.category === cat);
    const percent = items.length === 0
      ? 0
      : Math.round(items.reduce((sum, m) => sum + m.progress, 0) / items.length);
    return { category: cat, label: materiCategoryMeta[cat].label, percent };
  });
}
