/* Ambang nilai kelulusan (0-100) untuk status Tuntas/Belum Tuntas.
   BELUM ada angka resmi dari klien (Bu Putri) soal KKM Smart Diagnostic --
   70 dipakai sebagai standar KKM umum untuk tahap prototype.
   Satu-satunya tempat nilai ini didefinisikan (dipakai NonTkaGame.jsx dan
   HasilDiagnostik.jsx) supaya kalau nanti klien kasih angka resmi (mis.
   75), cukup ubah angka ini saja -- JANGAN hardcode ulang di komponen lain. */
export const PASSING_SCORE = 70;

export function isTuntas(score) {
  return score >= PASSING_SCORE;
}
