// Menurunkan "tahap Wordwall" (roadmap item #6, 2026-08-22) dari 2 field
// yang sudah ada di paket_soal (wordwallUrl, status) -- SENGAJA tidak ada
// kolom `stage`/`status` baru di database supaya tidak ada 2 sumber
// kebenaran yang bisa saling tidak sinkron (kelas bug yang berulang kali
// ditemukan di project ini, lihat concept_final_v2_pivot memory).
//
// 5 tahap sesuai brief user: DRAFT -> URL DIMASUKKAN -> URL VALID ->
// PUBLISHED -> AKTIVITAS TERSEDIA. Backend sekarang mewajibkan URL valid
// sebelum bisa publish (paketSoal.controller.js validatePaket()), jadi begitu
// status='published' tahap PUBLISHED dan AKTIVITAS TERSEDIA otomatis
// tercapai bersamaan -- itu bukan bug, itu memang berarti publish hanya
// berhasil kalau URL-nya sudah sah.
const WORDWALL_HOSTNAME_RE = /(^|\.)wordwall\.net$/i;

export function isWordwallUrl(url) {
  if (!url) return false;
  try {
    return WORDWALL_HOSTNAME_RE.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

export const WORDWALL_STAGES = [
  { key: 'draft', label: 'Draft' },
  { key: 'url_dimasukkan', label: 'URL Dimasukkan' },
  { key: 'url_valid', label: 'URL Valid' },
  { key: 'published', label: 'Published' },
  { key: 'tersedia', label: 'Aktivitas Tersedia' },
];

// Mengembalikan { key, label, step, reachedSteps } -- reachedSteps dipakai
// checklist (1..N tahap yang sudah tercapai), key/label/step dipakai badge
// ringkas (tabel, kartu kecil).
export function computeWordwallStage(item) {
  const hasUrl = Boolean(item.wordwallUrl);
  const urlValid = isWordwallUrl(item.wordwallUrl);
  const isPublished = item.status === 'published';

  let stage;
  if (!hasUrl) stage = WORDWALL_STAGES[0];
  else if (!urlValid) stage = WORDWALL_STAGES[1];
  else if (!isPublished) stage = WORDWALL_STAGES[2];
  else stage = WORDWALL_STAGES[4]; // published => valid wajib (gerbang backend), jadi langsung "Aktivitas Tersedia"

  const step = WORDWALL_STAGES.findIndex((s) => s.key === stage.key) + 1;
  // Published melompati "PUBLISHED" murni ke "AKTIVITAS TERSEDIA" (step 5) --
  // tapi utk checklist, tahap 4 (Published) tetap dianggap tercapai juga.
  const reachedSteps = isPublished ? 5 : step;

  return { ...stage, step, reachedSteps };
}
