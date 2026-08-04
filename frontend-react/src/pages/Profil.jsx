import { createElement, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { fetchProfil } from '../data/profilData';
import { getIcon } from '../utils/icon';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Profil.css';

/* View-only: menampilkan info guru yang sedang login, tidak ada form edit. */

function initial(name) {
  return name.trim().charAt(0).toUpperCase();
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="profil-info-row">
      <span className="profil-info-row__icon">{createElement(getIcon(icon), { size: 20 })}</span>
      <span className="profil-info-row__text">
        <span className="profil-info-row__label">{label}</span>
        <span className="profil-info-row__value">{value}</span>
      </span>
    </div>
  );
}

function Profil() {
  const [profil, setProfil] = useState(null);

  useDocumentTitle('Profil - Smart Diagnostic TKA');

  useEffect(() => {
    fetchProfil().then(setProfil);
  }, []);

  return (
    <Layout breadcrumb="Profil">
      <div className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">Profil</h1>
          <p className="page-header__desc">Informasi akun guru yang sedang masuk.</p>
        </div>
      </div>

      <div className="card-light profil-card">
        {profil ? (
          <>
            <div className="profil-card__head">
              <span className="profil-avatar" aria-hidden="true">{initial(profil.name)}</span>
              <div>
                <h2 className="profil-card__name">{profil.name}</h2>
                <span className="badge badge--info">{profil.role}</span>
              </div>
            </div>
            <div className="profil-info-list">
              <InfoRow icon="mail" label="Email" value={profil.email} />
              <InfoRow icon="school" label="Sekolah" value={profil.school} />
              <InfoRow icon="flask-conical" label="Mata Pelajaran" value={profil.subject} />
              <InfoRow icon="graduation-cap" label="Jenjang Diampu" value={profil.grade} />
              <InfoRow icon="calendar" label="Bergabung Sejak" value={formatDate(profil.joinDate)} />
            </div>
          </>
        ) : (
          <>
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--text" />
          </>
        )}
      </div>
    </Layout>
  );
}

export default Profil;
