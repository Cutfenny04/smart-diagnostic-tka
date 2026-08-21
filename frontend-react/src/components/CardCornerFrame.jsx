import './CardCornerFrame.css';

/* Bingkai ukiran emas untuk kartu paket Non-TKA (DiagnosticCard di
   SmartDiagnostic.jsx) -- permintaan user 2026-08-21, contoh visual persis:
   4 sudut ornamen (bingkai-aceh.png, dicerminkan per sudut lewat CSS
   transform) + 1 strip ornamen horizontal (ornamen-horizontal.png, hasil
   rotasi 90 derajat dari ornamen.png milik user) di ATAS saja, tanpa strip
   di bawah -- beda dari AcehMotifDivider (dipakai di StimulusView/
   NonTkaGame, tetap gaya divider 2-sudut+garis, TIDAK diubah pass ini
   karena user cuma menunjuk tampilan kartu). Parent (.diagnostic-card--game)
   WAJIB position:relative supaya offset negatif sudut ini "mengintip" ke
   luar kartu, pola yang sama dipakai .game-scene__landmark. */
const CORNER = encodeURI('/assets/assets bank soal non tka/bingkai-aceh.png');
const TOP_STRIP = encodeURI('/assets/assets bank soal non tka/ornamen-horizontal.png');

function CardCornerFrame() {
  return (
    <div className="card-corner-frame" aria-hidden="true">
      <img className="card-corner-frame__corner card-corner-frame__corner--tl" src={CORNER} alt="" />
      <img className="card-corner-frame__corner card-corner-frame__corner--tr" src={CORNER} alt="" />
      <img className="card-corner-frame__corner card-corner-frame__corner--bl" src={CORNER} alt="" />
      <img className="card-corner-frame__corner card-corner-frame__corner--br" src={CORNER} alt="" />
      <img className="card-corner-frame__top-strip" src={TOP_STRIP} alt="" />
    </div>
  );
}

export default CardCornerFrame;
