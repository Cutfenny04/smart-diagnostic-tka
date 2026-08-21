import './CardCornerFrame.css';

/* Bingkai ukiran emas -- dipakai di 4 tempat sekarang (DiagnosticCard,
   StimulusView, NonTkaGame question board, NonTkaGame result), permintaan
   user 2026-08-21: 4 sudut ornamen (bingkai-aceh.png, dicerminkan per sudut
   lewat CSS transform) + 1 strip ornamen horizontal di ATAS saja, tanpa
   strip di bawah. Parent WAJIB position:relative supaya offset negatif
   sudut ini "mengintip" ke luar, pola yang sama dipakai .game-scene__landmark.

   Strip atas sengaja dipasang lewat CSS background-repeat (bukan <img> yang
   di-object-fit:fill) -- 4 konteks pemakaian lebar kontainernya beda jauh
   (kartu ~380px vs papan soal bisa >800px), dan meregangkan satu gambar ke
   lebar berapa pun bikin motifnya kelihatan tipis/renggang di kontainer
   lebar. Pola berulang (tile) menjaga kepadatan motif tetap konsisten di
   lebar berapa pun -- ornamen-horizontal.png sudah di-crop pas ke pola
   bunganya sendiri (900x179, hasil rotasi 90deg dari ornamen.png milik
   user), jadi satu ukuran tile sudah representatif untuk di-ulang. */
const CORNER = encodeURI('/assets/assets bank soal non tka/bingkai-aceh.png');
const TOP_STRIP = encodeURI('/assets/assets bank soal non tka/ornamen-horizontal.png');
const topStripStyle = { backgroundImage: `url("${TOP_STRIP}")` };

function CardCornerFrame() {
  return (
    <div className="card-corner-frame" aria-hidden="true">
      <img className="card-corner-frame__corner card-corner-frame__corner--tl" src={CORNER} alt="" />
      <img className="card-corner-frame__corner card-corner-frame__corner--tr" src={CORNER} alt="" />
      <img className="card-corner-frame__corner card-corner-frame__corner--bl" src={CORNER} alt="" />
      <img className="card-corner-frame__corner card-corner-frame__corner--br" src={CORNER} alt="" />
      <span className="card-corner-frame__top-strip" style={topStripStyle} />
    </div>
  );
}

export default CardCornerFrame;
