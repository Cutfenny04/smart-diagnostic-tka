import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Layers, CheckCircle2, Circle, SearchX } from 'lucide-react';
import Layout from '../components/Layout';
import { fetchMateriById, materiCategoryMeta as CATEGORY_META } from '../data/materiData';
import { useProgressBarAnimation } from '../hooks/useProgressBarAnimation';
import './DetailMateri.css';

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

  useEffect(() => {
    setModul(undefined);
    fetchMateriById(id).then(setModul);
  }, [id]);

  useProgressBarAnimation(Boolean(modul));

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
  const doneCount = Math.round((modul.progress / 100) * modul.topics.length);

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
            <div className="progress-bar__fill" data-progress={modul.progress} />
          </div>
          <span className="detail-materi-progress__label">{modul.progress}% selesai</span>
        </div>

        <h2 className="section-heading__title">Daftar Topik</h2>
        <ul className="topic-list" aria-label="Daftar topik">
          {modul.topics.map((topic, i) => {
            const isDone = i < doneCount;
            return (
              <li className={'topic-list__item' + (isDone ? ' is-done' : '')} key={i}>
                {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                <span>{topic}</span>
              </li>
            );
          })}
        </ul>

        <div className="form-actions">
          <Link to="/materi" className="btn btn-secondary">Kembali ke Materi</Link>
          <Link to="/smart-diagnostic" className="btn btn-primary">{actionLabel(modul)}</Link>
        </div>
      </div>
    </Layout>
  );
}

export default DetailMateri;
