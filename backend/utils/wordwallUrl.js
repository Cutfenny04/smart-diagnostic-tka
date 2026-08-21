// Cek SINKRON (tidak ada fetch jaringan) apakah sebuah string adalah URL
// wordwall.net yang sah -- dipakai wordwall.controller.js (sebelum fetch
// server-side, guard SSRF) dan paketSoal.controller.js (gerbang publish,
// roadmap item #6 2026-08-22: "kemudian baru bisa publish"). Sengaja TIDAK
// menyentuh embeddability (X-Frame-Options dsb) -- itu butuh fetch jaringan
// ke wordwall.net dan cuma dipakai sebagai info tampilan (lihat
// checkEmbeddable di wordwall.controller.js), bukan syarat publish, karena
// URL yang tidak bisa di-embed tetap bisa dimainkan lewat fallback "Buka di
// Wordwall" (Fase 7E) -- jangan jadikan embeddability gerbang publish.
const WORDWALL_HOSTNAME_RE = /(^|\.)wordwall\.net$/i;

function isWordwallUrl(url) {
  if (!url) return false;
  try {
    return WORDWALL_HOSTNAME_RE.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

module.exports = { isWordwallUrl, WORDWALL_HOSTNAME_RE };
