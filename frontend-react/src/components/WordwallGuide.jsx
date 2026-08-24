import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import './WordwallGuide.css';

/* Alur membuat & mendaftarkan aktivitas TKA (roadmap item #5, 2026-08-22):
   guru sebelumnya cuma disodori form kosong tanpa konteks urutan kerjanya.
   8 tahap ini persis urutan yang diminta user -- 4 tahap pertama terjadi di
   Wordwall.net sendiri (situs ini tidak bisa melacaknya), 2 tahap terakhir
   otomatis begitu form ini disimpan (makanya tidak charged sebagai langkah
   guru yang harus dilakukan manual).

   Bugfix cookie popup berulang (2026-08-24): tahap 4 SEBELUMNYA menyuruh
   guru menyalin "Play URL" (wordwall.net/play/...) dari address bar. Link
   itu memuat halaman situs Wordwall yang lengkap (form nama pemain + banner
   cookie consent Wordwall sendiri). Di dalam iframe cross-origin, browser
   memblokir cookie pihak ketiga sehingga persetujuan cookie itu tidak
   pernah tersimpan -- banner-nya muncul lagi setiap kali Wordwall
   berpindah halaman internal, dan menekan "Terima semua" memicu reload
   yang terlihat seperti aktivitas kembali ke awal. Wordwall.net -> tombol
   Share pada aktivitas yang sudah dipublish -> tab "Embed" menyediakan
   link wordwall.net/embed/... yang dirancang khusus untuk iframe: tanpa
   chrome situs, tanpa form nama, dan tanpa banner cookie itu. */
const STEPS = [
  { n: 1, label: 'Pelajari Modul Panduan Wordwall', where: 'here' },
  { n: 2, label: 'Buat soal di Wordwall.net', where: 'external' },
  { n: 3, label: 'Publish aktivitasnya di Wordwall.net', where: 'external' },
  { n: 4, label: 'Klik Share > Embed, lalu salin link embed-nya (bukan Play URL)', where: 'external' },
  { n: 5, label: 'Tempel link embed ke form di bawah ini', where: 'here' },
  { n: 6, label: 'Website mengecek URL-nya otomatis', where: 'auto' },
  { n: 7, label: 'Aktivitas masuk ke Bank Soal TKA', where: 'auto' },
  { n: 8, label: 'Aktivitas bisa dimainkan langsung di Smart Diagnostic', where: 'auto' },
];

const WHERE_LABEL = { here: 'Di sini', external: 'Di Wordwall.net', auto: 'Otomatis' };

function WordwallGuide() {
  return (
    <section className="card-light wordwall-guide" aria-label="Alur Membuat Aktivitas TKA">
      <div className="section-heading">
        <h2 className="section-heading__title">Alur Membuat Aktivitas TKA</h2>
        <p className="wordwall-guide__desc">
          Soal HOTS tetap dibuat langsung di Wordwall.net, bukan di website ini. Ikuti 8 langkah berikut dari awal
          sampai aktivitas Anda bisa dimainkan di Smart Diagnostic.
        </p>
        <p className="wordwall-guide__warning">
          Penting: gunakan link <strong>Embed</strong> (tombol Share &rarr; tab Embed di Wordwall.net), <em>bukan</em>{' '}
          Play URL dari address bar. Play URL memunculkan banner cookie Wordwall yang terus berulang dan membuat
          aktivitas seolah kembali ke awal saat ditekan &quot;Terima semua&quot;.
        </p>
      </div>
      <ol className="wordwall-guide__list">
        {STEPS.map((s) => (
          <li key={s.n} className={'wordwall-guide__step is-' + s.where}>
            <span className="wordwall-guide__num">{s.n}</span>
            <span className="wordwall-guide__label">{s.label}</span>
            <span className="wordwall-guide__where">{WHERE_LABEL[s.where]}</span>
          </li>
        ))}
      </ol>
      <div className="wordwall-guide__links">
        <Link to="/materi/panduan-penggunaan" className="wordwall-guide__link">Baca Panduan Penggunaan (Bab 4–5: Wordwall &amp; TKA)</Link>
        <Link to="/materi" className="wordwall-guide__link">Baca Modul Panduan Wordwall</Link>
        <a href="https://wordwall.net" target="_blank" rel="noopener noreferrer" className="wordwall-guide__link">
          Buka Wordwall.net <ExternalLink size={13} />
        </a>
      </div>
    </section>
  );
}

export default WordwallGuide;
