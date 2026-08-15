import { API_BASE_URL, authHeaders, handleAuthResponse } from '../services/api';

export const materiCategoryMeta = {
  hots: { label: 'HOTS', thumbClass: 'module-card__thumb--hots', icon: 'brain' },
  budaya: { label: 'Budaya Aceh', thumbClass: 'module-card__thumb--budaya', icon: 'landmark' },
  soal: { label: 'Penyusunan Soal', thumbClass: 'module-card__thumb--soal', icon: 'file-edit' },
};

export const materiCategoryOrder = ['hots', 'budaya', 'soal'];

// Prototype: belum dihitung dari data asli, lihat PIVOT_PLAN.md §Batasan Sistem.
export const materiOverallProgress = { completed: 12, total: 18, percent: 67 };

export async function fetchMateri() {
  const headers = await authHeaders();
  return fetch(`${API_BASE_URL}/api/materi`, { headers }).then(handleAuthResponse);
}

export function fetchMateriById(id) {
  return fetchMateri().then((modules) => modules.filter((m) => String(m.id) === String(id))[0] || null);
}
