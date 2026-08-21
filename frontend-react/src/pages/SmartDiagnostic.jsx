import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FlaskConical, GraduationCap, PlayCircle, Gamepad2, Inbox, ArrowLeft, Link2Off, ExternalLink } from 'lucide-react';
import Layout from '../components/Layout';
import NonTkaGame from '../components/NonTkaGame';
import CardCornerFrame from '../components/CardCornerFrame';
import { fetchPaketSoal } from '../data/bankSoalData';
import { checkWordwallEmbeddable } from '../data/wordwallData';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './SmartDiagnostic.css';

/* Scope (Revisi 8, lihat PIVOT_PLAN.md §B/§C): halaman ini hanya membaca
   paket dengan status === 'published', lalu merutekan berdasarkan
   paket.type setelah Stimulus:
     - TKA     -> embed iframe Wordwall (paket.wordwallUrl)
     - NON_TKA -> NonTkaGame (game pilihan ganda, lihat components/NonTkaGame.jsx
       -- Fase 5 di PIVOT_PLAN.md §C)
   Tidak ada timer, integrasi API Wordwall, atau AI untuk jalur TKA. Empat
   view, satu halaman, tanpa routing per-view:
     1. list     — Daftar Paket Published (TKA & Non-TKA campur)
     2. stimulus — Stimulus (pengantar sebelum Wordwall/game)
     3. embed    — Embed Wordwall (iframe), atau Empty State kalau link kosong
     4. game     — NonTkaGame (skor dihitung di browser, belum disimpan --
        penyimpanan hasil adalah Fase 6, lihat PIVOT_PLAN.md §C) */

function hotsBadgeClass(level) {
  return { C4: 'badge--c4', C5: 'badge--c5', C6: 'badge--c6' }[level] || 'badge--c4';
}
function typeLabel(type) {
  return type === 'NON_TKA' ? 'Non-TKA' : 'TKA';
}
function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '…';
}

function DiagnosticCard({ item, onOpen }) {
  const isGame = item.type === 'NON_TKA';
  return (
    <article className={'diagnostic-card card-light' + (isGame ? ' diagnostic-card--game' : '')} onClick={() => onOpen(item.id)}>
      {isGame && <CardCornerFrame />}
      <div className="diagnostic-card__head">
        <h3 className="diagnostic-card__title">{item.title}</h3>
        <span className={'badge ' + hotsBadgeClass(item.hotsLevel)}>{item.hotsLevel}</span>
      </div>
      <div className="diagnostic-card__meta">
        <span><FlaskConical size={14} /> {item.subject}</span>
        <span><GraduationCap size={14} /> {item.grade}</span>
      </div>
      <p className="diagnostic-card__summary">{truncate(item.stimulus, 120)}</p>
      <div className="diagnostic-card__tags">
        {isGame
          ? <span className="badge diagnostic-card__type-badge--game"><Gamepad2 size={13} /> Game Interaktif</span>
          : <span className="badge badge--info">{typeLabel(item.type)}</span>}
      </div>
      <div className="diagnostic-card__action">
        {isGame
          ? <button type="button" className="btn btn-primary"><Gamepad2 size={16} /> Main Sekarang</button>
          : <button type="button" className="btn btn-primary"><PlayCircle size={16} /> Mulai</button>}
      </div>
    </article>
  );
}

function ListView({ publishedPaket, onOpen }) {
  if (publishedPaket.length === 0) {
    return (
      <div className="card-light empty-state-full">
        <div className="empty-state">
          <div className="empty-state__icon"><Inbox size={28} /></div>
          <h3 className="empty-state__title">Belum ada paket soal Published</h3>
          <p className="empty-state__desc">Publikasikan paket soal terlebih dahulu di Bank Soal Berbasis Budaya Aceh agar muncul di sini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="diagnostic-grid">
      {publishedPaket.map((item) => (
        <DiagnosticCard key={item.id} item={item} onOpen={onOpen} />
      ))}
    </div>
  );
}

function StimulusView({ item, onBack, onStart }) {
  const isGame = item.type === 'NON_TKA';
  return (
    <div className={'card-light diagnostic-stimulus' + (isGame ? ' diagnostic-stimulus--game' : '')}>
      {isGame && <CardCornerFrame />}
      {isGame && (
        <img
          className="diagnostic-stimulus__mascot"
          src={encodeURI('/assets/assets bank soal non tka/mascot-anak-aceh.png')}
          alt=""
          aria-hidden="true"
        />
      )}
      <h2 className="diagnostic-stimulus__title">{item.title}</h2>
      <div className="diagnostic-stimulus__tags">
        <span className="badge badge--info">{item.subject}</span>
        <span className="badge badge--info">{item.grade}</span>
        <span className={'badge ' + hotsBadgeClass(item.hotsLevel)}>{item.hotsLevel}</span>
        {isGame && <span className="badge diagnostic-card__type-badge--game"><Gamepad2 size={13} /> Game Interaktif</span>}
      </div>
      <h3 className="diagnostic-stimulus__section-title">Stimulus Budaya Aceh</h3>
      <p className="diagnostic-stimulus__text">{item.stimulus}</p>
      <div className="diagnostic-stimulus__actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}><ArrowLeft size={16} /> Kembali</button>
        {isGame
          ? <button type="button" className="btn btn-primary" onClick={onStart}><Gamepad2 size={16} /> Mulai Game</button>
          : <button type="button" className="btn btn-primary" onClick={onStart}><PlayCircle size={16} /> Mulai Diagnostik</button>}
      </div>
    </div>
  );
}

/* Revisi 8 (arahan user 2026-08-11): Wordwall harus dimainkan LANGSUNG di
   dalam website lewat iframe, bukan cuma tombol keluar ke tab baru. Tapi
   tidak semua link Wordwall bisa di-embed -- link berformat /resource/...
   mengirim X-Frame-Options: SAMEORIGIN yang memblokir iframe lintas origin
   (sudah dikonfirmasi manual dengan 2 link dari klien), sedangkan link
   /play/... biasanya tidak. Daripada menampilkan iframe kosong tanpa
   penjelasan, cek dulu ke backend (GET /api/wordwall/check-embed) sebelum
   memutuskan render iframe atau fallback "buka di tab baru". */
function EmbedView({ item, onBack }) {
  const hasUrl = Boolean(item.wordwallUrl);
  const [embedStatus, setEmbedStatus] = useState(hasUrl ? 'checking' : 'no-url');

  useEffect(() => {
    if (!hasUrl) return;
    let cancelled = false;
    setEmbedStatus('checking');
    checkWordwallEmbeddable(item.wordwallUrl)
      .then((result) => {
        if (!cancelled) setEmbedStatus(result.embeddable ? 'embeddable' : 'blocked');
      })
      .catch(() => {
        // Gagal cek -- tetap coba tampilkan iframe (perilaku lama) daripada
        // memblokir guru cuma karena endpoint cek-nya sendiri bermasalah.
        if (!cancelled) setEmbedStatus('embeddable');
      });
    return () => { cancelled = true; };
  }, [hasUrl, item.wordwallUrl]);

  return (
    <div className="card-light diagnostic-embed">
      <div className="diagnostic-embed__head">
        <h2 className="diagnostic-embed__title">{item.title}</h2>
        <button type="button" className="btn btn-secondary" onClick={() => onBack(hasUrl)}><ArrowLeft size={16} /> Kembali</button>
      </div>

      {embedStatus === 'checking' && (
        <div className="embed-frame embed-frame--loading">
          <div className="skeleton skeleton--text" style={{ width: '40%' }} />
        </div>
      )}

      {embedStatus === 'embeddable' && (
        <div className="embed-frame">
          <iframe src={item.wordwallUrl} title={'Aktivitas Wordwall - ' + item.title} allowFullScreen />
        </div>
      )}

      {embedStatus === 'blocked' && (
        <div className="empty-state">
          <div className="empty-state__icon"><ExternalLink size={28} /></div>
          <h3 className="empty-state__title">Aktivitas tidak dapat ditampilkan langsung</h3>
          <p className="empty-state__desc">Aktivitas ini tidak dapat dimainkan langsung di dalam website karena pengaturan Wordwall. Silakan buka aktivitas melalui Wordwall.</p>
          <a href={item.wordwallUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <ExternalLink size={16} /> Buka di Wordwall
          </a>
        </div>
      )}

      {embedStatus === 'no-url' && (
        <div className="empty-state">
          <div className="empty-state__icon"><Link2Off size={28} /></div>
          <h3 className="empty-state__title">Link Wordwall belum tersedia</h3>
          <p className="empty-state__desc">Silakan kembali ke Bank Soal dan lengkapi paket soal.</p>
        </div>
      )}
    </div>
  );
}

function SmartDiagnostic() {
  const [searchParams] = useSearchParams();
  const [publishedPaket, setPublishedPaket] = useState(null);
  const [view, setView] = useState('list');
  const [selectedPaket, setSelectedPaket] = useState(null);

  useDocumentTitle('Smart Diagnostic - Smart Diagnostic TKA');

  useEffect(() => {
    fetchPaketSoal().then((allPaket) => {
      const published = allPaket.filter((p) => p.status === 'published');
      setPublishedPaket(published);

      // Direct-link support: bank-soal.html/BankSoal.jsx menaut ke sini sebagai
      // /smart-diagnostic?paket=<id> untuk paket Published. Selalu mendarat di
      // view Stimulus, tidak pernah langsung ke iframe. Id tidak dikenal atau
      // bukan Published diam-diam jatuh ke daftar.
      const paketId = searchParams.get('paket');
      const target = paketId && published.find((p) => String(p.id) === String(paketId));
      if (target) {
        setSelectedPaket(target);
        setView('stimulus');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  function openStimulus(id) {
    const item = publishedPaket.find((p) => String(p.id) === String(id));
    if (!item) return;
    setSelectedPaket(item);
    setView('stimulus');
  }

  return (
    <Layout breadcrumb="Smart Diagnostic">
      <div className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">Smart Diagnostic</h1>
          <p className="page-header__desc">Pilih paket soal budaya Aceh yang sudah dipublikasikan, lalu mulai aktivitas diagnostik melalui Wordwall (TKA) atau game interaktif (Non-TKA).</p>
        </div>
      </div>

      {view === 'list' && (
        publishedPaket === null ? (
          <div className="diagnostic-grid">
            {Array.from({ length: 3 }, (_, i) => (
              <div className="card-light diagnostic-card" key={i}>
                <div className="skeleton skeleton--text" style={{ width: '50%' }} />
                <div className="skeleton skeleton--title" />
                <div className="skeleton skeleton--text" />
              </div>
            ))}
          </div>
        ) : (
          <ListView publishedPaket={publishedPaket} onOpen={openStimulus} />
        )
      )}

      {view === 'stimulus' && selectedPaket && (
        <StimulusView
          item={selectedPaket}
          onBack={() => setView('list')}
          onStart={() => setView(selectedPaket.type === 'NON_TKA' ? 'game' : 'embed')}
        />
      )}

      {view === 'embed' && selectedPaket && (
        <EmbedView item={selectedPaket} onBack={(hasUrl) => setView(hasUrl ? 'stimulus' : 'list')} />
      )}

      {view === 'game' && selectedPaket && (
        <NonTkaGame paket={selectedPaket} onExit={() => setView('stimulus')} />
      )}
    </Layout>
  );
}

export default SmartDiagnostic;
