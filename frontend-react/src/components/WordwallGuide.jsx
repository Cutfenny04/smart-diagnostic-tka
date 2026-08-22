import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import './WordwallGuide.css';

/* Alur membuat & mendaftarkan aktivitas TKA (roadmap item #5, 2026-08-22):
   guru sebelumnya cuma disodori form kosong tanpa konteks urutan kerjanya.
   8 tahap ini persis urutan yang diminta user -- 4 tahap pertama terjadi di
   Wordwall.net sendiri (situs ini tidak bisa melacaknya), 2 tahap terakhir
   otomatis begitu form ini disimpan (makanya tidak charged sebagai langkah
   guru yang harus dilakukan manual). */
const STEPS = [
  { n: 1, label: 'Pelajari Modul Panduan Wordwall', where: 'here' },
  { n: 2, label: 'Buat soal di Wordwall.net', where: 'external' },
  { n: 3, label: 'Publish aktivitasnya di Wordwall.net', where: 'external' },
  { n: 4, label: 'Salin Play URL dari Wordwall.net', where: 'external' },
  { n: 5, label: 'Tempel URL ke form di bawah ini', where: 'here' },
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
