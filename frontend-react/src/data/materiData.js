import { API_BASE_URL, authHeaders, handleAuthResponse } from '../services/api';
import { officialModules, getModuleContentById, getNextModule, getPreviousModule } from './materi';

export { officialModules, getModuleContentById, getNextModule, getPreviousModule };

export const materiCategoryMeta = {
  hots: { label: 'HOTS & Asesmen', thumbClass: 'module-card__thumb--hots', icon: 'brain' },
  soal: { label: 'Penyusunan Instrumen', thumbClass: 'module-card__thumb--soal', icon: 'file-edit' },
  budaya: { label: 'Stimulus & Budaya', thumbClass: 'module-card__thumb--budaya', icon: 'landmark' },
};

export const materiCategoryOrder = ['hots', 'soal', 'budaya'];

/* Mengambil daftar materi dari backend dan menggabungkannya dengan konten resmi */
export async function fetchMateri() {
  try {
    const headers = await authHeaders();
    const serverModules = await fetch(`${API_BASE_URL}/api/materi`, { headers }).then(handleAuthResponse);
    
    // Gabungkan data dari server (status/progress guru) dengan struktur 5 modul resmi
    const serverMap = new Map((serverModules || []).map((m) => [Number(m.id), m]));
    
    return officialModules.map((official) => {
      const serverData = serverMap.get(official.id);
      return {
        id: official.id,
        number: official.number,
        title: serverData?.title || official.title,
        desc: serverData?.desc || official.desc,
        category: official.category,
        duration: serverData?.duration || official.duration,
        materiCount: official.sections ? official.sections.length : 1,
        dateAdded: serverData?.dateAdded || '2026-08-01',
        progress: serverData?.progress !== undefined ? serverData.progress : 0,
        lastOpened: serverData?.lastOpened || null,
        startedAt: serverData?.startedAt || null,
        completedAt: serverData?.completedAt || null,
        kontenUrl: serverData?.kontenUrl || official.pdfUrl,
      };
    });
  } catch (err) {
    // Fallback offline / network fail: tetap tampilkan struktur 5 modul resmi
    return officialModules.map((official) => ({
      id: official.id,
      number: official.number,
      title: official.title,
      desc: official.desc,
      category: official.category,
      duration: official.duration,
      materiCount: official.sections ? official.sections.length : 1,
      dateAdded: '2026-08-01',
      progress: 0,
      lastOpened: null,
      startedAt: null,
      completedAt: null,
      kontenUrl: official.pdfUrl,
    }));
  }
}

export function fetchMateriById(id) {
  return fetchMateri().then((modules) => modules.find((m) => String(m.id) === String(id)) || null);
}

/* POST progress belajar guru untuk 1 materi */
export async function updateMateriProgress(id, progress) {
  const headers = await authHeaders();
  return fetch(`${API_BASE_URL}/api/materi/${id}/progress`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ progress }),
  }).then(handleAuthResponse);
}

/* Dihitung dari 5 modul resmi: Selesai = progress >= 100 */
export function computeMateriOverallProgress(modules) {
  const list = modules && modules.length > 0 ? modules : officialModules.map((m) => ({ ...m, progress: 0 }));
  const total = list.length;
  const completed = list.filter((m) => m.progress >= 100).length;
  const inProgress = list.filter((m) => m.progress > 0 && m.progress < 100).length;
  const notStarted = list.filter((m) => m.progress <= 0).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, inProgress, notStarted, total, percent };
}

/* Persentase selesai per kategori */
export function computeMateriProgressByCategory(modules) {
  const list = modules && modules.length > 0 ? modules : officialModules.map((m) => ({ ...m, progress: 0 }));
  return materiCategoryOrder.map((cat) => {
    const items = list.filter((m) => m.category === cat);
    const percent = items.length === 0
      ? 0
      : Math.round(items.reduce((sum, m) => sum + (m.progress || 0), 0) / items.length);
    return { category: cat, label: materiCategoryMeta[cat]?.label || cat, percent };
  });
}

/* ==========================================================================
   Persistensi Checklist Refleksi Mandiri
   Menyimpan status centang guru per materi secara terpercaya di localStorage
   ========================================================================== */
const CHECKLIST_STORAGE_PREFIX = 'sdtka_reflection_';

export function getChecklistStorageKey(guruId, materiId) {
  const safeGuru = guruId || 'current';
  return `${CHECKLIST_STORAGE_PREFIX}${safeGuru}_materi_${materiId}`;
}

export function loadChecklistState(guruId, materiId) {
  try {
    const raw = window.localStorage.getItem(getChecklistStorageKey(guruId, materiId));
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Gagal memuat state checklist refleksi:', e);
    return {};
  }
}

export function saveChecklistState(guruId, materiId, state) {
  try {
    window.localStorage.setItem(getChecklistStorageKey(guruId, materiId), JSON.stringify(state));
  } catch (e) {
    console.error('Gagal menyimpan state checklist refleksi:', e);
  }
}
