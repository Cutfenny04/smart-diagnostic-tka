// Format tanggal absolut gaya Indonesia (mis. "22 Agu 2026") -- dipakai di
// mana pun tanggal asli (bukan waktu relatif) perlu ditampilkan.
export function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
