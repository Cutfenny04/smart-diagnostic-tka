import { AlertCircle } from 'lucide-react';

/* Roadmap item #14 (2026-08-22): dipakai saat fetch data awal sebuah
   halaman gagal (Dashboard, Dashboard Hasil, Materi, Bank Soal, Smart
   Diagnostic). Sebelumnya semua halaman ini cuma .then(setState) tanpa
   .catch() -- kalau gagal, state tetap null selamanya dan skeleton loading
   tampil macet tanpa penjelasan. Ini menggantikan skeleton itu dengan pesan
   + tombol Coba Lagi. Reuse class .empty-state* yang sudah ada (dipakai
   juga untuk state "belum ada data", bukan cuma error). */
function FetchError({ message, onRetry }) {
  return (
    <div className="card-light empty-state-full">
      <div className="empty-state">
        <div className="empty-state__icon empty-state__icon--danger"><AlertCircle size={28} /></div>
        <h3 className="empty-state__title">Gagal memuat data</h3>
        <p className="empty-state__desc">{message || 'Terjadi kesalahan saat memuat data. Silakan coba lagi.'}</p>
        <button type="button" className="btn btn-primary" onClick={onRetry}>Coba Lagi</button>
      </div>
    </div>
  );
}

export default FetchError;
