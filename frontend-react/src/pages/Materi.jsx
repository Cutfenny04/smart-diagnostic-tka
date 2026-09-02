import { createElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Clock,
  BookOpen,
  PlayCircle,
  SearchX,
  Gamepad2,
  Layers,
  ExternalLink,
  FileText,
} from 'lucide-react';
import Layout from '../components/Layout';
import FetchError from '../components/FetchError';
import PdfViewer from '../components/PdfViewer';
import {
  fetchMateri,
  materiCategoryMeta as CATEGORY_META,
  computeMateriOverallProgress,
} from '../data/materiData';
import { friendlyErrorMessage } from '../services/api';
import { getIcon } from '../utils/icon';
import { useProgressBarAnimation } from '../hooks/useProgressBarAnimation';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Materi.css';

const WORDWALL_GUIDE_PDF = '/pdf/tutorial-wordwall.pdf';
const PANDUAN_PLATFORM_PDF = '/pdf/panduan-smart-diagnostic.pdf';
const BAHAN_TAYANG_RESMI_PDF = '/pdf/bahan-tayang-pelatihan.pdf';

const FILTERS = [
  { value: 'semua', label: 'Semua Modul' },
  { value: 'belum', label: 'Belum Dimulai' },
  { value: 'sedang', label: 'Sedang Dipelajari' },
  { value: 'selesai', label: 'Selesai' },
];

function getStatus(m) {
  if (m.progress >= 100) return 'selesai';
  if (m.progress <= 0) return 'belum';
  return 'sedang';
}

const STATUS_LABEL = {
  selesai: '✓ Selesai',
  sedang: '◐ Sedang Dipelajari',
  belum: '○ Belum Dimulai',
};

const ACTION_LABEL = {
  selesai: 'Lihat Kembali',
  sedang: 'Lanjutkan',
  belum: 'Mulai Belajar',
};

function sortModules(list, sort) {
  const copy = list.slice();
  if (sort === 'nama') copy.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'terlama') copy.sort((a, b) => a.id - b.id);
  else copy.sort((a, b) => a.id - b.id); // Default urut ID 1-5
  return copy;
}

function ModuleCard({ m }) {
  const status = getStatus(m);
  const meta = CATEGORY_META[m.category] || { label: 'HOTS & Asesmen', thumbClass: 'module-card__thumb--hots', icon: 'brain' };
  const btnClass = status === 'selesai' ? 'btn-secondary' : 'btn-primary';

  return (
    <article className={`module-card card-light module-card--${status}`}>
      <div className={'module-card__thumb ' + meta.thumbClass} aria-hidden="true">
        <span className="module-card__thumb-num">Modul {m.number || m.id}</span>
        {createElement(getIcon(meta.icon), { size: 28 })}
      </div>
      <div className="module-card__body">
        <div className="module-card__header-meta">
          <span className="module-card__category">{meta.label}</span>
          <span className={'badge badge--' + status}>{STATUS_LABEL[status]}</span>
        </div>
        <h3 className="module-card__title">
          {m.number ? `0${m.id}. ` : ''}{m.title}
        </h3>
        <p className="module-card__desc">{m.desc}</p>
        <div className="module-card__meta">
          <span><Clock size={14} /> {m.duration}</span>
          <span><Layers size={14} /> {m.materiCount} Bagian</span>
        </div>
        <div className="module-card__progress">
          <div
            className="progress-bar progress-bar--sm"
            role="progressbar"
            aria-valuenow={m.progress}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={'Progress ' + m.title}
          >
            <div className="progress-bar__fill" data-progress={m.progress} />
          </div>
        </div>
        <div className="module-card__footer">
          <span className="module-card__progress-text">{m.progress}% selesai</span>
          <Link to={`/materi/${m.id}`} className={'btn ' + btnClass}>
            {ACTION_LABEL[status]}
          </Link>
        </div>
      </div>
    </article>
  );
}

function Materi() {
  const [modules, setModules] = useState(null);
  const [fetchErrorMsg, setFetchErrorMsg] = useState('');
  const [retryTick, setRetryTick] = useState(0);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('semua');
  const [sort, setSort] = useState('urutan');

  useEffect(() => {
    fetchMateri()
      .then((result) => {
        setModules(result);
        setFetchErrorMsg('');
      })
      .catch((err) => setFetchErrorMsg(friendlyErrorMessage(err)));
  }, [retryTick]);

  useProgressBarAnimation(Boolean(modules));
  useDocumentTitle('Materi & Modul Pelatihan - Smart Diagnostic TKA');

  const isFilteringActive = query.trim() !== '' || statusFilter !== 'semua';

  let filtered = [];
  if (modules) {
    const q = query.trim().toLowerCase();
    filtered = modules.filter((m) => {
      const matchesQuery = !q || m.title.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'semua' || getStatus(m) === statusFilter;
      return matchesQuery && matchesStatus;
    });
    filtered = sortModules(filtered, sort);
  }

  const continueModule = modules?.find((m) => m.progress > 0 && m.progress < 100) || modules?.find((m) => m.lastOpened);
  const overallProgress = computeMateriOverallProgress(modules || []);

  return (
    <Layout breadcrumb="Materi & Modul Pelatihan">
      <div className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">Materi &amp; Modul Pelatihan</h1>
          <p className="page-header__desc">
            Pusat pembelajaran dan kurikulum resmi pelatihan penyusunan instrumen HOTS IPA berbasis Smart Diagnostic TKA terintegrasi budaya Aceh.
          </p>
        </div>
      </div>

      {/* ====================================================================
          ZONA 1: 🚀 MULAI DI SINI (Panduan Platform 35 Halaman)
          ==================================================================== */}
      <section className="dashboard-section" aria-label="Mulai di Sini: Panduan Penggunaan Platform">
        <PdfViewer
          title="Panduan Penggunaan Smart Diagnostic TKA"
          subtitle="Panduan operasional 35 halaman untuk membantu Bapak/Ibu guru mengenal seluruh alur fitur platform: login, materi, Wordwall, Bank Soal, Smart Diagnostic, dan Dashboard Hasil."
          pdfUrl={PANDUAN_PLATFORM_PDF}
          downloadName="panduan-penggunaan-smart-diagnostic-tka.pdf"
          initialOpen={false}
          badgeText="🚀 Mulai di Sini"
          pageCountText="35 Halaman &bull; Panduan Sistem"
        />
      </section>

      {/* ====================================================================
          ZONA 2: 📚 MATERI UTAMA PELATIHAN (Modul 01 - 05)
          ==================================================================== */}
      <section className="dashboard-section materi-main-section" aria-label="Materi Utama Pelatihan">
        {/* Header Seksi & Progress Overview */}
        <div className="materi-section-header">
          <div>
            <span className="materi-section-eyebrow">📚 Materi Utama Pelatihan</span>
            <h2 className="section-heading__title">5 Modul Pembelajaran HOTS &amp; TKA</h2>
          </div>

          <div className="materi-progress-pill card-light">
            <div className="materi-progress-pill__head">
              <span className="materi-progress-pill__label">Progress Pelatihan:</span>
              <strong className="materi-progress-pill__count">
                {overallProgress.completed} dari {overallProgress.total} Selesai ({overallProgress.percent}%)
              </strong>
            </div>
            <div
              className="progress-bar progress-bar--sm"
              role="progressbar"
              aria-valuenow={overallProgress.percent}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-label="Progress belajar keseluruhan"
            >
              <div className="progress-bar__fill" data-progress={overallProgress.percent} />
            </div>
            <div className="materi-progress-pill__status-row">
              <span className="pill-status pill-status--done">✓ {overallProgress.completed} Selesai</span>
              <span className="pill-status pill-status--progress">◐ {overallProgress.inProgress} Sedang Berjalan</span>
              <span className="pill-status pill-status--todo">○ {overallProgress.notStarted} Belum Dimulai</span>
            </div>
          </div>
        </div>

        {/* Continue Learning Card */}
        {continueModule && (
          <div className="card-light continue-card">
            <div className="continue-card__thumb" aria-hidden="true">
              {(() => {
                const Icon = getIcon(CATEGORY_META[continueModule.category]?.icon || 'brain');
                return <Icon size={24} />;
              })()}
            </div>
            <div className="continue-card__body">
              <span className="continue-card__eyebrow">Lanjutkan Modul Terakhir</span>
              <h3 className="continue-card__title">Modul {continueModule.number || continueModule.id}: {continueModule.title}</h3>
              <div className="continue-card__progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  aria-valuenow={continueModule.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={'Progress ' + continueModule.title}
                >
                  <div className="progress-bar__fill" data-progress={continueModule.progress} />
                </div>
                <span className="continue-card__percent">{continueModule.progress}% selesai</span>
              </div>
            </div>
            <div className="continue-card__action">
              <Link to={`/materi/${continueModule.id}`} className="btn btn-primary">
                <PlayCircle size={16} /> Lanjutkan Belajar
              </Link>
            </div>
          </div>
        )}

        {/* Search & Filter Controls */}
        <div className="catalog-controls card-light" aria-label="Cari dan Saring Modul Pelatihan">
          <div className="catalog-search">
            <span className="catalog-search__icon" aria-hidden="true"><Search size={16} /></span>
            <input
              type="search"
              className="catalog-search__input"
              placeholder="Cari materi HOTS, instrumen, stimulus..."
              aria-label="Cari materi"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="filter-group" role="group" aria-label="Saring berdasarkan status">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                className={'filter-chip' + (statusFilter === f.value ? ' is-active' : '')}
                aria-pressed={statusFilter === f.value}
                onClick={() => setStatusFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {fetchErrorMsg && <FetchError message={fetchErrorMsg} onRetry={() => setRetryTick((n) => n + 1)} />}

        {!modules && !fetchErrorMsg && (
          <div className="module-grid">
            {Array.from({ length: 5 }, (_, i) => (
              <div className="card-light module-card" key={i}>
                <div className="skeleton" style={{ height: 120, borderRadius: 0 }} />
                <div className="module-card__body">
                  <div className="skeleton skeleton--text" style={{ width: '35%' }} />
                  <div className="skeleton skeleton--title" />
                  <div className="skeleton skeleton--text" />
                  <div className="skeleton skeleton--text" />
                </div>
              </div>
            ))}
          </div>
        )}

        {modules && filtered.length === 0 && (
          <div className="card-light">
            <div className="empty-state">
              <div className="empty-state__icon"><SearchX size={28} /></div>
              <h3 className="empty-state__title">Modul tidak ditemukan</h3>
              <p className="empty-state__desc">Coba sesuaikan kata kunci pencarian atau ubah filter status.</p>
            </div>
          </div>
        )}

        {modules && filtered.length > 0 && (
          <div className="module-grid">
            {filtered.map((m) => (
              <ModuleCard key={m.id} m={m} />
            ))}
          </div>
        )}
      </section>

      {/* ====================================================================
          ZONA 3: 🛠️ PRAKTIK & IMPLEMENTASI (Action Flow / Alur Tindakan)
          ==================================================================== */}
      <section className="dashboard-section practice-flow-section card-light" aria-label="Praktik & Implementasi">
        <div className="section-heading">
          <span className="getting-started-card__eyebrow">🛠️ Praktik &amp; Implementasi</span>
          <h2 className="section-heading__title">Alur Tindakan: Dari Teori Menjadi Praktik Nyata</h2>
          <p className="practice-flow__desc">
            Setelah menyelesaikan pembelajaran materi di atas, ikuti alur tiga langkah berikut untuk menyusun, mendaftarkan, dan menguji instrumen HOTS Anda:
          </p>
        </div>

        <div className="practice-flow-grid">
          {/* Step 1: Wordwall */}
          <div className="practice-flow-card">
            <div className="practice-flow-card__head">
              <span className="practice-flow-card__step">Tahap 1</span>
              <span className="badge badge--new">Praktik Digital</span>
            </div>
            <h3 className="practice-flow-card__title">① Membuat Soal di Wordwall</h3>
            <p className="practice-flow-card__desc">
              Pindahkan stimulus dan butir soal HOTS IPA yang telah Anda susun ke template game interaktif Wordwall (Quiz, Match up, Game show).
            </p>
            <div className="practice-flow-card__actions">
              <a href={WORDWALL_GUIDE_PDF} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                <FileText size={14} /> Buka Panduan Wordwall (PDF) ↗
              </a>
              <a href="https://wordwall.net/create/template" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                Buka Wordwall.net <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Step 2: Register to Bank Soal */}
          <div className="practice-flow-card">
            <div className="practice-flow-card__head">
              <span className="practice-flow-card__step">Tahap 2</span>
              <span className="badge badge--info">Integrasi Platform</span>
            </div>
            <h3 className="practice-flow-card__title">② Mendaftarkan TKA ke Bank Soal</h3>
            <p className="practice-flow-card__desc">
              Daftarkan tautan aktivitas Wordwall Anda ke dalam Bank Soal Berbasis Budaya Aceh agar siap dimainkan dan terdokumentasi.
            </p>
            <div className="practice-flow-card__actions">
              <Link to="/bank-soal/tka/baru" className="btn btn-primary">
                + Daftarkan Paket TKA Baru
              </Link>
            </div>
          </div>

          {/* Step 3: Smart Diagnostic */}
          <div className="practice-flow-card">
            <div className="practice-flow-card__head">
              <span className="practice-flow-card__step">Tahap 3</span>
              <span className="badge badge--important">Uji Coba &amp; Simulasi</span>
            </div>
            <h3 className="practice-flow-card__title">③ Mencoba Smart Diagnostic</h3>
            <p className="practice-flow-card__desc">
              Jalankan simulasi asesmen diagnostik untuk menguji respons sistem, melihat analisis kompetensi, dan memantau hasil pengerjaan.
            </p>
            <div className="practice-flow-card__actions">
              <Link to="/smart-diagnostic" className="btn btn-primary">
                <Gamepad2 size={16} /> Mulai Smart Diagnostic
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          ZONA 4: 📎 DOKUMEN REFERENSI RESMI
          ==================================================================== */}
      <section className="dashboard-section" aria-label="Dokumen Referensi Pelatihan Resmi">
        <PdfViewer
          title="Bahan Tayang Pelatihan Resmi HOTS IPA &amp; TKA"
          subtitle="Dokumen sumber materi pelatihan resmi Universitas Syiah Kuala (USK) dalam kegiatan pengabdian di SMP Negeri 3 Ingin Jaya Aceh Besar."
          pdfUrl={BAHAN_TAYANG_RESMI_PDF}
          downloadName="bahan-tayang-pelatihan-hots-ipa-usk.pdf"
          initialOpen={true}
          badgeText="📎 Dokumen Referensi Resmi"
          pageCountText="15 Slide &bull; Presentasi Resmi USK"
        />
      </section>
    </Layout>
  );
}

export default Materi;
