import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  SearchX,
  ArrowLeft,
  ArrowRight,
  Target,
  Gamepad2,
} from 'lucide-react';
import Layout from '../components/Layout';
import FetchError from '../components/FetchError';
import InlineError from '../components/InlineError';
import LearningSection from '../components/LearningSection';
import AcehCallout from '../components/AcehCallout';
import ReflectionChecklist from '../components/ReflectionChecklist';
import PdfViewer from '../components/PdfViewer';
import {
  fetchMateriById,
  updateMateriProgress,
  materiCategoryMeta as CATEGORY_META,
  getModuleContentById,
  getNextModule,
  getPreviousModule,
} from '../data/materiData';
import { useAuth } from '../context/AuthContext';
import { friendlyErrorMessage } from '../services/api';
import { useProgressBarAnimation } from '../hooks/useProgressBarAnimation';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { formatDate } from '../utils/formatDate';
import './DetailMateri.css';

const STARTED_PROGRESS = 25;

function statusOf(m) {
  if (m.progress >= 100) return { text: 'Selesai', badge: 'selesai' };
  if (m.progress <= 0) return { text: 'Belum Dimulai', badge: 'belum' };
  return { text: 'Sedang Dipelajari', badge: 'sedang' };
}

function DetailMateri() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const guruId = user?.id;

  const [modul, setModul] = useState(undefined); // undefined = loading, null = not found
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [fetchErrorMsg, setFetchErrorMsg] = useState('');
  const [autoStartError, setAutoStartError] = useState('');
  const [retryTick, setRetryTick] = useState(0);

  const autoStartedRef = useRef(false);
  const progressBarRef = useRef(null);

  // Ambil konten detail native dari kurikulum
  const content = getModuleContentById(id);
  const nextMod = getNextModule(id);
  const prevMod = getPreviousModule(id);

  useEffect(() => {
    fetchMateriById(id)
      .then((result) => {
        setModul(result);
        setFetchErrorMsg('');
      })
      .catch((err) => setFetchErrorMsg(friendlyErrorMessage(err)));
  }, [id, retryTick]);

  // Otomatis catat minimal 25% saat pertama kali modul dibuka
  useEffect(() => {
    if (!modul || modul.progress > 0 || autoStartedRef.current) return;
    autoStartedRef.current = true;
    updateMateriProgress(modul.id, STARTED_PROGRESS)
      .then(() => {
        setModul((prev) =>
          prev
            ? {
                ...prev,
                progress: STARTED_PROGRESS,
                startedAt: prev.startedAt || new Date().toISOString(),
              }
            : prev
        );
      })
      .catch((err) => {
        autoStartedRef.current = false;
        setAutoStartError(friendlyErrorMessage(err));
      });
  }, [modul]);

  async function handleTandaiSelesai() {
    setSaving(true);
    setSaveError('');
    try {
      await updateMateriProgress(modul.id, 100);
      setModul((prev) =>
        prev
          ? {
              ...prev,
              progress: 100,
              completedAt: prev.completedAt || new Date().toISOString(),
            }
          : prev
      );
    } catch (err) {
      setSaveError(friendlyErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  useProgressBarAnimation(Boolean(modul));

  useEffect(() => {
    if (progressBarRef.current && modul) {
      progressBarRef.current.style.width = modul.progress + '%';
    }
  }, [modul?.progress]);

  useDocumentTitle(modul ? `${modul.title} - Smart Diagnostic TKA` : 'Detail Materi - Smart Diagnostic TKA');

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
          <div className="skeleton skeleton--text" style={{ width: '60%' }} />
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
            <p className="empty-state__desc">Modul pembelajaran yang Anda cari tidak ada atau belum tersedia.</p>
            <Link to="/materi" className="btn btn-primary">Kembali ke Daftar Materi</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const meta = CATEGORY_META[modul.category] || { label: 'Pelatihan HOTS', icon: 'brain' };
  const status = statusOf(modul);
  const pdfLink = content?.pdfUrl || modul.kontenUrl || '/pdf/bahan-tayang-pelatihan.pdf';

  return (
    <Layout breadcrumb={[{ label: 'Materi & Modul Pelatihan', to: '/materi' }, { label: `Modul ${content?.number || modul.id}: ${modul.title}` }]}>
      {/* Page Header */}
      <div className="page-header detail-materi-header">
        <div className="page-header__text">
          <div className="detail-materi-header__badges">
            <span className="badge badge--info">{meta.label}</span>
            <span className="badge badge--new">Modul {content?.number || modul.id}</span>
            <span className={'badge badge--' + status.badge}>{status.text}</span>
          </div>
          <h1 className="page-header__title">{modul.title}</h1>
          <p className="page-header__desc">{modul.desc}</p>
        </div>
        <div className="page-header__actions">
          <Link to="/materi" className="btn btn-secondary">
            <ArrowLeft size={16} /> Daftar Materi
          </Link>
        </div>
      </div>

      <div className="detail-materi-layout">
        {/* Main Content Area */}
        <main className="detail-materi-main">
          {/* Status & Progress Bar Card */}
          <div className="card-light detail-materi-status-card">
            <div className="detail-materi-meta">
              <span><Clock size={16} /> Durasi: {modul.duration}</span>
              <span><BookOpen size={16} /> {content?.sections?.length || modul.materiCount} Topik Pembahasan</span>
            </div>

            <div className="detail-materi-progress">
              <div
                className="progress-bar"
                role="progressbar"
                aria-valuenow={modul.progress}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={'Progress ' + modul.title}
              >
                <div className="progress-bar__fill" data-progress={modul.progress} ref={progressBarRef} />
              </div>
              <span className="detail-materi-progress__label">{modul.progress}% selesai</span>
            </div>

            {modul.startedAt && (
              <p className="detail-materi-dates">
                Mulai dipelajari: {formatDate(modul.startedAt)}
                {modul.completedAt && <> &middot; Diselesaikan: {formatDate(modul.completedAt)}</>}
              </p>
            )}
            <InlineError message={autoStartError} />
          </div>

          {/* Tujuan Pembelajaran Box */}
          {content?.learningObjective && (
            <section className="learning-objective-box card-light" aria-label="Tujuan Pembelajaran">
              <div className="learning-objective-box__head">
                <Target size={20} className="learning-objective-box__icon" />
                <h2 className="learning-objective-box__title">Tujuan Pembelajaran</h2>
              </div>
              <p className="learning-objective-box__text">{content.learningObjective}</p>
            </section>
          )}

          {/* Kutipan Kunci / Prinsip Modul */}
          {content?.quote && (
            <div className="quote-banner">
              <p className="quote-banner__text">“{content.quote.text}”</p>
              <span className="quote-banner__author">— {content.quote.author}</span>
            </div>
          )}

          {/* Uraian Materi Pembelajaran Native */}
          {content?.sections?.map((section) => (
            <LearningSection key={section.id} section={section} />
          ))}

          {/* Contoh Kontekstual Berbasis Budaya Aceh */}
          {content?.contextualExample && (
            <AcehCallout example={content.contextualExample} />
          )}

          {/* Checklist Refleksi Mandiri (Persisten) */}
          {content?.reflectionChecklist && (
            <ReflectionChecklist
              items={content.reflectionChecklist}
              guruId={guruId}
              materiId={modul.id}
            />
          )}

          {/* Dokumen Referensi PDF (Reusable PdfViewer) */}
          <PdfViewer
            title="Dokumen Materi Pelatihan Resmi"
            subtitle="Bahan tayang resmi Pelatihan Penyusunan Instrumen HOTS IPA Berbasis Smart Diagnostic TKA (USK &amp; SMPN 3 Ingin Jaya)"
            pdfUrl={pdfLink}
            downloadName="bahan-tayang-pelatihan-hots-ipa-usk.pdf"
            initialOpen={false}
            badgeText="Dokumen Referensi Resmi"
            pageCountText="15 Slide"
          />

          {/* Aksi & Navigasi Modul */}
          <div className="detail-materi-nav-bar card-light">
            <div className="detail-materi-nav-bar__left">
              {prevMod ? (
                <Link to={`/materi/${prevMod.id}`} className="btn btn-secondary">
                  <ArrowLeft size={16} /> Modul Sebelumnya: {prevMod.number}
                </Link>
              ) : (
                <Link to="/materi" className="btn btn-secondary">
                  <ArrowLeft size={16} /> Daftar Materi
                </Link>
              )}
            </div>

            <div className="detail-materi-nav-bar__right">
              {modul.progress < 100 && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleTandaiSelesai}
                  disabled={saving}
                >
                  {saving ? 'Menyimpan...' : <><CheckCircle2 size={16} /> Tandai Selesai</>}
                </button>
              )}

              {nextMod ? (
                <Link to={`/materi/${nextMod.id}`} className="btn btn-primary">
                  Modul {nextMod.number}: {nextMod.title} <ArrowRight size={16} />
                </Link>
              ) : (
                <Link to="/bank-soal" className="btn btn-primary">
                  <Gamepad2 size={16} /> Lanjut ke Praktik Wordwall &amp; TKA
                </Link>
              )}
            </div>
          </div>
          <InlineError message={saveError} />
        </main>
      </div>
    </Layout>
  );
}

export default DetailMateri;
