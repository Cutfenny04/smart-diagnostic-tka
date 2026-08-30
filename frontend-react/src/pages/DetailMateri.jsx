import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Layers, CheckCircle2, SearchX } from 'lucide-react';
import Layout from '../components/Layout';
import FetchError from '../components/FetchError';
import InlineError from '../components/InlineError';
import { fetchMateriById, updateMateriProgress, materiCategoryMeta as CATEGORY_META } from '../data/materiData';
import { friendlyErrorMessage } from '../services/api';
import { useProgressBarAnimation } from '../hooks/useProgressBarAnimation';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDate } from '../utils/formatDate';
import './DetailMateri.css';

// Belum dibuka sama sekali = 0. Baru dibuka pertama kali = 25 (otomatis,
// lihat efek di bawah). Tandai Selesai = 100. Materi belum final dari klien
// (masih kerangka, lihat PIVOT_PLAN.md §5) jadi belum ada breakdown
// per-topik yang bisa dilacak -- 3 titik ini yang realistis untuk dilacak.
const STARTED_PROGRESS = 25;

function statusOf(m) {
  if (m.progress >= 100) return { text: 'Selesai', badge: 'selesai' };
  if (m.progress <= 0) return { text: 'Belum Dipelajari', badge: 'belum' };
  return { text: 'Sedang Dipelajari', badge: 'sedang' };
}

function actionLabel(m) {
  if (m.progress >= 100) return 'Lihat Kembali';
  if (m.progress <= 0) return 'Mulai Belajar';
  return 'Lanjutkan Belajar';
}

function DetailMateri() {
  const { id } = useParams();
  const [modul, setModul] = useState(undefined); // undefined = loading, null = not found
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [fetchErrorMsg, setFetchErrorMsg] = useState('');
  const [autoStartError, setAutoStartError] = useState('');
  const [retryTick, setRetryTick] = useState(0);
  const autoStartedRef = useRef(false);
  const progressBarRef = useRef(null);

  // Reset ke loading tiap ganti id ditangani lewat key={id} di App.jsx
  // (remount penuh), bukan setState manual di sini.
  useEffect(() => {
    fetchMateriById(id)
      .then((result) => {
        setModul(result);
        setFetchErrorMsg('');
      })
      .catch((err) => setFetchErrorMsg(friendlyErrorMessage(err)));
  }, [id, retryTick]);

  // Begitu modul pertama kali dibuka (progress masih 0), otomatis catat
  // sebagai "Sedang Dipelajari" -- ini yang bikin Dashboard/Materi.jsx
  // punya progress asli tanpa guru harus klik apa-apa dulu.
  useEffect(() => {
    if (!modul || modul.progress > 0 || autoStartedRef.current) return;
    autoStartedRef.current = true;
    updateMateriProgress(modul.id, STARTED_PROGRESS)
      .then(() => {
        setModul((prev) => (prev ? { ...prev, progress: STARTED_PROGRESS, startedAt: prev.startedAt || new Date().toISOString() } : prev));
      })
      .catch((err) => {
        // Kegagalan di sini tidak menghalangi guru membaca materinya (halaman
        // tetap tampil) -- cukup dikasih tahu progres otomatisnya tidak
        // tersimpan, bukan disembunyikan diam-diam seperti sebelumnya.
        autoStartedRef.current = false;
        setAutoStartError(friendlyErrorMessage(err));
      });
  }, [modul]);

  async function handleTandaiSelesai() {
    setSaving(true);
    setSaveError('');
    try {
      await updateMateriProgress(modul.id, 100);
      setModul((prev) => (prev ? { ...prev, progress: 100, completedAt: prev.completedAt || new Date().toISOString() } : prev));
    } catch (err) {
      setSaveError(friendlyErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  useProgressBarAnimation(Boolean(modul));

  // useProgressBarAnimation cuma jalan sekali (scroll-into-view via
  // IntersectionObserver) -- begitu progress berubah lagi setelah mount
  // (auto-start atau Tandai Selesai), set width langsung di sini supaya
  // bar-nya ikut update, bukan macet di nilai lamanya.
  useEffect(() => {
    if (progressBarRef.current && modul) {
      progressBarRef.current.style.width = modul.progress + '%';
    }
  }, [modul?.progress]);
  useDocumentTitle(modul ? modul.title + ' - Smart Diagnostic TKA' : 'Detail Materi - Smart Diagnostic TKA');

  if (fetchErrorMsg) {
    return (
      <Layout breadcrumb={[{ label: 'Materi & Modul Pelatihan', to: '/materi' }, { label: 'Gagal Memuat' }]}>
        <FetchError message={fetchErrorMsg} onRetry={() => setRetryTick((n) => n + 1)} />
      </Layout>
    );
  }

  if (modul === undefined) {
    return (
      <Layout breadcrumb={[{ label: 'Materi & Modul Pelatihan', to: '/materi' }, { label: 'Memuat...' }]}>
        <div className="card-light detail-materi-card">
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--text" />
        </div>
      </Layout>
    );
  }

  if (modul === null) {
    return (
      <Layout breadcrumb={[{ label: 'Materi & Modul Pelatihan', to: '/materi' }, { label: 'Tidak Ditemukan' }]}>
        <div className="card-light detail-materi-card">
          <div className="empty-state">
            <div className="empty-state__icon"><SearchX size={28} /></div>
            <h3 className="empty-state__title">Materi tidak ditemukan</h3>
            <p className="empty-state__desc">Modul yang Anda cari tidak ada atau sudah dihapus.</p>
            <Link to="/materi" className="btn btn-primary">Kembali ke Materi</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const meta = CATEGORY_META[modul.category];
  const status = statusOf(modul);

  return (
    <Layout breadcrumb={[{ label: 'Materi & Modul Pelatihan', to: '/materi' }, { label: modul.title }]}>
      <div className="page-header">
        <div className="page-header__text">
          <span className="badge badge--info">{meta.label}</span>
          <h1 className="page-header__title">{modul.title}</h1>
          <p className="page-header__desc">{modul.desc}</p>
        </div>
      </div>

      <div className="card-light detail-materi-card">
        <div className="detail-materi-meta">
          <span><Clock size={16} /> {modul.duration}</span>
          <span><Layers size={16} /> {modul.materiCount} Materi</span>
          <span className={'badge badge--' + status.badge}>{status.text}</span>
        </div>

        <div className="detail-materi-progress">
          <div className="progress-bar" role="progressbar" aria-valuenow={modul.progress} aria-valuemin="0" aria-valuemax="100" aria-label={'Progress ' + modul.title}>
            <div className="progress-bar__fill" data-progress={modul.progress} ref={progressBarRef} />
          </div>
          <span className="detail-materi-progress__label">{modul.progress}% selesai</span>
        </div>

        {modul.startedAt && (
          <p className="detail-materi-dates">
            Mulai dipelajari: {formatDate(modul.startedAt)}
            {modul.completedAt && <> &middot; Selesai: {formatDate(modul.completedAt)}</>}
          </p>
        )}

        {modul.kontenUrl && (
          <section className="detail-materi-viewer" aria-label={`Materi pembelajaran - ${modul.title}`}>
            <iframe
              src={modul.kontenUrl}
              title={`Materi pembelajaran - ${modul.title}`}
            />
          </section>
        )}

        <InlineError message={autoStartError} />

        <div className="form-actions">
          <Link to="/materi" className="btn btn-secondary">Kembali ke Materi</Link>
          {modul.progress < 100 ? (
            <button type="button" className="btn btn-primary" onClick={handleTandaiSelesai} disabled={saving}>
              {saving ? 'Menyimpan...' : <><CheckCircle2 size={16} /> Tandai Selesai</>}
            </button>
          ) : (
            <Link to="/smart-diagnostic" className="btn btn-primary">{actionLabel(modul)}</Link>
          )}
        </div>
        <InlineError message={saveError} />
      </div>
    </Layout>
  );
}

export default DetailMateri;
