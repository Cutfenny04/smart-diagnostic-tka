import { createElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, Layers, PlayCircle, SearchX, Inbox, FileText, Download, BookOpen } from 'lucide-react';
import Layout from '../components/Layout';
import FetchError from '../components/FetchError';
import { fetchMateri, materiCategoryMeta as CATEGORY_META, materiCategoryOrder as CATEGORY_ORDER, computeMateriOverallProgress } from '../data/materiData';
import { friendlyErrorMessage } from '../services/api';
import { getIcon } from '../utils/icon';
import { useProgressBarAnimation } from '../hooks/useProgressBarAnimation';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Materi.css';

const GURU_GUIDE_PDF = '/assets/modul/modul-tutorial-wordwall.pdf';
const PANDUAN_PENGGUNAAN_HALAMAN = 35;

const FILTERS = [
  { value: 'semua', label: 'Semua' },
  { value: 'belum', label: 'Belum Dipelajari' },
  { value: 'sedang', label: 'Sedang Dipelajari' },
  { value: 'selesai', label: 'Selesai' },
];

function getStatus(m) {
  if (m.progress >= 100) return 'selesai';
  if (m.progress <= 0) return 'belum';
  return 'sedang';
}

const STATUS_LABEL = { selesai: 'Selesai', sedang: 'Sedang Dipelajari', belum: 'Belum Dipelajari' };
const ACTION_LABEL = { selesai: 'Lihat Kembali', sedang: 'Lanjutkan', belum: 'Mulai Belajar' };

function sortModules(list, sort) {
  const copy = list.slice();
  if (sort === 'nama') copy.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'terlama') copy.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
  else copy.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  return copy;
}

function ModuleCard({ m }) {
  const status = getStatus(m);
  const meta = CATEGORY_META[m.category];
  const btnClass = status === 'selesai' ? 'btn-secondary' : 'btn-primary';

  return (
    <article className="module-card card-light">
      <div className={'module-card__thumb ' + meta.thumbClass} aria-hidden="true">{createElement(getIcon(meta.icon), { size: 22 })}</div>
      <div className="module-card__body">
        <span className="module-card__category">{meta.label}</span>
        <h3 className="module-card__title">{m.title}</h3>
        <p className="module-card__desc">{m.desc}</p>
        <div className="module-card__meta">
          <span><Clock size={14} /> {m.duration}</span>
          <span><Layers size={14} /> {m.materiCount} Materi</span>
        </div>
        <div className="module-card__progress">
          <div className="progress-bar progress-bar--sm" role="progressbar" aria-valuenow={m.progress} aria-valuemin="0" aria-valuemax="100" aria-label={'Progress ' + m.title}>
            <div className="progress-bar__fill" data-progress={m.progress} />
          </div>
        </div>
        <div className="module-card__footer">
          <span className={'badge badge--' + status}>{STATUS_LABEL[status]}</span>
          <Link to={`/materi/${m.id}`} className={'btn ' + btnClass}>{ACTION_LABEL[status]}</Link>
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
  const [sort, setSort] = useState('terbaru');

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

  const continueModule = modules?.find((m) => m.lastOpened);
  const overallProgress = computeMateriOverallProgress(modules || []);

  return (
    <Layout breadcrumb="Materi & Modul Pelatihan">
      <div className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">Materi &amp; Modul Pelatihan</h1>
          <p className="page-header__desc">Pelajari seluruh materi penyusunan soal HOTS IPA berbasis budaya Aceh secara bertahap.</p>
        </div>
      </div>

      <section className="dashboard-section card-light guide-module-card getting-started-card" aria-label="Mulai di Sini: Panduan Penggunaan Smart Diagnostic TKA">
        <div className="guide-module-card__header">
          <div className="guide-module-card__icon" aria-hidden="true"><BookOpen size={24} /></div>
          <div className="guide-module-card__text">
            <span className="getting-started-card__eyebrow">Mulai di Sini</span>
            <h2 className="section-heading__title">Panduan Penggunaan Smart Diagnostic TKA</h2>
            <p className="guide-module-card__desc">
              Belum pernah menggunakan platform ini? Ikuti panduan {PANDUAN_PENGGUNAAN_HALAMAN} halaman ini
              terlebih dahulu untuk mengenal alur penggunaan mulai dari login, Materi, Wordwall, Bank Soal,
              Smart Diagnostic, hingga Dashboard Hasil.
            </p>
          </div>
          <div className="getting-started-card__actions">
            <Link to="/materi/panduan-penggunaan" className="btn btn-primary"><BookOpen size={16} /> Baca Panduan</Link>
            <a href="/assets/modul/panduan-penggunaan-smart-diagnostic-tka.pdf" download className="btn btn-secondary">
              <Download size={16} /> Unduh PDF
            </a>
          </div>
        </div>
      </section>

      <section className="dashboard-section card-light guide-module-card" aria-label="Modul Panduan Guru">
        <div className="guide-module-card__header">
          <div className="guide-module-card__icon" aria-hidden="true"><FileText size={24} /></div>
          <div className="guide-module-card__text">
            <h2 className="section-heading__title">Modul Panduan Guru</h2>
            <p className="guide-module-card__desc">Modul Tutorial Pembuatan Game Edukasi Interaktif Menggunakan Wordwall — panduan langkah demi langkah bagi Bapak/Ibu guru untuk membuat dan memainkan game edukasi di kelas.</p>
          </div>
          <a href={GURU_GUIDE_PDF} download className="btn btn-primary guide-module-card__download">
            <Download size={16} /> Unduh PDF
          </a>
        </div>
        <div className="guide-module-card__viewer">
          <iframe src={GURU_GUIDE_PDF} title="Modul Panduan Guru - Tutorial Wordwall" />
        </div>
      </section>

      <section className="dashboard-section card-light" aria-label="Progress Belajar Keseluruhan">
        <div className="learning-overview">
          <div className="learning-overview__text">
            <h2 className="section-heading__title">Progress Belajar Anda</h2>
            <p className="learning-overview__count">{overallProgress.completed} dari {overallProgress.total} materi selesai</p>
          </div>
          <div className="learning-overview__figure">
            <span className="learning-overview__percent">{overallProgress.percent}%</span>
          </div>
        </div>
        <div className="progress-bar" role="progressbar" aria-valuenow={overallProgress.percent} aria-valuemin="0" aria-valuemax="100" aria-label="Progress belajar keseluruhan">
          <div className="progress-bar__fill" data-progress={overallProgress.percent} />
        </div>
      </section>

      {continueModule && (
        <section className="dashboard-section" aria-label="Lanjutkan Belajar">
          <div className="card-light continue-card">
            <div className="continue-card__thumb" aria-hidden="true">
              {(() => { const Icon = getIcon(CATEGORY_META[continueModule.category].icon); return <Icon size={24} />; })()}
            </div>
            <div className="continue-card__body">
              <span className="continue-card__eyebrow">Lanjutkan Belajar</span>
              <h2 className="continue-card__title">{continueModule.title}</h2>
              <div className="continue-card__progress">
                <div className="progress-bar" role="progressbar" aria-valuenow={continueModule.progress} aria-valuemin="0" aria-valuemax="100" aria-label={'Progress ' + continueModule.title}>
                  <div className="progress-bar__fill" data-progress={continueModule.progress} />
                </div>
                <span className="continue-card__percent">{continueModule.progress}% selesai</span>
              </div>
            </div>
            <div className="continue-card__action">
              <Link to={`/materi/${continueModule.id}`} className="btn btn-primary"><PlayCircle size={16} /> Lanjutkan Belajar</Link>
            </div>
          </div>
        </section>
      )}

      <section className="catalog-controls card-light" aria-label="Cari dan Saring Materi">
        <div className="catalog-search">
          <span className="catalog-search__icon" aria-hidden="true"><Search size={16} /></span>
          <input
            type="search"
            className="catalog-search__input"
            placeholder="Cari materi..."
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

        <div className="catalog-sort">
          <label htmlFor="materiSortSelect" className="catalog-sort__label">Urutkan</label>
          <select id="materiSortSelect" className="catalog-sort__select" aria-label="Urutkan materi" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="terbaru">Terbaru</option>
            <option value="terlama">Terlama</option>
            <option value="nama">Nama (A-Z)</option>
          </select>
        </div>
      </section>

      {fetchErrorMsg && <FetchError message={fetchErrorMsg} onRetry={() => setRetryTick((n) => n + 1)} />}

      {!modules && !fetchErrorMsg && (
        <div className="module-grid">
          {Array.from({ length: 6 }, (_, i) => (
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
          {isFilteringActive ? (
            <div className="empty-state">
              <div className="empty-state__icon"><SearchX size={28} /></div>
              <h3 className="empty-state__title">Materi tidak ditemukan</h3>
              <p className="empty-state__desc">Coba ubah kata kunci pencarian atau pilih filter status lain.</p>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon"><Inbox size={28} /></div>
              <h3 className="empty-state__title">Belum ada materi tersedia</h3>
              <p className="empty-state__desc">Materi & modul pelatihan akan muncul di sini begitu tersedia.</p>
            </div>
          )}
        </div>
      )}

      {modules && filtered.length > 0 && isFilteringActive && (
        <section className="module-category" aria-label={`Hasil Pencarian (${filtered.length})`}>
          <div className="section-heading"><h2 className="section-heading__title">Hasil Pencarian ({filtered.length})</h2></div>
          <div className="module-grid">
            {filtered.map((m) => <ModuleCard key={m.id} m={m} />)}
          </div>
        </section>
      )}

      {modules && filtered.length > 0 && !isFilteringActive && CATEGORY_ORDER.map((cat) => {
        const items = filtered.filter((m) => m.category === cat);
        if (!items.length) return null;
        return (
          <section className="module-category" key={cat} aria-label={CATEGORY_META[cat].label}>
            <div className="section-heading"><h2 className="section-heading__title">{CATEGORY_META[cat].label}</h2></div>
            <div className="module-grid">
              {items.map((m) => <ModuleCard key={m.id} m={m} />)}
            </div>
          </section>
        );
      })}
    </Layout>
  );
}

export default Materi;
