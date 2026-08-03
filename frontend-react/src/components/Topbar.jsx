import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Bell, BellOff, ChevronDown, User, Lock, LogOut } from 'lucide-react';

function Topbar({ onOpenDrawer }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  const guru = JSON.parse(window.localStorage.getItem('guru') || 'null');
  const profileName = guru?.nama || 'Guru';
  const profileAvatar = profileName.charAt(0).toUpperCase();

  // Tutup dropdown yang lagi terbuka kalau user klik di luar area topbar, atau tekan Escape.
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    }
    function handleEscape(e) {
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function handleLogout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('guru');
    navigate('/login');
  }

  return (
    <header className="topbar" ref={wrapperRef}>
      <button
        type="button"
        className="topbar__menu-btn"
        aria-label="Buka menu navigasi"
        aria-expanded={false}
        onClick={onOpenDrawer}
      >
        <Menu size={20} />
      </button>

      <div className="topbar__spacer" />

      <div className="topbar__actions">
        <button
          type="button"
          className="btn-icon topbar__notif-btn"
          aria-label="Notifikasi"
          aria-haspopup="true"
          aria-expanded={notifOpen}
          onClick={() => {
            setProfileOpen(false);
            setNotifOpen((v) => !v);
          }}
        >
          <Bell size={18} />
          <span className="topbar__notif-dot" aria-hidden="true" />
        </button>

        {notifOpen && (
          <div className="topbar__notif-panel" role="menu">
            <div className="topbar__notif-panel-header">Notifikasi</div>
            <div className="empty-state empty-state--compact">
              <div className="empty-state__icon"><BellOff size={20} /></div>
              <p className="empty-state__desc">Belum ada notifikasi baru.</p>
            </div>
          </div>
        )}

        <button
          type="button"
          className="topbar__profile-btn"
          aria-haspopup="true"
          aria-expanded={profileOpen}
          onClick={() => {
            setNotifOpen(false);
            setProfileOpen((v) => !v);
          }}
        >
          <span className="topbar__avatar" aria-hidden="true">{profileAvatar}</span>
          <span className="topbar__profile-info">
            <span className="topbar__profile-name">{profileName}</span>
            <span className="topbar__profile-role">Guru IPA</span>
          </span>
          <ChevronDown size={16} className="topbar__profile-caret" />
        </button>

        {profileOpen && (
          <div className="topbar__profile-menu" role="menu">
            <Link to="/profil" role="menuitem" className="topbar__profile-menu-item">
              <User size={16} /> Profil Saya
            </Link>
            <Link to="/ubah-password" role="menuitem" className="topbar__profile-menu-item">
              <Lock size={16} /> Ubah Password
            </Link>
            <button
              type="button"
              role="menuitem"
              className="topbar__profile-menu-item topbar__profile-menu-item--danger"
              onClick={handleLogout}
            >
              <LogOut size={16} /> Keluar
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Topbar;
