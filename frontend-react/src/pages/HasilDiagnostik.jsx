import { createElement, useEffect, useMemo, useState } from 'react';
import { BarChart3, Puzzle } from 'lucide-react';
import Layout from '../components/Layout';
import { fetchDashboardHasil } from '../data/dashboardHasilData';
import { getIcon } from '../utils/icon';
import { isTuntas } from '../utils/scoring';
import { formatDate } from '../utils/formatDate';
import { computeWordwallStage } from '../utils/wordwallStage';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useProgressBarAnimation } from '../hooks/useProgressBarAnimation';
import './HasilDiagnostik.css';

/* Revisi 9 (permintaan user 2026-08-17): Dashboard Hasil jadi pusat
   monitoring PROGRESS PELATIHAN GURU (materi + latihan Non-TKA + aktivitas
   TKA/Wordwall), bukan dashboard nilai siswa -- data dari satu endpoint
   agregat GET /api/dashboard/hasil (lihat dashboard.controller.js utk rumus
   komposit). "Pencapaian/badge" dari brief user sengaja TIDAK dibuat --
   eksplisit ditandai opsional/skip kalau waktu terbatas. */

const ACTIVITY_FILTERS = [
  { value: 'semua', label: 'Semua Aktivitas' },
  { value: 'materi', label: 'Materi & Modul' },
  { value: 'non_tka', label: 'Latihan Non-TKA' },
  { value: 'tka', label: 'Latihan TKA' },
];

const RANGE_FILTERS = [
  { value: 'semua', label: 'Semua Waktu' },
  { value: '7', label: '7 Hari Terakhir' },
  { value: '30', label: '30 Hari Terakhir' },
];

const ACTIVITY_ICON = { materi: 'book-open', non_tka: 'activity', tka: 'puzzle' };

// Roadmap item #6 (2026-08-22): tabel Aktivitas TKA sebelumnya cuma
// Draft/Published (2 badge), sekarang pakai 5 tahap dari computeWordwallStage.
const WORDWALL_STAGE_BADGE = {
  draft: 'badge--belum',
  url_dimasukkan: 'badge--belum',
  url_valid: 'badge--sedang',
  published: 'badge--selesai',
  tersedia: 'badge--selesai',
};

function truncate(text, max) {
  if (!text) return '-';
  return text.length <= max ? text : text.slice(0, max).trim() + '…';
}
function materiStatusLabel(status) {
  return { selesai: 'Selesai', sedang: 'Sedang Dipelajari', belum: 'Belum Dipelajari' }[status];
}
function materiStatusIcon(status) {
  return { selesai: '✓', sedang: '◐', belum: '○' }[status];
}

function StatCard({ icon, label, value, unit, isProgress }) {
  return (
    <div className={'card-stat' + (isProgress ? ' card-stat--progress' : '')}>
      <div className="card-stat__header">
        <span className="card-stat__icon">{createElement(getIcon(icon), { size: 18 })}</span>
        <span className="card-stat__label">{label}</span>
      </div>
      <div className="card-stat__value">{value}<span className="card-stat__unit">{unit}</span></div>
      {isProgress && (
        <div className="progress-bar progress-bar--sm" role="progressbar" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100" aria-label={label}>
          <div className="progress-bar__fill" data-progress={value} />
        </div>
      )}
    </div>
  );
}

// Grafik garis "Perkembangan Nilai Non-TKA" -- SVG kecil bikin sendiri
// (tidak ada library chart di project ini), bukan cuma menampilkan nilai
// terakhir supaya guru bisa lihat trennya, bukan cuma angka statis.
function TrendChart({ history }) {
  const width = 600;
  const height = 160;
  const padding = 24;

  if (history.length < 2) {
    return (
      <p className="hasil-trend__hint">
        {history.length === 0
          ? 'Belum ada latihan Non-TKA untuk ditampilkan.'
          : 'Kerjakan minimal 2 latihan Non-TKA supaya tren perkembangan nilai bisa ditampilkan.'}
      </p>
    );
  }

  const scores = history.map((h) => h.score);
  const min = Math.min(0, Math.min(...scores) - 10);
  const max = Math.max(100, Math.max(...scores));
  const stepX = (width - padding * 2) / (history.length - 1);
  const points = history.map((h, i) => {
    const x = padding + i * stepX;
    const y = height - padding - ((h.score - min) / (max - min)) * (height - padding * 2);
    return { x, y, score: h.score };
  });
  const path = points.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ');

  return (
    <svg className="hasil-trend__svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Grafik perkembangan nilai latihan Non-TKA">
      <path d={path} fill="none" stroke="var(--color-moss)" strokeWidth="2.5" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="var(--color-moss)" />
          <text x={p.x} y={p.y - 10} textAnchor="middle" className="hasil-trend__label">{p.score}</text>
        </g>
      ))}
    </svg>
  );
}

function HasilDiagnostik() {
  const [data, setData] = useState(null);
  const [activityFilter, setActivityFilter] = useState('semua');
  const [rangeFilter, setRangeFilter] = useState('semua');

  useDocumentTitle('Dashboard Hasil - Smart Diagnostic TKA');

  useEffect(() => {
    fetchDashboardHasil().then(setData);
  }, []);

  useProgressBarAnimation(Boolean(data));

  const filteredActivity = useMemo(() => {
    if (!data) return [];
    let list = data.recentActivity;
    if (activityFilter !== 'semua') list = list.filter((a) => a.type === activityFilter);
    if (rangeFilter !== 'semua') {
      const cutoff = Date.now() - Number(rangeFilter) * 24 * 60 * 60 * 1000;
      list = list.filter((a) => new Date(a.timestamp).getTime() >= cutoff);
    }
    return list;
  }, [data, activityFilter, rangeFilter]);

  const chartHistory = useMemo(() => (data ? [...data.nonTka.history].reverse() : []), [data]);

  const hasAnyActivity = data && (data.materi.completed > 0 || data.nonTka.totalAttempts > 0 || data.tka.total > 0);

  return (
    <Layout breadcrumb="Dashboard Hasil">
      <div className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">Dashboard Hasil</h1>
          <p className="page-header__desc">Pantau perkembangan Anda dalam mengikuti pelatihan, latihan Smart Diagnostic, dan aktivitas penyusunan soal.</p>
        </div>
      </div>

      <section className="catalog-controls card-light hasil-filters" aria-label="Saring Aktivitas">
        <div className="catalog-sort">
          <label htmlFor="hasilActivityFilter" className="catalog-sort__label">Aktivitas</label>
          <select id="hasilActivityFilter" className="catalog-sort__select" value={activityFilter} onChange={(e) => setActivityFilter(e.target.value)}>
            {ACTIVITY_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <div className="catalog-sort">
          <label htmlFor="hasilRangeFilter" className="catalog-sort__label">Rentang Waktu</label>
          <select id="hasilRangeFilter" className="catalog-sort__select" value={rangeFilter} onChange={(e) => setRangeFilter(e.target.value)}>
            {RANGE_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
      </section>

      <section className="dashboard-section" aria-label="Ringkasan Progress">
        <div className="kpi-grid">
          {data ? (
            <>
              <StatCard icon="target" label="Progress Pelatihan" value={data.progress.overall} unit="%" isProgress />
              <StatCard icon="book-open" label="Materi Selesai" value={data.materi.completed} unit={`/${data.materi.total}`} />
              <StatCard icon="activity" label="Latihan Non-TKA" value={data.nonTka.totalAttempts} unit="x" />
              <StatCard icon="puzzle" label="Aktivitas TKA Wordwall" value={data.tka.total} unit="x" />
            </>
          ) : (
            Array.from({ length: 4 }, (_, i) => (
              <div className="card-stat" key={i}>
                <div className="skeleton skeleton--text" style={{ width: '50%' }} />
                <div className="skeleton skeleton--title" />
              </div>
            ))
          )}
        </div>
      </section>

      {data && !hasAnyActivity && (
        <div className="card-light">
          <div className="empty-state">
            <div className="empty-state__icon"><BarChart3 size={28} /></div>
            <h3 className="empty-state__title">Belum ada aktivitas pelatihan</h3>
            <p className="empty-state__desc">Mulai dari Materi & Modul, atau kerjakan latihan Smart Diagnostic -- perkembangan Anda akan muncul di sini.</p>
          </div>
        </div>
      )}

      {data && (
        <>
          <section className="dashboard-section card-light" aria-label="Progress Pelatihan">
            <h2 className="section-heading__title">Progress Pelatihan</h2>
            <div className="hasil-overall">
              <div className="progress-bar" role="progressbar" aria-valuenow={data.progress.overall} aria-valuemin="0" aria-valuemax="100" aria-label="Progress pelatihan keseluruhan">
                <div className="progress-bar__fill" data-progress={data.progress.overall} />
              </div>
              <p className="hasil-overall__note">
                {data.materi.completed} dari {data.materi.total} materi selesai &middot; {data.nonTka.totalAttempts} latihan Non-TKA &middot; {data.tka.total} aktivitas TKA tercatat
              </p>
            </div>

            <ul className="hasil-checklist" aria-label="Checklist materi">
              {data.materi.list.map((m) => (
                <li className={'hasil-checklist__item' + (m.status === 'selesai' ? ' is-done' : '')} key={m.id}>
                  <span className="hasil-checklist__icon" aria-hidden="true">{materiStatusIcon(m.status)}</span>
                  <span className="hasil-checklist__title">{m.title}</span>
                  <span className="hasil-checklist__status">{materiStatusLabel(m.status)}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="dashboard-section card-light" aria-label="Performa Latihan Non-TKA">
            <h2 className="section-heading__title">Latihan Smart Diagnostic — Non-TKA</h2>
            <div className="hasil-summary-grid hasil-summary-grid--compact">
              <StatCard icon="activity" label="Total Latihan" value={data.nonTka.totalAttempts} unit="x" />
              <StatCard icon="bar-chart-2" label="Rata-rata Nilai" value={data.nonTka.averageScore} unit="" />
              <StatCard icon="award" label="Nilai Tertinggi" value={data.nonTka.highestScore} unit="" />
            </div>

            <h3 className="hasil-subheading">Perkembangan Nilai</h3>
            <TrendChart history={chartHistory} />

            {data.nonTka.bySubject.length > 0 && (
              <>
                <h3 className="hasil-subheading">Performa per Mata Pelajaran</h3>
                <div className="hasil-subject-bars">
                  {data.nonTka.bySubject.map((s) => (
                    <div className="hasil-subject-bars__row" key={s.subject}>
                      <div className="hasil-subject-bars__label">
                        <span>{s.subject}</span>
                        <span>{s.average} ({s.attempts}x)</span>
                      </div>
                      <div className="progress-bar" role="progressbar" aria-valuenow={s.average} aria-valuemin="0" aria-valuemax="100" aria-label={'Rata-rata ' + s.subject}>
                        <div className="progress-bar__fill" data-progress={s.average} />
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {data.nonTka.history.length > 0 && (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr><th>Paket</th><th>Mapel</th><th>Benar</th><th>Nilai</th><th>Tanggal</th><th>Status</th></tr>
                  </thead>
                  <tbody>
                    {data.nonTka.history.map((h) => (
                      <tr key={h.id}>
                        <td>{truncate(h.paketTitle, 40)}</td>
                        <td>{h.paketSubject || '-'}</td>
                        <td>{h.correctCount} / {h.totalQuestions}</td>
                        <td>{h.score}</td>
                        <td>{formatDate(h.completedAt)}</td>
                        <td><span className={'badge ' + (isTuntas(h.score) ? 'badge--selesai' : 'badge--belum')}>{isTuntas(h.score) ? 'Tuntas' : 'Belum Tuntas'}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="dashboard-section card-light" aria-label="Aktivitas TKA Wordwall">
            <h2 className="section-heading__title">Aktivitas TKA &amp; Wordwall</h2>
            <p className="hasil-tka__desc">Aktivitas Wordwall yang Anda buat dan daftarkan sendiri ke Bank Soal TKA. Nilai Wordwall tidak diambil di sini -- lihat langsung di Wordwall (belum ada integrasi resmi).</p>
            <div className="hasil-summary-grid hasil-summary-grid--compact">
              <StatCard icon="puzzle" label="Total Aktivitas" value={data.tka.total} unit="" />
              <StatCard icon="check-circle" label="Published" value={data.tka.published} unit="" />
              <StatCard icon="file-edit" label="Draft" value={data.tka.draft} unit="" />
            </div>

            {data.tka.list.length === 0 ? (
              <div className="empty-state empty-state--compact">
                <div className="empty-state__icon"><Puzzle size={22} /></div>
                <p className="empty-state__desc">Anda belum membuat aktivitas TKA sendiri. Buka Bank Soal &rarr; Tambah Paket TKA untuk mulai.</p>
              </div>
            ) : (
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead><tr><th>Mata Pelajaran</th><th>Judul</th><th>Status</th><th>Tanggal</th></tr></thead>
                  <tbody>
                    {data.tka.list.map((t) => {
                      const stage = computeWordwallStage(t);
                      return (
                        <tr key={t.id}>
                          <td>{t.subject}</td>
                          <td>{truncate(t.title, 40)}</td>
                          <td><span className={'badge ' + WORDWALL_STAGE_BADGE[stage.key]}>{stage.label}</span></td>
                          <td>{formatDate(t.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="dashboard-section card-light" aria-label="Riwayat Aktivitas">
            <h2 className="section-heading__title">Riwayat Aktivitas</h2>
            {filteredActivity.length === 0 ? (
              <div className="empty-state empty-state--compact">
                <p className="empty-state__desc">Tidak ada aktivitas pada filter yang dipilih.</p>
              </div>
            ) : (
              <ul className="timeline">
                {filteredActivity.map((a, i) => (
                  <li className="timeline__item" key={i}>
                    <span className="timeline__icon">{createElement(getIcon(ACTIVITY_ICON[a.type]), { size: 16 })}</span>
                    <div className="timeline__body">
                      <p className="timeline__text">{a.text}</p>
                      <span className="timeline__time">{formatDate(a.timestamp)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </Layout>
  );
}

export default HasilDiagnostik;
