import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusCircle, Search, SearchX, FlaskConical, GraduationCap,
  MousePointerClick, Pencil, PlayCircle, Trash2, X, Link as LinkIcon, Unlink,
} from 'lucide-react';
import Layout from '../components/Layout';
import { fetchPaketSoal, deletePaket } from '../data/bankSoalData';
import { getIcon } from '../utils/icon';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './BankSoal.css';

const FILTER_GROUPS = [
  { key: 'status', label: 'Status', options: [
    { value: 'semua', label: 'Semua' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
  ] },
  { key: 'hotsLevel', label: 'Level HOTS', options: [
    { value: 'semua', label: 'Semua' },
    { value: 'C4', label: 'C4' },
    { value: 'C5', label: 'C5' },
    { value: 'C6', label: 'C6' },
  ] },
  { key: 'subject', label: 'Bidang IPA', options: [
    { value: 'semua', label: 'Semua' },
    { value: 'Biologi', label: 'Biologi' },
    { value: 'Fisika', label: 'Fisika' },
    { value: 'Kimia', label: 'Kimia' },
  ] },
];

function hotsBadgeClass(level) {
  return { C4: 'badge--c4', C5: 'badge--c5', C6: 'badge--c6' }[level] || 'badge--c4';
}
function statusBadgeClass(status) {
  return status === 'published' ? 'badge--selesai' : 'badge--belum';
}
function statusLabel(status) {
  return status === 'published' ? 'Published' : 'Draft';
}
function truncate(text, max) {
  if (text.length <= max) return text;
  return text.slice(0, max).trim() + '…';
}
function sortPaket(list, sort) {
  const copy = list.slice();
  if (sort === 'az') copy.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === 'terlama') copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  else copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return copy;
}

function computeStats(allPaket) {
  const total = allPaket.length;
  const draft = allPaket.filter((p) => p.status === 'draft').length;
  const published = allPaket.filter((p) => p.status === 'published').length;
  const terhubung = allPaket.filter((p) => !!p.wordwallUrl).length;
  return [
    { icon: 'folder', label: 'Total Paket Soal', value: total, unit: 'Paket' },
    { icon: 'edit-3', label: 'Draft', value: draft, unit: 'Paket' },
    { icon: 'check-circle', label: 'Published', value: published, unit: 'Paket' },
    { icon: 'link', label: 'Terhubung Wordwall', value: terhubung, unit: 'Paket' },
  ];
}

function PaketCard({ item, selected, onSelect }) {
  return (
    <article
      className={'soal-card card-light' + (selected ? ' is-selected' : '')}
      tabIndex={0}
      role="button"
      aria-label={`Lihat detail paket soal ${item.title}`}
      onClick={() => onSelect(item.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(item.id);
        }
      }}
    >
      <div className="soal-card__head">
        <h3 className="soal-card__title">{item.title}</h3>
        <span className={'badge ' + statusBadgeClass(item.status)}>{statusLabel(item.status)}</span>
      </div>
      <div className="soal-card__meta">
        <span><FlaskConical size={14} /> {item.subject}</span>
        <span><GraduationCap size={14} /> {item.grade}</span>
      </div>
      <p className="soal-card__summary">{truncate(item.stimulus, 140)}</p>
      <div className="soal-card__tags">
        <span className={'badge ' + hotsBadgeClass(item.hotsLevel)}>{item.hotsLevel}</span>
      </div>
    </article>
  );
}

function PreviewPanel({ item, onClose, onDeleteRequest }) {
  if (!item) {
    return (
      <div className="empty-state">
        <div className="empty-state__icon"><MousePointerClick size={28} /></div>
        <h3 className="empty-state__title">Pilih Paket Soal</h3>
        <p className="empty-state__desc">Klik salah satu paket untuk melihat detail di sini.</p>
      </div>
    );
  }

  const wordwallConnected = Boolean(item.wordwallUrl);

  return (
    <>
      <button type="button" className="preview-panel__close" aria-label="Tutup pratinjau" onClick={onClose}>
        <X size={18} />
      </button>
      <span className="soal-preview__eyebrow">{item.subject} &middot; {item.grade}</span>
      <h2 className="soal-preview__title">{item.title}</h2>
      <div className="soal-preview__tags">
        <span className={'badge ' + hotsBadgeClass(item.hotsLevel)}>{item.hotsLevel}</span>
        <span className={'badge ' + statusBadgeClass(item.status)}>{statusLabel(item.status)}</span>
      </div>
      <h3 className="soal-preview__section-title">Stimulus Budaya Aceh</h3>
      <p className="soal-preview__question">{item.stimulus}</p>
      <h3 className="soal-preview__section-title">Aktivitas Wordwall</h3>
      <p className={'soal-preview__wordwall-indicator ' + (wordwallConnected ? 'is-connected' : 'is-disconnected')}>
        {wordwallConnected ? <LinkIcon size={16} /> : <Unlink size={16} />} {wordwallConnected ? 'Sudah Terhubung' : 'Belum Terhubung'}
      </p>
      <div className="soal-preview__action">
        <Link to={`/bank-soal/${item.id}/edit`} className="btn btn-secondary"><Pencil size={16} /> Edit</Link>
        {item.status === 'published' && (
          <Link to={`/smart-diagnostic?paket=${item.id}`} className="btn btn-primary"><PlayCircle size={16} /> Smart Diagnostic</Link>
        )}
        <button
          type="button"
          className="btn-icon btn-icon--danger"
          aria-label="Hapus Paket Soal"
          title="Hapus Paket Soal"
          onClick={() => onDeleteRequest(item)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </>
  );
}

function BankSoal() {
  const [allPaket, setAllPaket] = useState(null);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ status: 'semua', hotsLevel: 'semua', subject: 'semua' });
  const [sort, setSort] = useState('terbaru');
  const [selectedId, setSelectedId] = useState(null);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useDocumentTitle('Bank Soal Berbasis Budaya Aceh - Smart Diagnostic TKA');

  useEffect(() => {
    fetchPaketSoal().then(setAllPaket);
  }, []);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key !== 'Escape') return;
      if (deleteTarget) setDeleteTarget(null);
      else setMobilePreviewOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [deleteTarget]);

  function selectPaket(id) {
    setSelectedId(id);
    setMobilePreviewOpen(true);
  }

  async function confirmDelete() {
    const updated = await deletePaket(deleteTarget.id);
    setAllPaket(updated);
    setDeleteTarget(null);
    setMobilePreviewOpen(false);
    setSelectedId(null);
  }

  let filtered = [];
  if (allPaket) {
    const q = query.trim().toLowerCase();
    filtered = allPaket.filter((item) => {
      const matchesQuery = !q || item.title.toLowerCase().includes(q) || item.stimulus.toLowerCase().includes(q);
      const matchesStatus = filters.status === 'semua' || item.status === filters.status;
      const matchesHots = filters.hotsLevel === 'semua' || item.hotsLevel === filters.hotsLevel;
      const matchesSubject = filters.subject === 'semua' || item.subject === filters.subject;
      return matchesQuery && matchesStatus && matchesHots && matchesSubject;
    });
    filtered = sortPaket(filtered, sort);
  }

  const selectedItem = allPaket?.find((p) => String(p.id) === String(selectedId)) || null;

  return (
    <Layout breadcrumb="Bank Soal Berbasis Budaya Aceh">
      <div className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">Bank Soal Berbasis Budaya Aceh</h1>
          <p className="page-header__desc">Kelola paket soal berbasis budaya Aceh yang terhubung dengan aktivitas Wordwall untuk digunakan pada Smart Diagnostic.</p>
        </div>
        <div className="page-header__actions">
          <Link to="/bank-soal/baru" className="btn btn-primary"><PlusCircle size={18} /> Tambah Paket Soal</Link>
        </div>
      </div>

      <section className="dashboard-section" aria-label="Statistik Bank Soal">
        <div className="kpi-grid">
          {allPaket
            ? computeStats(allPaket).map((stat) => {
                const Icon = getIcon(stat.icon);
                return (
                  <div className="card-stat" key={stat.label}>
                    <div className="card-stat__header">
                      <span className="card-stat__icon"><Icon size={18} /></span>
                      <span className="card-stat__label">{stat.label}</span>
                    </div>
                    <div className="card-stat__value">{stat.value}<span className="card-stat__unit">{stat.unit}</span></div>
                  </div>
                );
              })
            : Array.from({ length: 4 }, (_, i) => (
                <div className="card-stat" key={i}>
                  <div className="skeleton skeleton--text" style={{ width: '50%' }} />
                  <div className="skeleton skeleton--title" />
                </div>
              ))}
        </div>
      </section>

      <section className="catalog-controls card-light" aria-label="Cari dan Saring Paket Soal">
        <div className="catalog-search">
          <span className="catalog-search__icon" aria-hidden="true"><Search size={16} /></span>
          <input
            type="search"
            className="catalog-search__input"
            placeholder="Cari judul materi atau stimulus..."
            aria-label="Cari paket soal"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div aria-label="Saring paket soal">
          <div className="filter-groups-stack">
            {FILTER_GROUPS.map((group) => (
              <div className="filter-group-row" key={group.key}>
                <span className="filter-group__label">{group.label}</span>
                <div className="filter-group" role="group" aria-label={group.label}>
                  {group.options.map((opt) => {
                    const isActive = opt.value === filters[group.key];
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={'filter-chip' + (isActive ? ' is-active' : '')}
                        aria-pressed={isActive}
                        onClick={() => setFilters((f) => ({ ...f, [group.key]: opt.value }))}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="catalog-sort">
          <label htmlFor="soalSortSelect" className="catalog-sort__label">Urutkan</label>
          <select id="soalSortSelect" className="catalog-sort__select" aria-label="Urutkan paket soal" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="terbaru">Terbaru</option>
            <option value="terlama">Terlama</option>
            <option value="az">A-Z</option>
          </select>
        </div>
      </section>

      <div className="catalog-layout">
        <div className="soal-main">
          <div className="soal-list">
            {!allPaket && Array.from({ length: 5 }, (_, i) => (
              <div className="card-light soal-card" key={i}>
                <div className="skeleton skeleton--text" style={{ width: '50%' }} />
                <div className="skeleton skeleton--title" />
                <div className="skeleton skeleton--text" />
              </div>
            ))}

            {allPaket && filtered.length === 0 && (
              <div className="card-light">
                <div className="empty-state">
                  <div className="empty-state__icon"><SearchX size={28} /></div>
                  <h3 className="empty-state__title">Paket soal tidak ditemukan</h3>
                  <p className="empty-state__desc">Coba ubah kata kunci pencarian atau pilih filter lain.</p>
                </div>
              </div>
            )}

            {allPaket && filtered.map((item) => (
              <PaketCard key={item.id} item={item} selected={String(item.id) === String(selectedId)} onSelect={selectPaket} />
            ))}
          </div>
        </div>

        <aside className={'soal-preview preview-panel card-light' + (mobilePreviewOpen ? ' is-open' : '')} aria-label="Pratinjau Paket Soal">
          <PreviewPanel item={selectedItem} onClose={() => setMobilePreviewOpen(false)} onDeleteRequest={setDeleteTarget} />
        </aside>
      </div>
      <div className={'preview-panel-backdrop' + (mobilePreviewOpen ? ' is-open' : '')} onClick={() => setMobilePreviewOpen(false)} />

      <div className={'confirm-modal-backdrop' + (deleteTarget ? ' is-open' : '')} onClick={(e) => { if (e.target === e.currentTarget) setDeleteTarget(null); }}>
        <div className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="deleteConfirmTitle">
          <h2 className="confirm-modal__title" id="deleteConfirmTitle">Hapus Paket Soal?</h2>
          <p className="confirm-modal__desc">
            {deleteTarget ? `Paket soal "${deleteTarget.title}" akan dihapus secara permanen dan tidak dapat dikembalikan.` : ''}
          </p>
          <div className="confirm-modal__actions">
            <button type="button" className="btn btn-secondary" onClick={() => setDeleteTarget(null)}>Batal</button>
            <button type="button" className="btn btn-danger" onClick={confirmDelete}>Ya, Hapus</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BankSoal;
