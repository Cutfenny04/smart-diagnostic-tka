import { createElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Activity } from 'lucide-react';
import Layout from '../components/Layout';
import TrainingFlow from '../components/TrainingFlow';
import ResumeCard from '../components/ResumeCard';
import FetchError from '../components/FetchError';
import { fetchDashboardData } from '../data/dashboardData';
import { friendlyErrorMessage } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getIcon } from '../utils/icon';
import { useProgressBarAnimation } from '../hooks/useProgressBarAnimation';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Dashboard.css';

const STATUS_BADGE_CLASS = { important: 'badge--important', new: 'badge--new', info: 'badge--info' };

function StatCard({ stat }) {
  return (
    <div className={'card-stat' + (stat.isProgress ? ' card-stat--progress' : '')}>
      <div className="card-stat__header">
        <span className="card-stat__icon">{createElement(getIcon(stat.icon), { size: 18 })}</span>
        <span className="card-stat__label">{stat.label}</span>
      </div>
      <div className="card-stat__value">
        {stat.value}
        <span className="card-stat__unit">{stat.unit}</span>
      </div>
      {stat.isProgress && (
        <div className="progress-bar progress-bar--sm" role="progressbar" aria-valuenow={stat.value} aria-valuemin="0" aria-valuemax="100" aria-label={stat.label}>
          <div className="progress-bar__fill" data-progress={stat.value} />
        </div>
      )}
    </div>
  );
}

function QuickAccessCard({ item }) {
  return (
    <Link to={item.href} className="quick-access-card card-light">
      <span className="quick-access-card__icon">{createElement(getIcon(item.icon), { size: 20 })}</span>
      <span className="quick-access-card__title">{item.title}</span>
      <span className="quick-access-card__desc">{item.desc}</span>
    </Link>
  );
}

function ActivityItem({ item }) {
  return (
    <li className="timeline__item">
      <span className="timeline__icon">{createElement(getIcon(item.icon), { size: 16 })}</span>
      <div className="timeline__body">
        <p className="timeline__text">{item.text}</p>
        <span className="timeline__time">{item.time}</span>
      </div>
    </li>
  );
}

function AnnouncementItem({ item }) {
  const badgeClass = STATUS_BADGE_CLASS[item.status] || 'badge--info';
  return (
    <li className="announcement-item">
      <div className="announcement-item__head">
        <span className={'badge ' + badgeClass}>{item.badgeLabel}</span>
        <span className="announcement-item__date">{item.date}</span>
      </div>
      <p className="announcement-item__title">{item.title}</p>
      <p className="announcement-item__desc">{item.desc}</p>
    </li>
  );
}

function LearningProgressItem({ item }) {
  return (
    <div className="learning-progress-item">
      <div className="learning-progress-item__head">
        <span>{item.label}</span>
        <span>{item.percent}%</span>
      </div>
      <div className="progress-bar" role="progressbar" aria-valuenow={item.percent} aria-valuemin="0" aria-valuemax="100" aria-label={'Progress ' + item.label}>
        <div className="progress-bar__fill" data-progress={item.percent} />
      </div>
    </div>
  );
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [fetchErrorMsg, setFetchErrorMsg] = useState('');
  const [retryTick, setRetryTick] = useState(0);
  const { user, profile } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetchDashboardData()
      .then((result) => {
        if (cancelled) return;
        if (profile) result.greeting.name = profile.nama;
        setData(result);
        setFetchErrorMsg('');
      })
      .catch((err) => {
        if (!cancelled) setFetchErrorMsg(friendlyErrorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [userId, profile, retryTick]);

  useProgressBarAnimation(Boolean(data));
  useDocumentTitle('Dashboard - Smart Diagnostic TKA');

  const todayLabel = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <Layout breadcrumb="Dashboard">
      <section className="welcome-hero card-light" aria-label="Sambutan">
        <span className="welcome-hero__eyebrow">{todayLabel}</span>
        <h1 className="welcome-hero__title">
          {data ? `Selamat Datang, ${data.greeting.name}` : 'Memuat...'}
        </h1>
        <p className="welcome-hero__message">{data?.greeting.message}</p>
        <div className="welcome-hero__actions">
          <Link to={data?.currentStage.href || '/materi'} className="btn btn-primary">
            <PlayCircle size={18} /> {data ? data.currentStage.ctaLabel : 'Lanjutkan Pelatihan'}
          </Link>
          <Link to="/smart-diagnostic" className="btn btn-secondary">
            <Activity size={18} /> Mulai Smart Diagnostic
          </Link>
        </div>
      </section>

      {fetchErrorMsg && <FetchError message={fetchErrorMsg} onRetry={() => setRetryTick((n) => n + 1)} />}

      {!fetchErrorMsg && data && <TrainingFlow stages={data.trainingFlow} currentStage={data.currentStage} />}

      {!fetchErrorMsg && (
        <section className="dashboard-section" aria-label="Statistik Ringkas">
          <div className="kpi-grid">
            {data
              ? data.stats.map((stat) => <StatCard key={stat.id} stat={stat} />)
              : Array.from({ length: 4 }, (_, i) => (
                  <div className="card-stat" key={i}>
                    <div className="skeleton skeleton--text" style={{ width: '50%' }} />
                    <div className="skeleton skeleton--title" />
                  </div>
                ))}
          </div>
        </section>
      )}

      {!fetchErrorMsg && (
      <>
      <section className="dashboard-section" aria-label="Akses Cepat">
        <div className="section-heading">
          <h2 className="section-heading__title">Akses Cepat</h2>
        </div>
        <div className="quick-access-grid">
          {data?.quickAccess.map((item) => <QuickAccessCard key={item.href} item={item} />)}
        </div>
      </section>

      <div className="dashboard-columns">
        <section className="dashboard-section card-light" aria-label="Aktivitas Terbaru">
          <div className="section-heading">
            <h2 className="section-heading__title">Aktivitas Terbaru</h2>
          </div>
          <ul className="timeline">
            {data?.recentActivity.length === 0 && (
              <li className="timeline__empty">
                <div className="empty-state">
                  <h3 className="empty-state__title">Belum ada aktivitas</h3>
                  <p className="empty-state__desc">Aktivitas pelatihan Anda akan muncul di sini.</p>
                </div>
              </li>
            )}
            {data?.recentActivity.map((item, i) => <ActivityItem key={i} item={item} />)}
          </ul>
        </section>

        <div className="dashboard-columns__side">
          {data && <ResumeCard item={data.resumeItem} />}

          <section className="dashboard-section card-light" aria-label="Pengumuman">
            <div className="section-heading">
              <h2 className="section-heading__title">Pengumuman</h2>
            </div>
            <ul className="announcement-list">
              {data?.announcements.map((item, i) => <AnnouncementItem key={i} item={item} />)}
            </ul>
          </section>

          <section className="dashboard-section card-light" aria-label="Progress Belajar">
            <div className="section-heading">
              <h2 className="section-heading__title">Progress Belajar</h2>
            </div>
            <div className="learning-progress-list">
              {data?.learningProgress.map((item, i) => <LearningProgressItem key={i} item={item} />)}
            </div>
          </section>
        </div>
      </div>
      </>
      )}
    </Layout>
  );
}

export default Dashboard;
