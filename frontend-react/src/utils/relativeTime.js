/* Format timestamp jadi teks relatif berbahasa Indonesia, dipakai
   "Aktivitas Terbaru" di Dashboard (menggantikan teks waktu dummy). */
export function formatRelativeTime(dateInput) {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now - date;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return 'Baru saja';
  if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;

  const jam = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return `Kemarin, ${jam}`;
  if (diffDays < 7) return `${diffDays} hari yang lalu`;

  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}
