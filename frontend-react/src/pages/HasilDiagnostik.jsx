import { createElement, useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import Layout from '../components/Layout';
import { fetchHasil } from '../data/hasilData';
import { getIcon } from '../utils/icon';
import { isTuntas } from '../utils/scoring';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './HasilDiagnostik.css';

/* Revisi 8 Fase 6 (PIVOT_PLAN.md §C): halaman ini sekarang menampilkan
   riwayat hasil diagnostik guru yang login sungguhan, dari
   GET /api/hasil-diagnostik -- bukan lagi data prototype statis.
   Status Tuntas/Belum Tuntas pakai PASSING_SCORE dari utils/scoring.js
   (satu sumber, dipakai juga di NonTkaGame.jsx) -- lihat komentar di
   file itu soal kenapa nilainya masih sementara. */

function statusLabel(score) {
  return isTuntas(score) ? 'Tuntas' : 'Belum Tuntas';
}
function statusBadgeClass(score) {
  return isTuntas(score) ? 'badge--selesai' : 'badge--belum';
}
function typeLabel(type) {
  return type === 'NON_TKA' ? 'Non-TKA' : 'TKA';
}
function formatDate(iso) {
  if (!iso) return '-';
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}
function truncate(text, max) {
  if (!text) return '-';
  return text.length <= max ? text : text.slice(0, max).trim() + '…';
}

function computeSummary(list) {
  const total = list.length;
  const tuntas = list.filter((h) => isTuntas(h.score)).length;
  const belumTuntas = total - tuntas;
  const rataRata = total === 0 ? 0 : list.reduce((sum, h) => sum + h.score, 0) / total;
  const latihanTerakhir = list[0] || null; // list sudah diurutkan terbaru dulu dari backend

  return { total, tuntas, belumTuntas, rataRata: Math.round(rataRata * 10) / 10, latihanTerakhir };
}

function summaryCards(summary) {
  return [
    { icon: 'activity', label: 'Total Latihan', value: summary.total, unit: 'Latihan' },
    { icon: 'bar-chart-2', label: 'Rata-rata Nilai', value: summary.rataRata, unit: '' },
    { icon: 'award', label: 'Nilai Latihan Terakhir', value: summary.latihanTerakhir ? summary.latihanTerakhir.score : '-', unit: '' },
    { icon: 'check-circle', label: 'Tuntas', value: summary.tuntas, unit: 'Latihan' },
  ];
}

function StatCard({ stat }) {
  return (
    <div className="card-stat">
      <div className="card-stat__header">
        <span className="card-stat__icon">{createElement(getIcon(stat.icon), { size: 18 })}</span>
        <span className="card-stat__label">{stat.label}</span>
      </div>
      <div className="card-stat__value">{stat.value}<span className="card-stat__unit">{stat.unit}</span></div>
    </div>
  );
}

function ChartRow({ label, count, total, fillModifier }) {
  const percent = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div className="hasil-chart__row">
      <div className="hasil-chart__row-label">
        <span>{label}</span>
        <span>{count} latihan ({percent}%)</span>
      </div>
      <div className="progress-bar" role="progressbar" aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100" aria-label={label}>
        <div className={'progress-bar__fill ' + fillModifier} style={{ width: percent + '%' }} />
      </div>
    </div>
  );
}

function HasilDiagnostik() {
  const [hasilList, setHasilList] = useState(null);

  useDocumentTitle('Dashboard Hasil - Smart Diagnostic TKA');

  useEffect(() => {
    fetchHasil().then(setHasilList);
  }, []);

  if (hasilList && hasilList.length === 0) {
    return (
      <Layout breadcrumb="Dashboard Hasil">
        <div className="page-header">
          <div className="page-header__text">
            <h1 className="page-header__title">Dashboard Hasil</h1>
            <p className="page-header__desc">Riwayat hasil latihan Smart Diagnostic Non-TKA yang sudah kamu kerjakan.</p>
          </div>
        </div>
        <div className="card-light">
          <div className="empty-state">
            <div className="empty-state__icon"><BarChart3 size={28} /></div>
            <h3 className="empty-state__title">Belum ada hasil diagnostik</h3>
            <p className="empty-state__desc">Kerjakan paket soal Non-TKA di Smart Diagnostic dulu, hasilnya akan muncul di sini.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const summary = hasilList ? computeSummary(hasilList) : null;

  return (
    <Layout breadcrumb="Dashboard Hasil">
      <div className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">Dashboard Hasil</h1>
          <p className="page-header__desc">Riwayat hasil latihan Smart Diagnostic Non-TKA yang sudah kamu kerjakan.</p>
        </div>
      </div>

      <section className="dashboard-section" aria-label="Ringkasan Hasil Diagnostik">
        <div className="hasil-summary-grid">
          {summary
            ? summaryCards(summary).map((stat) => <StatCard stat={stat} key={stat.label} />)
            : Array.from({ length: 4 }, (_, i) => (
                <div className="card-stat" key={i}>
                  <div className="skeleton skeleton--text" style={{ width: '50%' }} />
                  <div className="skeleton skeleton--title" />
                </div>
              ))}
        </div>
      </section>

      <section className="dashboard-section" aria-label="Grafik Tuntas vs Belum Tuntas">
        <div className="card-light hasil-chart">
          <h2 className="section-heading__title">Tuntas vs Belum Tuntas</h2>
          {summary ? (
            <div className="hasil-chart__bars">
              <ChartRow label="Tuntas" count={summary.tuntas} total={summary.total} fillModifier="hasil-chart__fill--tuntas" />
              <ChartRow label="Belum Tuntas" count={summary.belumTuntas} total={summary.total} fillModifier="hasil-chart__fill--belum" />
            </div>
          ) : (
            <div className="hasil-chart__bars">
              <div className="skeleton skeleton--text" />
              <div className="skeleton skeleton--text" />
            </div>
          )}
        </div>
      </section>

      <section className="dashboard-section" aria-label="Tabel Hasil Diagnostik">
        <div className="card-light hasil-table-card">
          <h2 className="section-heading__title">Riwayat Latihan</h2>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Paket</th>
                  <th>Tipe</th>
                  <th>Benar</th>
                  <th>Nilai</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {hasilList && hasilList.map((item) => (
                  <tr key={item.id}>
                    <td>{truncate(item.paketTitle, 40)}</td>
                    <td>{typeLabel(item.paketType)}</td>
                    <td>{item.correctCount} / {item.totalQuestions}</td>
                    <td>{item.score}</td>
                    <td>{formatDate(item.completedAt || item.createdAt)}</td>
                    <td><span className={'badge ' + statusBadgeClass(item.score)}>{statusLabel(item.score)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default HasilDiagnostik;
