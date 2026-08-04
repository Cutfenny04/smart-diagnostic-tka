import { createElement, useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import Layout from '../components/Layout';
import { fetchHasil } from '../data/hasilData';
import { getIcon } from '../utils/icon';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './HasilDiagnostik.css';

/* Scope (Requirement Pivot Revisi 7): halaman ini cuma memvisualisasikan
   data prototype -- tidak ada perhitungan skor dari Wordwall, hasil siswa
   sungguhan, atau search/filter/sort/pagination/export. Lihat PIVOT_PLAN.md. */

function statusBadgeClass(status) {
  return status === 'Tuntas' ? 'badge--selesai' : 'badge--belum';
}

function computeSummary(list) {
  const total = list.length;
  const tuntas = list.filter((h) => h.status === 'Tuntas').length;
  const belumTuntas = list.filter((h) => h.status === 'Belum Tuntas').length;
  const average = total === 0 ? 0 : list.reduce((sum, h) => sum + h.score, 0) / total;

  return {
    jumlahSiswa: total,
    rataRata: Math.round(average * 10) / 10,
    tuntas,
    belumTuntas,
  };
}

function summaryCards(summary) {
  return [
    { icon: 'users', label: 'Jumlah Siswa', value: summary.jumlahSiswa, unit: 'Siswa' },
    { icon: 'bar-chart-2', label: 'Rata-rata Nilai', value: summary.rataRata, unit: '' },
    { icon: 'check-circle', label: 'Tuntas', value: summary.tuntas, unit: 'Siswa' },
    { icon: 'x-circle', label: 'Belum Tuntas', value: summary.belumTuntas, unit: 'Siswa' },
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
        <span>{count} siswa ({percent}%)</span>
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
            <p className="page-header__desc">Visualisasi contoh hasil diagnostik siswa. Data yang ditampilkan adalah data prototype sebagai simulasi tampilan hasil, bukan hasil pengerjaan Wordwall yang sebenarnya.</p>
          </div>
        </div>
        <div className="card-light">
          <div className="empty-state">
            <div className="empty-state__icon"><BarChart3 size={28} /></div>
            <h3 className="empty-state__title">Belum ada data hasil diagnostik</h3>
            <p className="empty-state__desc">Silakan lakukan asesmen terlebih dahulu.</p>
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
          <p className="page-header__desc">Visualisasi contoh hasil diagnostik siswa. Data yang ditampilkan adalah data prototype sebagai simulasi tampilan hasil, bukan hasil pengerjaan Wordwall yang sebenarnya.</p>
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
              <ChartRow label="Tuntas" count={summary.tuntas} total={summary.jumlahSiswa} fillModifier="hasil-chart__fill--tuntas" />
              <ChartRow label="Belum Tuntas" count={summary.belumTuntas} total={summary.jumlahSiswa} fillModifier="hasil-chart__fill--belum" />
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
          <h2 className="section-heading__title">Tabel Hasil</h2>
          <div className="data-table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nama Siswa</th>
                  <th>Materi</th>
                  <th>Tanggal</th>
                  <th>Nilai</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {hasilList && hasilList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.studentName}</td>
                    <td>{item.materi}</td>
                    <td>{item.date}</td>
                    <td>{item.score}</td>
                    <td><span className={'badge ' + statusBadgeClass(item.status)}>{item.status}</span></td>
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
