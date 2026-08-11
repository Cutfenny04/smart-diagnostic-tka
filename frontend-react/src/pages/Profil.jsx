import { createElement, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { fetchProfil } from '../data/profilData';
import { getIcon } from '../utils/icon';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Profil.css';

/* View-only: menampilkan info guru yang sedang login sungguhan (dari
   GET /api/auth/me -- lihat data/profilData.js), tidak ada form edit.
   Tabel `guru` cuma punya nama/email/tanggal daftar, jadi field yang
   dulu ditampilkan di sini (sekolah, mata pelajaran, jenjang) dihapus
   karena memang tidak ada sumber data aslinya -- bukan diisi dummy baru. */

function initial(name) {
  return name.trim().charAt(0).toUpperCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
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
              <span className="profil-avatar" aria-hidden="true">{initial(profil.nama)}</span>
              <div>
                <h2 className="profil-card__name">{profil.nama}</h2>
                <span className="badge badge--info">Guru IPA</span>
              </div>
            </div>
            <div className="profil-info-list">
              <InfoRow icon="mail" label="Email" value={profil.email} />
              <InfoRow icon="calendar" label="Bergabung Sejak" value={formatDate(profil.createdAt)} />
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
