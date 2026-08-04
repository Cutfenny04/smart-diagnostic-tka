import { useEffect } from 'react';

/* Setara dengan tiap halaman vanilla yang punya <title> sendiri (atau,
   untuk halaman seperti detail-soal.html/detail-materi.html, mengganti
   document.getElementById('pageTitle').textContent secara dinamis). SPA ini
   cuma punya satu index.html, jadi tanpa hook ini judul tab tidak pernah
   berubah saat pindah rute. */
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
