import { createElement } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getIcon } from '../utils/icon';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import './Profil.css';

/* View-only: menampilkan info guru yang sedang login sungguhan, dari tabel
   profiles (Fase 6 migrasi Auth) lewat AuthContext -- bukan lagi
   /api/auth/me. Tidak ada form edit. NIP ditampilkan kalau ada; dua guru
   (Siti Suyata, Nurliana) belum punya NIP sampai data itu diberikan, jadi
   barisnya disembunyikan untuk mereka, bukan diisi placeholder. */

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
  const { profile } = useAuth();

  useDocumentTitle('Profil - Smart Diagnostic TKA');

  return (
    <Layout breadcrumb="Profil">
      <div className="page-header">
        <div className="page-header__text">
          <h1 className="page-header__title">Profil</h1>
          <p className="page-header__desc">Informasi akun guru yang sedang masuk.</p>
        </div>
      </div>

      <div className="card-light profil-card">
        {profile ? (
          <>
            <div className="profil-card__head">
              <span className="profil-avatar" aria-hidden="true">{initial(profile.nama)}</span>
              <div>
                <h2 className="profil-card__name">{profile.nama}</h2>
                <span className="badge badge--info">Guru IPA</span>
              </div>
            </div>
            <div className="profil-info-list">
              <InfoRow icon="mail" label="Email" value={profile.email} />
              {profile.nip && <InfoRow icon="id-card" label="NIP" value={profile.nip} />}
              <InfoRow icon="calendar" label="Bergabung Sejak" value={formatDate(profile.created_at)} />
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
