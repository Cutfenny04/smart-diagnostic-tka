import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FlaskConical, GraduationCap, PlayCircle, Inbox, ArrowLeft, Link2Off } from 'lucide-react';
import Layout from '../components/Layout';
import { fetchPaketSoal } from '../data/bankSoalData';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './SmartDiagnostic.css';

/* Scope (Requirement Pivot Revisi 7): halaman ini hanya membaca paket
   dengan status === 'published' dan membuka paket.wordwallUrl lewat
   iframe. Tidak ada timer, skor, penyimpanan jawaban, integrasi API
   Wordwall, atau AI. Tiga view, satu halaman, tanpa routing per-view
   (sama seperti smart-diagnostic.js vanilla):
     1. list     — Daftar Paket Published
     2. stimulus — Stimulus Budaya Aceh (pengantar sebelum Wordwall)
     3. embed    — Embed Wordwall (iframe), atau Empty State kalau link kosong */

function hotsBadgeClass(level) {
  return { C4: 'badge--c4', C5: 'badge--c5', C6: 'badge--c6' }[level] || 'badge--c4';
}
function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '…';
}

function DiagnosticCard({ item, onOpen }) {
  return (
    <article className="diagnostic-card card-light" onClick={() => onOpen(item.id)}>
      <div className="diagnostic-card__head">
        <h3 className="diagnostic-card__title">{item.title}</h3>
        <span className={'badge ' + hotsBadgeClass(item.hotsLevel)}>{item.hotsLevel}</span>
      </div>
      <div className="diagnostic-card__meta">
        <span><FlaskConical size={14} /> {item.subject}</span>
        <span><GraduationCap size={14} /> {item.grade}</span>
      </div>
      <p className="diagnostic-card__summary">{truncate(item.stimulus, 120)}</p>
      <div className="diagnostic-card__action">
        <button type="button" className="btn btn-primary"><PlayCircle size={16} /> Mulai</button>
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
  return (
    <div className="card-light diagnostic-stimulus">
      <h2 className="diagnostic-stimulus__title">{item.title}</h2>
      <div className="diagnostic-stimulus__tags">
        <span className="badge badge--info">{item.subject}</span>
        <span className="badge badge--info">{item.grade}</span>
        <span className={'badge ' + hotsBadgeClass(item.hotsLevel)}>{item.hotsLevel}</span>
      </div>
      <h3 className="diagnostic-stimulus__section-title">Stimulus Budaya Aceh</h3>
      <p className="diagnostic-stimulus__text">{item.stimulus}</p>
      <div className="diagnostic-stimulus__actions">
        <button type="button" className="btn btn-secondary" onClick={onBack}><ArrowLeft size={16} /> Kembali</button>
        <button type="button" className="btn btn-primary" onClick={onStart}><PlayCircle size={16} /> Mulai Diagnostik</button>
      </div>
    </div>
  );
}

function EmbedView({ item, onBack }) {
  const hasUrl = Boolean(item.wordwallUrl);

  return (
    <div className="card-light diagnostic-embed">
      <div className="diagnostic-embed__head">
        <h2 className="diagnostic-embed__title">{item.title}</h2>
        <button type="button" className="btn btn-secondary" onClick={() => onBack(hasUrl)}><ArrowLeft size={16} /> Kembali</button>
      </div>
      {hasUrl ? (
        <div className="embed-frame">
          <iframe src={item.wordwallUrl} title={'Aktivitas Wordwall - ' + item.title} allowFullScreen />
        </div>
      ) : (
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
          <p className="page-header__desc">Pilih paket soal budaya Aceh yang sudah dipublikasikan, lalu mulai aktivitas diagnostik melalui Wordwall.</p>
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
          onStart={() => setView('embed')}
        />
      )}

      {view === 'embed' && selectedPaket && (
        <EmbedView item={selectedPaket} onBack={(hasUrl) => setView(hasUrl ? 'stimulus' : 'list')} />
      )}
    </Layout>
  );
}

export default SmartDiagnostic;
