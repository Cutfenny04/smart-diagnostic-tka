/* Motif dekoratif "identitas Aceh" dipakai di 4 tempat sepanjang perjalanan
   Non-TKA (kartu daftar di SmartDiagnostic.jsx -> stimulus -> papan soal ->
   hasil di NonTkaGame.jsx) -- lihat PIVOT_PLAN.md §B2. Redesign 2026-08-21
   (permintaan user, menunjuk langsung ke motif di kartu daftar): sebelumnya
   segitiga SVG polos ber-warna currentColor (hijau di kartu/stimulus, emas
   di dalam game), sekarang pakai ornamen ukiran emas asli (bingkai-aceh.png,
   diproses dari file mentah user "bingkai-aceh.jpg" -- background putihnya
   dihapus lewat canvas white-key, lihat riwayat sesi) di kedua ujung + garis
   tipis emas di tengah. Warna ornamen sudah baku di dalam gambarnya sendiri
   (bukan lagi currentColor), jadi seragam emas di ke-4 tempat pemakaian --
   ini sengaja menyimpang dari aturan lama "warna emas cuma di .game-scene"
   karena elemen ini sendiri MEMANG identitas visual Non-TKA, bukan token
   warna sitewide. */
const ORNAMENT = encodeURI('/assets/assets bank soal non tka/bingkai-aceh.png');

function AcehMotifDivider({ className }) {
  return (
    <div className={'aceh-motif-divider' + (className ? ' ' + className : '')} aria-hidden="true">
      <img className="aceh-motif-divider__corner aceh-motif-divider__corner--start" src={ORNAMENT} alt="" />
      <span className="aceh-motif-divider__line" />
      <img className="aceh-motif-divider__corner aceh-motif-divider__corner--end" src={ORNAMENT} alt="" />
    </div>
  );
}

export default AcehMotifDivider;
