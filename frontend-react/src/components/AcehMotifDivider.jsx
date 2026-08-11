import { useId } from 'react';

/* Motif dekoratif terinspirasi "pucuk rebung" (motif segitiga berlapis) yang
   umum dipakai pada sulaman/ukiran Aceh & Gayo -- dipakai sebagai identitas
   visual permanen game Non-TKA (bukan konten soal), lihat catatan nuansa
   Aceh di PIVOT_PLAN.md §B2. Warna diwariskan lewat CSS `color` (currentColor),
   jadi cukup atur lewat className pemanggil. */
function AcehMotifDivider({ className }) {
  const patternId = useId();

  return (
    <svg
      className={'aceh-motif-divider' + (className ? ' ' + className : '')}
      viewBox="0 0 240 14"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <pattern id={patternId} width="20" height="14" patternUnits="userSpaceOnUse">
        <path d="M0 14 L10 1 L20 14 Z" fill="currentColor" opacity="0.85" />
        <path d="M5 14 L10 7 L15 14 Z" fill="currentColor" opacity="0.5" />
      </pattern>
      <rect width="240" height="14" fill={`url(#${patternId})`} />
    </svg>
  );
}

export default AcehMotifDivider;
