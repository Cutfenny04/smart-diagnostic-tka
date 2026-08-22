import { AlertCircle } from 'lucide-react';

/* Roadmap item #14 (2026-08-22): satu komponen dipakai ulang di semua
   write/destructive action (save, delete, login, logout) supaya kegagalan
   selalu terlihat -- sebelumnya banyak yang macet diam di status
   "Menyimpan..." atau gagal tanpa pesan apa pun. Styling di style.css
   (.inline-error), reuse --color-danger yang sudah dipakai form-field__error. */
function InlineError({ message }) {
  if (!message) return null;
  return (
    <p className="inline-error" role="alert">
      <AlertCircle size={16} /> {message}
    </p>
  );
}

export default InlineError;
